import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://gentbandenservice.be'
    // Ensure baseUrl starts with https://
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`
    }
    const locales = ['en', 'nl', 'fr', 'de', 'it', 'es', 'tr', 'pl', 'gr', 'ar', 'fa', 'uk']

    // Get all tires
    const tires = await prisma.tire.findMany({
        select: { slug: true, updatedAt: true },
    })

    // Get all published blog posts
    const blogPosts = await prisma.blogPost.findMany({
        where: { status: 'published' },
        select: { slug: true, updatedAt: true, locale: true },
    })

    // Static pages
    const staticPages = [
        '',
        '/tires',
        '/services',
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
    for (const page of staticPages) {
        // Base locale for the entry (arbitrarily using 'nl' as the primary)
        sitemap.push({
            url: `${baseUrl}/nl${page}`,
            lastModified: new Date(),
            changeFrequency: page === '' ? 'daily' : 'weekly',
            priority: page === '' ? 1 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}${page}`])
                )
            }
        })
    }

    // 2. Add tire product pages with alternates
    for (const tire of tires) {
        sitemap.push({
            url: `${baseUrl}/nl/tires/${tire.slug}`,
            lastModified: tire.updatedAt,
            changeFrequency: 'weekly',
            priority: 0.9,
            alternates: {
                languages: Object.fromEntries(
                    locales.map(l => [l, `${baseUrl}/${l}/tires/${tire.slug}`])
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
