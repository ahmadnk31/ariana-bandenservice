import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
    // A list of all locales that are supported
    locales: ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk', 'de', 'it'],

    // Used when no locale matches
    defaultLocale: 'nl',
    
    pathnames: {
        '/': '/',
        '/checkout': '/checkout',
        '/contact': '/contact',
        '/faq': '/faq',
        '/services': '/services',
        '/b2b': '/b2b',
        '/blog': '/blog',
        '/blog/[slug]': '/blog/[slug]',
        '/about': {
            en: '/about',
            nl: '/over-ons',
            fr: '/a-propos',
            de: '/uber-uns',
            es: '/sobre-nosotros',
            it: '/chi-siamo',
            tr: '/hakkimizda',
            pl: '/o-nas',
            gr: '/schetika',
            ar: '/man-nahnu',
            fa: '/dar-bareh-ma',
            uk: '/pro-nas'
        },
        '/admin': '/admin',
        '/admin/login': '/admin/login',
        '/admin/orders': '/admin/orders',
        '/admin/tires': '/admin/tires',
        '/appointment': {
            en: '/appointment',
            nl: '/afspraak',
            fr: '/rendez-vous',
            es: '/cita',
            tr: '/randevu',
            pl: '/wizyta',
            gr: '/rantevou',
            ar: '/maweid',
            fa: '/noghteh',
            uk: '/pryyom',
            de: '/termin',
            it: '/appuntamento'
        },
        '/appointment/manage/[id]': {
            en: '/appointment/manage/[id]',
            nl: '/afspraak/beheren/[id]',
            fr: '/rendez-vous/gerer/[id]',
            es: '/cita/gestionar/[id]',
            tr: '/randevu/yonet/[id]',
            pl: '/wizyta/zarzadzaj/[id]',
            gr: '/rantevou/diaxeirisi/[id]',
            ar: '/maweid/idara/[id]',
            fa: '/noghteh/modiriat/[id]',
            uk: '/pryyom/keruvannya/[id]',
            de: '/termin/verwalten/[id]',
            it: '/appuntamento/gestisci/[id]'
        },
        '/tires': {
            en: '/tires',
            nl: '/banden',
            fr: '/pneus',
            es: '/neumaticos',
            tr: '/lastikler',
            pl: '/opony',
            gr: '/elastika',
            ar: '/iitarat',
            fa: '/lasthikha',
            uk: '/shyny',
            de: '/reifen',
            it: '/pneumatici'
        },
        '/tires/[slug]': {
            en: '/tires/[slug]',
            nl: '/banden/[slug]',
            fr: '/pneus/[slug]',
            es: '/neumaticos/[slug]',
            tr: '/lastikler/[slug]',
            pl: '/opony/[slug]',
            gr: '/elastika/[slug]',
            ar: '/iitarat/[slug]',
            fa: '/lasthikha/[slug]',
            uk: '/shyny/[slug]',
            de: '/reifen/[slug]',
            it: '/pneumatici/[slug]'
        }
    }
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);
