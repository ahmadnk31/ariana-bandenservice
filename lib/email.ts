import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

export async function sendContactEmail(data: ContactFormData): Promise<{ success: boolean; error?: string }> {
    try {
        await resend.emails.send({
            from: "Ariana Bandenservice <onboarding@resend.dev>", // Update with your verified domain
            to: ["info@arianabandenservice.com"], // Update with your email
            replyTo: data.email,
            subject: `New Contact Form: ${data.firstName} ${data.lastName}`,
            html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p><strong>Service:</strong> ${data.service || "Not specified"}</p>
        <h3>Message:</h3>
        <p>${data.message}</p>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendStockRequestEmail(data: StockRequestData): Promise<{ success: boolean; error?: string }> {
    try {
        await resend.emails.send({
            from: "Ariana Bandenservice <onboarding@resend.dev>",
            to: ["info@arianabandenservice.com"],
            replyTo: data.email,
            subject: `New Stock Request: ${data.tireName}`,
            html: `
        <h2>New Stock Request Submission</h2>
        <p><strong>Tire:</strong> ${data.tireName}</p>
        <p><strong>Customer Name:</strong> ${data.name || "Not provided"}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
        <p>A customer is interested in a tire that is currently out of stock. Please bring it back as soon as possible!</p>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send stock request email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendStockRequestConfirmationEmail(data: StockRequestData): Promise<{ success: boolean; error?: string }> {
    try {
        await resend.emails.send({
            from: "Ariana Bandenservice <onboarding@resend.dev>",
            to: [data.email],
            subject: `Bevestiging voorraad aanvraag: ${data.tireName}`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Bedankt voor je aanvraag!</h2>
          <p>Beste ${data.name || "Klant"},</p>
          <p>We hebben je aanvraag voor de volgende band ontvangen:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Band:</strong> ${data.tireName}</p>
          </div>
          <p>We doen ons best om deze band zo snel mogelijk weer op voorraad te krijgen. Zodra de band beschikbaar is, laten we het je direct weten via dit e-mailadres.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #666;">Met vriendelijke groet,<br /><strong>Ariana Bandenservice</strong></p>
        </div>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send customer confirmation email:", error);
        return { success: false, error: "Failed to send email" };
    }
}

export async function sendBackInStockEmail(data: { email: string; name?: string | null; tireName: string; slug: string }): Promise<{ success: boolean; error?: string }> {
    try {
        const tireUrl = `https://arianabandenservice.com/tires/${data.slug}`; // Update with your actual domain

        await resend.emails.send({
            from: "Ariana Bandenservice <onboarding@resend.dev>",
            to: [data.email],
            subject: `Goed nieuws! De ${data.tireName} is weer op voorraad`,
            html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Goed nieuws!</h2>
          <p>Beste ${data.name || "Klant"},</p>
          <p>Je hebt onlangs gevraagd om een melding wanneer de volgende band weer op voorraad zou zijn:</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Band:</strong> ${data.tireName}</p>
          </div>
          <p>We zijn blij om te kunnen melden dat deze band nu weer beschikbaar is!</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${tireUrl}" style="background-color: #0070f3; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">Bekijk Band en Bestel Nu</a>
          </div>
          <p>Wacht niet te lang, want de voorraad kan snel gaan.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 0.9em; color: #666;">Met vriendelijke groet,<br /><strong>Ariana Bandenservice</strong></p>
        </div>
      `,
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to send back-in-stock email:", error);
        return { success: false, error: "Failed to send email" };
    }
}
