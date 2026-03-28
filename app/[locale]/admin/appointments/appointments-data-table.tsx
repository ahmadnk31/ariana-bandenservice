"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { format } from "date-fns"
import { useState } from "react"
import { useRouter } from "next/navigation"
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

interface AppointmentRow {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    date: Date | string
    status: string
    tireName: string | null
    notes: string | null
}

export const columns = (
    onUpdateStatus: (id: string, status: string) => void,
    onDelete: (id: string) => void,
    loading: boolean
): ColumnDef<AppointmentRow>[] => [
    {
        id: "customer",
        header: "Customer",
        accessorFn: (row) => `${row.firstName} ${row.lastName} ${row.email}`,
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-bold">{row.original.firstName} {row.original.lastName}</span>
                <span className="text-xs text-muted-foreground">{row.original.email}</span>
                <span className="text-xs text-muted-foreground">{row.original.phone}</span>
            </div>
        ),
    },
    {
        accessorKey: "tireName",
        header: "Service/Tire",
        cell: ({ row }) => (
            <div className="max-w-[200px] truncate text-sm">
                {row.original.tireName || <span className="text-muted-foreground italic">General Service</span>}
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: "Appointment Date",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-sm">{format(new Date(row.original.date), "dd MMM yyyy")}</span>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded w-fit mt-1">
                    {format(new Date(row.original.date), "HH:mm")}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.status
            return (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider
                    ${status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                    ${status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}
                    ${status === 'cancelled' ? 'bg-red-100 text-red-700' : ''}
                `}>
                    {status}
                </span>
            )
        },
        filterFn: (row, id, value) => {
            return value === "all" || value === row.getValue(id)
        },
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const appointment = row.original
            const isExpired = new Date(appointment.date) < new Date()
            
            return (
                <div className="flex items-center gap-2">
                    {appointment.status !== 'confirmed' && (
                        <button
                            onClick={() => onUpdateStatus(appointment.id, "confirmed")}
                            disabled={isExpired || loading}
                            className={`h-8 px-2 text-[10px] font-bold text-white rounded transition-colors uppercase
                                ${isExpired ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}
                            `}
                        >
                            Confirm
                        </button>
                    )}
                    {appointment.status !== 'cancelled' && (
                        <button
                            onClick={() => onUpdateStatus(appointment.id, "cancelled")}
                            disabled={isExpired || loading}
                            className={`h-8 px-2 text-[10px] font-bold rounded transition-colors uppercase
                                ${isExpired ? 'border border-gray-200 text-gray-400 cursor-not-allowed' : 'border border-red-200 text-red-600 hover:bg-red-50'}
                            `}
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(appointment.id)}
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

interface AppointmentsDataTableProps {
    data: AppointmentRow[]
}

export function AppointmentsDataTable({ data }: AppointmentsDataTableProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const onUpdateStatus = async (id: string, status: string) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/appointments/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const onConfirmDelete = async () => {
        if (!deleteId) return
        setLoading(true)
        try {
            const res = await fetch(`/api/appointments/${deleteId}`, {
                method: "DELETE",
            })
            if (res.ok) {
                router.refresh()
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
            setDeleteId(null)
        }
    }

    return (
        <div className="space-y-4">
            <DataTable
                columns={columns(onUpdateStatus, (id) => setDeleteId(id), loading)}
                data={data}
                searchKey="customer"
                searchPlaceholder="Search customer..."
                filterColumn="status"
                filterOptions={[
                    { label: "Pending", value: "pending" },
                    { label: "Confirmed", value: "confirmed" },
                    { label: "Cancelled", value: "cancelled" },
                ]}
            />

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete this appointment record. This cannot be undone.
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
        </div>
    )
}
