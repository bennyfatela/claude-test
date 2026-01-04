import { createI18n } from 'vue-i18n';
import en from './en';
import pt from './pt';

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    pt,
  },
});

export const setLocale = (locale: string) => {
  i18n.global.locale.value = locale;
  localStorage.setItem('locale', locale);
};

export const getLocale = () => {
  return i18n.global.locale.value;
};
