# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- [INFERENCE, not confirmed] Primary: engineers and product teams in robotics, automotive/mobility, industrial, and AI infrastructure who evaluate programmable-optics and 3D-sensing hardware (TX10, M30, NM120 kits; LM10 chip) before contacting sales. Evidence: technical product copy, contact-only CTAs, no pricing (`pb_migrations/1787701000_m30_dev_kit_page.js`, `1787701100_tx10_page.js`, `1787701200_nm120_page.js`).
- Secondary audiences present in content: investors/partners (`/partners`), recruits (`/culture`), press (`/news`).

## Product Purpose

Lumotive.com is the public marketing site for Lumotive, Inc. It presents the LCM (Light Control Metasurface) programmable-optics platform and its two offers, Sense and Connect. Success on this site is one action: a visitor contacts sales via `/contact` (confirmed).

## Positioning

- "Programmable optics": "LCM™ chips shape and steer laser light on the surface of silicon — no mirrors, no lenses, no moving parts." (`pb_migrations/1700000300_seed_lumotive.js:15-17`)
- Mechanism: software-defined light control built on optical semiconductor technology; engineered metasurfaces control photons at the chip surface. (`1700000300_seed_lumotive.js:359-409`)
- Sense: "3D sensing for Physical AI". Connect: "Programmable photonics for AI infrastructure". (`1700000300_seed_lumotive.js:53-74`)

## Operating Context

- Content is CMS-driven. Pages and sections live in PocketBase records, seeded and mutated by `pb_migrations/*.js`. The SvelteKit frontend (`src/routes/(site)/`) renders them.
- Markets named in content: robotics/humanoids, automotive and heavy equipment, smart infrastructure/surveillance, industrial monitoring, AI networks and hyperscale fabrics.
- Sitemap: `/`, `/platform`, `/sense`, `/lm10`, `/dev-kits`, `/tx10`, `/m30`, `/nm120`, `/connect`, `/applications`, `/about`, `/culture`, `/partners`, `/contact`, `/news`, `/posts/[slug]`. Editor at `/admin/*`.
- Header: Platform; Sense → Overview, LM10 chip, Dev kits & reference designs → TX10 / M30 / NM120; Connect; Applications → Overview, Robotics, Automotive; Company → About, Culture, Partners, News, Careers; CTA Contact.

## Capabilities and Constraints

- Stack: SvelteKit 2, Svelte 5, Tailwind 4, GSAP, Lenis, PocketBase 0.39.11. Node adapter SSR. Deployed to Dokploy from GHCR images (`.github/workflows/publish.yml`).
- Products: LCM Evaluation Kit, TX10 Development Kit / Reference Design (iToF transmit module on LM10), M30 Development Kit (iToF, >25 m, smaller than a credit card), NM120 Development Kit (solid-state dToF lidar, <17 W).
- No pricing, purchase flow, or kit-specific request path. All CTAs route to contact.
- Terminology: LCM™, LM10, iToF, dToF, beam steering, Physical AI, Sense, Connect.
- Open: `/privacy-policy` is linked in the footer but has no seeded page. SEO tagline/description in `1700000300_seed_lumotive.js:3641-3645` is stale boilerplate ("Next.js and Payload starter").

## Brand Commitments

- Copy is binding. Do not rewrite, add, or remove site copy without an explicit request (confirmed 2026-09-23).
- The incumbent look is binding (confirmed 2026-09-23): Oswald display + Poppins body; primary blue `#0078d0`, dark blue `#0063ad`, green `#00a651`, amber `#ffb114`, red `#ee0000`; ink `#0d1526`, panel `#0a1226`, background `#f3f4f7` (`src/lib/styles/tokens.css`). Future work refines this system; it does not replace it.
- Marks: `static/brand/logo-navy.svg`, `static/brand/logo-white.svg`, `static/lumotive/logos/`.
- Legal: "Lumotive, Inc. All rights reserved."

## Evidence on Hand

- Investors: "Backed by Gates Frontier, Amazon and Samsung Ventures" plus nine investor logos (`1700000300_seed_lumotive.js:100-165`).
- Customer products: Hokuyo YLM-10LX and Namuga Stella-120 built on LCM (`1787701400_dev_kits_customer_products.js`, `1787706000_dev_kits_stella_120.js`).
- Press releases and media coverage seeded in News (`1700000310_seed_lumotive_news.js`). Eight industry awards (`1787705200_culture_awards.js`).
- Two employee testimonials, Pankil and Linda (`1787705100_culture_testimonials.js`). These are recruiting proof, not buyer proof.
- Media: product, market, and team imagery; `hero.mp4`, `beam-steering.mp4` under `static/lumotive/`.
- Absent, do not fabricate: buyer testimonials, first-party case studies, pricing, benchmarks beyond the seeded product claims.

## Product Principles

1. The contact action is the goal. Every surface should shorten the path to `/contact`.
2. Copy and claims are fixed truth. Design serves the existing words.
3. Technical credibility over marketing gloss. Engineers verify; show mechanism and specs.
4. Proof is real or absent. Use seeded investors, customer products, press, and awards; never invent more.
5. Refine the incumbent system. Consistency across CMS-driven sections outranks novelty.

## Accessibility & Inclusion

No explicit standard recorded. Existing practice: alt text tracked in the media library, `prefers-reduced-motion` respected in public and admin styles, ARIA labels in components.
