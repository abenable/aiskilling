// Client-safe helpers for the private sign-ups page (/admin) and its CSV export.
import { z } from 'zod'
import { activities, audiences } from '#/content'

export const signupSorts = ['joined', 'name', 'email', 'group'] as const
export type SignupSort = (typeof signupSorts)[number]

// Unknown values fall back to newest first.
export const adminSearch = z.object({
  sort: z.enum(signupSorts).default('joined').catch('joined'),
  dir: z.enum(['asc', 'desc']).default('desc').catch('desc'),
})
export type AdminSearch = z.infer<typeof adminSearch>

export type Signup = {
  id: number
  name: string
  email: string
  audience: string
  interests: string
  message: string | null
  createdAt: string
  updatedAt: string
}

export const groupName = (slug: string) => audiences.find((a) => a.slug === slug)?.name ?? slug
export const interestNames = (csv: string) =>
  csv
    .split(',')
    .filter(Boolean)
    .map((s) => activities.find((a) => a.slug === s)?.short ?? s)

/** Excel-safe CSV: every cell quoted, a BOM so names with accents survive, formula-like text neutralised. */
export function signupsCsv(rows: Signup[]) {
  const cell = (v: string | null) => `"${(v ?? '').replace(/^[=+\-@\t\r]/, "'$&").replace(/"/g, '""')}"`
  const lines = [
    ['Name', 'Email', 'Group', 'Interests', 'Message', 'Joined (UTC)', 'Updated (UTC)'],
    ...rows.map((r) => [r.name, r.email, groupName(r.audience), interestNames(r.interests).join('; '), r.message, r.createdAt, r.updatedAt]),
  ]
  return '﻿' + lines.map((l) => l.map(cell).join(',')).join('\r\n')
}
