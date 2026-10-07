// All site copy lives here. Edit this file to change what the site says.
// Photos: Unsplash (unsplash.com/license), self-hosted in /public/images.

export const site = {
  name: 'AI Skilling',
  url: 'https://aiskilling.dev',
  email: 'ableabenaitwe@gmail.com',
  description:
    'Hands-on AI workshops, meetups, bootcamps and online sessions for students, professionals, beginners and teams.',
}

export type Tone = 'coral' | 'magenta' | 'violet' | 'orange' | 'blue'

export function photo(name: string) {
  return {
    src: `/images/${name}-800.webp`,
    srcSet: `/images/${name}-800.webp 800w, /images/${name}-1600.webp 1600w`,
  }
}

export const audiences = [
  {
    slug: 'students',
    label: 'Students',
    name: 'Students & young people',
    word: 'studies',
    line: 'Study smarter, build projects that stand out, and start your career already fluent in the tools employers use.',
    tone: 'coral',
  },
  {
    slug: 'professionals',
    label: 'Professionals',
    name: 'Working professionals',
    word: 'career',
    line: 'Hand off the reports, emails, research and spreadsheets, and spend your time on the work that needs you.',
    tone: 'violet',
  },
  {
    slug: 'beginners',
    label: 'Beginners',
    name: 'Complete beginners',
    word: 'ideas',
    line: 'Never used ChatGPT or Claude? Start from zero, in plain language, at a pace that feels comfortable.',
    tone: 'orange',
  },
  {
    slug: 'teams',
    label: 'Teams',
    name: 'Businesses & teams',
    word: 'business',
    line: 'Train your people together on tools and habits that fit how your business already works.',
    tone: 'magenta',
  },
] as const satisfies ReadonlyArray<{ tone: Tone } & Record<string, string>>

export type AudienceSlug = (typeof audiences)[number]['slug']
export const audienceSlugs = audiences.map((a) => a.slug) as [AudienceSlug, ...AudienceSlug[]]

export const activities = [
  {
    slug: 'workshops',
    name: 'Hands-on workshops',
    short: 'Workshops',
    tagline: 'Small groups, real tasks, one laptop each.',
    summary:
      'You learn a tool by using it on work you actually have. Short demos, then guided practice with someone beside you when you get stuck.',
    happens: [
      'A short live demo of one tool or technique',
      'Guided practice on a task you bring along',
      'Swap results with the group and see other approaches',
      'Walk away with prompts and templates you can reuse',
    ],
    outcomes: ['A workflow you can repeat on Monday', 'Prompt templates for your own tasks', 'Confidence to try the next tool on your own'],
    audiences: ['students', 'professionals', 'beginners'],
    tone: 'coral',
  },
  {
    slug: 'meetups',
    name: 'Community meetups',
    short: 'Meetups',
    tagline: 'Talks, demos and open conversation.',
    summary:
      'Meet people figuring out AI alongside you. Members show what they built, what worked and what failed, and everyone leaves with ideas to try.',
    happens: [
      'Lightning demos from members and guests',
      'Open Q&A on tools, careers and getting started',
      'Small-group conversations by interest',
      'Time to meet people working on similar problems',
    ],
    outcomes: ['New ideas you can test this week', 'People to learn with between sessions', 'A feel for where AI is heading'],
    audiences: ['students', 'professionals', 'beginners', 'teams'],
    tone: 'magenta',
  },
  {
    slug: 'bootcamps',
    name: 'Intensive bootcamps',
    short: 'Bootcamps',
    tagline: 'From first prompt to your own AI workflows.',
    summary:
      'A focused series of sessions that build on each other. You finish with a small project that uses AI to solve a real problem in your study, work or business.',
    happens: [
      'A structured path from basics to building',
      'A project you choose and carry through every session',
      'Feedback on your work from facilitators and peers',
      'A final show-and-tell with the group',
    ],
    outcomes: ['A finished project to show', 'Skills that carry across tools', 'A habit of using AI on hard problems'],
    audiences: ['students', 'professionals'],
    tone: 'violet',
  },
  {
    slug: 'online',
    name: 'Live online sessions',
    short: 'Online sessions',
    tagline: 'Join from anywhere, follow on your own screen.',
    summary:
      'Live walkthroughs you can follow step by step from your laptop, with time for questions at the end. Good for busy schedules and for anyone outside the city.',
    happens: [
      'A live, step-by-step walkthrough',
      'Follow along on your own screen as we go',
      'Questions answered live in the chat',
      'Notes and links shared afterwards',
    ],
    outcomes: ['One new skill per session', 'Notes to come back to', 'Access wherever you are'],
    audiences: ['students', 'professionals', 'beginners'],
    tone: 'blue',
  },
  {
    slug: 'team-training',
    name: 'Team training',
    short: 'Team training',
    tagline: 'Built around your tools, data rules and daily work.',
    summary:
      'Sessions designed with your team in mind. We start from the work your people already do and show where AI saves time, and where it should stay out.',
    happens: [
      'A short conversation to understand your team’s work',
      'Sessions built on your real tasks and examples',
      'Clear guidance on data, privacy and checking AI output',
      'Follow-up material your team can keep using',
    ],
    outcomes: ['Shared habits across the team', 'Guidelines for safe, responsible use', 'Time saved on routine work'],
    audiences: ['teams'],
    tone: 'orange',
  },
] as const satisfies ReadonlyArray<
  {
    slug: string
    tone: Tone
    audiences: ReadonlyArray<AudienceSlug>
    happens: ReadonlyArray<string>
    outcomes: ReadonlyArray<string>
  } & Record<string, unknown>
