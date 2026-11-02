// Email HTML templates built on Postmark's open-source transactional email templates
// (https://postmarkapp.com/transactional-email-templates — free to use, tested across Gmail,
// Outlook, Apple Mail, Yahoo and mobile clients, with dark-mode support). Client-safe: no
// server-only imports here so UI code can preview or link these templates.
//
// Directed outreach copy is TEXT-ONLY by design: benchmarks from 2M+ tracked B2B emails
// show plain text, <90 words, one question CTA and no links in the first email maximise
// reply rates (https://learn.outboundsystem.com/playbooks/copy-templates).

const brand = {
  name: 'AI Skilling',
  url: 'https://aiskilling.dev',
  accent: '#0099ff',
  footer: "AI Skilling — aiskilling.dev",
}

// Postmark base stylesheet, accent-coloured per brand at render time.
const BASE_STYLE = `
/* Base ------------------------------ */

@import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
body {
  width: 100% !important;
  height: 100%;
  margin: 0;
  -webkit-text-size-adjust: none;
}

a {
  color: #3869D4;
}

a img {
  border: none;
}

td {
  word-break: break-word;
}

.preheader {
  display: none !important;
  visibility: hidden;
  mso-hide: all;
  font-size: 1px;
  line-height: 1px;
  max-height: 0;
  max-width: 0;
  opacity: 0;
  overflow: hidden;
}
/* Type ------------------------------ */

body,
td,
th {
  font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
}

h1 {
  margin-top: 0;
  color: #333333;
  font-size: 22px;
  font-weight: bold;
  text-align: left;
}

h2 {
  margin-top: 0;
  color: #333333;
  font-size: 16px;
  font-weight: bold;
  text-align: left;
}

h3 {
  margin-top: 0;
  color: #333333;
  font-size: 14px;
  font-weight: bold;
  text-align: left;
}

td,
th {
  font-size: 16px;
}

p,
ul,
ol,
blockquote {
  margin: .4em 0 1.1875em;
  font-size: 16px;
  line-height: 1.625;
}

p.sub {
  font-size: 13px;
}
/* Utilities ------------------------------ */

.align-right {
  text-align: right;
}

.align-left {
  text-align: left;
}

.align-center {
  text-align: center;
}

.u-margin-bottom-none {
  margin-bottom: 0;
}
/* Buttons ------------------------------ */

.button {
  background-color: #3869D4;
  border-top: 10px solid #3869D4;
  border-right: 18px solid #3869D4;
  border-bottom: 10px solid #3869D4;
  border-left: 18px solid #3869D4;
  display: inline-block;
  color: #FFF;
  text-decoration: none;
  border-radius: 3px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);
  -webkit-text-size-adjust: none;
  box-sizing: border-box;
}

.button--green {
  background-color: #22BC66;
  border-top: 10px solid #22BC66;
  border-right: 18px solid #22BC66;
  border-bottom: 10px solid #22BC66;
  border-left: 18px solid #22BC66;
}

.button--red {
  background-color: #FF6136;
  border-top: 10px solid #FF6136;
  border-right: 18px solid #FF6136;
  border-bottom: 10px solid #FF6136;
  border-left: 18px solid #FF6136;
}

@media only screen and (max-width: 500px) {
  .button {
    width: 100% !important;
    text-align: center !important;
  }
}
/* Attribute list ------------------------------ */

.attributes {
  margin: 0 0 21px;
}

.attributes_content {
  background-color: #F4F4F7;
  padding: 16px;
}

.attributes_item {
  padding: 0;
}
/* Related Items ------------------------------ */

.related {
  width: 100%;
  margin: 0;
  padding: 25px 0 0 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
}

.related_item {
  padding: 10px 0;
  color: #CBCCCF;
  font-size: 15px;
  line-height: 18px;
}

.related_item-title {
  display: block;
  margin: .5em 0 0;
}

.related_item-thumb {
  display: block;
  padding-bottom: 10px;
}

.related_heading {
  border-top: 1px solid #CBCCCF;
  text-align: center;
  padding: 25px 0 10px;
}
/* Discount Code ------------------------------ */

.discount {
  width: 100%;
  margin: 0;
  padding: 24px;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
  background-color: #F4F4F7;
  border: 2px dashed #CBCCCF;
}

.discount_heading {
  text-align: center;
}

.discount_body {
  text-align: center;
  font-size: 15px;
}
/* Social Icons ------------------------------ */

.social {
  width: auto;
}

.social td {
  padding: 0;
  width: auto;
}

.social_icon {
  height: 20px;
  margin: 0 8px 10px 8px;
  padding: 0;
}
/* Data table ------------------------------ */

.purchase {
  width: 100%;
  margin: 0;
  padding: 35px 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
}

.purchase_content {
  width: 100%;
  margin: 0;
  padding: 25px 0 0 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
}

.purchase_item {
  padding: 10px 0;
  color: #51545E;
  font-size: 15px;
  line-height: 18px;
}

.purchase_heading {
  padding-bottom: 8px;
  border-bottom: 1px solid #EAEAEC;
}

.purchase_heading p {
  margin: 0;
  color: #85878E;
  font-size: 12px;
}

.purchase_footer {
  padding-top: 15px;
  border-top: 1px solid #EAEAEC;
}

.purchase_total {
  margin: 0;
  text-align: right;
  font-weight: bold;
  color: #333333;
}

.purchase_total--label {
  padding: 0 15px 0 0;
}

body {
  background-color: #F2F4F6;
  color: #51545E;
}

p {
  color: #51545E;
}

.email-wrapper {
  width: 100%;
  margin: 0;
  padding: 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
  background-color: #F2F4F6;
}

.email-content {
  width: 100%;
  margin: 0;
  padding: 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
}
/* Masthead ----------------------- */

.email-masthead {
  padding: 25px 0;
  text-align: center;
}

.email-masthead_logo {
  width: 94px;
}

.email-masthead_name {
  font-size: 16px;
  font-weight: bold;
  color: #A8AAAF;
  text-decoration: none;
  text-shadow: 0 1px 0 white;
}
/* Body ------------------------------ */

.email-body {
  width: 100%;
  margin: 0;
  padding: 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
}

.email-body_inner {
  width: 570px;
  margin: 0 auto;
  padding: 0;
  -premailer-width: 570px;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
  background-color: #FFFFFF;
}

.email-footer {
  width: 570px;
  margin: 0 auto;
  padding: 0;
  -premailer-width: 570px;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
  text-align: center;
}

.email-footer p {
  color: #A8AAAF;
}

.body-action {
  width: 100%;
  margin: 30px auto;
  padding: 0;
  -premailer-width: 100%;
  -premailer-cellpadding: 0;
  -premailer-cellspacing: 0;
  text-align: center;
}

.body-sub {
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid #EAEAEC;
}

.content-cell {
  padding: 45px;
}
/*Media Queries ------------------------------ */

@media only screen and (max-width: 600px) {
  .email-body_inner,
  .email-footer {
    width: 100% !important;
  }
}

@media (prefers-color-scheme: dark) {
  body,
  .email-body,
  .email-body_inner,
  .email-content,
  .email-wrapper,
  .email-masthead,
  .email-footer {
    background-color: #333333 !important;
    color: #FFF !important;
  }
  p,
  ul,
  ol,
  blockquote,
  h1,
  h2,
  h3,
  span,
  .purchase_item {
    color: #FFF !important;
  }
  .attributes_content,
  .discount {
    background-color: #222 !important;
  }
  .email-masthead_name {
    text-shadow: none !important;
  }
}

:root {
  color-scheme: light dark;
  supported-color-schemes: light dark;
}
</style>
<style type="text/css">
  .f-fallback  {
    font-family: Arial, sans-serif;
  }
`

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

