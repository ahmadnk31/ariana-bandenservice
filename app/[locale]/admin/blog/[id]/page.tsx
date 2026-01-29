import { getBlogCategories, getBlogPostById } from '@/app/actions/blog';
import BlogForm from '../BlogForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function EditBlogPostPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    const [post, categories] = await Promise.all([
        getBlogPostById(id),
        getBlogCategories(),
    ]);

    if (!post) {
        notFound();
    }

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
                <h1 className="text-3xl font-bold">Edit Post</h1>
            </div>

            <BlogForm initialData={post} categories={categories} locale={locale} />
        </div>
    );
}
