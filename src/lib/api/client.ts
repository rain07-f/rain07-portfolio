import type {
  WPRawPortfolioItem,
  WPRawPost,
  NormalizedPortfolioItem,
  NormalizedPost,
  NormalizedTaxonomyTerm
} from './types';
import { normalizePortfolioItem, normalizeBlogPost } from '../content/normalizer';

// In Astro build/server, process.env or import.meta.env can be accessed
const BASE_URL = (
  (typeof process !== 'undefined' && process.env?.PUBLIC_API_URL) ||
  import.meta.env?.PUBLIC_API_URL ||
  'https://be-web-por-rey.rey07.my.id'
).replace(/\/$/, '');

/**
 * Low-level safe fetch utility with timeout and error handling
 */
async function fetchApi<T>(endpoint: string): Promise<T | null> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'RAIN07-Astro-SSG/1.0'
      }
    });

    if (!res.ok) {
      console.warn(`[RAIN07 API] Failed GET ${url}: status ${res.status}`);
      return null;
    }

    const data = await res.json();
    return data as T;
  } catch (err) {
    console.error(`[RAIN07 API] Network error fetching ${url}:`, err);
    return null;
  }
}

/**
 * Fetch all published portfolio items (using _embed for media and terms)
 */
export async function getPortfolioItems(): Promise<NormalizedPortfolioItem[]> {
  const rawItems = await fetchApi<WPRawPortfolioItem[]>('/wp-json/wp/v2/portfolio?_embed&per_page=100&status=publish');
  if (!rawItems || !Array.isArray(rawItems)) {
    return [];
  }
  return rawItems.map(normalizePortfolioItem);
}

/**
 * Fetch a single portfolio item by slug
 */
export async function getPortfolioItemBySlug(slug: string): Promise<NormalizedPortfolioItem | null> {
  const rawItems = await fetchApi<WPRawPortfolioItem[]>(`/wp-json/wp/v2/portfolio?slug=${encodeURIComponent(slug)}&_embed`);
  if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
    return null;
  }
  return normalizePortfolioItem(rawItems[0]);
}

/**
 * Fetch all published blog / notes posts
 */
export async function getPosts(): Promise<NormalizedPost[]> {
  const rawPosts = await fetchApi<WPRawPost[]>('/wp-json/wp/v2/posts?_embed&per_page=100&status=publish');
  if (!rawPosts || !Array.isArray(rawPosts)) {
    return [];
  }
  return rawPosts.map(normalizeBlogPost);
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<NormalizedPost | null> {
  const rawPosts = await fetchApi<WPRawPost[]>(`/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed`);
  if (!rawPosts || !Array.isArray(rawPosts) || rawPosts.length === 0) {
    return null;
  }
  return normalizeBlogPost(rawPosts[0]);
}

/**
 * Fetch portfolio categories (cat-portfolio)
 */
export async function getPortfolioCategories(): Promise<NormalizedTaxonomyTerm[]> {
  const rawCategories = await fetchApi<Array<{ id: number; name: string; slug: string; taxonomy: string }>>('/wp-json/wp/v2/cat-portfolio');
  if (!rawCategories || !Array.isArray(rawCategories)) {
    return [];
  }
  return rawCategories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    taxonomy: c.taxonomy || 'cat-portfolio'
  }));
}

/**
 * Fetch blog categories
 */
export async function getBlogCategories(): Promise<NormalizedTaxonomyTerm[]> {
  const rawCategories = await fetchApi<Array<{ id: number; name: string; slug: string; taxonomy: string }>>('/wp-json/wp/v2/categories');
  if (!rawCategories || !Array.isArray(rawCategories)) {
    return [];
  }
  return rawCategories.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    taxonomy: c.taxonomy || 'category'
  }));
}