/** Wrap content in the tested Postmark layout (masthead, body card, footer). */
function layout(preheader: string, contentHtml: string): string {
  const style = BASE_STYLE.replaceAll('#3869D4', brand.accent)
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="color-scheme" content="light dark" />
    <meta name="supported-color-schemes" content="light dark" />
    <title>${escapeHtml(preheader)}</title>
    <style type="text/css" rel="stylesheet" media="all">
${style}
    </style>
    <!--[if mso]>
    <style type="text/css">
      .f-fallback  {
        font-family: Arial, sans-serif;
      }
    </style>
  <![endif]-->
  </head>
  <body>
    <span class="preheader">${escapeHtml(preheader)}</span>
    <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center">
          <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td class="email-masthead">
                <a href="${brand.url}" class="f-fallback email-masthead_name">
                  ${escapeHtml(brand.name)}
                </a>
              </td>
            </tr>
            <tr>
              <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell">
                      <div class="f-fallback">
${contentHtml}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td class="content-cell" align="center">
                      <p class="f-fallback sub align-center">${escapeHtml(brand.footer)}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}

import { site } from '#/content'

export interface EmailContent {
  subject: string
  html: string
  text: string
}

/**
 * Join confirmation, following Postmark's welcome-email best practices: greet the
 * person by name, remind them what they signed up for, one clear next step, and a
 * real contact address for questions (site.email — not a no-reply inbox).
 */
