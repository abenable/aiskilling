// End-to-end smoke test against the local dev server (writes test rows to LOCAL D1 only).
// Usage: bun run dev  (in another terminal), then: bun run test:e2e
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright-core'

const base = process.argv[2] ?? 'http://localhost:3000'
if (!/^http:\/\/(localhost|127\.0\.0\.1)/.test(base)) throw new Error('Refusing to run against a non-local URL: this test submits the join form.')

const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome' })
const page = await browser.newPage()
const errors = []
page.on('pageerror', (e) => errors.push(e.message))
const submit = () => page.getByRole('button', { name: 'Join the community' }).click()

// Routes render, unknown routes 404.
for (const path of ['/', '/activities', '/activities/workshops', '/join']) {
  assert.equal((await page.goto(base + path, { waitUntil: 'networkidle' }))?.status(), 200, path)
}
assert.equal((await page.goto(base + '/activities/nope'))?.status(), 404, 'unknown activity 404s')

// Search params: invalid values fall back, valid ones filter / prefill.
await page.goto(`${base}/activities?type=bogus&audience=teams`, { waitUntil: 'networkidle' })
assert.equal(await page.locator('main ul >> li h2').count(), 2, 'audience=teams -> meetups + team training')
await page.goto(`${base}/join?interest=bootcamps`, { waitUntil: 'networkidle' })
assert.ok(await page.locator('input[name=interests][value=bootcamps]').isChecked(), 'interest prefilled')

// Client validation.
await page.locator('label:has(input[value=bootcamps])').click()
await submit()
for (const t of ['Please enter your name.', 'Enter a valid email address.', 'Pick the option closest to you.', 'Pick at least one.']) {
  assert.ok(await page.getByText(t).isVisible(), t)
}

// Server function -> D1 -> success state.
await page.fill('#name', 'E2E Tester')
await page.fill('#email', `e2e+${Date.now()}@example.com`)
await page.locator('label:has(input[value=professionals])').click()
await page.locator('label:has(input[value=workshops])').click()
await submit()
await page.getByText('You’re on the list, E2E.').waitFor({ timeout: 10_000 })

// Rate limiter eventually refuses.
let limited = false
for (let i = 0; i < 8 && !limited; i++) {
  await page.goto(`${base}/join`, { waitUntil: 'networkidle' })
  await page.fill('#name', 'Rate Test')
  await page.fill('#email', `rate${i}@example.com`)
  await page.locator('label:has(input[value=students])').click()
  await page.locator('label:has(input[value=meetups])').click()
  await submit()
  await page.waitForTimeout(1200)
  limited = await page.getByText('Too many attempts').isVisible()
}
assert.ok(limited, 'rate limiter kicks in')

// Private admin: password-gated (page, JSON and CSV), sortable, exports CSV.
const password = readFileSync('.dev.vars', 'utf8').match(/^ADMIN_PASSWORD=(.*)$/m)?.[1]
assert.ok(password, 'ADMIN_PASSWORD is set in .dev.vars')
for (const path of ['/admin', '/admin/api/signups', '/admin/signups.csv', '/ADMIN/api/signups']) {
  assert.equal((await fetch(base + path)).status, 401, `${path} needs the password`)
}
const admin = await browser.newContext({ httpCredentials: { username: 'admin', password } })
const ap = await admin.newPage()
ap.on('pageerror', (e) => errors.push(e.message))
await ap.goto(`${base}/admin`, { waitUntil: 'networkidle' })
await ap.getByRole('cell', { name: 'E2E Tester' }).first().waitFor()
await ap.getByRole('link', { name: 'Name' }).click()
await ap.waitForURL(/sort=name&dir=asc/)
await ap.waitForTimeout(800)
const names = await ap.locator('tbody tr td:first-child').allTextContents()
assert.deepEqual(names, [...names].sort((x, y) => x.localeCompare(y, 'en', { sensitivity: 'base' })), 'sorted by name A to Z')
const csv = await (await ap.request.get(`${base}/admin/signups.csv`)).text()
assert.ok(csv.startsWith('\uFEFF"Name","Email","Group"'), 'CSV has a header row')
await admin.close()
assert.deepEqual(errors, [], 'no uncaught page errors')

await browser.close()
console.log('e2e: all checks passed')
