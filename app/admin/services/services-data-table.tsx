"use client"

import Link from "next/link"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

export interface ServiceRow {
    id: string
    name: string
    description: string
    price: number | null
    duration: string | null
    active: boolean
    createdAt: Date
}

export const columns: ColumnDef<ServiceRow>[] = [
    {
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => {
            const active = row.getValue("active") as boolean
            return active ? (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                    Active
                </span>
            ) : (
                <span className="inline-block px-2 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                    Inactive
                </span>
            )
        },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "price",
        header: "Starting Price",
        cell: ({ row }) => {
            const price = row.getValue("price") as number | null
            return price ? `€${price}` : <span className="text-muted-foreground italic">On Request</span>
        },
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }) => row.getValue("duration") || "—",
        meta: { className: "hidden sm:table-cell" },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex justify-end gap-2">
                    <Link
                        href={`/admin/services/${row.original.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Edit
                    </Link>
                </div>
            )
        },
    },
]

interface ServicesDataTableProps {
    data: ServiceRow[]
}

export function ServicesDataTable({ data }: ServicesDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search services..."
        />
    )
}
