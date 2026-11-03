import { defaultLang, supportedLangs, type SupportedLang } from './config';
import { ui, type TranslationKey } from './ui';

export function getLangFromUrl(url: URL): SupportedLang {
  const [, lang] = url.pathname.split('/');
  if (lang && supportedLangs.includes(lang as SupportedLang)) {
    return lang as SupportedLang;
  }
  return defaultLang;
}

export function useTranslations(lang: SupportedLang) {
  return function t(key: TranslationKey): any {
    return ui[lang][key] !== undefined ? ui[lang][key] : ui[defaultLang][key];
  };
}

export function getLocalizedPath(currentPath: string, targetLang: SupportedLang): string {
  // Normalize leading slash
  let cleanPath = currentPath.startsWith('/') ? currentPath : `/${currentPath}`;

  // Strip trailing index.html or .html if present
  cleanPath = cleanPath.replace(/\/index\.html$/, '').replace(/\.html$/, '');

  // Detect if currentPath already starts with /en or another language code
  const segments = cleanPath.split('/').filter(Boolean);
  const hasLangPrefix = segments.length > 0 && supportedLangs.includes(segments[0] as SupportedLang);

  // Extract core path without language prefix
  const pureSegments = hasLangPrefix ? segments.slice(1) : segments;
  const purePath = pureSegments.length > 0 ? `/${pureSegments.join('/')}/` : '/';

  if (targetLang === defaultLang) {
    return purePath;
  }

  return `/${targetLang}${purePath === '/' ? '/' : purePath}`;
}

export function getAlternateLinks(currentPath: string, siteUrl: string) {
  const cleanSite = siteUrl.replace(/\/$/, '');
  const idPath = getLocalizedPath(currentPath, 'id');
  const enPath = getLocalizedPath(currentPath, 'en');

  return {
    id: `${cleanSite}${idPath}`,
    en: `${cleanSite}${enPath}`,
    xDefault: `${cleanSite}${idPath}`
  };
}

