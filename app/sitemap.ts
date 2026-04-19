import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'
import { routing } from '@/src/i18n/routing'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gentbandenservice.be'
    // Ensure baseUrl starts with https://
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`
    }

    const locales = routing.locales;

    // Helper to get localized pathname
    function getPathname(route: string, locale: string): string {
        const pathnameConfig = (routing.pathnames as any)[route];
        if (!pathnameConfig) return route;
        if (typeof pathnameConfig === 'string') return pathnameConfig;
        return pathnameConfig[locale] || pathnameConfig[routing.defaultLocale] || route;
    }

    // Get all tires
    const tires = await prisma.tire.findMany({
        select: { slug: true, updatedAt: true },
    })

    // Get all published blog posts
    const blogPosts = await prisma.blogPost.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true, locale: true },
    })

    // Static pages using internal route names
    const staticPages = [
        '/',
        '/tires',
        '/services',
        '/about',
        '/contact',
        '/faq',
        '/blog',
        '/b2b',
        '/appointment',
        '/privacy',
        '/terms',
        '/cookies',
        '/return-policy',
    ]

    const sitemap: MetadataRoute.Sitemap = []

    // 1. Add static pages with alternates
    for (const route of staticPages) {
        // Use 'nl' as the primary locale for the sitemap URL
        const primaryLocale = 'nl';
        const primaryPath = getPathname(route, primaryLocale);
        
        sitemap.push({
            url: `${baseUrl}/${primaryLocale}${primaryPath === '/' ? '' : primaryPath}`,
            lastModified: new Date(),
            changeFrequency: route === '/' ? 'daily' : 'weekly',
            priority: route === '/' ? 1 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => {
                        const lp = getPathname(route, l);
                        return [l, `${baseUrl}/${l}${lp === '/' ? '' : lp}`];
                    })
                )
            }
        })
    }

    // 2. Add tire product pages with alternates
    for (const tire of tires) {
        const route = '/tires/[slug]';
        const primaryLocale = 'nl';
        const primaryPath = getPathname(route, primaryLocale).replace('[slug]', tire.slug);

        sitemap.push({
            url: `${baseUrl}/${primaryLocale}${primaryPath}`,
            lastModified: tire.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.9,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => {
                        const lp = getPathname(route, l).replace('[slug]', tire.slug);
                        return [l, `${baseUrl}/${l}${lp}`];
                    })
                )
            }
        })
    }

    // 3. Add blog posts
    // For blog posts, we add them to their specific locale as they are currently content-unique in the DB
    for (const post of blogPosts) {
        sitemap.push({
            url: `${baseUrl}/${post.locale}/blog/${post.slug}`,
            lastModified: post.updatedAt,
            changeFrequency: 'monthly',
            priority: 0.7,
        })
    }

    return sitemap
}
