import { getBlogPosts, getBlogCategories } from '@/app/actions/blog';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogDataTable } from './blog-data-table';

export default async function AdminBlogPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ page?: string; status?: string }>;
}) {
    const { locale } = await params;
    const { page, status } = await searchParams;
    const currentPage = parseInt(page || '1', 10);
    const t = await getTranslations({ locale, namespace: 'Admin' });

    const { posts, pagination } = await getBlogPosts({
        status: status,
        page: currentPage,
        limit: 20,
    });

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Blog Management</h1>
                    <p className="text-muted-foreground">Create and manage your blog posts</p>
                </div>
                <Link href={`/${locale}/admin/blog/new`}>
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="bg-background rounded-lg border border-muted p-4">
                <BlogDataTable data={posts as any} locale={locale} />
            </div>
        </div>
    );
}
