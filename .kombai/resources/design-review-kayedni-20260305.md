# Design Review: Kayedni — `/`, `/business/[slug]` & Booking System

**Review Date**: 2026-03-05  
**Routes**: `/` (Home), `/business/[slug]` (Business Detail), Booking Flow (Steps 1–4)  
**Focus Areas**: Visual Design · UX/Usability · Responsive/Mobile · Accessibility · Performance · Consistency  
**Method**: Live browser inspection at `http://localhost:3000`

---

## Summary

The app has a solid foundation with a clean purple brand, working multi-step booking flow, and strong card UI. The main remaining concern is a high CLS score (0.635) on the business detail page. Several medium-priority UX gaps — no progress indicator during booking, no calendar color legend, non-interactive star rating — add friction to the core user journey. Dark mode token inconsistencies and a few mobile layout rough edges round out the polish work.

---

## Issues

| # | Issue | Criticality | Category | Location |
|---|-------|-------------|----------|----------|
| 1 | **CLS score of 0.635** on `/business/[slug]` — far exceeds the 0.1 "Good" threshold, causing visible layout jumps as images and the booking section load | 🔴 Critical | Performance | `src/app/(pages)/(business)/business/[slug]/page.tsx` — booking section toggle + image load |
| 2 | **No booking progress indicator** — once inside the booking flow the user has no visual progress bar or stepper. The panel label "3" or "4" is the only position signal. Users cannot tell how many steps remain | 🟠 High | UX/Usability | `src/app/(pages)/(business)/business/[slug]/page.tsx:479–756` |
| 3 | **Footer renders inside booking view** — when booking mode is active and the panel is short (e.g. Step 1 with no services yet shown), the dark footer is visible directly below the booking card, creating a jarring context break | 🟠 High | Visual Design | `src/app/(pages)/(business)/business/[slug]/page.tsx:478` — `isBookingMode` branch has no `min-h` |
| 4 | **Plain text "Loading..." state** — while the business detail loads only the text "Loading..." is shown with no skeleton, making the page feel broken during the ~2s initial load | 🟡 Medium | Visual Design | `src/app/(pages)/(business)/business/[slug]/page.tsx:248–253` |
| 5 | **Calendar has no color legend** — the availability calendar uses up to 7 color states (green = available, orange = full, blue = day off, red = sick, amber = vacation, slate = closed, gray = unavailable) but there is no visible legend to explain them | 🟡 Medium | UX/Usability | `src/app/(pages)/(business)/business/[slug]/page.tsx:593–626` |
| 6 | **Booking confirmation lacks business context** — Step 4 "Confirm Details" shows service, professional, date/time, and total but does NOT show the business name or location. If a user has multiple tabs open they have no way to identify which booking they are confirming | 🟡 Medium | UX/Usability | `src/app/(pages)/(business)/business/[slug]/page.tsx:699–744` |
| 7 | **Review form star rating is not interactive** — the star icons in "Leave a Review" have `cursor-pointer` and hover styles but no `onClick` handler. Clicking stars does nothing; the selected rating is never captured | 🟡 Medium | UX/Usability | `src/app/(pages)/(business)/business/[slug]/page.tsx:417–421` |
| 8 | **"Browse All Professionals" button has poor visual weight** — uses a white/outline skeuomorphic style that blends into the light section background. This primary CTA can be easily missed | 🟡 Medium | Visual Design | `src/app/Index.tsx:591–601` |
| 9 | **Home page: no consumer CTA above the fold** — the only CTA below the search bar is "Bookify for Business" targeting business owners. There is no "Browse All Services" or equivalent for consumers | 🟡 Medium | UX/Usability | `src/app/Index.tsx:448–462` |
| 10 | **Mobile: "Dentist" quick-tag wraps to a new line alone** — at 390 px the popular search tags wrap, leaving "Dentist" isolated on a second row with awkward centering. Tags should left-align on wrap | 🟡 Medium | Responsive | `src/app/Index.tsx:413–429` |
| 11 | **Mobile: date + time layout gets very cramped** — at 390 px the calendar and time slot grid stack but the time slots 2-column grid becomes too tight for comfortable tapping | 🟡 Medium | Responsive | `src/app/(pages)/(business)/business/[slug]/page.tsx:591–663` |
| 12 | **"No services available" empty state is bare plain text** — when the selected staff member has no services, a small grey paragraph is shown with no icon and no guidance on next steps | ⚪ Low | Visual Design | `src/app/(pages)/(business)/business/[slug]/page.tsx:557–559` |
| 13 | **Phone mockup in mobile app section has no real content** — the phone illustration in "Manage Bookings On-the-Go" is filled with grey placeholder rectangles. Real app screenshots or branded mockup images would significantly improve conversion intent | ⚪ Low | Visual Design | `src/app/Index.tsx:940–988` |
| 14 | **Review card action buttons lack `aria-label`** — "ThumbsUp" and "Reply" buttons in review cards are `<button>` elements without `aria-label` attributes, making them meaningless to screen readers | ⚪ Low | Accessibility | `src/app/(pages)/(business)/business/[slug]/page.tsx:403–409` |
| 15 | **Dark mode theme token gaps** — several elements use hardcoded Tailwind grays (`text-gray-600`, `bg-gray-50`, `border-gray-100`) instead of semantic tokens (`text-muted-foreground`, `bg-muted`, `border-border`), causing incorrect colors in dark mode | ⚪ Low | Consistency | `src/app/(pages)/(business)/business/[slug]/page.tsx` — scattered throughout |

---

## Criticality Legend
- 🔴 **Critical**: Breaks functionality or causes severe performance degradation
- 🟠 **High**: Significantly impacts the user experience or core flow
- 🟡 **Medium**: Noticeable friction or visual inconsistency that should be addressed
- ⚪ **Low**: Polish / nice-to-have improvement

---

## Next Steps (Prioritized)

### 🔴 Fix First
1. **CLS** — Reserve layout space for the booking section and images upfront (`min-h`, `aspect-ratio` on image containers) to prevent layout shift on load.

### 🟠 Fix Next
2. **Booking progress indicator** — Add a visible stepper (e.g. `Step 2 of 3` pill or a `<Progress>` bar) at the top of the booking card so users always know their position in the flow.
3. **Footer gap** — Add `min-h-[60vh]` to the booking mode wrapper to prevent the footer from bleeding into an active booking step.

### 🟡 Fix Soon (Polish)
4. **Calendar legend** — Add a compact legend row below the calendar: `● Available  ● Fully Booked  ● Closed  ● Day Off`.
5. **Skeleton loading** — Replace "Loading..." text with a `<Skeleton>` layout matching the business page structure.
6. **Star rating** — Wire up `useState(rating)` to make stars clickable and capture the selected value before form submission.
7. **Confirmation context** — Add business name (and optionally address) to the Step 4 summary card.
8. **Consumer CTA** — Add a "Browse All Services →" link below the search bar for users who are not business owners.
9. **Mobile tag alignment** — Set `justify-start` on the quick-tag row so tags left-align on wrap instead of centering the last orphan.
10. **Empty state** — Replace bare text with an icon + helpful message for "no services" and "no available slots" states.
