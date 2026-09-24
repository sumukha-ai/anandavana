# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences, weighted equally:

- **Bhaktas (devotees)** book and pay for sevas for themselves and their family members, then check their bookings. Many read Kannada first and use a phone.
- **Seekers and visitors** learn about Sri Kshetra Anandavana: the Guru Parampare, the Sadguru Vamsha Vruksha, the institutions and the kshetra itself. Some are planning a visit.

Staff use role-based workspaces for operations:

- **Admin** manages staff logins, the seva catalog (in the seva editor), bookings, the seva calendar, user accounts and Jyotisha references (Rashi and Nakshatra).
- **Manager** reviews bookings, seva availability, user accounts and daily schedules.
- **Priest** tracks booked sevas, upcoming ritual dates and seva details in a focused view.

## Product Purpose

This is the official web presence of Sri Sheshachala Sadguru Samsthana (R), Anandavana, Agadi. It has two jobs:

1. Carry the Samsthana's spiritual identity (lineage, teachings, service, institutions) to devotees and seekers.
2. Run seva booking end to end: a bhakta books and pays online, and staff see and schedule the booking on the seva calendar.

It succeeds when a devotee can book a seva in their own language without help, and when temple staff can run the day's sevas from the portal.

## Positioning

- **A living Guru lineage.** The Sheshachala Sadguru parampare and the vamsha vruksha are the core identity. Nothing generic to "a temple" should replace them.
- **Service and annadana.** Nourishment, care and solace for the distressed are central to what the kshetra is.
- **Institutions.** Sri Sheshachala Veda Paatashaale and Sri Sheshachala Prouda Shaale carry the tradition forward through education.
- **Reverent and non-commercial.** Booking a seva is an offering, never a shopping transaction.

## Operating Context

- Public routes: Home, About, Guru Parampare, Sadguru Vamsha Vruksha, Institutions, Events, Online Seva Booking and individual seva pages, Publications, Gallery, Contact.
- Bhakta flow: register or log in, open the dashboard, manage profile and family members, book a seva, then view bookings.
- Staff flow: role workspaces under `/admin`, `/manager` and `/priest`, organised into Home, Access, Catalog and Operations groups.
- Seva details can depend on Jyotisha data (Rashi, Nakshatra). These lookups have English and Kannada names.
- Contact: SH 2, Agadi, Haveri - 581128, Karnataka, India · +91 97415 85030 · info@anandavanaagadi.org.

## Capabilities and Constraints

- Stack: React 19 + Vite, React Router, CSS Modules. MUI appears in parts (e.g. the Dashboard), and GSAP and AOS handle motion. lucide-react provides icons, and axios calls a REST API (`VITE_API_BASE_URL`, default `http://127.0.0.1:5000/api`). The site is deployed on Netlify as a single-page app.
- Routes are language-prefixed (`/en/...`, `/kn/...`). The API is called with `lang=kn` for Kannada content.
- Payments currently run against a sandbox payment session and are going live on Cashfree. Receipts matter.
- Some sevas are marked "Offline" when they have no online amount.
- **Open:** 80G / tax-exemption status is not confirmed. Do not claim tax benefits until it is.

## Brand Commitments

- Name: **Sri Sheshachala Sadguru Samsthana (R)**, Anandavana, Agadi (in Kannada: ಶ್ರೀ ಶೇಷಾಚಲ ಸದ್ಗುರು ಸಂಸ್ಥಾನ (ರಿ.), ಆನಂದವನ, ಅಗಡಿ). In the hero it appears as "Sri Kshetra Anandavana".
- Logo files: `assets/logo.png`, `assets/logo.jpeg`.
- Voice: devotional, humble and reverent, with warmth toward those in distress. Guru names and honorifics must be rendered correctly.
- Kannada is the primary language. Every user-facing string needs a reviewed Kannada counterpart as well as English.

## Evidence on Hand

- Photographs of the Gurus, the deities and the kshetra in `assets/`: Sheshachala Maharajaru, Brahmanandaru Maharajaru, Narayana Bhagavanaru, Shankara Bhagavanaru, the Panchayatana, the full view of Anandavana and more. The entrance video is in `assets/entrance.mp4`.
- Existing bilingual copy on the lineage, the Gurus' lives and teachings, and the institutions (in the page components and `src/i18n/translations.js`).
- **Absent, so do not fabricate:** the events and festival schedule (the page is a placeholder), the final publications list, testimonials, visitor or devotee numbers, and any tax-exemption claims.

## Product Principles

1. **Seva is an offering.** Booking and payment language and flow stay reverent and simple. No commerce patterns: no urgency, upsells or cart language.
2. **Kannada first, English equal.** No feature ships in one language only.
3. **The lineage leads.** The Guru Parampare is the identity, and every public surface should let it speak.
4. **Operational clarity for staff.** Staff workspaces favour scanability and accuracy of dates, sevas and devotee details over expression.
5. **Truth over polish.** Show only real schedules, publications and facts. Placeholder states say so honestly.

## Accessibility & Inclusion

- Many devotees are older and use phones on mobile networks, so text must stay legible, tap targets generous and pages light.
- Kannada script needs proper font support and line height.
