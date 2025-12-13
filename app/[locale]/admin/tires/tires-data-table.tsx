"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"

interface TireImage {
    id: string
    url: string
    key: string
    order: number
}

export interface TireRow {
    id: string
    name: string
    brand: string
    season: string
    condition?: string
    size: string
    loadIndex: string | null
    speedRating: string | null
    price: number
    stock: number
    inStock: boolean
    images: TireImage[]
}

const seasonLabels: Record<string, string> = {
    summer: "Summer",
    winter: "Winter",
    "all-season": "All-Season",
}

const seasonColors: Record<string, string> = {
    summer: "bg-amber-500/10 text-amber-600",
    winter: "bg-blue-500/10 text-blue-600",
    "all-season": "bg-green-500/10 text-green-600",
}

export const columns: ColumnDef<TireRow>[] = [
    {
        accessorKey: "images",
        header: "Image",
        cell: ({ row }) => {
            const images = row.getValue("images") as TireImage[]
            const firstImage = images?.[0]
            return (
                <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center overflow-hidden">
                    {firstImage ? (
                        <img
                            src={firstImage.url}
                            alt={row.getValue("name")}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground/50">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="3"></circle>
                        </svg>
                    )}
                </div>
            )
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7 15 5 5 5-5" />
                        <path d="m7 9 5-5 5 5" />
                    </svg>
                </button>
            )
        },
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "brand",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Brand
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7 15 5 5 5-5" />
                        <path d="m7 9 5-5 5 5" />
                    </svg>
                </button>
            )
        },
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("brand")}</span>,
        meta: { className: "hidden sm:table-cell" },
    },
    {
        accessorKey: "condition",
        header: "Condition",
        cell: ({ row }) => {
            const condition = row.getValue("condition") as string
            return condition === "used" ? (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-amber-500 text-white uppercase tracking-wider">
                    Used
                </span>
            ) : (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground uppercase tracking-wider">
                    New
                </span>
            )
        },
        filterFn: (row, id, value) => {
            return value === row.getValue(id)
        },
        meta: { className: "hidden md:table-cell" },
    },
    {
        accessorKey: "season",
        header: "Season",
        cell: ({ row }) => {
            const season = row.getValue("season") as string
            return (
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${seasonColors[season] || "bg-gray-500/10 text-gray-600"}`}>
                    {seasonLabels[season] || season}
                </span>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
        meta: { className: "hidden lg:table-cell" },
    },
    {
        accessorKey: "size",
        header: "Size",
        cell: ({ row }) => <span className="text-muted-foreground">{row.getValue("size")}</span>,
        meta: { className: "hidden md:table-cell" },
    },
    {
        id: "specs",
        header: "Specs",
        cell: ({ row }) => {
            const loadIndex = row.original.loadIndex
            const speedRating = row.original.speedRating
            if (loadIndex && speedRating) {
                return <span>{loadIndex}{speedRating}</span>
            }
            if (loadIndex || speedRating) {
                return <span>{loadIndex || speedRating}</span>
            }
            return <span className="text-muted-foreground/50">—</span>
        },
        meta: { className: "hidden xl:table-cell" },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7 15 5 5 5-5" />
                        <path d="m7 9 5-5 5 5" />
                    </svg>
                </button>
            )
        },
        cell: ({ row }) => <span className="font-bold">€{row.getValue("price")}</span>,
    },
    {
        accessorKey: "stock",
        header: ({ column }) => {
            return (
                <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Stock
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m7 15 5 5 5-5" />
                        <path d="m7 9 5-5 5 5" />
                    </svg>
                </button>
            )
        },
        cell: ({ row }) => {
            const stock = row.getValue("stock") as number
            return (
                <span className={`text-sm ${stock > 0 ? "text-green-600" : "text-muted-foreground"}`}>
                    {stock}
                </span>
            )
        },
        meta: { className: "hidden lg:table-cell" },
    },
    {
        accessorKey: "inStock",
        header: "Status",
        cell: ({ row }) => {
            const inStock = row.getValue("inStock") as boolean
            return inStock ? (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                    Available
                </span>
            ) : (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600">
                    Unavailable
                </span>
            )
        },
        meta: { className: "hidden sm:table-cell" },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const tire = row.original
            return (
                <div className="flex items-center gap-2">
                    <Link
                        href={`/admin/tires/${tire.id}`}
                        className="p-2 rounded-md hover:bg-muted transition-colors"
                        title="Edit"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                        </svg>
                    </Link>
                </div>
            )
        },
    },
]

interface TiresDataTableProps {
    data: TireRow[]
}

export function TiresDataTable({ data }: TiresDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search tires..."
            filterColumn="condition"
            filterOptions={[
                { label: "New", value: "new" },
                { label: "Used", value: "used" },
            ]}
        />
    )
}
