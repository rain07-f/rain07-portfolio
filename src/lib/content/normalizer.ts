import type {
  WPRawPortfolioItem,
  WPRawPost,
  NormalizedPortfolioItem,
  NormalizedPost,
  NormalizedGalleryImage,
  NormalizedTaxonomyTerm
} from '../api/types';

/**
 * Extracts gallery image URLs and alt texts from rendered Gutenberg HTML content
 */
export function extractGalleryImagesFromHtml(html: string): NormalizedGalleryImage[] {
  const images: NormalizedGalleryImage[] = [];
  if (!html) return images;

  // Regex to match <img ... src="..." ... />
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null;

  while ((match = imgRegex.exec(html)) !== null) {
    const fullTag = match[0];
    const src = match[1];
    
    // Extract alt if present
    const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? decodeHtmlEntities(altMatch[1]) : '';

    if (src && !images.some(img => img.src === src)) {
      images.push({ src, alt });
    }
  }

  return images;
}

/**
 * Common HTML named entity map for fast lookup
 */
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  quot: '"',
  apos: "'",
  lt: '<',
  gt: '>',
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  sbquo: '‚',
  ldquo: '“',
  rdquo: '”',
  bdquo: '„',
  hellip: '…',
  laquo: '«',
  raquo: '»',
  middot: '·',
  bull: '•',
  prime: '′',
  Prime: '″',
  trade: '™',
  copy: '©',
  reg: '®',
  euro: '€',
  pound: '£',
  yen: '¥',
  cent: '¢',
  deg: '°',
  plusmn: '±',
  times: '×',
  divide: '÷',
  para: '¶',
  sect: '§'
};

/**
 * Safely decodes HTML entities (both numeric decimal/hex and named entities)
 * without using DOM/browser APIs or dangerous innerHTML.
 */
export function decodeHtmlEntities(text: string): string {
  if (!text || typeof text !== 'string') return '';
  if (!text.includes('&')) return text;

  return text.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-zA-Z]+);/g, (match, entity) => {
    // Hexadecimal numeric entity: &#x2013;
    if (entity.startsWith('#x') || entity.startsWith('#X')) {
      const code = parseInt(entity.slice(2), 16);
      return (!Number.isNaN(code) && code >= 0 && code <= 0x10FFFF) ? String.fromCodePoint(code) : match;
    }

    // Decimal numeric entity: &#8211; or &#039;
    if (entity.startsWith('#')) {
      const code = parseInt(entity.slice(1), 10);
      return (!Number.isNaN(code) && code >= 0 && code <= 0x10FFFF) ? String.fromCodePoint(code) : match;
    }

    // Named entity: &quot;, &amp;, &ndash;, etc.
    const lower = entity.toLowerCase();
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, lower) ? NAMED_ENTITIES[lower] : match;
  });
}

/**
 * Strips HTML tags and decodes HTML entities to produce clean plain text
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  const withoutTags = html.replace(/<[^>]+>/g, ' ');
  return decodeHtmlEntities(withoutTags).replace(/\s+/g, ' ').trim();
}

/**
 * Determines a factual status badge based on categories, title, or status
 */
function deriveStatusBadge(slug: string, title: string, categories: NormalizedTaxonomyTerm[]): 'LIVE' | 'CLIENT' | 'PERSONAL' | 'CONCEPT' | 'PROTOTYPE' | 'DEVELOPMENT' {
  const combined = `${slug} ${title} ${categories.map(c => c.slug).join(' ')}`.toLowerCase();
  if (combined.includes('live') || combined.includes('production')) return 'LIVE';
  if (combined.includes('client') || combined.includes('pembuatan-website')) return 'CLIENT';
  if (combined.includes('concept')) return 'CONCEPT';
  if (combined.includes('prototype')) return 'PROTOTYPE';
  if (combined.includes('dev') || combined.includes('development')) return 'DEVELOPMENT';
  return 'PERSONAL';
}

/**
 * Normalizes a raw WordPress Portfolio item into our clean UI model
 */
