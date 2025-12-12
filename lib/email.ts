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
