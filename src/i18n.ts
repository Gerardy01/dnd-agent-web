import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translations
import EN from '@/constants/locales/en.json';



i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: EN,
            },
        },
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });
