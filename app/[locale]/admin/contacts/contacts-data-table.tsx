"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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

export const columns = (
    onDelete: (id: string) => void,
    onSelect: (id: string, checked: boolean) => void,
    onSelectAll: (checked: boolean) => void,
    selectedIds: string[],
    allIds: string[],
    loading: boolean
): ColumnDef<ContactRow>[] => [
    {
        id: "select",
        header: () => (
            <input
                type="checkbox"
                checked={selectedIds.length === allIds.length && allIds.length > 0}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-muted bg-background text-primary focus:ring-primary cursor-pointer"
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={selectedIds.includes(row.original.id)}
                onChange={(e) => onSelect(row.original.id, e.target.checked)}
                className="h-4 w-4 rounded border-muted bg-background text-primary focus:ring-primary cursor-pointer"
            />
        ),
        meta: { className: "w-[40px] px-2 text-center" },
    },
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
                <div className="flex justify-end items-center gap-2">
                    <Link
                        href={`/admin/contacts/${row.original.id}`}
                        className="inline-flex h-8 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        View
                    </Link>
                    <button
                        onClick={() => onDelete(row.original.id)}
                        disabled={loading}
                        className="p-2 text-muted-foreground hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                </div>
            )
        },
    },
]

interface ContactsDataTableProps {
    data: ContactRow[]
}

export function ContactsDataTable({ data }: ContactsDataTableProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)

    const allIds = data.map((item) => item.id)

    const onConfirmDelete = async () => {
        if (!deleteId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/contacts/${deleteId}`, {
                method: "DELETE",
            })
            if (res.ok) {
                setSelectedIds((prev) => prev.filter((id) => id !== deleteId))
                router.refresh()
            } else {
                throw new Error("Failed to delete message")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to delete message")
        } finally {
            setLoading(false)
            setDeleteId(null)
        }
    }

    const onConfirmBulkDelete = async () => {
        if (selectedIds.length === 0) return
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/contacts`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds }),
            })
            if (res.ok) {
                setSelectedIds([])
                router.refresh()
            } else {
                throw new Error("Failed to delete messages")
            }
        } catch (error) {
            console.error(error)
            alert("Failed to delete messages")
        } finally {
            setLoading(false)
            setConfirmBulkDelete(false)
        }
    }

    const handleSelect = (id: string, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((item) => item !== id)
        )
    }

    const handleSelectAll = (checked: boolean) => {
        setSelectedIds(checked ? allIds : [])
    }

    return (
        <div className="space-y-4">
            {selectedIds.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-red-50 border border-red-100 rounded-md">
                    <span className="text-sm font-medium text-red-800">
                        {selectedIds.length} message{selectedIds.length > 1 ? "s" : ""} selected
                    </span>
                    <button
                        onClick={() => setConfirmBulkDelete(true)}
                        disabled={loading}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-red-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-50 cursor-pointer"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            <DataTable
                columns={columns(
                    (id) => setDeleteId(id),
                    handleSelect,
                    handleSelectAll,
                    selectedIds,
                    allIds,
                    loading
                )}
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

            {/* Individual Delete Confirm */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete this message record. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete Forever
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Bulk Delete Confirm */}
            <AlertDialog open={confirmBulkDelete} onOpenChange={setConfirmBulkDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Selected Messages?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to permanently delete the {selectedIds.length} selected message{selectedIds.length > 1 ? "s" : ""}? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onConfirmBulkDelete}
                            disabled={loading}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete {selectedIds.length} Message{selectedIds.length > 1 ? "s" : ""}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}


