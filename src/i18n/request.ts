import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
    // This typically corresponds to the `[locale]` segment
    let locale = await requestLocale;

    // Ensure that a valid locale is used
    const supportedLocales = ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk'];
    if (!locale || !supportedLocales.includes(locale)) {
        locale = 'en';
    }

    return {
        locale,
        messages: (await import(`../../messages/${locale}.json`)).default
    };
});
