'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/app/components/blog/TiptapEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { createBlogPost, updateBlogPost, type BlogPostInput } from '@/app/actions/blog';
import { Save, Eye, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import CoverImageDropzone from '@/app/components/blog/CoverImageDropzone';

interface BlogFormProps {
    initialData?: any;
    categories: { id: string; name: string }[];
    locale: string;
}

export default function BlogForm({ initialData, categories, locale }: BlogFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<BlogPostInput>({
        title: initialData?.title || '',
        content: initialData?.content || '',
        excerpt: initialData?.excerpt || '',
        locale: initialData?.locale || locale,
        status: initialData?.status || 'draft',
        coverImage: initialData?.coverImage || '',
        coverImageKey: initialData?.coverImageKey || '',
        categoryId: initialData?.categoryId || '',
        metaTitle: initialData?.metaTitle || '',
        metaDescription: initialData?.metaDescription || '',
        author: initialData?.author || '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (initialData?.id) {
                await updateBlogPost(initialData.id, formData);
            } else {
                await createBlogPost(formData);
            }
            router.push(`/${locale}/admin/blog`);
            router.refresh();
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Failed to save post');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Post Title</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter a catchy title..."
                            className="text-lg font-semibold"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Content</Label>
                        <TiptapEditor
                            content={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Tell your story..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="metaTitle">SEO Meta Title (Optional)</Label>
                            <Input
                                id="metaTitle"
                                value={formData.metaTitle || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, metaTitle: e.target.value })}
                                placeholder="SEO optimized title"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="metaDescription">SEO Meta Description (Optional)</Label>
                            <Input
                                id="metaDescription"
                                value={formData.metaDescription || ''}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, metaDescription: e.target.value })}
                                placeholder="Short summary for search engines"
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Sidebar */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm space-y-6">
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(val: 'draft' | 'published' | 'archived') => setFormData({ ...formData, status: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Language</Label>
                            <Select
                                value={formData.locale}
                                onValueChange={(val: string) => setFormData({ ...formData, locale: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nl">Dutch</SelectItem>
                                    <SelectItem value="en">English</SelectItem>
                                    <SelectItem value="fr">French</SelectItem>
                                    <SelectItem value="de">German</SelectItem>
                                    <SelectItem value="it">Italian</SelectItem>
                                    <SelectItem value="es">Spanish</SelectItem>
                                    <SelectItem value="tr">Turkish</SelectItem>
                                    <SelectItem value="pl">Polish</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select
                                value={formData.categoryId || 'none'}
                                onValueChange={(val: string) => setFormData({ ...formData, categoryId: val === 'none' ? undefined : val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="none">No Category</SelectItem>
                                    {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Cover Image</Label>
                            <CoverImageDropzone
                                value={formData.coverImage || ''}
                                onChange={(url, key) => setFormData({ ...formData, coverImage: url, coverImageKey: key })}
                                onRemove={() => setFormData({ ...formData, coverImage: '', coverImageKey: '' })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Short Excerpt</Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt || ''}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, excerpt: e.target.value })}
                                placeholder="Summary for blog cards..."
                                rows={4}
                            />
                        </div>

                        <div className="pt-4 space-y-3">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                {initialData?.id ? 'Update Post' : 'Save Post'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
