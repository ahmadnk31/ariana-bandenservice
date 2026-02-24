import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF, type InvoiceData } from '@/app/components/InvoicePDF';

export type { InvoiceData };

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
    const pdfBuffer = await renderToBuffer(InvoicePDF({ data }));
    return Buffer.from(pdfBuffer);
}

