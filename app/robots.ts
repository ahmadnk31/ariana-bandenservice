import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arianabandenservice.be'
    // Ensure baseUrl starts with https://
    if (!baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
        baseUrl = `https://${baseUrl}`
    }

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/checkout/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
