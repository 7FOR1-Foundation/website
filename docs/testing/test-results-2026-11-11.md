# Manual test results: 11 November 2026

**Build tested:** local development server, plus a production build (`pnpm build && pnpm start`) for the
content-refresh checks (section 10).
**Browser:** Chromium (built-in browser pane), at 320, 375, 768, 1024 and 1440 px.
**Data:** the seeded content plus made-up test accounts, posts, initiatives and `test+N@example.com`
sign-ups. All test data was deleted afterwards. The admin is back to the "create your first user" screen.

Plan: [manual-test-plan.md](manual-test-plan.md)

## Summary

| | Count |
| --- | --- |
| Checks in the plan | 78 |
| Passed first time | 72 |
| Failed, then fixed and retested | 5 (N7, O2, A10, S6, X2) |
| Not run | 1 (A15) |

Nine problems were found: five from failing checks and four noticed along the way. All nine are fixed.
Problems 1–6 were retested in the browser. Problems 7–9 were only checked in the code.

| # | Problem | Severity | Fix | Retest |
| --- | --- | --- | --- | --- |
| 1 | The keyboard focus outline was nearly invisible on the blue and dark bands (footer 1.4:1 contrast, needs 3:1). Keyboard users lost track of where they were. | High (accessibility) | White outline inside the hero, top bar, Our Impact, Stay Connected and footer. The outline colour no longer fades in. | Pass: white outline visible in the footer |
| 2 | Blog post titles on the homepage linked to pages that didn't exist ("page not found"). | High (once posts are published) | Added the blog list (`/blog`) and individual post pages. | Pass: on both the dev and production builds |
| 3 | Anyone could read the photos' consent notes through the public API (`/api/media`). | Medium (privacy) | Consent notes are now visible to logged-in staff only. | Pass: hidden when logged out, visible to staff |
| 4 | Unknown addresses showed a bare, unbranded "404" with no way back to the site. | Medium | A branded "We can't find that page" page with the header, footer and links home. | Pass: for /x, /a/b/c, /initiatives/x, /projects/x, /blog/x |
| 5 | After a newsletter error, keyboard focus was lost (it jumped to the top of the page). After success, screen readers might not announce the thank-you message. | Medium (accessibility) | Focus returns to the email box on error and moves to the thank-you message on success. | Pass |
| 6 | Link fields in the admin accepted anything (e.g. `facebook.com/page` without https://), which would create broken links. | Low | Social, Donate, button, video and external links are checked when saving. | Pass: bad links refused with a clear message |
| 7 | A new initiative defaulted to sort order 0, so it jumped to the first spot on the homepage. | Low | New initiatives default to 99 and appear last. | Not run in the admin (A15) |
| 8 | Two different "Status" fields sat next to each other in the admin (Draft/Published plus Active/Paused). | Low | Renamed to **Activity** (initiatives) and **Progress** (projects). | Seen in code only |
| 9 | A project with no photo or write-up showed an empty left column next to its details box. | Low | The details box moves into the main column. | Checked in code; not rechecked visually |

## Results by check

**Header and navigation:** H1–H9 all pass. For H2, the email link points to info7for1@gmail.com; opening
an email app can't be checked in the test browser.

**Homepage:** P1–P12 all pass.

**Newsletter**
- N1–N3, N5, N6 and N8 pass. N4 also passes; it was checked in the database rather than on the admin list screen.
- N7 failed: focus was lost after submitting (problem 5). Fixed, now passes.

**Footer:** F1–F3 pass. With a Facebook link set, the column title becomes "Follow Us".

**Other pages**
- O1, O3–O7 pass.
- O2 failed: the 404 page was unbranded (problem 4). Fixed, now passes.
- O8 and O9 are new checks for the blog pages. Both pass: the list and post pages load and show the right
  content. The post page layout wasn't reviewed visually.

**Admin**
- A1–A9 and A11–A13 pass. A11 was checked against the server's own rules, since this browser can't open a
  file-upload dialog. An editor tried to promote themselves to admin; the request was ignored.
- A10 failed: the blog link opened "page not found" (problem 2). Fixed, now passes.
- A14 is new. It passes, checked through the API.
- A15 is new and was not run.

**Access and privacy**
- S1–S5 and S7 pass. Logged out, nobody can read subscribers or accounts, create or change content, or see
  unpublished drafts, even with `?draft=true`.
- S6 failed: consent notes were public (problem 3). Fixed, now passes.

**Accessibility**
- X1, X3–X7 pass. The lowest text contrast is 5.2:1 (links on the light-blue background), so everything
  meets WCAG AA.
- X6 was checked at 320 px wide, the same reflow as 400% zoom on a laptop.
- X2 failed: the focus outline was invisible on dark bands (problem 1). Fixed, now passes.

**Layout:** L1–L3 pass. No sideways scrolling at 320, 375, 768, 1024 or 1440 px.

**Production build:** R1–R5 all pass. Admin changes reached visitors within about a second, with no
redeploy. The cache refreshed on the first visit after a change.

## Not covered by this round

- A real screen reader (VoiceOver or NVDA) and real phones. The checks used the accessibility tree and
  emulated screen sizes.
- Safari and Firefox.
- Slow or unreliable mobile connections.
- The admin's file-upload dialog. Uploads were tested through the same server rules.
- Whether the page scrolls smoothly to the element you tab to. The browser pane was hidden during testing,
  which pauses animations and smooth scrolling, so this couldn't be judged.

## Open observations (not bugs, or not fixed yet)

1. **Dead ends:** "Donate" and "Fund a training seat" lead to a coming-soon page until donations are decided.
2. **No confirmation email:** newsletter sign-ups stay "Pending confirmation" because no email service is set
   up yet. The thank-you message says "We'll keep you posted", but nothing is sent until Brevo is connected.
3. **Password reset:** "Forgot password?" in the admin can't send emails yet, for the same reason.
4. **Rate limit:** the sign-up limit (5 per hour) is kept in each server's memory. On Vercel, each server
   instance counts separately. A shared limit comes with the spam-protection work.
5. **Initiative cards:** only the button is clickable, not the photo or title. A card without a photo shows
   an empty light-blue box.
6. **404 tab title:** for deeper unknown addresses (e.g. /initiatives/x), the browser tab shows the site's
   default title rather than "Page not found".
