# RAIN07 — WordPress REST API Discovery Documentation

## Overview
- **Backend URL:** `https://be-web-por-rey.rey07.my.id/`
- **REST API Discovery Root:** `https://be-web-por-rey.rey07.my.id/wp-json/`
- **WPGraphQL:** Not installed. The system utilizes the WordPress REST API v2 (`/wp-json/wp/v2/`).
- **SEO Engine:** Yoast SEO v28.4 (`yoast_head` and `yoast_head_json` available on all post types).

---

## 1. Discovered Custom Post Types (CPT)

### Portfolio Post Type
- **Discovered CPT Identifier:** `portfolio`
- **API Endpoint:** `/wp-json/wp/v2/portfolio`
- **Single Item Route:** `/wp-json/wp/v2/portfolio/(?P<id>[\d]+)`
- **Query by Slug:** `/wp-json/wp/v2/portfolio?slug={slug}&_embed`
- **Associated Taxonomy:** `cat-portfolio` (`/wp-json/wp/v2/cat-portfolio`)

#### Sample Item Inspected:
- **ID:** 28
- **Date:** `2026-09-02T09:27:29`
- **Slug:** `pembuatan-website`
- **Title:** `Pembuatan Website`
- **Featured Media ID:** 23 (`https://be-web-por-rey.rey07.my.id/wp-content/uploads/2026/09/pembuatan-website-featured-1788341128.png`)
- **Embedded Gallery Images:** Extracted directly from Gutenberg gallery block markup in `content.rendered`.
- **Category:** `cat-portfolio` -> `[ { id: 3, name: "Website", slug: "website" } ]`

---

## 2. Discovered Standard Posts (Blog / Notes)

### Standard Posts
- **Endpoint:** `/wp-json/wp/v2/posts`
- **Query by Slug:** `/wp-json/wp/v2/posts?slug={slug}&_embed`
- **Taxonomies:**
  - Categories: `/wp-json/wp/v2/categories` (e.g. Category ID 1: "Tak Berkategori")
  - Tags: `/wp-json/wp/v2/tags`

#### Sample Post Inspected:
- **ID:** 1
- **Slug:** `halo-dunia`
- **Title:** `Halo dunia!`
- **Content:** Welcome post content.

---

## 3. Discovered Taxonomies
- **`cat-portfolio`**: Categories for portfolio items (e.g., ID 3: `Website`, slug `website`)
- **`category`**: Standard blog post categories
- **`post_tag`**: Standard blog tags

---

## 4. Normalization Strategy
The raw WordPress responses contain nested HTML, rendered objects, and `_embedded` arrays. We construct strict TypeScript interfaces:
- `NormalizedPortfolioItem`: extracts `id`, `title`, `slug`, `contentHtml`, `excerpt`, `featuredImageUrl`, `categories`, `galleryImages`, `yoastHeadJson`, `publishedDate`.
- `NormalizedPost`: extracts `id`, `title`, `slug`, `contentHtml`, `excerpt`, `featuredImageUrl`, `categories`, `tags`, `author`, `publishedDate`, `yoastHeadJson`.
- All endpoints use `_embed` to resolve featured media and taxonomy terms in a single HTTP request without N+1 query overhead.
