"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"

export interface StockRequestRow {
    id: string
    tireName: string
    email: string
    name: string | null
    phone: string | null
    status: string
    createdAt: Date
}

const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date))
}

export const columns: ColumnDef<StockRequestRow>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>,
        meta: { className: "whitespace-nowrap" },
    },
    {
        accessorKey: "tireName",
        header: "Tire",
        cell: ({ row }) => <span className="font-medium">{row.getValue("tireName")}</span>,
    },
    {
        accessorKey: "name",
        header: "Customer",
        cell: ({ row }) => <span>{row.getValue("name") || "N/A"}</span>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("email")}</span>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.getValue("phone") || "N/A"}</span>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const colors: Record<string, string> = {
                pending: "bg-amber-100 text-amber-700",
                resolved: "bg-green-100 text-green-700",
            }
            return (
                <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${colors[status] || "bg-gray-100"}`}>
                    {status}
                </span>
            )
        },
    },
]

interface StockRequestsDataTableProps {
    data: StockRequestRow[]
}

export function StockRequestsDataTable({ data }: StockRequestsDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="email"
            searchPlaceholder="Search email..."
            filterColumn="status"
            filterOptions={[
                { label: "Pending", value: "pending" },
                { label: "Resolved", value: "resolved" },
            ]}
        />
    )
}
