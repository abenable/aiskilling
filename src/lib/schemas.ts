// Client-safe schemas shared by routes (search params) and server functions (input).
import { z } from 'zod'
import { activitySlugs, audienceSlugs, type ActivitySlug } from '#/content'

// Unknown values fall back to "no filter" instead of erroring the page.
export const activitiesSearch = z.object({
  type: z.enum(activitySlugs).optional().catch(undefined),
  audience: z.enum(audienceSlugs).optional().catch(undefined),
})

export const joinSearch = z.object({
  interest: z.enum(activitySlugs).optional().catch(undefined),
})

export const upcomingInput = z.object({
  kind: z.enum(activitySlugs).optional(),
})

export const joinInput = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80, 'That name is a little long.'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(160)
    .pipe(z.email('Enter a valid email address.')),
  audience: z.enum(audienceSlugs, { error: 'Pick the option closest to you.' }),
  interests: z.array(z.enum(activitySlugs)).min(1, 'Pick at least one.'),
  message: z.string().trim().max(1000, 'Please keep it under 1000 characters.').optional(),
  // Honeypot: hidden from people, filled by bots.
  website: z.string().max(200).optional(),
})

export type JoinInput = z.infer<typeof joinInput>

export type EventItem = {
  id: number
  kind: ActivitySlug
  title: string
  startsAt: string
  location: string
  url: string | null
  summary: string | null
}
