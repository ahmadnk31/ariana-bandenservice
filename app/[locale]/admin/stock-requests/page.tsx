import { prisma } from "@/lib/db"
import { StockRequestsDataTable } from "./stock-requests-data-table"

async function getStockRequests() {
    const requests = await prisma.stockRequest.findMany({
        include: {
            tire: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return requests.map(req => ({
        id: req.id,
        tireName: req.tire.name,
        email: req.email,
        name: req.name,
        phone: req.phone,
        status: req.status,
        createdAt: req.createdAt
    }))
}

export default async function StockRequestsPage() {
    const data = await getStockRequests()

    return (
        <div className="space-y-6 p-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Stock Requests</h1>
                <p className="text-muted-foreground">
                    Manage requests for out-of-stock tires.
                </p>
            </div>

            <StockRequestsDataTable data={data} />
        </div>
    )
}
