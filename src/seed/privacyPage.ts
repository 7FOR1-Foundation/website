/**
 * First draft of the privacy policy, written for how the site works today
 * (November 2026). After the first run, edit it in the admin (Content →
 * Privacy policy): this only fills the page while it is empty, unless
 * `force` is passed. Have it checked by a lawyer when possible.
 */
import { convertMarkdownToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import type { Payload } from 'payload'

import { ctx } from './helpers'

export const PRIVACY_MARKDOWN = `This policy explains what personal information Seven For One Association (7FOR1) collects through www.7for1.org, why we collect it, and what you can do about it. We collect as little as we can, and we never sell or rent your information.

## Who we are

Seven For One Association (7FOR1) is a non-profit association legally declared in Cameroon, with its headquarters in Buea, South West Region. We are responsible for the personal information described here. You can contact us at info7for1@gmail.com.

## What we collect and why

### If you subscribe to our emails

- We keep your email address, the dates you signed up and confirmed, and the page where you signed up.
- We use it only to send you our updates: new blog posts and a short update on our work every quarter.
- We first send you an email asking you to confirm, so nobody can sign you up without your agreement. If you don't confirm within 30 days, we delete the sign-up.
- Every email has an "Unsubscribe" link at the bottom.

### If you fill in one of our forms

Our Donate, Volunteer and Contact buttons currently open a Google Form. What you enter there is collected by Google for us and handled under Google's own privacy policy. We use it only to reply to you and to organise volunteering or donations.

### When you visit the website

- We don't use advertising or tracking cookies, and we don't use analytics tools that follow you across the web.
- Like all websites, our hosting provider automatically records technical details such as your IP address and type of browser for a short time, to keep the website secure and working.
- The only cookie is the one our own team uses to sign in to the website's admin area.

### Links to other websites

Links to Facebook, LinkedIn, YouTube or Google Forms take you to those services, which have their own privacy policies.

## Photos and stories

We only publish photos and stories of the people we work with when they, or for children a parent or guardian, have agreed. We never publish children's names. If you appear in a photo on our website and would like it removed, write to us and we will take it down.

## Who we share it with

We never sell, rent or trade your information. We share it only with the services that run our website and emails, and only so they can do that work:

- **Brevo** (France) sends our emails and stores our subscriber list.
- **Vercel** (United States) hosts the website and its images.
- **Neon** (United States) stores the website's database.
- **Google** (United States) runs our forms.

Some of these services store information outside Cameroon. We choose providers with strong security and data protection commitments.

## How long we keep it

- **Email subscribers:** until you unsubscribe. You can also ask us to delete your address completely.
- **Unconfirmed sign-ups:** deleted after 30 days.
- **Form responses:** only as long as we need them to reply to you or organise your volunteering or donation, and no longer than two years after our last contact, unless the law requires us to keep them longer (for example, records of donations).

## Your rights

You can ask us at any time to:

- tell you what information we hold about you and give you a copy;
- correct it;
- delete it;
- stop sending you emails (use the "Unsubscribe" link in any email, or write to us).

Write to info7for1@gmail.com and we will reply within 30 days. These rights are protected by Cameroon's law on the protection of personal data and, for people in the European Union, by the General Data Protection Regulation (GDPR).

## Keeping it safe

Our website only works over an encrypted connection (https). Only a few members of our team can see subscriber and form information, using their own accounts and strong passwords.

## Children

Our emails and forms are meant for adults. If you are under 18, please ask a parent or guardian before signing up.

## Changes to this policy

If we change this policy, we will update this page and the date at the top. If a change is important, we will also tell our subscribers by email.

## Contact us

Seven For One Association (7FOR1), Buea, South West Region, Cameroon. Email: info7for1@gmail.com.`

export const seedPrivacyPage = async (payload: Payload, { force = false } = {}) => {
  const existing = await payload.findGlobal({ slug: 'privacy-page', depth: 0 })
  if (existing.body && !force) {
    payload.logger.info('The privacy policy already has content; leaving it as it is.')
    return
  }
  const body = convertMarkdownToLexical({
    editorConfig: await editorConfigFactory.default({ config: payload.config }),
    markdown: PRIVACY_MARKDOWN,
  })
  await payload.updateGlobal({
    slug: 'privacy-page',
    context: ctx(),
    data: { title: 'Privacy policy', lastUpdated: '2026-11-17T11:00:00.000Z', body },
  })
  payload.logger.info('Privacy policy filled with the first draft.')
}
