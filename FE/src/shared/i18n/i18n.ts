import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import de from './locales/de.json';
import en from './locales/en.json';
import ru from './locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
      ru: { translation: ru },
    },
    // язык задаёт URL (/en, /ru; без префикса — de), а не localStorage
    lng: 'de',
    initAsync: false,
    fallbackLng: 'de',
    supportedLngs: ['de', 'en', 'ru'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
