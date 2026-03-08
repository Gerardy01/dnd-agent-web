import 'i18next';

declare module 'i18next' {
    interface CustomTypeOptions {
        defaultNS: 'translation';
        resources: {
            en: typeof import('@/constants/locales/en.json');
        }
    }
}