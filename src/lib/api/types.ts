/**
 * Raw WordPress REST API Types (v2)
 */

export interface WPRenderedField {
  rendered: string;
}

export interface WPMediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}

export interface WPMediaAttachment {
  id: number;
  date: string;
  slug: string;
  type: string;
  link: string;
  title: WPRenderedField;
  alt_text?: string;
  source_url: string;
  media_details?: {
    width: number;
    height: number;
    file: string;
    sizes: {
      thumbnail?: WPMediaSize;
      medium?: WPMediaSize;
      large?: WPMediaSize;
      full?: WPMediaSize;
      [key: string]: WPMediaSize | undefined;
    };
  };
}

export interface WPTerm {
  id: number;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPAuthor {
  id: number;
  name: string;
  url: string;
  description: string;
  link: string;
  slug: string;
  avatar_urls?: Record<string, string>;
}

export interface WPYoastImage {
  url: string;
  width?: number;
  height?: number;
  type?: string;
}

export interface WPYoastHeadJson {
  title?: string;
  robots?: {
    index?: string;
    follow?: string;
  };
  og_locale?: string;
  og_type?: string;
  og_title?: string;
  og_description?: string;
  og_url?: string;
  og_site_name?: string;
  article_published_time?: string;
  article_modified_time?: string;
  og_image?: WPYoastImage[];
  twitter_card?: string;
  schema?: Record<string, any>;
}

export interface WPRawPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedField;
  content: WPRenderedField;
  excerpt: WPRenderedField;
  author: number;
  featured_media: number;
  categories?: number[];
  tags?: number[];
  yoast_head?: string;
  yoast_head_json?: WPYoastHeadJson;
  _embedded?: {
    'wp:featuredmedia'?: WPMediaAttachment[];
    'wp:term'?: WPTerm[][];
    author?: WPAuthor[];
  };
}

export interface WPRawPortfolioItem {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: WPRenderedField;
  content: WPRenderedField;
  excerpt: WPRenderedField;
  featured_media: number;
  'cat-portfolio'?: number[];
  yoast_head?: string;
  yoast_head_json?: WPYoastHeadJson;
  _embedded?: {
    'wp:featuredmedia'?: WPMediaAttachment[];
    'wp:term'?: WPTerm[][];
  };
}

/**
 * Normalized Frontend Data Models
 */

export interface NormalizedTaxonomyTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface NormalizedGalleryImage {
  src: string;
  alt: string;
}

export interface NormalizedPortfolioItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  featuredImage: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  galleryImages: NormalizedGalleryImage[];
  categories: NormalizedTaxonomyTerm[];
  date: string;
  modified: string;
  yoastTitle?: string;
  yoastDescription?: string;
  yoastImage?: string;
  statusBadge: 'LIVE' | 'CLIENT' | 'PERSONAL' | 'CONCEPT' | 'PROTOTYPE' | 'DEVELOPMENT';
}

export interface NormalizedPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  featuredImage: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
  } | null;
  categories: NormalizedTaxonomyTerm[];
  tags: NormalizedTaxonomyTerm[];
  authorName: string;
  date: string;
  modified: string;
  yoastTitle?: string;
  yoastDescription?: string;
  yoastImage?: string;
}
