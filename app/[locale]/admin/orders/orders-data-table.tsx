"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import { Package, Clock, Truck, CheckCircle, XCircle, Eye } from "lucide-react"

export interface OrderRow {
    id: string
    orderNumber: string
    customerName: string
    email: string
    itemsCount: number
    total: number
    shippingCarrier: string | null
    shippingMethod: string | null
    status: string
    createdAt: string // Serialized date
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    paid: { label: "Paid", color: "bg-blue-100 text-blue-800", icon: Package },
    shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800", icon: Truck },
    delivered: { label: "Delivered", color: "bg-green-100 text-green-800", icon: CheckCircle },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: XCircle },
}

export const columns: ColumnDef<OrderRow>[] = [
    {
        accessorKey: "orderNumber",
        header: "Order",
        cell: ({ row }) => <span className="font-mono font-medium">{row.getValue("orderNumber")}</span>,
    },
    {
        id: "customer",
        header: "Customer",
        cell: ({ row }) => (
            <div>
                <p className="font-medium">{row.original.customerName}</p>
                <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
        ),
    },
    {
        accessorKey: "itemsCount",
        header: "Items",
        cell: ({ row }) => <span className="text-sm">{row.getValue("itemsCount")} item(s)</span>,
    },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => <span className="font-medium">€{Number(row.getValue("total")).toFixed(2)}</span>,
    },
    {
        id: "shipping",
        header: "Shipping",
        cell: ({ row }) => (
            <div>
                <p className="text-sm uppercase">{row.original.shippingCarrier || '-'}</p>
                <p className="text-xs text-muted-foreground">{row.original.shippingMethod || ''}</p>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            const config = statusConfig[status] || statusConfig.pending
            const Icon = config.icon
            return (
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                </span>
            )
        },
        filterFn: (row, id, value) => {
            return value === row.getValue(id)
        },
    },
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("createdAt"))
            return (
                <div>
                    <p className="text-sm">{date.toLocaleDateString('nl-NL')}</p>
                    <p className="text-xs text-muted-foreground">{date.toLocaleTimeString('nl-NL')}</p>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
            <Link
                href={`/admin/orders/${row.original.id}`}
                className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
                <Eye className="w-4 h-4" />
                View
            </Link>
        ),
    },
]

interface OrdersDataTableProps {
    data: OrderRow[]
}

export function OrdersDataTable({ data }: OrdersDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="orderNumber"
            searchPlaceholder="Search orders..."
            filterColumn="status"
            filterOptions={[
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Shipped", value: "shipped" },
                { label: "Delivered", value: "delivered" },
                { label: "Cancelled", value: "cancelled" },
            ]}
        />
    )
}
