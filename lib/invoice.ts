import PDFDocument from 'pdfkit';

interface InvoiceLineItem {
    name: string;
    size?: string;
    quantity: number;
    unitPrice: number;
}

interface InvoiceData {
    invoiceNumber: string;
    issueDate: Date;
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    shippingAddress: {
        street: string;
        city: string;
        postalCode: string;
        country: string;
    };
    items: InvoiceLineItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
}

const euro = (amount: number) => `€${amount.toFixed(2)}`;

export async function generateInvoicePdf(data: InvoiceData): Promise<Buffer> {
    return await new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.fontSize(22).text('FACTUUR', 50, 50);
        doc.fontSize(10).text(`Factuurnummer: ${data.invoiceNumber}`, 50, 85);
        doc.fontSize(10).text(`Datum: ${data.issueDate.toLocaleDateString('nl-BE')}`, 50, 100);
        doc.fontSize(10).text(`Ordernummer: ${data.orderNumber}`, 50, 115);

        doc.fontSize(12).text('Gent bandenservice', 330, 50, { align: 'left' });
        doc.fontSize(10).text('Dendermondsesteenweg 428', 330, 68, { align: 'left' });
        doc.fontSize(10).text('9040 Sint-Amandsberg', 330, 82, { align: 'left' });
        doc.fontSize(10).text('België', 330, 96, { align: 'left' });
        doc.fontSize(10).text('+32 466 19 56 22', 330, 110, { align: 'left' });

        doc.moveTo(50, 145).lineTo(545, 145).stroke('#d4d4d8');

        doc.fontSize(11).text('Gefactureerd aan', 50, 160);
        doc.fontSize(10).text(data.customerName, 50, 178);
        doc.fontSize(10).text(data.customerEmail, 50, 192);
        if (data.customerPhone) {
            doc.fontSize(10).text(data.customerPhone, 50, 206);
        }
        doc.fontSize(10).text(data.shippingAddress.street, 50, 220);
        doc.fontSize(10).text(`${data.shippingAddress.postalCode} ${data.shippingAddress.city}`, 50, 234);
        doc.fontSize(10).text(data.shippingAddress.country, 50, 248);

        const tableTop = 290;
        doc.rect(50, tableTop, 495, 24).fill('#f4f4f5');
        doc.fillColor('#111827').fontSize(10).text('Artikel', 56, tableTop + 7);
        doc.text('Aantal', 330, tableTop + 7);
        doc.text('Prijs', 405, tableTop + 7);
        doc.text('Totaal', 475, tableTop + 7);

        let y = tableTop + 28;
        for (const item of data.items) {
            const lineTotal = item.quantity * item.unitPrice;
            const name = item.size ? `${item.name} (${item.size})` : item.name;
            doc.fillColor('#111827').fontSize(10).text(name, 56, y, { width: 260 });
            doc.text(String(item.quantity), 340, y);
            doc.text(euro(item.unitPrice), 395, y, { width: 65, align: 'right' });
            doc.text(euro(lineTotal), 465, y, { width: 70, align: 'right' });
            y += 22;
            doc.moveTo(50, y - 4).lineTo(545, y - 4).stroke('#f1f5f9');
        }

        y += 18;
        doc.fontSize(10).text('Subtotaal', 390, y, { width: 80, align: 'right' });
        doc.text(euro(data.subtotal), 465, y, { width: 70, align: 'right' });
        y += 18;
        doc.text('Verzending', 390, y, { width: 80, align: 'right' });
        doc.text(euro(data.shippingCost), 465, y, { width: 70, align: 'right' });
        y += 24;
        doc.font('Helvetica-Bold').fontSize(12).text('Totaal', 390, y, { width: 80, align: 'right' });
        doc.text(euro(data.total), 465, y, { width: 70, align: 'right' });

        doc.font('Helvetica').fontSize(9).fillColor('#6b7280').text(
            'Bedankt voor je bestelling bij Gent bandenservice.',
            50,
            760,
            { align: 'center', width: 495 }
        );

        doc.end();
    });
}
