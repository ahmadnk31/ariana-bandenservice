'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import readingTime from 'reading-time';

// Calculate reading time from HTML content
function calculateReadingTime(content: string): number {
    // Strip HTML tags for word count
    const text = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const result = readingTime(text);
    return Math.ceil(result.minutes);
}

// Generate slug from title
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

export interface BlogPostInput {
    title: string;
    content: string;
    excerpt?: string;
    locale?: string;
    status?: 'draft' | 'published' | 'archived';
    coverImage?: string;
    coverImageKey?: string;
    categoryId?: string;
    metaTitle?: string;
    metaDescription?: string;
    author?: string;
}

export async function createBlogPost(data: BlogPostInput) {
    const slug = generateSlug(data.title);
    const readingTimeMinutes = calculateReadingTime(data.content);

    // Ensure unique slug
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    const post = await prisma.blogPost.create({
        data: {
            slug: uniqueSlug,
            title: data.title,
            content: data.content,
            excerpt: data.excerpt,
            locale: data.locale || 'nl',
            status: data.status || 'draft',
            coverImage: data.coverImage,
            coverImageKey: data.coverImageKey,
            categoryId: data.categoryId,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            author: data.author,
            readingTime: readingTimeMinutes,
            publishedAt: data.status === 'published' ? new Date() : null,
        },
    });

    revalidatePath('/blog');
    revalidatePath(`/admin/blog`);
    return post;
}

export async function updateBlogPost(id: string, data: Partial<BlogPostInput>) {
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) throw new Error('Post not found');

    const updateData: Record<string, unknown> = { ...data };

    // Recalculate reading time if content changed
    if (data.content) {
        updateData.readingTime = calculateReadingTime(data.content);
    }

    // Handle publishing
    if (data.status === 'published' && existingPost.status !== 'published') {
        updateData.publishedAt = new Date();
    }

    const post = await prisma.blogPost.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/admin/blog`);
    return post;
}

export async function deleteBlogPost(id: string) {
    const post = await prisma.blogPost.delete({ where: { id } });

    revalidatePath('/blog');
    revalidatePath(`/admin/blog`);
    return post;
}

export async function publishBlogPost(id: string, publish: boolean = true) {
    const post = await prisma.blogPost.update({
        where: { id },
        data: {
            status: publish ? 'published' : 'draft',
            publishedAt: publish ? new Date() : null,
        },
    });

    revalidatePath('/blog');
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath(`/admin/blog`);
    return post;
}

export async function getBlogPosts({
    locale,
    status,
    categoryId,
    page = 1,
    limit = 10,
}: {
    locale?: string;
    status?: string;
    categoryId?: string;
    page?: number;
    limit?: number;
} = {}) {
    const where: Record<string, unknown> = {};
    if (locale) where.locale = locale;
    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.blogPost.count({ where }),
    ]);

    return {
        posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getPublishedBlogPosts({
    locale = 'nl',
    categorySlug,
    page = 1,
    limit = 10,
}: {
    locale?: string;
    categorySlug?: string;
    page?: number;
    limit?: number;
} = {}) {
    const where: Record<string, unknown> = {
        status: 'published',
        locale,
    };

    if (categorySlug) {
        const category = await prisma.blogCategory.findUnique({ where: { slug: categorySlug } });
        if (category) where.categoryId = category.id;
    }

    const [posts, total] = await Promise.all([
        prisma.blogPost.findMany({
            where,
            include: { category: true },
            orderBy: { publishedAt: 'desc' },
            skip: (page - 1) * limit,
            take: limit,
        }),
        prisma.blogPost.count({ where }),
    ]);

    return {
        posts,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
}

export async function getBlogPost(slug: string) {
    return prisma.blogPost.findUnique({
        where: { slug },
        include: { 
            category: true, 
            images: true 
        }
    });
}

export async function incrementBlogPostView(slug: string) {
    try {
        // Get current time
        const now = new Date();
        
        // Update the post view count and last viewed time
        await prisma.blogPost.update({
            where: { slug },
            data: {
                viewCount: {
                    increment: 1,
                },
                lastViewedAt: now,
            },
        });
    } catch (error) {
        // Silently fail if post doesn't exist or update fails
        console.error('Failed to increment view count:', error);
    }
}

export async function getBlogPostById(id: string) {
    return prisma.blogPost.findUnique({
        where: { id },
        include: { category: true, images: true },
    });
}

// Category actions
export async function getBlogCategories() {
    return prisma.blogCategory.findMany({
        include: { _count: { select: { posts: true } } },
        orderBy: { name: 'asc' },
    });
}

export async function createBlogCategory(name: string, description?: string) {
    const slug = generateSlug(name);
    return prisma.blogCategory.create({
        data: { name, slug, description },
    });
}

export async function deleteBlogCategory(id: string) {
    return prisma.blogCategory.delete({ where: { id } });
}
