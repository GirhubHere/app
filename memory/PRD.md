# Five Agra Select — Product Requirements (PRD)

## Original problem statement
Single-page B2B landing site for "Five Agra Select", a Ukrainian grain & oilseeds exporter (corn, wheat, sunflower, barley, rapeseed, soybeans). English-first with RU/RO language toggle. Visual style of world-class agribusiness leaders (ADM, Bunge, Cargill): white, airy, confident; brand palette of deep green + brand green + gold. Smooth-scroll anchor navigation, scroll-reveal animations, animated count-up stats, glassmorphism contact form on dark green.

## User personas
- International B2B importers (EU, MENA, Turkey, Asia)
- Feed mills, crushers and traders sourcing Ukrainian-origin commodities
- Procurement officers comparing exporters' credibility & documentation

## Tech stack
- Frontend: React 19 + Tailwind + Sora/Inter (Google Fonts), lucide-react icons, axios
- i18n: lightweight context (EN/RU/RO) with localStorage persistence (`fa_lang`)
- Backend: FastAPI + Motor (MongoDB). Collection: `quote_requests`
- Images: generated once with Gemini 3.1 Flash Image Preview (Nano Banana), stored statically under `/app/frontend/public/images/`

## What's been implemented (2026-06-10)
- 10-section landing page: Hero (full viewport with dark-green gradient + animated down-arrow), Stats (animated count-up), Purpose statement, Commodities (6 cards with photos, badges, simplified chips: only bulk/big-bags + protein/oil), Our Story (with offset gold photo frame + check list), Field-to-Vessel (dark parallax + 4-step gold-dot timeline + gold quote), Why Us (3×2 bordered grid + cert pills), Global Markets (regions list + Incoterms panel with gold glow), Contact (glassmorphism form on dark green gradient), Footer (4 columns).
- Sticky navbar: transparent over hero → solid white after 60px scroll, 4 smooth-scroll anchor links, EN/RU/RO language switcher, gold pill "Request a Quote" CTA.
- Full EN/RU/RO translations (one dictionary file).
- Backend endpoints: `GET /api/health`, `POST /api/quote-requests` (validates commodity allow-list + email), `GET /api/quote-requests` (sorted desc).
- 10 AI-generated photographic assets (hero, aerial, 6 commodity close-ups, farmer, vessel) + uploaded brand logo.
- SEO meta + page title set.

## Backlog (deferred)
- P1: Email notification on new quote (Resend / SendGrid integration) — currently MongoDB-only.
- P1: WhatsApp/Telegram lead notification.
- P1: `/admin` view to list submissions.
- P2: Cookie consent banner.
- P2: Replace placeholder phone with real number.
- P2: Sitemap.xml + robots.txt for SEO.
- P2: Image lazy-loading via `loading="lazy"` (already added) + WebP conversion.
- P3: Refactor `Landing.jsx` (~900 lines) into per-section files.

## Test credentials
n/a — no authentication.

## Last verified
2026-06-10 — backend 9/9 pytest passing; frontend 100% pass (testing_agent_v3 iteration_1).