export function joinConfirmationEmail({ name }: { name: string }): EmailContent {
  const firstName = escapeHtml(name.split(' ')[0] || 'there')
  const subject = "You're in — AI Skilling"
  const preheader = 'Hands-on AI training for you and your team — here\'s where to start.'
  const text = [
    'Hi ' + name.split(' ')[0] + ',',
    '',
    "Thanks for joining the AI Skilling community.",
    'We share hands-on AI workshops, team training and practical sessions that match what you want to learn.',
    '',
    'See what\'s coming up: ' + brand.url,
    '',
    'Questions? Just reply to this email — it reaches a real person.',
    '',
    '— The AI Skilling team',
  ].join('\n')
  const html = layout(
    preheader,
    `<h1>Welcome, ${firstName}!</h1>
                        <p>Thanks for joining <strong>AI Skilling</strong>. We run hands-on AI workshops and team training that turn AI tools into everyday working skills.</p>
                        <p>Here's the one thing to do next: see what's coming up and pick a session that fits what you want to learn.</p>
                        <!-- Action -->
                        <table class="body-action" align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                          <tr>
                            <td align="center">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                <tr>
                                  <td align="center">
                                    <a href="${brand.url}" class="f-fallback button" target="_blank">See upcoming sessions</a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <p>We'll only email you about AI Skilling sessions that match your interests. If you have any questions, <a href="mailto:${site.email}">reply to this email</a> — it reaches a real person.</p>
                        <p>Thanks,
                          <br>The AI Skilling team</p>`,
  )
  return { subject, html, text }
}

/**
 * Starter copy for directed outreach, adapted from the highest-performing public
 * B2B structures (problem-solution opener, quick question, ultra-short). Each is
 * under 90 words with one question CTA and no links — replace every [bracket]
 * before sending; a personalised first line is the single biggest reply-rate lever.
 */
export const outreachStarters: { label: string; subject: string; body: string }[] = [
  {
    label: 'Quick question (short, informal)',
    subject: 'quick question',
    body: 'Hi [First name],\n\nSaw [specific observation about their team or company]. Most [industry] teams we meet are still working AI out alone — hours lost to tools nobody was trained on.\n\nWe run hands-on AI workshops that get a whole team actually using these tools in a day.\n\nWorth a 15-minute call?\n\n[Your name]',
  },
  {
    label: 'Problem — proof — call',
    subject: '[Company] + AI Skilling',
    body: 'Hi [First name],\n\nI noticed [specific observation about their business]. Most [similar companies] struggle with [specific problem], which usually shows up as [cost — lost hours, stalled projects, inconsistent quality].\n\nWe helped [similar company] [specific result with a number].\n\nWorth a quick 15-minute call to see how this might work at [Company]?\n\n[Your name]',
  },
  {
    label: 'Ultra-short (2 benefits, tiny ask)',
    subject: 'worth a quick look?',
    body: 'Hi [First name],\n\nWe do hands-on AI training for teams like [Company]. Two things customers usually flag after a session: [benefit 1] and [benefit 2].\n\nShould I send the 2-minute breakdown?\n\n[Your name]',
  },
]
