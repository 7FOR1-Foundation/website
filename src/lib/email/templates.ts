/**
 * Plain, accessible HTML emails: one column, real text (no text in images),
 * large tap targets, and the colours and contrast of the website.
 */
const BRAND = '#136d94'
const INK = '#282828'
const BODY = '#525252'
const ADDRESS = 'Seven For One Association (7FOR1) · Buea, South West Region, Cameroon'

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)

type Layout = {
  title: string
  preheader: string
  body: string
  siteUrl: string
  logoUrl?: string | null
  /** Campaigns to the list carry Brevo's unsubscribe link. */
  unsubscribe?: boolean
}

const layout = ({ title, preheader, body, siteUrl, logoUrl, unsubscribe }: Layout) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#eaf5ff;">
<div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eaf5ff;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;">
<tr><td style="padding:28px 32px 8px;">
<a href="${siteUrl}" style="text-decoration:none;color:${BRAND};font:900 26px/1 Arial,Helvetica,sans-serif;">${
  logoUrl ? `<img src="${logoUrl}" alt="7FOR1" width="150" style="display:block;width:150px;height:auto;border:0;">` : '7FOR1'
}</a>
</td></tr>
<tr><td style="padding:16px 32px 32px;font:16px/1.6 Arial,Helvetica,sans-serif;color:${BODY};">
${body}
</td></tr>
</table>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
<tr><td style="padding:20px 32px;font:13px/1.6 Arial,Helvetica,sans-serif;color:${BODY};text-align:center;">
Action Over Sympathy<br>${ADDRESS}<br>
<a href="${siteUrl}" style="color:${BRAND};">www.7for1.org</a> · <a href="${siteUrl}/privacy" style="color:${BRAND};">Privacy policy</a>${
  unsubscribe ? ` · <a href="{{ unsubscribe }}" style="color:${BRAND};">Unsubscribe</a>` : ''
}
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`

const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0;"><tr><td style="border-radius:8px;background:${BRAND};">
<a href="${href}" style="display:inline-block;padding:14px 28px;font:bold 16px/1.2 Arial,Helvetica,sans-serif;color:#ffffff;text-decoration:none;border-radius:8px;">${label}</a>
</td></tr></table>`

const heading = (text: string) =>
  `<h1 style="margin:0 0 12px;font:bold 26px/1.3 Arial,Helvetica,sans-serif;color:${INK};">${escapeHtml(text)}</h1>`

export function confirmationEmail({ confirmUrl, siteUrl, logoUrl }: { confirmUrl: string; siteUrl: string; logoUrl?: string | null }) {
  const subject = 'Please confirm your subscription to 7FOR1'
  const html = layout({
    title: subject,
    preheader: 'One click to start receiving our updates.',
    siteUrl,
    logoUrl,
    body: `${heading('Confirm your subscription')}
<p style="margin:0;">Thank you for signing up for updates from Seven For One Association (7FOR1). Please confirm that you want to receive our emails: news from our work, new blog posts and a short update every quarter.</p>
${button(confirmUrl, 'Yes, subscribe me')}
<p style="margin:0;font-size:14px;">If the button doesn’t work, copy this link into your browser:<br><a href="${confirmUrl}" style="color:${BRAND};word-break:break-all;">${confirmUrl}</a></p>
<p style="margin:16px 0 0;font-size:14px;">If you didn’t sign up, ignore this email and you won’t hear from us. The link expires in 7 days.</p>`,
  })
  const text = `Confirm your subscription to 7FOR1

Thank you for signing up for updates from Seven For One Association (7FOR1). To confirm, open this link:
${confirmUrl}

If you didn’t sign up, ignore this email and you won’t hear from us. The link expires in 7 days.

${ADDRESS}
${siteUrl}`
  return { subject, html, text }
}

export function newPostEmail(post: {
  title: string
  excerpt: string
  url: string
  byline?: string | null
  imageUrl?: string | null
  imageAlt?: string | null
  siteUrl: string
  logoUrl?: string | null
}) {
  const html = layout({
    title: post.title,
    preheader: post.excerpt,
    siteUrl: post.siteUrl,
    logoUrl: post.logoUrl,
    unsubscribe: true,
    body: `<p style="margin:0 0 8px;font:bold 13px/1.4 Arial,Helvetica,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND};">New on our blog</p>
${post.imageUrl ? `<a href="${post.url}"><img src="${post.imageUrl}" alt="${escapeHtml(post.imageAlt ?? '')}" width="536" style="display:block;width:100%;height:auto;border:0;border-radius:8px;margin:8px 0 20px;"></a>` : ''}
${heading(post.title)}
${post.byline ? `<p style="margin:0 0 12px;font-weight:bold;color:${INK};">${escapeHtml(post.byline)}</p>` : ''}
<p style="margin:0;">${escapeHtml(post.excerpt)}</p>
${button(post.url, 'Read the full post')}`,
  })
  return { subject: post.title, previewText: post.excerpt, html }
}

/** To the team: one submitted form, every answer listed, reply goes to the sender. */
export function teamNotificationEmail(form: {
  typeLabel: string
  name: string
  rows: [string, string][]
  adminUrl: string
  siteUrl: string
}) {
  const subject = `New ${form.typeLabel.toLowerCase()} form from ${form.name}`
  const rows = form.rows
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="padding:8px 12px 8px 0;font:bold 14px/1.5 Arial,Helvetica,sans-serif;color:${INK};white-space:nowrap;">${escapeHtml(label)}</th><td style="padding:8px 0;font:15px/1.5 Arial,Helvetica,sans-serif;color:${BODY};white-space:pre-wrap;">${escapeHtml(value)}</td></tr>`,
    )
    .join('')
  const html = layout({
    title: subject,
    preheader: `${form.typeLabel} form sent through the website.`,
    siteUrl: form.siteUrl,
    body: `${heading(`New ${form.typeLabel.toLowerCase()} form`)}
<p style="margin:0 0 12px;">Reply to this email to answer ${escapeHtml(form.name)} directly.</p>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="border-top:1px solid #d6ebfa;">${rows}</table>
${button(form.adminUrl, 'Open in the admin')}`,
  })
  const text = `New ${form.typeLabel.toLowerCase()} form\n\n${form.rows
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')}\n\nOpen in the admin: ${form.adminUrl}`
  return { subject, html, text }
}

/** To the sender: a short thank-you that says what happens next. */
export function thankYouEmail(form: { name: string; intro: string; next: string; siteUrl: string; logoUrl?: string | null }) {
  const subject = 'Thank you for getting in touch with 7FOR1'
  const firstName = form.name.trim().split(/\s+/)[0]
  const html = layout({
    title: subject,
    preheader: form.next,
    siteUrl: form.siteUrl,
    logoUrl: form.logoUrl,
    body: `${heading(`Thank you, ${firstName}`)}
<p style="margin:0 0 12px;">${escapeHtml(form.intro)}</p>
<p style="margin:0 0 12px;">${escapeHtml(form.next)}</p>
<p style="margin:0;">With thanks,<br>The Seven For One Association (7FOR1) team</p>`,
  })
  const text = `Thank you, ${firstName}\n\n${form.intro}\n\n${form.next}\n\nWith thanks,\nThe Seven For One Association (7FOR1) team\n${form.siteUrl}`
  return { subject, html, text }
}
