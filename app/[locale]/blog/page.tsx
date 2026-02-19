import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublishedBlogPosts, getBlogCategories } from '@/app/actions/blog';
import BlogCard from '@/app/components/blog/BlogCard';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Blog' });

    return {
        title: t('pageTitle'),
        description: t('pageDescription'),
    };
}

export default async function BlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; page?: string }>;
}) {
    const { locale } = await params;
    const { category, page } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const t = await getTranslations({ locale, namespace: 'Blog' });

    const [{ posts, pagination }, categories] = await Promise.all([
        getPublishedBlogPosts({
            locale,
            categorySlug: category,
            page: currentPage,
            limit: 9,
        }),
        getBlogCategories(),
    ]);

    return (
        <>
            <main className="min-h-screen flex flex-col">
                <Header />

                <div className="container mx-auto px-4 py-12 flex-1">
                    {/* Category Filter */}
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8 justify-center">
                            <Link
                                href={`/${locale}/blog`}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                    }`}
                            >
                                {t('allCategories')}
                            </Link>
                            {categories.map((cat: any) => (
                                <Link
                                    key={cat.id}
                                    href={`/${locale}/blog?category=${cat.slug}`}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Blog Grid */}
                    {posts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map((post: any) => (
                                <BlogCard
                                    key={post.id}
                                    slug={post.slug}
                                    title={post.title}
                                    excerpt={post.excerpt}
                                    coverImage={post.coverImage}
                                    publishedAt={post.publishedAt}
                                    readingTime={post.readingTime}
                                    category={post.category}
                                    locale={locale}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <BookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {t('noPosts')}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                {t('noPostsDescription')}
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                                <Link
                                    key={p}
                                    href={`/${locale}/blog?page=${p}${category ? `&category=${category}` : ''}`}
                                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium transition-colors ${p === currentPage
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    {p}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
