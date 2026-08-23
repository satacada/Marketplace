// Tipos explícitos para evitar errores de TypeScript
type Locale = 'es' | 'en' | 'pt';

type LocaleConfig = {
  locale: string;
  currency: string;
};

export const supportedLocales: Record<Locale, string> = {
  'es': 'Español',
  'en': 'English',
  'pt': 'Português',
};

const localeConfigs: Record<Locale, LocaleConfig> = {
  'es': { locale: 'es-AR', currency: 'ARS' },
  'en': { locale: 'en-US', currency: 'USD' },
  'pt': { locale: 'pt-BR', currency: 'BRL' },
};

export function getUserLocale(): Locale {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0] as Locale;
    return supportedLocales[browserLang] ? browserLang : 'es';
  }
  return 'es';
}

export function formatCurrency(amount: number, locale?: Locale): string {
  const lang = locale || getUserLocale();
  const config = localeConfigs[lang];
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency,
  }).format(amount);
}