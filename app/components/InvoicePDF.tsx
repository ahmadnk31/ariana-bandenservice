import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

interface InvoiceLineItem {
    name: string;
    size?: string;
    quantity: number;
    unitPrice: number;
}

export interface InvoiceData {
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
    paymentFee?: number;
    total: number;
}

const euro = (amount: number) => `€${amount.toFixed(2)}`;

const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 10,
        fontFamily: 'Helvetica',
        color: '#111827',
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    logo: {
        width: 140,
        height: 100,

    },
    title: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 12,
    },
    infoLabel: {
        fontSize: 10,
        color: '#6b7280',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 10,
        marginBottom: 4,
    },
    companyName: {
        fontSize: 12,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    companyDetail: {
        fontSize: 10,
        color: '#374151',
        marginBottom: 2,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#d4d4d8',
        marginVertical: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 6,
    },
    customerDetail: {
        fontSize: 10,
        marginBottom: 3,
    },
    // Table
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f4f4f5',
        paddingVertical: 7,
        paddingHorizontal: 6,
        marginTop: 20,
        borderRadius: 2,
    },
    tableHeaderText: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: '#6b7280',
        textTransform: 'uppercase',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 6,
        paddingHorizontal: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    colArticle: { width: '50%' },
    colQty: { width: '15%', textAlign: 'center' },
    colPrice: { width: '17%', textAlign: 'right' },
    colTotal: { width: '18%', textAlign: 'right' },
    // Totals
    totalsRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 3,
        paddingRight: 6,
    },
    totalsLabel: {
        width: 80,
        textAlign: 'right',
        marginRight: 10,
        fontSize: 10,
    },
    totalsValue: {
        width: 70,
        textAlign: 'right',
        fontSize: 10,
    },
    totalsBold: {
        fontFamily: 'Helvetica-Bold',
        fontSize: 12,
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 50,
        right: 50,
        textAlign: 'center',
        fontSize: 9,
        color: '#6b7280',
    },
});

export function InvoicePDF({ data }: { data: InvoiceData }) {
    const dateStr = data.issueDate.toLocaleDateString('nl-BE');

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header row */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.title}>FACTUUR</Text>
                        <Text style={styles.infoValue}>Factuurnummer: {data.invoiceNumber}</Text>
                        <Text style={styles.infoValue}>Datum: {dateStr}</Text>
                        <Text style={styles.infoValue}>Ordernummer: {data.orderNumber}</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <Image
                            src="https://gentbandenservice.be/gentbandenservice/android-chrome-512x512.png"
                            style={styles.logo}
                        />
                        <Text style={styles.companyName}>Gent bandenservice</Text>
                        <Text style={styles.companyDetail}>Dendermondsesteenweg 428</Text>
                        <Text style={styles.companyDetail}>9040 Sint-Amandsberg</Text>
                        <Text style={styles.companyDetail}>België</Text>
                        <Text style={styles.companyDetail}>+32 466 19 56 22</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                {/* Customer info */}
                <Text style={styles.sectionTitle}>Gefactureerd aan</Text>
                <Text style={styles.customerDetail}>{data.customerName}</Text>
                <Text style={styles.customerDetail}>{data.customerEmail}</Text>
                {data.customerPhone ? (
                    <Text style={styles.customerDetail}>{data.customerPhone}</Text>
                ) : null}
                <Text style={styles.customerDetail}>{data.shippingAddress.street}</Text>
                <Text style={styles.customerDetail}>
                    {data.shippingAddress.postalCode} {data.shippingAddress.city}
                </Text>
                <Text style={styles.customerDetail}>{data.shippingAddress.country}</Text>

                {/* Table header */}
                <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, styles.colArticle]}>Artikel</Text>
                    <Text style={[styles.tableHeaderText, styles.colQty]}>Aantal</Text>
                    <Text style={[styles.tableHeaderText, styles.colPrice]}>Prijs</Text>
                    <Text style={[styles.tableHeaderText, styles.colTotal]}>Totaal</Text>
                </View>

                {/* Table rows */}
                {data.items.map((item, i) => {
                    const lineTotal = item.quantity * item.unitPrice;
                    const name = item.size ? `${item.name} (${item.size})` : item.name;
                    return (
                        <View style={styles.tableRow} key={i}>
                            <Text style={styles.colArticle}>{name}</Text>
                            <Text style={styles.colQty}>{item.quantity}</Text>
                            <Text style={styles.colPrice}>{euro(item.unitPrice)}</Text>
                            <Text style={styles.colTotal}>{euro(lineTotal)}</Text>
                        </View>
                    );
                })}

                {/* Totals */}
                <View style={{ marginTop: 16 }}>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Subtotaal</Text>
                        <Text style={styles.totalsValue}>{euro(data.subtotal)}</Text>
                    </View>
                    <View style={styles.totalsRow}>
                        <Text style={styles.totalsLabel}>Verzending</Text>
                        <Text style={styles.totalsValue}>{euro(data.shippingCost)}</Text>
                    </View>
                    {data.paymentFee && data.paymentFee > 0 ? (
                        <View style={styles.totalsRow}>
                            <Text style={styles.totalsLabel}>Transactiekosten</Text>
                            <Text style={styles.totalsValue}>{euro(data.paymentFee)}</Text>
                        </View>
                    ) : null}
                    <View style={[styles.totalsRow, { marginTop: 6 }]}>
                        <Text style={[styles.totalsLabel, styles.totalsBold]}>Totaal</Text>
                        <Text style={[styles.totalsValue, styles.totalsBold]}>{euro(data.total)}</Text>
                    </View>
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    Bedankt voor je bestelling bij Gent bandenservice.
                </Text>
            </Page>
        </Document>
    );
}
