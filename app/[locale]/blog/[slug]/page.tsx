import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getBlogPost, getPublishedBlogPosts, incrementBlogPostView } from '@/app/actions/blog';
import BlogPostContent from '@/app/components/blog/BlogPostContent';
import BlogCard from '@/app/components/blog/BlogCard';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, Calendar, Tag, Share2, Facebook, Twitter, Linkedin, Eye } from 'lucide-react';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
    const { locale, slug } = await params;
    const post = await getBlogPost(slug);

    if (!post) return { title: 'Not Found' };

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arianabandenservice.be';
    const postUrl = `${baseUrl}/${locale}/blog/${slug}`;
    const defaultImage = `${baseUrl}/banden-service/android-chrome-512x512.png`;
    
    // Ensure we have proper image URLs
    const imageUrl = post.coverImage || defaultImage;
    const title = post.metaTitle || post.title;
    const description = post.metaDescription || post.excerpt || `Read about ${post.title} on Gent Bandenservice blog.`;

    return {
        title,
        description,
        authors: [{ name: post.author || 'Gent Bandenservice' }],
        category: post.category?.name,
        keywords: post.category?.name ? [post.category.name, 'tires', 'automotive', 'Gent'] : undefined,
        openGraph: {
            title,
            description,
            url: postUrl,
            siteName: 'Gent Bandenservice',
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            locale,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString(),
            modifiedTime: post.updatedAt?.toISOString(),
            authors: [post.author || 'Gent Bandenservice'],
            section: post.category?.name,
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [imageUrl],
            creator: '@gentbandenservice',
            site: '@gentbandenservice',
        },
        alternates: {
            canonical: postUrl,
            languages: {
                'en': `${baseUrl}/en/blog/${slug}`,
                'nl': `${baseUrl}/nl/blog/${slug}`,
                'fr': `${baseUrl}/fr/blog/${slug}`,
                'de': `${baseUrl}/de/blog/${slug}`,
            },
        },
        robots: {
            index: post.status === 'published',
            follow: post.status === 'published',
            googleBot: {
                index: post.status === 'published',
                follow: post.status === 'published',
            },
        },
    };
}

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; slug: string }>;
}) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });
    const post = await getBlogPost(slug);

    if (!post || post.status !== 'published') {
        notFound();
    }

    // Increment view count (fire and forget)
    incrementBlogPostView(slug);

    // Get related posts
    const { posts: relatedPosts } = await getPublishedBlogPosts({
        locale: post.locale,
        categorySlug: post.category?.slug,
        limit: 3,
    });
    const filteredRelatedPosts = relatedPosts.filter((p: any) => p.id !== post.id).slice(0, 2);

    const formattedDate = post.publishedAt
        ? new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(post.publishedAt))
        : null;

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arianabandenservice.be';
    const shareUrl = `${baseUrl}/${locale}/blog/${slug}`;

    // JSON-LD structured data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': shareUrl,
        headline: post.title,
        description: post.excerpt || post.metaDescription,
        image: post.coverImage ? {
            '@type': 'ImageObject',
            url: post.coverImage,
            width: 1200,
            height: 630,
        } : undefined,
        datePublished: post.publishedAt?.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: post.author || 'Gent Bandenservice',
        },
        publisher: {
            '@type': 'Organization',
            name: 'Gent Bandenservice',
            url: baseUrl,
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/banden-service/android-chrome-512x512.png`,
                width: 512,
                height: 512,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': shareUrl,
        },
        articleSection: post.category?.name,
        keywords: post.category?.name,
        inLanguage: post.locale,
        url: shareUrl,
    };

    // Breadcrumb JSON-LD
    const breadcrumbJsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": `${baseUrl}/${locale}`
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": t('badge'),
                "item": `${baseUrl}/${locale}/blog`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title
            }
        ]
    };

    return (
        <>
            <Header />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
            />

            <main className="min-h-screen bg-background">
                {/* Breadcrumb / Back Link */}
                <div className="container mx-auto px-4 py-6">
                    <Link href={`/${locale}/blog`} className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                        {t('backToBlog')}
                    </Link>
                </div>

                {/* Hero */}
                <article>
                    <header className="relative">
                        {post.coverImage ? (
                            <div className="relative h-[400px] md:h-[500px]">
                                <Image
                                    src={post.coverImage}
                                    alt={post.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                                    {post.category && (
                                        <Link
                                            href={`/${locale}/blog?category=${post.category.slug}`}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full mb-4 hover:opacity-90 transition-opacity"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {post.category.name}
                                        </Link>
                                    )}
                                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                                        {post.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-white/80">
                                        {formattedDate && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formattedDate}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readingTime} min {t('readTime')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {(post.viewCount || 0).toLocaleString()} {t('views')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-primary/5 py-16 border-b border-primary/10">
                                <div className="container mx-auto px-4">
                                    {post.category && (
                                        <Link
                                            href={`/${locale}/blog?category=${post.category.slug}`}
                                            className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full mb-4 hover:opacity-90 transition-opacity"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {post.category.name}
                                        </Link>
                                    )}
                                    <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                                        {post.title}
                                    </h1>
                                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                        {formattedDate && (
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                {formattedDate}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {post.readingTime} min {t('readTime')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {(post.viewCount || 0).toLocaleString()} {t('views')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Content */}
                    <div className="container mx-auto px-4 py-12">
                        <div className="max-w-3xl mx-auto">
                            {/* Article content */}
                            <BlogPostContent content={post.content} />

                            {/* Share buttons */}
                            <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Share2 className="w-4 h-4" />
                                        {t('share')}:
                                    </span>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-[#1877F2] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Facebook className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                                    >
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
                                    >
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {filteredRelatedPosts.length > 0 && (
                    <section className="bg-gray-50 dark:bg-gray-900 py-16">
                        <div className="container mx-auto px-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                                {t('relatedPosts')}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {filteredRelatedPosts.map((relatedPost: any) => (
                                    <BlogCard
                                        key={relatedPost.id}
                                        slug={relatedPost.slug}
                                        title={relatedPost.title}
                                        excerpt={relatedPost.excerpt}
                                        coverImage={relatedPost.coverImage}
                                        publishedAt={relatedPost.publishedAt}
                                        readingTime={relatedPost.readingTime}
                                        category={relatedPost.category}
                                        locale={locale}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
