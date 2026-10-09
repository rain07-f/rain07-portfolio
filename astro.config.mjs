import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Check if there are valid published notes; if none, keep /notes out of sitemap while noindex
let hasPublishedNotes = false;
try {
  const apiUrl = (process.env.PUBLIC_API_URL || 'https://be-web-por-rey.rey07.my.id').replace(/\/$/, '');
  const res = await fetch(`${apiUrl}/wp-json/wp/v2/posts?per_page=10&status=publish`);
  if (res.ok) {
    const data = await res.json();
    if (Array.isArray(data)) {
      hasPublishedNotes = data.some((p) => {
        const slug = (p.slug || '').toLowerCase();
        const title = (p.title?.rendered || '').toLowerCase();
        return (
          !slug.includes('halo-dunia') &&
          !slug.includes('hello-world') &&
          !title.includes('halo dunia') &&
          !title.includes('hello world')
        );
      });
    }
  }
} catch {
  hasPublishedNotes = false;
}

export default defineConfig({
  site: 'https://rain07.my.id',

  output: 'static',

  session: false,

  adapter: cloudflare({
    imageService: 'passthrough'
  }),

  integrations: [
    sitemap({
      filter: (page) => {
        if (page.includes('/404')) return false;
        if (!hasPublishedNotes && page.includes('/notes')) return false;
        return true;
      }
    })
  ],

  vite: {
    plugins: [
      tailwindcss()
    ]
  }
});