export function normalizePortfolioItem(raw: WPRawPortfolioItem): NormalizedPortfolioItem {
  const cleanTitle = stripHtml(raw.title?.rendered || 'Untitled Project');

  // Extract embedded featured media
  let featuredImage: NormalizedPortfolioItem['featuredImage'] = null;
  const embeddedMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  if (embeddedMedia?.source_url) {
    featuredImage = {
      url: embeddedMedia.source_url,
      alt: embeddedMedia.alt_text ? decodeHtmlEntities(embeddedMedia.alt_text) : cleanTitle,
      width: embeddedMedia.media_details?.width,
      height: embeddedMedia.media_details?.height
    };
  } else if (raw.yoast_head_json?.og_image?.[0]?.url) {
    featuredImage = {
      url: raw.yoast_head_json.og_image[0].url,
      alt: cleanTitle,
      width: raw.yoast_head_json.og_image[0].width,
      height: raw.yoast_head_json.og_image[0].height
    };
  }

  // Extract gallery images from content
  const galleryImages = extractGalleryImagesFromHtml(raw.content?.rendered || '');

  // Extract terms (cat-portfolio)
  const categories: NormalizedTaxonomyTerm[] = [];
  const termGroups = raw._embedded?.['wp:term'] || [];
  for (const group of termGroups) {
    for (const term of group) {
      if (term.taxonomy === 'cat-portfolio') {
        categories.push({
          id: term.id,
          name: decodeHtmlEntities(term.name),
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      }
    }
  }

  const statusBadge = deriveStatusBadge(raw.slug, cleanTitle, categories);

  return {
    id: raw.id,
    slug: raw.slug,
    title: cleanTitle,
    excerpt: stripHtml(raw.excerpt?.rendered || raw.content?.rendered || ''),
    contentHtml: raw.content?.rendered || '',
    featuredImage,
    galleryImages,
    categories,
    date: raw.date,
    modified: raw.modified,
    yoastTitle: raw.yoast_head_json?.title ? decodeHtmlEntities(raw.yoast_head_json.title) : undefined,
    yoastDescription: raw.yoast_head_json?.og_description ? decodeHtmlEntities(raw.yoast_head_json.og_description) : undefined,
    yoastImage: raw.yoast_head_json?.og_image?.[0]?.url,
    statusBadge
  };
}

/**
 * Normalizes a raw WordPress Blog Post into our clean UI model
 */
export function normalizeBlogPost(raw: WPRawPost): NormalizedPost {
  const cleanTitle = stripHtml(raw.title?.rendered || 'Untitled Post');

  // Extract embedded featured media
  let featuredImage: NormalizedPost['featuredImage'] = null;
  const embeddedMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  if (embeddedMedia?.source_url) {
    featuredImage = {
      url: embeddedMedia.source_url,
      alt: embeddedMedia.alt_text ? decodeHtmlEntities(embeddedMedia.alt_text) : cleanTitle,
      width: embeddedMedia.media_details?.width,
      height: embeddedMedia.media_details?.height
    };
  } else if (raw.yoast_head_json?.og_image?.[0]?.url) {
    featuredImage = {
      url: raw.yoast_head_json.og_image[0].url,
      alt: cleanTitle,
      width: raw.yoast_head_json.og_image[0].width,
      height: raw.yoast_head_json.og_image[0].height
    };
  }

  // Extract terms (category & post_tag)
  const categories: NormalizedTaxonomyTerm[] = [];
  const tags: NormalizedTaxonomyTerm[] = [];
  const termGroups = raw._embedded?.['wp:term'] || [];
  for (const group of termGroups) {
    for (const term of group) {
      if (term.taxonomy === 'category') {
        categories.push({
          id: term.id,
          name: decodeHtmlEntities(term.name),
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      } else if (term.taxonomy === 'post_tag') {
        tags.push({
          id: term.id,
          name: decodeHtmlEntities(term.name),
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      }
    }
  }

  const authorName = raw._embedded?.author?.[0]?.name ? decodeHtmlEntities(raw._embedded.author[0].name) : 'RAIN07';

  return {
    id: raw.id,
    slug: raw.slug,
    title: cleanTitle,
    excerpt: stripHtml(raw.excerpt?.rendered || raw.content?.rendered || ''),
    contentHtml: raw.content?.rendered || '',
    featuredImage,
    categories,
    tags,
    authorName,
    date: raw.date,
    modified: raw.modified,
    yoastTitle: raw.yoast_head_json?.title ? decodeHtmlEntities(raw.yoast_head_json.title) : undefined,
    yoastDescription: raw.yoast_head_json?.og_description ? decodeHtmlEntities(raw.yoast_head_json.og_description) : undefined,
    yoastImage: raw.yoast_head_json?.og_image?.[0]?.url
  };
}
