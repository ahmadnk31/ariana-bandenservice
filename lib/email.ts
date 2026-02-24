import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromAddress = process.env.FROM_EMAIL || "contact@gentbandenservice.be";
const fromEmail = `Gent bandenservice <${fromAddress}>`;
const salesEmail = "Gent bandenservice <sales@gentbandenservice.be>";
const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gentbandenservice.be";
const siteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    service?: string;
    message: string;
}

interface StockRequestData {
    tireName: string;
    email: string;
    name?: string | null;
    phone?: string | null;
}

// Shared email wrapper for consistent branding
function emailLayout(content: string, preheader?: string): string {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  ${preheader ? `<!--[if !mso]><!--><span style="display:none;font-size:1px;color:#fff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span><!--<![endif]-->` : ""}
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
          <!-- Header -->
          <tr>
            <td style="background-color:#18181b;padding:24px 32px;border-radius:12px 12px 0 0;text-align:center;">
              <img src="${siteUrl}/gentbandenservice/android-chrome-192x192.png" alt="Gent bandenservice" width="48" height="48" style="display:block;margin:0 auto 12px;border-radius:8px;" />
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px;">
                Gent bandenservice
              </h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;border-left:1px solid #e4e4e7;border-right:1px solid #e4e4e7;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color:#fafafa;padding:24px 32px;border-radius:0 0 12px 12px;border:1px solid #e4e4e7;border-top:none;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#71717a;">
                Gent bandenservice &bull; Dendermondsesteenweg 428, 9040 Sint-Amandsberg
              </p>
              <p style="margin:0;font-size:13px;">
                <a href="${siteUrl}" style="color:#2563eb;text-decoration:none;">gentbandenservice.be</a>
                &nbsp;&bull;&nbsp;
                <a href="tel:+32466195622" style="color:#2563eb;text-decoration:none;">+32 466 19 56 22</a>
                &nbsp;&bull;&nbsp;
                <a href="tel:+32467871205" style="color:#2563eb;text-decoration:none;">+32 467 87 12 05</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Reusable info-row for key-value pairs
function infoRow(label: string, value: string): string {
    return `<tr>
    <td style="padding:8px 12px;font-size:14px;color:#71717a;white-space:nowrap;vertical-align:top;">${label}</td>
    <td style="padding:8px 12px;font-size:14px;color:#18181b;">${value}</td>
  </tr>`;
}

// Reusable CTA button
function ctaButton(text: string, href: string): string {
    return `<div style="text-align:center;margin:28px 0;">
    <a href="${href}" style="display:inline-block;background-color:#2563eb;color:#ffffff;font-size:15px;font-weight:600;padding:14px 28px;border-radius:8px;text-decoration:none;letter-spacing:-0.2px;">${text}</a>
  </div>`;
}

// Reusable highlighted box
function highlightBox(content: string): string {
    return `<div style="background-color:#f4f4f5;border:1px solid #e4e4e7;border-radius:8px;padding:16px 20px;margin:20px 0;">${content}</div>`;
}

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">📩 Nieuw contactformulier</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#71717a;">Er is een nieuw bericht binnengekomen via het contactformulier.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#f4f4f5;">
                <td colspan="2" style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Klantgegevens</td>
              </tr>
              ${infoRow("Naam", `${data.firstName} ${data.lastName}`)}
              ${infoRow("E-mail", `<a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a>`)}
              ${infoRow("Telefoon", data.phone || "<span style='color:#a1a1aa;'>Niet opgegeven</span>")}
              ${infoRow("Dienst", data.service || "<span style='color:#a1a1aa;'>Niet opgegeven</span>")}
            </table>
            ${highlightBox(`
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Bericht</p>
              <p style="margin:0;font-size:14px;color:#18181b;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
            `)}
            <p style="margin:24px 0 0;font-size:13px;color:#71717a;">Beantwoord door te reageren op dit e-mail &mdash; het gaat direct naar <strong>${data.email}</strong>.</p>
        `, `Nieuw bericht van ${data.firstName} ${data.lastName}`);

        await resend.emails.send({
            from: fromEmail,
            to: [fromAddress],
            replyTo: data.email,
            subject: `📩 Nieuw contactformulier: ${data.firstName} ${data.lastName}`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendContactConfirmationEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">Bedankt voor je bericht!</h2>
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.firstName},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">We hebben je bericht goed ontvangen en zullen zo snel mogelijk reageren.</p>
            ${highlightBox(`
              <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Je bericht</p>
              <p style="margin:0;font-size:14px;color:#18181b;line-height:1.6;white-space:pre-wrap;">${data.message}</p>
            `)}
            <p style="margin:0 0 8px;font-size:15px;color:#3f3f46;line-height:1.6;">We proberen binnen 24 uur te antwoorden. Als je vraag dringend is, bel ons gerust op <a href="tel:+32466195622" style="color:#2563eb;text-decoration:none;">+32 466 19 56 22</a> of <a href="tel:+32467871205" style="color:#2563eb;text-decoration:none;">+32 467 87 12 05</a>.</p>
            ${ctaButton("Bekijk onze diensten →", `${siteUrl}/services`)}
            <p style="margin:24px 0 0;font-size:15px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `Bedankt ${data.firstName}, we hebben je bericht ontvangen`);

        await resend.emails.send({
            from: fromEmail,
            to: [data.email],
            subject: `Bedankt voor je bericht, ${data.firstName}!`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send contact confirmation email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendStockRequestEmail(data: StockRequestData): Promise<{ success: boolean; error?: string }> {
    try {
        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">📦 Nieuwe voorraad aanvraag</h2>
            <p style="margin:0 0 24px;font-size:14px;color:#71717a;">Een klant is geïnteresseerd in een band die niet op voorraad is.</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;">
              <tr style="background-color:#f4f4f5;">
                <td colspan="2" style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Aanvraagdetails</td>
              </tr>
              ${infoRow("Band", `<strong>${data.tireName}</strong>`)}
              ${infoRow("Klant", data.name || "<span style='color:#a1a1aa;'>Niet opgegeven</span>")}
              ${infoRow("E-mail", `<a href="mailto:${data.email}" style="color:#2563eb;text-decoration:none;">${data.email}</a>`)}
              ${infoRow("Telefoon", data.phone || "<span style='color:#a1a1aa;'>Niet opgegeven</span>")}
            </table>
            <p style="margin:24px 0 0;font-size:13px;color:#71717a;">Probeer deze band zo snel mogelijk weer op voorraad te brengen.</p>
        `, `Voorraad aanvraag: ${data.tireName}`);

        await resend.emails.send({
            from: fromEmail,
            to: [fromAddress],
            replyTo: data.email,
            subject: `📦 Voorraad aanvraag: ${data.tireName}`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send stock request email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendStockRequestConfirmationEmail(data: StockRequestData): Promise<{ success: boolean; error?: string }> {
    try {
        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">Bedankt voor je aanvraag!</h2>
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.name || "Klant"},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">We hebben je aanvraag voor de volgende band ontvangen:</p>
            ${highlightBox(`<p style="margin:0;font-size:15px;color:#18181b;"><strong>🛞 ${data.tireName}</strong></p>`)}
            <p style="margin:0 0 8px;font-size:15px;color:#3f3f46;line-height:1.6;">We doen ons best om deze band zo snel mogelijk weer op voorraad te krijgen. Zodra de band beschikbaar is, laten we het je direct weten via dit e-mailadres.</p>
            <p style="margin:24px 0 0;font-size:15px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `We hebben je voorraad aanvraag ontvangen voor ${data.tireName}`);

        await resend.emails.send({
            from: fromEmail,
            to: [data.email],
            subject: `Bevestiging voorraad aanvraag: ${data.tireName}`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send customer confirmation email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendContactReplyEmail(data: { customerName: string; customerEmail: string; adminMessage: string; originalMessage: string }): Promise<{ success: boolean; error?: string }> {
    try {
        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">Reactie op je bericht</h2>
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.customerName},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">Bedankt voor je bericht. Hieronder ons antwoord:</p>
            <div style="background-color:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:16px 20px;margin:0 0 24px;">
              <p style="margin:0;font-size:15px;color:#18181b;line-height:1.6;white-space:pre-wrap;">${data.adminMessage}</p>
            </div>
            <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Je oorspronkelijke bericht</p>
            ${highlightBox(`<p style="margin:0;font-size:14px;color:#71717a;line-height:1.6;font-style:italic;white-space:pre-wrap;">&ldquo;${data.originalMessage}&rdquo;</p>`)}
            <p style="margin:24px 0 0;font-size:15px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `Reactie op je bericht — Gent bandenservice`);

        await resend.emails.send({
            from: fromEmail,
            to: [data.customerEmail],
            subject: `Reactie op je bericht — Gent bandenservice`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send contact reply email:", error);
        return { success: false, error: "Failed to send reply email" };
    }
}

export async function sendBackInStockEmail(data: { email: string; name?: string | null; tireName: string; slug: string }): Promise<{ success: boolean; error?: string }> {
    try {
        const tireUrl = `${siteUrl}/tires/${data.slug}`;

        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:20px;font-weight:700;color:#18181b;">Goed nieuws! 🎉</h2>
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.name || "Klant"},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">Je hebt onlangs gevraagd om een melding wanneer de volgende band weer op voorraad zou zijn:</p>
            ${highlightBox(`<p style="margin:0;font-size:15px;color:#18181b;"><strong>🛞 ${data.tireName}</strong></p>`)}
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">We zijn blij om te kunnen melden dat deze band nu weer <strong>beschikbaar</strong> is!</p>
            ${ctaButton("Bekijk band en bestel nu →", tireUrl)}
            <p style="margin:0 0 8px;font-size:14px;color:#71717a;">Wacht niet te lang, want de voorraad kan snel gaan.</p>
            <p style="margin:24px 0 0;font-size:15px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `De ${data.tireName} is weer op voorraad!`);

        await resend.emails.send({
            from: fromEmail,
            to: [data.email],
            subject: `Goed nieuws! De ${data.tireName} is weer op voorraad 🎉`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send back-in-stock email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

interface AbandonedCartItem {
    name: string;
    size?: string;
    price: number;
    quantity: number;
    image?: string;
}

interface OrderConfirmationItem {
    name: string;
    size?: string;
    quantity: number;
    unitPrice: number;
}

export async function sendOrderStatusUpdateEmail(data: {
  email: string;
  customerName: string;
  orderNumber: string;
  status: string;
  trackingNumber?: string | null;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const statusLabelMap: Record<string, string> = {
      pending: 'In behandeling',
      paid: 'Betaald',
      shipped: 'Verzonden',
      delivered: 'Geleverd',
      cancelled: 'Geannuleerd',
    };

    const statusLabel = statusLabelMap[data.status] || data.status;
    const trackingBlock = data.trackingNumber
      ? highlightBox(`<p style="margin:0;font-size:14px;color:#18181b;"><strong>Trackingnummer:</strong> ${data.trackingNumber}</p>`)
      : '';

    const html = emailLayout(`
      <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Update over je bestelling</h2>
      <p style="margin:0 0 8px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.customerName},</p>
      <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">De status van je bestelling is bijgewerkt.</p>

      ${highlightBox(`
        <p style="margin:0 0 8px;font-size:14px;color:#18181b;"><strong>Bestelnummer:</strong> ${data.orderNumber}</p>
        <p style="margin:0;font-size:14px;color:#18181b;"><strong>Nieuwe status:</strong> ${statusLabel}</p>
      `)}

      ${trackingBlock}

      <p style="margin:0;font-size:14px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
    `, `Statusupdate voor bestelling ${data.orderNumber}: ${statusLabel}`);

    await resend.emails.send({
      from: fromEmail,
      to: [data.email],
      subject: `Bestelling ${data.orderNumber} status: ${statusLabel}`,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send order status update email:', error);
    return { success: false, error: 'Failed to send order status update email' };
  }
}

export async function sendOrderConfirmationEmail(data: {
    email: string;
    customerName: string;
    orderNumber: string;
    items: OrderConfirmationItem[];
    subtotal: number;
    shippingCost: number;
    total: number;
    invoicePdf: Buffer;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const rows = data.items
            .map(item => `
                <tr>
                  <td style="padding:10px 12px;font-size:14px;color:#18181b;border-bottom:1px solid #e4e4e7;">
                    ${item.name}${item.size ? `<br/><span style="font-size:12px;color:#71717a;">${item.size}</span>` : ''}
                  </td>
                  <td style="padding:10px 12px;font-size:14px;color:#71717a;text-align:center;border-bottom:1px solid #e4e4e7;">${item.quantity}x</td>
                  <td style="padding:10px 12px;font-size:14px;color:#18181b;text-align:right;border-bottom:1px solid #e4e4e7;">€${(item.unitPrice * item.quantity).toFixed(2)}</td>
                </tr>
            `)
            .join('');

        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Betaling geslaagd ✅</h2>
            <p style="margin:0 0 8px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${data.customerName},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#3f3f46;line-height:1.6;">Bedankt voor je bestelling. We hebben je betaling succesvol ontvangen.</p>

            ${highlightBox(`
                <p style="margin:0;font-size:14px;color:#18181b;"><strong>Bestelnummer:</strong> ${data.orderNumber}</p>
            `)}

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;margin:0 0 20px;">
              <tr style="background-color:#f4f4f5;">
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Artikel</td>
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;text-align:center;">Aantal</td>
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Prijs</td>
              </tr>
              ${rows}
              <tr>
                <td colspan="2" style="padding:10px 12px;font-size:14px;color:#18181b;">Subtotaal</td>
                <td style="padding:10px 12px;font-size:14px;color:#18181b;text-align:right;">€${data.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:10px 12px;font-size:14px;color:#18181b;">Verzending</td>
                <td style="padding:10px 12px;font-size:14px;color:#18181b;text-align:right;">€${data.shippingCost.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="2" style="padding:12px;font-size:16px;font-weight:700;color:#18181b;">Totaal</td>
                <td style="padding:12px;font-size:16px;font-weight:700;color:#18181b;text-align:right;">€${data.total.toFixed(2)}</td>
              </tr>
            </table>

            <p style="margin:0 0 10px;font-size:14px;color:#3f3f46;">Je factuur zit als PDF in de bijlage van deze e-mail.</p>
            <p style="margin:0;font-size:14px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `Betaling ontvangen voor bestelling ${data.orderNumber}`);

        await resend.emails.send({
            from: fromEmail,
            to: [data.email],
            subject: `Bevestiging bestelling ${data.orderNumber} + factuur`,
            html,
            attachments: [
                {
                    filename: `factuur-${data.orderNumber}.pdf`,
                    content: data.invoicePdf,
                },
            ],
        });

        return { success: true };
    } catch (error) {
        console.error('Failed to send order confirmation email:', error);
        return { success: false, error: 'Failed to send order confirmation email' };
    }
}

export async function sendAbandonedCheckoutEmail(data: {
    email: string;
    firstName?: string | null;
    checkoutId: string;
    cartItems: AbandonedCartItem[];
    subtotal: number;
}): Promise<{ success: boolean; error?: string }> {
    try {
        const checkoutUrl = `${siteUrl}/nl/checkout?recover=${data.checkoutId}`;
        const customerName = data.firstName || "Klant";

        // Build cart items HTML
        const cartItemsHtml = data.cartItems.map(item => `
          <tr>
            <td style="padding:12px;font-size:14px;color:#18181b;border-bottom:1px solid #e4e4e7;">
              <strong>${item.name}</strong>
              ${item.size ? `<br/><span style="font-size:12px;color:#71717a;">${item.size}</span>` : ""}
            </td>
            <td style="padding:12px;font-size:14px;color:#71717a;text-align:center;border-bottom:1px solid #e4e4e7;">${item.quantity}x</td>
            <td style="padding:12px;font-size:14px;color:#18181b;text-align:right;border-bottom:1px solid #e4e4e7;font-weight:600;">€${(item.price * item.quantity).toFixed(2)}</td>
          </tr>
        `).join("");

        const html = emailLayout(`
            <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#18181b;">Je bent er bijna! 🛒</h2>
            <p style="margin:0 0 4px;font-size:15px;color:#3f3f46;line-height:1.6;">Beste ${customerName},</p>
            <p style="margin:0 0 24px;font-size:15px;color:#3f3f46;line-height:1.6;">Je was bezig met het bestellen van banden, maar hebt de betaling nog niet afgerond. Geen zorgen — je winkelwagen staat nog klaar!</p>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e4e4e7;border-radius:8px;overflow:hidden;margin:0 0 20px;">
              <tr style="background-color:#f4f4f5;">
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;">Artikel</td>
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;text-align:center;">Aantal</td>
                <td style="padding:10px 12px;font-size:12px;font-weight:600;color:#71717a;text-transform:uppercase;letter-spacing:0.5px;text-align:right;">Prijs</td>
              </tr>
              ${cartItemsHtml}
              <tr>
                <td colspan="2" style="padding:12px;font-size:15px;font-weight:700;color:#18181b;">Subtotaal</td>
                <td style="padding:12px;font-size:15px;font-weight:700;color:#18181b;text-align:right;">€${data.subtotal.toFixed(2)}</td>
              </tr>
            </table>

            ${highlightBox(`
              <p style="margin:0;font-size:14px;color:#18181b;line-height:1.6;">
                <strong>✅ Montage + balans gratis</strong> inbegrepen bij elke bestelling!
              </p>
            `)}

            ${ctaButton("Bestelling afronden →", checkoutUrl)}

            <p style="margin:0 0 8px;font-size:14px;color:#71717a;text-align:center;">Je banden liggen klaar. Rond je bestelling af voordat ze uitverkocht zijn!</p>

            <p style="margin:24px 0 0;font-size:15px;color:#3f3f46;">Met vriendelijke groet,<br /><strong>Het Gent bandenservice team</strong></p>
        `, `${customerName}, je hebt nog items in je winkelwagen!`);

        await resend.emails.send({
            from: salesEmail,
            to: [data.email],
            subject: `${customerName}, je bent er bijna! Rond je bestelling af 🛞`,
            html,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send abandoned checkout email:", error);
        return { success: false, error: "Failed to send email" };
    }
}