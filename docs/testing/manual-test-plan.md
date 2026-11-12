# Manual test plan: website v0.1 (homepage and initiatives)

Covers everything built for the first version: the homepage, initiative and project pages, the
"coming soon" pages, the newsletter form, the admin panel and its access rules.

Run it before each release and after any change to these areas. Test as a visitor would: click,
type and read, rather than trusting the code.

## Before you start

1. Start the database and the site (see README → Getting started), then open http://localhost:3000.
2. Run `pnpm seed` so the starting content is present.
3. Use a fresh browser profile or a private window, so no old logins or cached files interfere.
4. Test at these widths: phone (375 px), tablet (768 px), laptop (1024 px) and desktop (1440 px).
5. Use made-up test data only, such as `test+1@example.com`. Never use a real person's email.

Record each result as **Pass**, **Fail** (with what happened) or **Blocked** (could not be run).

## 1. Header and navigation

| ID | Steps | Expected result |
| --- | --- | --- |
| H1 | Look at the top bar | The email info7for1@gmail.com shows. No phone number shows (none is set). |
| H2 | Click the email in the top bar | Your email app opens a new message to info7for1@gmail.com. |
| H3 | Click the logo from any page | You return to the homepage. |
| H4 | On desktop, click each menu item: Home, About, Initiatives, Blog, Contact | Each opens the right page; **Contact** opens the foundation's Google Form in a new tab. The current page is shown in bold blue. |
| H5 | Click **Donate** | The foundation's Google Form opens in a new tab. |
| H6 | Click **Volunteer with us** | The Google Form opens in a new tab. |
| H7 | At phone width, tap the menu button | The menu opens with all five pages plus Donate and Volunteer buttons. The button now reads "Close menu" to screen readers. |
| H8 | With the phone menu open, press Escape | The menu closes and focus returns to the menu button. |
| H9 | With the phone menu open, tap a page | That page opens and the menu closes. |

## 2. Homepage content

| ID | Steps | Expected result |
| --- | --- | --- |
| P1 | Look at the hero | Headline "Training Africans with Disabilities in Digital Skills", the subtitle, and a white **Volunteer with us** button on a blue background with a faint ring of figures. No "Watch our Story" button (no video set). |
| P2 | Click **Volunteer with us** in the hero | The Google Form opens in a new tab. |
| P3 | Look at Who We Are | A white card overlapping the hero, with Our Mission and Our Vision side by side (stacked on phones), each with an icon. |
| P4 | Click **Learn more** | The About coming-soon page opens. |
| P5 | Look at Our Initiatives | Three cards in this order: Digital Skills Training (Core Program, laptop photo), Disability Awareness & Sensitivity Training (Recurring Program, training photo), A Lesson Away Initiative (Sister Initiative tag in orange, classroom photo). |
| P6 | Click each card's button | The first two open that initiative's page on this site. **Visit A Lesson Away** (outlined, with an arrow) opens its LinkedIn page in a new tab. |
| P7 | Click **See all** next to Our Initiatives | The Initiatives list page opens. |
| P8 | Look at Our Impact | Three figures, centred, with the numbers lined up: 18+ blind learners trained, 12+ young people trained in disability awareness, 3 initiatives launched. On phones they stack. |
| P9 | Look at "Disability is not inability" | Headline, text, **Fund a training seat** button, the volunteers photo with the laptop photo overlapping its lower-right corner, and the caption below. |
| P10 | Click **Fund a training seat** | The Google Form opens in a new tab. |
| P11 | Look for a blog section | None shows, because no post is published yet. |
| P12 | Check the page title in the browser tab | "7FOR1 Foundation · Action Over Sympathy". |

## 3. Newsletter sign-up (Stay Connected)

