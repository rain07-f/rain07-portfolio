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
    const alt = altMatch ? altMatch[1] : '';

    if (src && !images.some(img => img.src === src)) {
      images.push({ src, alt });
    }
  }

  return images;
}

/**
 * Cleans basic HTML tags from an excerpt
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
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
  // Extract embedded featured media
  let featuredImage: NormalizedPortfolioItem['featuredImage'] = null;
  const embeddedMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  if (embeddedMedia?.source_url) {
    featuredImage = {
      url: embeddedMedia.source_url,
      alt: embeddedMedia.alt_text || raw.title?.rendered || 'Project preview',
      width: embeddedMedia.media_details?.width,
      height: embeddedMedia.media_details?.height
    };
  } else if (raw.yoast_head_json?.og_image?.[0]?.url) {
    featuredImage = {
      url: raw.yoast_head_json.og_image[0].url,
      alt: raw.title?.rendered || 'Project preview',
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
          name: term.name,
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      }
    }
  }

  const cleanTitle = stripHtml(raw.title?.rendered || 'Untitled Project');
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
    yoastTitle: raw.yoast_head_json?.title,
    yoastDescription: raw.yoast_head_json?.og_description,
    yoastImage: raw.yoast_head_json?.og_image?.[0]?.url,
    statusBadge
  };
}

/**
 * Normalizes a raw WordPress Blog Post into our clean UI model
 */
export function normalizeBlogPost(raw: WPRawPost): NormalizedPost {
  // Extract embedded featured media
  let featuredImage: NormalizedPost['featuredImage'] = null;
  const embeddedMedia = raw._embedded?.['wp:featuredmedia']?.[0];
  if (embeddedMedia?.source_url) {
    featuredImage = {
      url: embeddedMedia.source_url,
      alt: embeddedMedia.alt_text || raw.title?.rendered || 'Blog post image',
      width: embeddedMedia.media_details?.width,
      height: embeddedMedia.media_details?.height
    };
  } else if (raw.yoast_head_json?.og_image?.[0]?.url) {
    featuredImage = {
      url: raw.yoast_head_json.og_image[0].url,
      alt: raw.title?.rendered || 'Blog post image',
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
          name: term.name,
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      } else if (term.taxonomy === 'post_tag') {
        tags.push({
          id: term.id,
          name: term.name,
          slug: term.slug,
          taxonomy: term.taxonomy
        });
      }
    }
  }

  const authorName = raw._embedded?.author?.[0]?.name || 'RAIN07';

  return {
    id: raw.id,
    slug: raw.slug,
    title: stripHtml(raw.title?.rendered || 'Untitled Post'),
    excerpt: stripHtml(raw.excerpt?.rendered || raw.content?.rendered || ''),
    contentHtml: raw.content?.rendered || '',
    featuredImage,
    categories,
    tags,
    authorName,
    date: raw.date,
    modified: raw.modified,
    yoastTitle: raw.yoast_head_json?.title,
    yoastDescription: raw.yoast_head_json?.og_description,
    yoastImage: raw.yoast_head_json?.og_image?.[0]?.url
  };
}
