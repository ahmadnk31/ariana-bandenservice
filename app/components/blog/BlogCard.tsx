import Image from 'next/image';
import Link from 'next/link';
import { Clock, Calendar, ChevronRight, Eye } from 'lucide-react';

interface BlogCardProps {
    slug: string;
    title: string;
    excerpt?: string | null;
    coverImage?: string | null;
    publishedAt?: Date | null;
    readingTime: number;
    viewCount?: number;
    category?: { name: string; slug: string } | null;
    locale: string;
}

export default function BlogCard({
    slug,
    title,
    excerpt,
    coverImage,
    publishedAt,
    readingTime,
    viewCount = 0,
    category,
    locale,
}: BlogCardProps) {
    const formattedDate = publishedAt
        ? new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(publishedAt))
        : null;

    return (
        <article className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
            {/* Cover Image */}
            <Link href={`/${locale}/blog/${slug}`} className="block relative aspect-[16/9] overflow-hidden">
                {coverImage ? (
                    <Image
                        src={coverImage}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white/80 text-4xl font-bold">{title.charAt(0)}</span>
                    </div>
                )}
                {category && (
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {category.name}
                    </span>
                )}
            </Link>

            {/* Content */}
            <div className="p-6">
                {/* Meta */}
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {formattedDate && (
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formattedDate}
                        </span>
                    )}
                    <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {readingTime} min
                    </span>
                    {viewCount > 0 && (
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {viewCount.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    <Link href={`/${locale}/blog/${slug}`}>{title}</Link>
                </h2>

                {/* Excerpt */}
                {excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">{excerpt}</p>
                )}

                {/* Read More */}
                <Link
                    href={`/${locale}/blog/${slug}`}
                    className="inline-flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all"
                >
                    Lees meer
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
        </article>
    );
}
