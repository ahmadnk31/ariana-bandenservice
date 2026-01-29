import { getBlogCategories } from '@/app/actions/blog';
import BlogForm from '../BlogForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function NewBlogPostPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const categories = await getBlogCategories();

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <Link
                    href={`/${locale}/admin/blog`}
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back to Blog List
                </Link>
                <h1 className="text-3xl font-bold">Create New Post</h1>
            </div>

            <BlogForm categories={categories} locale={locale} />
        </div>
    );
}