>

export type Activity = (typeof activities)[number]
export type ActivitySlug = Activity['slug']
export const activitySlugs = activities.map((a) => a.slug) as [ActivitySlug, ...ActivitySlug[]]

export const prompts = [
  { who: 'Student', text: 'Turn my lecture notes into a 7-day revision plan with a short quiz each day.' },
  { who: 'Shop owner', text: 'Write three product descriptions for handmade shea butter soap.' },
  { who: 'Beginner', text: 'Explain what this spreadsheet formula does, like I’m new to this.' },
  { who: 'Manager', text: 'Pull the five decisions I need to make out of this 30-page report.' },
  { who: 'Team lead', text: 'Draft an onboarding checklist for new staff joining next month.' },
  { who: 'Graduate', text: 'Rewrite my CV summary for a junior data analyst role.' },
  { who: 'Teacher', text: 'Make a 20-minute lesson plan on climate, with one group activity.' },
  { who: 'Freelancer', text: 'Write a polite follow-up to a client whose invoice is two weeks late.' },
  { who: 'Analyst', text: 'Find the three biggest changes in last quarter’s sales and chart them.' },
  { who: 'Parent', text: 'Plan a week of healthy family dinners on a tight budget.' },
  { who: 'Founder', text: 'Turn these customer interviews into the top five problems to solve.' },
  { who: 'Student', text: 'Quiz me on photosynthesis until I get ten answers right in a row.' },
]

export const tools = [
  'claude',
  'googlegemini',
  'githubcopilot',
  'perplexity',
  'notebooklm',
  'notion',
  'zapier',
  'cursor',
  'huggingface',
  'elevenlabs',
  'mistralai',
  'n8n',
].map((slug) => ({
  slug,
  name: {
    claude: 'Claude',
    googlegemini: 'Gemini',
    githubcopilot: 'Copilot',
    perplexity: 'Perplexity',
    notebooklm: 'NotebookLM',
    notion: 'Notion AI',
    zapier: 'Zapier',
    cursor: 'Cursor',
    huggingface: 'Hugging Face',
    elevenlabs: 'ElevenLabs',
    mistralai: 'Mistral',
    n8n: 'n8n',
  }[slug]!,
}))

export const skills = [
  { icon: 'chat', title: 'Prompts that work', body: 'Give context, set a role, ask for a format. Get answers you can use on the first try.' },
  { icon: 'book', title: 'Research & summaries', body: 'Turn long reports, articles and meeting notes into the points that matter, then check the sources.' },
  { icon: 'pen', title: 'Writing in your voice', body: 'Draft emails, proposals and posts faster, without sounding like a robot wrote them.' },
  { icon: 'table', title: 'Data & spreadsheets', body: 'Clean messy data, write formulas, and ask questions of your numbers in plain language.' },
  { icon: 'image', title: 'Images, audio & video', body: 'Make visuals and media for presentations, social posts and small projects.' },
  { icon: 'flow', title: 'Automating busywork', body: 'Connect the tools you use so repetitive tasks run on their own.' },
  { icon: 'shield', title: 'Using AI responsibly', body: 'Know what to share, how to fact-check, and where AI tends to get things wrong.' },
] as const

export const steps = [
  { title: 'Join the community', body: 'Add your name to the list and tell us who you are and what you want to learn.' },
  { title: 'Pick your session', body: 'We share upcoming workshops, meetups and online sessions. Choose the ones that fit your week.' },
  { title: 'Learn by doing', body: 'Bring a laptop and a real task. Leave with a skill you can use the next morning.' },
  { title: 'Keep growing', body: 'Stay connected with people learning alongside you, and come back as the tools change.' },
]

export const manifesto =
  'AI is changing how we study, work and run our businesses. Most people were never shown how to use it well. AI Skilling runs hands-on sessions where you learn with real tools, on real tasks, next to people figuring it out with you.'
