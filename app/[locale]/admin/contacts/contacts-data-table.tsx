"use client"

import Link from "next/link"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

export interface ContactRow {
    id: string
    name: string
    email: string
    service: string
    status: string
    createdAt: Date
    message: string
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date)
}

export const columns: ColumnDef<ContactRow>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>,
        meta: { className: "whitespace-nowrap" },
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("email")}</span>,
        meta: { className: "hidden sm:table-cell" },
    },
    {
        accessorKey: "service",
        header: "Service",
        cell: ({ row }) => row.getValue("service") || <span className="text-muted-foreground italic">General</span>,
        meta: { className: "hidden md:table-cell" },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const colors: Record<string, string> = {
                unread: "bg-blue-100 text-blue-700",
                read: "bg-gray-100 text-gray-700",
                replied: "bg-green-100 text-green-700",
            }
            return (
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${colors[status] || "bg-gray-100"}`}>
                    {status}
                </span>
            )
        },
        filterFn: (row, id, value) => {
            return value === row.getValue(id)
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            return (
                <div className="flex justify-end">
                    <Link
                        href={`/admin/contacts/${row.original.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        View
                    </Link>
                </div>
            )
        },
    },
]

interface ContactsDataTableProps {
    data: ContactRow[]
}

export function ContactsDataTable({ data }: ContactsDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="name"
            searchPlaceholder="Search contacts..."
            filterColumn="status"
            filterOptions={[
                { label: "Unread", value: "unread" },
                { label: "Read", value: "read" },
                { label: "Replied", value: "replied" },
            ]}
        />
    )
}
