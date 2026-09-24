---
version: 1
slug: "src-pages-roleportal-roleshell-jsx"
primary_target: "src/pages/rolePortal/RoleShell.jsx"
related_targets: ["src/pages/RolePortal.jsx","src/pages/rolePortal"]
---

# Staff console (admin / manager / priest)

Mode: Operate. Audience: temple office staff at a desk in daylight, and priests on phones. Job: run the day's sevas, keep the catalog accurate, manage access.

## Direction contract

THESIS: A standalone operations console at Linear/Stripe craft level: its own full-height app shell rather than a public-site page with a sidebar pasted under the marketing navbar. It refuses the stack of shadowed white cards with big numbers.

OWN-WORLD: Cool zinc neutrals on two layers (a sidebar rail slightly darker than the canvas), hairline 1px borders, 8px/6px radii, and one accent (brand saffron-orange) reserved for the primary action, the current selection and focus. Inter with tabular numerals throughout. Status is carried by small dot badges. Light by default, with a dark theme on the same tokens.

STORY: Staff open the console, see today's sevas and what is outstanding, jump anywhere with ⌘K, filter and export bookings, open a calendar day and read everything a priest needs.

FIRST VIEWPORT: 248px sidebar (logo lockup, grouped nav with a sliding active indicator, user and theme at the foot). A 56px top bar with breadcrumb, a ⌘K search trigger and the language toggle. Content: page title with its primary action on the right, a segmented KPI strip, then today's sevas beside a 14-day load chart.

FORM: Canon SaaS console (user-chosen standing exit; references Linear, Stripe Dashboard, Vercel). No seed rolled; the direction was pinned by the user.

SIGNATURE: the sliding nav indicator plus a ⌘K command palette. Motion grammar: 160–220ms ease-out, content fade-rise on route change, toasts slide in, calendar month slides by direction, skeletons while loading. prefers-reduced-motion honored.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
