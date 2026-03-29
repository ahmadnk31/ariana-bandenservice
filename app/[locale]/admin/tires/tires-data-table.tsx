"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { DataTable } from "@/components/ui/data-table"
import Barcode from "react-barcode"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useState } from "react"
import SeasonIcon from "@/app/components/SeasonIcon"

interface TireImage {
    id: string
    url: string
    key: string
    order: number
}

export interface TireRow {
    id: string
    name: string
    barcode: string | null
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
    efficiency?: string | null
    grip?: string | null
    noise?: string | null
    noiseDb?: number | null
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
        accessorKey: "barcode",
        header: "Barcode",
        cell: ({ row }) => <span className="font-mono text-xs">{row.getValue("barcode") || "—"}</span>,
        meta: { className: "hidden md:table-cell" },
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
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${seasonColors[season] || "bg-gray-500/10 text-gray-600 border-gray-200"}`}>
                    <SeasonIcon season={season} size="sm" />
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
        accessorKey: "efficiency",
        header: "Eff.",
        cell: ({ row }) => (
            <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-[10px] font-black text-white ${row.getValue("efficiency") ? "bg-primary" : "bg-muted text-muted-foreground"}`}>
                {row.getValue("efficiency") || "—"}
            </span>
        ),
        meta: { className: "hidden xl:table-cell" },
    },
    {
        accessorKey: "grip",
        header: "Grip",
        cell: ({ row }) => (
            <span className={`inline-block w-6 h-6 leading-6 text-center rounded text-[10px] font-black text-white ${row.getValue("grip") ? "bg-blue-600" : "bg-muted text-muted-foreground"}`}>
                {row.getValue("grip") || "—"}
            </span>
        ),
        meta: { className: "hidden xl:table-cell" },
    },
    {
        id: "noise_info",
        header: "Noise",
        cell: ({ row }) => {
            const noise = row.original.noise
            const noiseDb = row.original.noiseDb
            if (!noise && !noiseDb) return <span className="text-muted-foreground/30">—</span>
            return (
                <div className="flex flex-col text-[10px] leading-tight">
                    {noise && <span className="font-bold text-green-600">{noise}</span>}
                    {noiseDb && <span className="text-muted-foreground">{noiseDb}dB</span>}
                </div>
            )
        },
        meta: { className: "hidden 2xl:table-cell" },
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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button
                                className="p-2 rounded-md hover:bg-muted transition-colors"
                                title="Print Barcode"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z" />
                                    <path d="M7 15h2" /><path d="M7 11h2" /><path d="M7 7h2" />
                                    <path d="M11 15h2" /><path d="M11 11h2" /><path d="M11 7h2" />
                                    <path d="M15 15h2" /><path d="M15 11h2" /><path d="M15 7h2" />
                                </svg>
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-md">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Print Barcode</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Barcode for {tire.name}
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex flex-col items-center justify-center py-4 bg-white text-black text-center min-w-0" id={`barcode-${tire.id}`}>

                                <div className="flex space-x-4 justify-between bg-white text-black w-full max-w-full px-2">
                                    <div className="text-sm md:text-lg font-bold truncate">{tire.size}</div>
                                    <div className="text-sm md:text-lg font-bold">€{tire.price}</div>
                                </div>

                                <div className="w-full max-w-full overflow-auto flex justify-center">
                                    <div className="inline-block min-w-0">
                                        <Barcode 
                                            value={tire.barcode || tire.name} 
                                            width={1} 
                                            height={35} 
                                            fontSize={10} 
                                            displayValue={true}
                                            background="white"
                                            lineColor="black"
                                            margin={5}
                                            textMargin={2}
                                        />
                                    </div>
                                </div>
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Close</AlertDialogCancel>
                                <button
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        const barcodeElement = document.getElementById(`barcode-${tire.id}`);
                                        if (barcodeElement) {
                                            // Extract just the barcode SVG and info
                                            const sizeText = tire.size;
                                            const priceText = `€${tire.price}`;
                                            const barcodeValue = tire.barcode || tire.name;
                                            
                                            const win = window.open('', '', 'width=400,height=200');
                                            if (win) {
                                                win.document.write(`
                                                    <html>
                                                        <head>
                                                            <title>Barcode - ${tire.name}</title>
                                                            <style>
                                                                @page { 
                                                                    size: auto; 
                                                                    margin: 5mm; 
                                                                }
                                                                * {
                                                                    box-sizing: border-box;
                                                                    margin: 0;
                                                                    padding: 0;
                                                                }
                                                                body {
                                                                    font-family: Arial, sans-serif;
                                                                    background: white;
                                                                    padding: 10px;
                                                                    display: flex;
                                                                    flex-direction: column;
                                                                    align-items: center;
                                                                    justify-content: center;
                                                                    min-height: 100vh;
                                                                }
                                                                .label {
                                                                    width: 100%;
                                                                    max-width: 250px;
                                                                    text-align: center;
                                                                    background: white;
                                                                    border: 1px solid #000;
                                                                    padding: 8px;
                                                                }
                                                                .info-row {
                                                                    display: flex;
                                                                    justify-content: space-between;
                                                                    align-items: center;
                                                                    margin-bottom: 3px;
                                                                    font-size: 11px;
                                                                    font-weight: bold;
                                                                    color: black;
                                                                    width: 100%;
                                                                    padding: 0 5px;
                                                                }
                                                                .info-row span:first-child {
                                                                    margin-right: auto;
                                                                }
                                                                .info-row span:last-child {
                                                                    margin-left: auto;
                                                                }
                                                                .barcode-wrapper {
                                                                    width: 100%;
                                                                    overflow: hidden;
                                                                    display: flex;
                                                                    justify-content: center;
                                                                }
                                                                svg { 
                                                                    max-width: 100% !important; 
                                                                    height: auto !important;
                                                                    display: block;
                                                                    margin: 0 auto;
                                                                    image-rendering: -webkit-optimize-contrast;
                                                                    image-rendering: crisp-edges;
                                                                    shape-rendering: crispEdges;
                                                                }
                                                                @media print {
                                                                    @page {
                                                                        size: 4in 2in;
                                                                        margin: 0.1in;
                                                                    }
                                                                    body {
                                                                        -webkit-print-color-adjust: exact;
                                                                        color-adjust: exact;
                                                                        padding: 0;
                                                                        margin: 0;
                                                                        width: 100%;
                                                                        height: 100%;
                                                                    }
                                                                    .label {
                                                                        border: 1px solid #000;
                                                                        box-shadow: none;
                                                                        width: 3.8in;
                                                                        max-width: 3.8in;
                                                                        padding: 0.05in;
                                                                        margin: 0;
                                                                        page-break-inside: avoid;
                                                                        display: flex;
                                                                        flex-direction: column;
                                                                        align-items: center;
                                                                        justify-content: center;
                                                                    }
                                                                    .barcode-wrapper {
                                                                        width: 3.6in;
                                                                        max-width: 3.6in;
                                                                        overflow: hidden;
                                                                        display: flex;
                                                                        justify-content: center;
                                                                    }
                                                                    svg {
                                                                        max-width: 3.4in !important;
                                                                        width: 3.4in !important;
                                                                        height: auto !important;
                                                                        image-rendering: -webkit-optimize-contrast !important;
                                                                        image-rendering: crisp-edges !important;
                                                                        shape-rendering: crispEdges !important;
                                                                        print-color-adjust: exact !important;
                                                                    }
                                                                }
                                                            </style>
                                                            <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js"></script>
                                                        </head>
                                                        <body>
                                                            <div class="label">
                                                                <div class="info-row">
                                                                    <span>${sizeText}</span>
                                                                    <span>${priceText}</span>
                                                                </div>
                                                                <div class="barcode-wrapper">
                                                                    <svg id="barcode"></svg>
                                                                </div>
                                                            </div>
                                                            <script>
                                                                JsBarcode("#barcode", "${barcodeValue}", {
                                                                    format: "CODE128",
                                                                    width: 2,
                                                                    height: 40,
                                                                    fontSize: 10,
                                                                    background: "white",
                                                                    lineColor: "black",
                                                                    margin: 4,
                                                                    displayValue: true,
                                                                    textMargin: 1,
                                                                    textPosition: "bottom",
                                                                    xmlDocument: document
                                                                });
                                                                
                                                                setTimeout(() => {
                                                                    window.print();
                                                                    window.onafterprint = function() {
                                                                        window.close();
                                                                    }
                                                                }, 500);
                                                            </script>
                                                        </body>
                                                    </html>
                                                `);
                                                win.document.close();
                                            }
                                        }
                                    }}
                                >
                                    Print
                                </button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            )
        },
    },
]

interface TiresDataTableProps {
    data: TireRow[]
}

export function TiresDataTable({ data }: TiresDataTableProps) {
    const [searchKey, setSearchKey] = useState<"name" | "barcode" | "size">("name")

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setSearchKey("name")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${searchKey === "name" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        Search by Name
                    </button>
                    <button
                        onClick={() => setSearchKey("barcode")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${searchKey === "barcode" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        Search by Barcode
                    </button>
                    <button
                        onClick={() => setSearchKey("size")}
                        className={`px-3 py-1 text-sm rounded-md transition-colors ${searchKey === "size" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                    >
                        Search by Size
                    </button>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={data}
                searchKey={searchKey}
                searchPlaceholder={`Search ${searchKey}...`}
                filterColumn="condition"
                filterOptions={[
                    { label: "New", value: "new" },
                    { label: "Used", value: "used" },
                ]}
            />
        </div>
    )
}
