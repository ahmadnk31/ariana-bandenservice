import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { prisma } from '@/lib/db';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Helper to parse standard RFC 5322 From header: "Name <email>" or "email"
 */
function parseSender(fromStr: string) {
    const match = fromStr.match(/^(.*?)\s*<(.*?)>$/);
    if (match) {
        const name = match[1].replace(/['"]/g, '').trim();
        const email = match[2].trim();
        const nameParts = name.split(/\s+/);
        const firstName = nameParts[0] || 'Inbound';
        const lastName = nameParts.slice(1).join(' ') || '(Email)';
        return { firstName, lastName, email };
    } else {
        const email = fromStr.trim();
        const namePart = email.split('@')[0] || 'Inbound';
        // Capitalize namePart
        const firstName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        return { firstName, lastName: '(Email)', email };
    }
}

/**
 * Strips quoted email history from plain-text email bodies.
 * Removes:
 * - Lines starting with ">"
 * - Gmail/Outlook attribution lines: "Op [date] schreef ..." / "On [date] ... wrote:"
 * - Everything after those patterns
 */
function extractLatestReply(body: string): string {
    const lines = body.split('\n');
    const cutoffPatterns = [
        /^>\s*/,                                          // Quoted lines starting with >
        /^Op\s.+schreef\s/i,                             // Dutch Gmail: "Op za 18 jul ... schreef ..."
        /^On\s.+wrote:\s*$/i,                            // English Gmail: "On Mon, Jan 1 ... wrote:"
        /^-{3,}\s*(Original Message|Origineel bericht)/i, // Outlook dividers
        /^_{5,}$/,                                        // Outlook underscore divider
    ];

    let cutIndex = lines.length;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (cutoffPatterns.some(pattern => pattern.test(line))) {
            cutIndex = i;
            break;
        }
    }

    return lines.slice(0, cutIndex).join('\n').trim();
}

export async function POST(req: NextRequest) {
    console.log('🔔 Resend Webhook received!');

    const payload = await req.text();
    const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
    let event: any;

    if (webhookSecret) {
        const sig = req.headers.get('svix-signature');
        const id = req.headers.get('svix-id');
        const timestamp = req.headers.get('svix-timestamp');

        if (!sig || !id || !timestamp) {
            console.error('❌ Missing svix signature headers');
            return NextResponse.json({ error: 'Missing svix signature headers' }, { status: 400 });
        }

        try {
            event = resend.webhooks.verify({
                payload,
                headers: {
                    'id': id,
                    'timestamp': timestamp,
                    'signature': sig,
                },
                webhookSecret,
            });
        } catch (err) {
            console.error('❌ Webhook signature verification failed:', err);
            return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
        }
    } else {
        if (process.env.NODE_ENV === 'production') {
            console.error('❌ RESEND_WEBHOOK_SECRET is not set in production');
            return NextResponse.json({ error: 'Webhook secret is not configured' }, { status: 500 });
        }
        console.warn('⚠️ RESEND_WEBHOOK_SECRET is missing. Bypassing signature verification in non-production.');
        try {
            event = JSON.parse(payload);
        } catch (parseError) {
            console.error('❌ Invalid JSON payload:', parseError);
            return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
        }
    }

    console.log('✅ Event type:', event?.type);

    if (event?.type !== 'email.received') {
        console.log(`⏭️ Ignoring webhook event type: ${event?.type}`);
        return NextResponse.json({ received: true });
    }

    const emailId = event.data?.email_id;
    if (!emailId) {
        console.error('❌ Missing email_id in email.received payload');
        return NextResponse.json({ error: 'Missing email_id' }, { status: 400 });
    }

    try {
        console.log(`📧 Fetching email details for email_id: ${emailId}`);
        const { data: emailData, error: emailError } = await resend.emails.receiving.get(emailId);

        if (emailError || !emailData) {
            console.error('❌ Failed to fetch email from Resend:', emailError);
            return NextResponse.json({ error: 'Failed to fetch email details' }, { status: 500 });
        }

        const fromStr = emailData.from || '';
        const parsed = parseSender(fromStr);
        const subject = emailData.subject || '(No Subject)';
        const bodyText = emailData.text || emailData.html || '(No content)';
        const isReply = /^re:/i.test(subject.trim());

        // Threading: if this is a reply, try to append to an existing contact thread
        if (isReply) {
            const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
            const existing = await prisma.contact.findFirst({
                where: {
                    email: parsed.email,
                    createdAt: { gte: fourteenDaysAgo },
                },
                orderBy: { createdAt: 'desc' },
            });

            if (existing) {
                const timestamp = new Date().toLocaleString('nl-BE', { timeZone: 'Europe/Brussels' });
                const cleanReply = extractLatestReply(bodyText);
                const appendedMessage = `${existing.message}\n\n---\n📨 Klant antwoordde op ${timestamp}:\n\n${cleanReply}`;

                const updated = await prisma.contact.update({
                    where: { id: existing.id },
                    data: {
                        message: appendedMessage,
                        status: 'unread',
                    },
                });

                console.log(`✅ Appended reply to existing contact ID: ${updated.id}`);
                return NextResponse.json({ success: true, contactId: updated.id, threaded: true });
            }
        }

        // No matching thread found, or it's a new inquiry — create a new contact
        const cleanBody = extractLatestReply(bodyText);
        const message = `${subject}\n\n${cleanBody}`;
        const contact = await prisma.contact.create({
            data: {
                firstName: parsed.firstName,
                lastName: parsed.lastName,
                email: parsed.email,
                phone: null,
                service: 'Email Inquiry',
                message,
                status: 'unread'
            }
        });

        console.log(`✅ Saved new contact from inbound email. Contact ID: ${contact.id}`);
        return NextResponse.json({ success: true, contactId: contact.id, threaded: false });
    } catch (error) {
        console.error('❌ Error processing inbound email webhook:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
