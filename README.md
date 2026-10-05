# RAIN07 — Personal Engineering Portfolio
### Astro + Headless WordPress + Cloudflare Workers

A high-performance personal engineering portfolio website branded as **RAIN07** (secondary identity: **REYNO07**), built with a **Digital Brutalism + Technical Editorial** aesthetic.

The application positions RAIN07 at the intersection of:
```
WEB DEVELOPER + FULL-STACK DEVELOPER + INFRASTRUCTURE ENGINEER
"I BUILD WEBSITES, APPLICATIONS & THE INFRASTRUCTURE BEHIND THEM."
```

---

## 1. Project Overview & Architecture

The architecture decouples content management (WordPress) from production delivery (Cloudflare Workers edge):

```
                     INTERNET / CLIENTS
                             │
                             ▼
                   ┌──────────────────┐
                   │    CLOUDFLARE    │
                   │     WORKERS      │
                   └─────────┬────────┘
                             │
                             ▼
                   ┌──────────────────┐
                   │   ASTRO RAIN07   │
                   │ TypeScript       │
                   │ Tailwind CSS v4  │
                   │ Digital Brutalism│
                   │ Edge Routing     │
                   └─────────┬────────┘
                             │
                      HTTPS REST API (_embed)
                             │
                             ▼
              ┌─────────────────────────────┐
              │         BACKEND API         │
              │   be-web-por-rey.rey07...   │
              └──────────────┬──────────────┘
                             │
                             ▼
                     WORDPRESS (Headless)
                     • CPT: 'portfolio'
                     • Tax: 'cat-portfolio'
                     • Posts & Categories
                             │
                             ▼
                         DATABASE
```

---

## 2. Tech Stack

- **Frontend Framework:** Astro v7 with static site generation (SSG) & Cloudflare Workers runtime adapter
- **Language:** TypeScript (strict mode, zero errors)
- **Styling:** Tailwind CSS v4 + Digital Brutalism Design System (custom grid blueprint, hard borders, zero border-radius, hard offset shadows, high-contrast monochrome + electric blue `#0057FF` + lime `#D9FF00`)
- **Typography:** Space Grotesk (Headings), Inter (Body), JetBrains Mono (Technical telemetry & labels)
- **Backend / CMS:** Headless WordPress via standard REST API v2 (`/wp-json/wp/v2/`)
- **SEO & Metadata:** Yoast SEO v28.4 JSON-LD extraction, OpenGraph, Twitter Cards, Sitemap, robots.txt
- **Hosting / Edge Runtime:** Cloudflare Workers (`wrangler.toml`)

---

## 3. Local Development

### Prerequisites
- Node.js >= 20
- npm >= 10

### Setup
```bash
# Clone the repository
git clone <repo-url>
cd rain07

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```
The local server will run on `http://localhost:4321/`.

---

## 4. Environment Variables

Create `.env` using `.env.example`:

| Variable | Description | Default |
|---|---|---|
| `PUBLIC_API_URL` | Base URL of WordPress backend | `https://be-web-por-rey.rey07.my.id` |
| `PUBLIC_SITE_URL` | Canonical public site URL | `https://rain07.my.id` |
| `PUBLIC_CONTACT_EMAIL` | Public contact email | `reyno.fahreza@gmail.com` |
| `PUBLIC_LINKEDIN_NAME` | Public LinkedIn handle | `Reyno Nur Fahreza` |
| `PUBLIC_WHATSAPP_NUMBER` | Contact WhatsApp number | Configurable |

---

## 5. Backend API & Content Model

The live WordPress REST API was inspected and documented in [`docs/api.md`](file:///e:/Project%20App/rain07/docs/api.md).

### Custom Post Type: `portfolio`
- **REST Endpoint:** `/wp-json/wp/v2/portfolio`
- **Slug Endpoint:** `/wp-json/wp/v2/portfolio?slug={slug}&_embed`
- **Taxonomy:** `cat-portfolio` (`/wp-json/wp/v2/cat-portfolio`)
- **Gutenberg Gallery:** Extracted automatically in `src/lib/content/normalizer.ts` without client overhead.
- **Routes:**
  - `/work` (All portfolio items)
  - `/work/[slug]` (Individual case study route)

### Standard Posts: `posts`
- **REST Endpoint:** `/wp-json/wp/v2/posts`
- **Slug Endpoint:** `/wp-json/wp/v2/posts?slug={slug}&_embed`
- **Taxonomy:** `category` (`/wp-json/wp/v2/categories`)
- **Routes:**
  - `/notes` (All engineering notes)
  - `/notes/[slug]` (Individual note route)

---

## 6. Content Normalization Layer

To protect Astro components from WordPress API leaks or restructuring:
1. `src/lib/api/client.ts`: Handles requests with error-handling and fallback defaults.
2. `src/lib/content/normalizer.ts`: Maps raw WordPress objects to clean, strictly-typed models (`NormalizedPortfolioItem`, `NormalizedPost`).
3. Astro components consume only normalized models.

---

## 7. Build & Cloudflare Workers Deployment

### Production Build
```bash
npm run build
```
This pre-renders all static HTML pages and outputs the Cloudflare Workers assets to `./dist`.

### Type Verification
```bash
npm run astro check
```

### Preview Locally
```bash
npm run preview
```

### Deploy to Cloudflare Workers
Ensure you are logged into Wrangler:
```bash
npx wrangler login
npm run deploy
```

---

## 8. Webhook Rebuilds (Headless Flow)

When new portfolio items or blog notes are published in WordPress:
1. WordPress webhook (e.g. WP Webhooks or custom action) sends a POST request to Cloudflare Deploy Hook / CI.
2. Cloudflare builds the Astro application using `npm run build`.
3. The updated static assets are instantly deployed to the edge.

---

## 9. Brand & Identity Guidelines

- **Primary Identity:** RAIN07
- **Secondary Identity:** REYNO07 (used as signature, technical metadata, and footer label)
- **Compact Mark:** R07
- Full legal name is excluded from public display.