| ID | Steps | Expected result |
| --- | --- | --- |
| N1 | Click **Subscribe** with the box empty | An error says to enter a valid email. Nothing is saved. |
| N2 | Enter `not-an-email` and subscribe | The same error shows. The typed text stays in the box so you can fix it. |
| N3 | Enter `test+1@example.com` and subscribe | The form is replaced by "Thank you for subscribing! We'll keep you posted." |
| N4 | In the admin, open People → Subscribers | `test+1@example.com` is listed with status "Pending confirmation" and source "home". |
| N5 | Reload the homepage and subscribe `TEST+1@example.com` again | The same thank-you message shows (it doesn't reveal the address was already on the list). No duplicate appears in the admin. |
| N6 | Submit 6 sign-ups in a row from the same browser | From the 6th, the form says "Too many attempts. Please try again in an hour." |
| N7 | After an error, check where the cursor is | The cursor is back in the email box, so you can correct it straight away. After a successful sign-up, focus moves to the thank-you message. |
| N8 | (Technical) Fill the hidden "website" field and submit, as a bot would | The thank-you message shows, but nothing is saved. |

## 4. Footer

| ID | Steps | Expected result |
| --- | --- | --- |
| F1 | Look at the footer | Columns: logo and "Action Over Sympathy", Quick Links, Follow Us (only when social links are set), and Contact with the phone number (when set) and email. On phones they stack. |
| F2 | Click each Quick Link | About Us, Our Initiatives and Projects and Blog open their pages; Contact Us opens the Google Form in a new tab. |
| F3 | Check the copyright line | Shows the current year and "7FOR1 (Seven For One) Foundation". |

## 5. Other pages

| ID | Steps | Expected result |
| --- | --- | --- |
| O1 | Open /about | It shows its title, a "coming soon" message with a working email link, and a **Back to the home page** button. |
| O10 | Type /donate, /volunteer or /contact into the address bar | You are forwarded to the Google Form (set in Site settings → Button and form links). |
| O2 | Open /something-that-does-not-exist and /a/b/c | The site's own "We can't find that page" page shows, with the header, footer and links back to the homepage and initiatives. |
| O8 | Open /blog with no posts published | "Our first stories are coming soon." |
| O9 | Publish a post, then open /blog and click the post | The post is listed with its date, and its own page shows the title, date, excerpt, text and a **More from our blog** button. |
| O3 | Open /initiatives | All three initiatives show as cards, with a short introduction. |
| O4 | Open Disability Awareness & Sensitivity Training | Breadcrumb "Initiatives / …", the Recurring Program tag, the goal, the photo, and a Projects section listing "Inclusive teaching training with VIFAL" (Completed · October 2023). |
| O5 | Open Digital Skills Training | The Projects section says the first project is coming soon. |
| O6 | Click the VIFAL project | Its page shows the breadcrumb Initiatives / Disability Awareness… / project, the summary, a details box (Status: Completed, Started: October 2023, Partners: VIFAL) and a **More projects from…** button that goes back to the initiative. |
| O7 | Open /initiatives/not-real and /projects/not-real | A "page not found" page shows. |

## 6. Admin panel

Use made-up test accounts only. Delete them when you finish testing.

| ID | Steps | Expected result |
| --- | --- | --- |
| A1 | Open /admin with no accounts yet | A "Welcome / create your first user" form with Email, Password, Confirm Password and Name. No Role field. |
| A2 | Create the first account | You are logged in. Under Settings → Users, the account's role is **Admin**. |
| A3 | Home page → Hero: change the subtitle and save | The homepage shows the new subtitle after a reload. |
| A4 | Settings → Site settings: add a phone number and a Facebook link, then save | The phone shows in the top bar and "Facebook" appears in the footer under "Follow Us". Remove both afterwards. |
| A5 | Initiatives → open Disability Awareness… | Its edit screen lists the VIFAL project under "Projects". |
| A6 | Create an initiative "Test initiative", fill required fields and **Save Draft** (don't publish) | It doesn't appear on the homepage or /initiatives, and /initiatives/test-initiative shows "not found". |
| A7 | Publish the test initiative | It appears on the homepage, on /initiatives and at its own page. The slug was filled in from the title. |
| A8 | Projects → create a project under "Test initiative" without choosing an initiative | Saving is refused: Initiative is required. |
| A9 | Choose the initiative and publish | The project appears on the test initiative's page. |
| A10 | Blog posts → publish a test post | An "Our Blogs" section appears on the homepage with the post. |
| A11 | Media → upload an image without alt text | Saving is refused: alt text is required. |
| A16 | Upload a large photo (e.g. 4000 px wide, under 4.5 MB) with **Add watermark** ticked | The saved image is at most 1600 px wide and has "© 7FOR1 Foundation" in the bottom-right corner, in every size. |
| A17 | Upload a logo with **Add watermark** unticked | No watermark is added. |
| A12 | As an admin, create a second account with role **Editor**, then log in as that editor | The editor can edit content but cannot see Subscribers or other users' accounts. |
| A13 | Delete the test initiative, project, post, subscriber and accounts | They disappear from the site, and their old addresses show "page not found". |
| A14 | In Site settings, enter `facebook.com/page` (no https://) as the Facebook link, or `donate-page` as the Donate link, and save | Saving is refused with a message asking for a full web address or a page starting with "/". |
| A15 | Create a new initiative without changing Sort Order | It defaults to 99 and appears after the existing initiatives. The sidebar field is labelled **Activity** (projects: **Progress**), so it isn't confused with Draft/Published. |

## 7. Access and privacy

| ID | Steps | Expected result |
| --- | --- | --- |
| S1 | Logged out, open /api/subscribers | Access is refused. No email addresses show. |
| S2 | Logged out, open /api/users | Access is refused. |
| S3 | Logged out, open /api/initiatives | Only published initiatives are returned. |
| S4 | Logged out, try to create a subscriber through /api/subscribers (POST) | Refused. Sign-ups only work through the website form. |
| S5 | In the admin, open Media and check each photo's Consent note | Training, A Lesson Away and volunteers photos say consent confirmed. The two laptop photos say consent is pending. |
| S6 | Logged out, open /api/media | Photos are listed, but no Consent note field appears. |
| S7 | Logged out, open /api/initiatives?draft=true after saving an unpublished change | Only the published version is returned. The draft change doesn't leak. |

## 8. Accessibility (keyboard and screen reader)

| ID | Steps | Expected result |
| --- | --- | --- |
| X1 | On the homepage, press Tab once | A "Skip to main content" link appears. Pressing Enter moves focus past the header. |
| X2 | Keep pressing Tab through the whole page | Every link, button and the email box can be reached in a sensible order, each with a clearly visible focus outline: blue on light backgrounds, white on the blue and dark bands (hero, top bar, Our Impact, Stay Connected, footer). |
| X3 | Check every image | Each photo has a description (alt text). The decorative ring in the hero is ignored by screen readers. |
| X4 | Check the heading structure | One main heading (the hero headline), then a heading for each section. |
| X5 | Check that external links say so | Links that open a new tab are announced as "(opens in a new tab)". |
| X6 | Zoom the browser to 200% | Everything is still readable and usable, with no text cut off. |
| X8 | Right-click a photo, and try dragging it to the desktop | No "Save image as" menu and no drag. Right-clicking links, text and the logo still works. On an iPhone, long-pressing a photo doesn't offer "Save to Photos". |
| X7 | Check text contrast | Body text, button labels and text on the blue bands are easy to read (at least WCAG AA). |

## 9. Layout on different screens

| ID | Steps | Expected result |
| --- | --- | --- |
| L1 | View the homepage at 375, 768, 1024 and 1440 px | Nothing overlaps or is cut off, and the page never scrolls sideways. |
| L2 | At phone width, check the cards and sections | Cards stack in one column. Mission and Vision stack. The Disability photos sit under the text. |
| L3 | At 1024 px, check the header | The menu button shows (the full menu appears from 1280 px). |

## 10. Production build (content refresh)

The site serves pre-built pages, so check once on a production build (`pnpm build && pnpm start`) that admin
changes reach visitors without a redeploy.

| ID | Steps | Expected result |
| --- | --- | --- |
| R1 | Change the hero text in the admin, then reload the homepage twice | The new text shows. |
| R2 | Edit a project's summary | The change shows on the project page and on its initiative's page. |
| R3 | Publish a new blog post | It appears on the homepage, on /blog and at its own address. |
| R4 | Change something in Site settings (e.g. the phone number) | The change shows on every page, including the coming-soon pages. |
| R5 | Delete a published initiative | It disappears from the homepage and /initiatives, and its address shows "page not found". |
