import messages from './messages.json';
export type Locale = 'fr' | 'en' | 'ar';
export type MessageKey = keyof typeof messages.fr;
export const dictionaries: Record<Locale, Record<MessageKey, string>> = messages;
export const locales: Locale[] = ['fr', 'en', 'ar'];
export const intlLocale = { fr: 'fr-TN', en: 'en-GB', ar: 'ar-TN' };
export function validLocale(value?: string): Locale { return locales.includes(value as Locale) ? value as Locale : 'fr'; }
