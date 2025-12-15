import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arianabandenservice.be'
    // Ensure baseUrl starts with https://
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`
    }
    const locales = ['en', 'nl', 'fr', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk']

    // Get all tires for product pages
    const tires = await prisma.tire.findMany({
        select: { slug: true, updatedAt: true },
    })

    // Get all active services
    const services = await prisma.service.findMany({
        where: { active: true },
        select: { id: true, updatedAt: true },
    })

    // Static pages
    const staticPages = [
        '',
        '/tires',
        '/services',
        '/contact',
        '/faq',
    ]

    const sitemap: MetadataRoute.Sitemap = []

    // Add static pages for each locale
    for (const locale of locales) {
        for (const page of staticPages) {
            sitemap.push({
                url: `${baseUrl}/${locale}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'daily' : 'weekly',
                priority: page === '' ? 1 : 0.8,
            })
        }
    }

    // Add tire product pages for each locale
    for (const locale of locales) {
        for (const tire of tires) {
            sitemap.push({
                url: `${baseUrl}/${locale}/tires/${tire.slug}`,
                lastModified: tire.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.9,
            })
        }
    }

    // Add service detail pages for each locale
    for (const locale of locales) {
        for (const service of services) {
            sitemap.push({
                url: `${baseUrl}/${locale}/services/${service.id}`,
                lastModified: service.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        }
    }

    return sitemap
}
