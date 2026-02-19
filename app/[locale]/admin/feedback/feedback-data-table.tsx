"use client"

import {
    ColumnDef,
} from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import { Angry, Frown, Laugh, Smile } from "lucide-react"

export interface FeedbackRow {
    id: string
    happiness: number
    feedback: string | null
    createdAt: Date
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

const RatingIcon = ({ rating }: { rating: number }) => {
    switch (rating) {
        case 4:
            return <Laugh className="text-green-600 h-5 w-5" />
        case 3:
            return <Smile className="text-green-400 h-5 w-5" />
        case 2:
            return <Frown className="text-yellow-400 h-5 w-5" />
        case 1:
            return <Angry className="text-red-600 h-5 w-5" />
        default:
            return null
    }
}

const RatingLabel = ({ rating }: { rating: number }) => {
    const labels: Record<number, string> = {
        4: "Very Happy",
        3: "Happy",
        2: "Unhappy",
        1: "Very Unhappy",
    }
    return labels[rating] || "Unknown"
}

export const columns: ColumnDef<FeedbackRow>[] = [
    {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => <span className="text-sm">{formatDate(row.getValue("createdAt"))}</span>,
        meta: { className: "whitespace-nowrap" },
    },
    {
        accessorKey: "happiness",
        header: "Rating",
        cell: ({ row }) => {
            const rating = row.getValue("happiness") as number
            return (
                <div className="flex items-center gap-2">
                    <RatingIcon rating={rating} />
                    <span className="text-sm font-medium">{RatingLabel({ rating })}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "feedback",
        header: "Comment",
        cell: ({ row }) => (
            <div className="max-w-[400px] truncate text-sm text-muted-foreground" title={row.getValue("feedback") || ""}>
                {row.getValue("feedback") || <span className="italic">No comment</span>}
            </div>
        ),
    },
]

interface FeedbackDataTableProps {
    data: FeedbackRow[]
}

export function FeedbackDataTable({ data }: FeedbackDataTableProps) {
    return (
        <DataTable
            columns={columns}
            data={data}
            searchKey="feedback"
            searchPlaceholder="Search feedback comments..."
        />
    )
}
