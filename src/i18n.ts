import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import ruTranslation from './locales/ru/translation.json';
import enTranslation from './locales/en/translation.json';

const resources = {
  ru: {
    translation: ruTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru', // Russian as default
    debug: false,
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
