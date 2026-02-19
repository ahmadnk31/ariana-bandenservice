"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit, Eye, MoreHorizontal, Trash2, Globe, FileText } from "lucide-react"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"

export type BlogRow = {
    id: string
    title: string
    slug: string
    status: string
    locale: string
    category: { name: string; slug: string } | null
    coverImage: string | null
    publishedAt: Date | null
}

export const getColumns = (locale: string): ColumnDef<BlogRow>[] => [
    {
        accessorKey: "title",
        header: "Post",
        cell: ({ row }) => {
            const post = row.original
            return (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {post.coverImage ? (
                            <img src={post.coverImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <FileText className="w-5 h-5 text-muted-foreground" />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-medium text-foreground truncate">{post.title}</div>
                        <div className="text-xs text-muted-foreground truncate">/{post.slug}</div>
                    </div>
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "published" ? "default" : "secondary"} className="capitalize">
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "locale",
        header: "Locale",
        cell: ({ row }) => {
            const locale = row.getValue("locale") as string
            return (
                <div className="flex items-center gap-1.5 text-sm uppercase">
                    <Globe className="w-4 h-4 text-muted-foreground" />
                    {locale}
                </div>
            )
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category
            return (
                <span className="text-sm text-muted-foreground">
                    {category?.name || "Uncategorized"}
                </span>
            )
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original

            return (
                <div className="flex justify-end gap-2">
                    <Link href={`/${locale}/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" title="View Public">
                            <Eye className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Link href={`/${locale}/admin/blog/${post.id}`}>
                        <Button variant="ghost" size="icon" title="Edit">
                            <Edit className="w-4 h-4" />
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="text-destructive cursor-pointer">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]

export interface BlogDataTableProps {
    data: BlogRow[]
    locale: string
}

export function BlogDataTable({ data, locale }: BlogDataTableProps) {
    return (
        <DataTable
            columns={getColumns(locale)}
            data={data}
            searchKey="title"
            searchPlaceholder="Search posts..."
            filterColumn="status"
            filterOptions={[
                { label: "Draft", value: "draft" },
                { label: "Published", value: "published" },
                { label: "Archived", value: "archived" },
            ]}
        />
    )
}
