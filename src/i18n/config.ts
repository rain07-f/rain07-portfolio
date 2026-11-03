export const defaultLang = 'id' as const;
export const supportedLangs = ['id', 'en'] as const;

export type SupportedLang = (typeof supportedLangs)[number];

export const langLabels: Record<SupportedLang, string> = {
  id: 'ID',
  en: 'EN'
};

