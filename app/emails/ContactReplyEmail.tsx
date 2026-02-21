
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Link,
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface ContactReplyEmailProps {
    customerName: string;
    adminMessage: string;
    originalMessage: string;
}

export default function ContactReplyEmail({
    customerName = "Customer",
    adminMessage = "Thank you for your inquiry.",
    originalMessage = "Original message...",
}: ContactReplyEmailProps) {
    return (
        <Html lang="nl">
            <Head />
            <Preview>Reactie op je bericht — Gent bandenservice</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <img src="https://gentbandenservice.be/gentbandenservice/android-chrome-192x192.png" alt="Gent bandenservice" width={48} height={48} style={headerLogo} />
                        <Heading style={headerTitle}>Gent bandenservice</Heading>
                    </Section>

                    {/* Body */}
                    <Section style={body}>
                        <Text style={greeting}>Beste {customerName},</Text>
                        <Text style={paragraph}>
                            Bedankt voor je bericht. Hieronder ons antwoord:
                        </Text>

                        {/* Reply box */}
                        <Section style={replyBox}>
                            <Text style={replyText}>{adminMessage}</Text>
                        </Section>

                        <Hr style={divider} />

                        <Text style={originalLabel}>Je oorspronkelijke bericht:</Text>
                        <Section style={originalBox}>
                            <Text style={originalText}>"{originalMessage}"</Text>
                        </Section>

                        <Text style={signoff}>
                            Met vriendelijke groet,
                            <br />
                            <strong>Het Gent bandenservice team</strong>
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerAddress}>
                            Gent bandenservice &bull; dendermondsesteenweg 428, 9040 Sint-Amandsberg, België
                        </Text>
                        <Row>
                            <Column align="center">
                                <Link href="https://www.gentbandenservice.be" style={footerLink}>
                                    gentbandenservice.be
                                </Link>
                                <Text style={footerBull}>&nbsp;&bull;&nbsp;</Text>
                                <Link href="tel:+32466195622" style={footerLink}>
                                    +32 466 19 56 22
                                </Link>
                                <Text style={footerBull}>&nbsp;&bull;&nbsp;</Text>
                                <Link href="tel:+32467871205" style={footerLink}>
                                    +32 467 87 12 05
                                </Link>
                            </Column>
                        </Row>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

const main: React.CSSProperties = {
    backgroundColor: "#f4f4f5",
    fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
    margin: 0,
    padding: "40px 20px",
};

const container: React.CSSProperties = {
    maxWidth: "600px",
    margin: "0 auto",
};

const header: React.CSSProperties = {
    backgroundColor: "#18181b",
    padding: "24px 32px",
    borderRadius: "12px 12px 0 0",
    textAlign: "center" as const,
};

const headerTitle: React.CSSProperties = {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.5px",
};

const headerLogo: React.CSSProperties = {
    display: "block",
    margin: "0 auto 12px",
    borderRadius: "8px",
};

const body: React.CSSProperties = {
    backgroundColor: "#ffffff",
    padding: "32px",
    borderLeft: "1px solid #e4e4e7",
    borderRight: "1px solid #e4e4e7",
};

const greeting: React.CSSProperties = {
    fontSize: "15px",
    color: "#3f3f46",
    lineHeight: "1.6",
    margin: "0 0 4px",
};

const paragraph: React.CSSProperties = {
    fontSize: "15px",
    color: "#3f3f46",
    lineHeight: "1.6",
    margin: "0 0 20px",
};

const replyBox: React.CSSProperties = {
    backgroundColor: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "0 0 24px",
};

const replyText: React.CSSProperties = {
    fontSize: "15px",
    color: "#18181b",
    lineHeight: "1.6",
    margin: 0,
    whiteSpace: "pre-wrap" as const,
};

const divider: React.CSSProperties = {
    borderColor: "#e4e4e7",
    margin: "24px 0",
};

const originalLabel: React.CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#71717a",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    margin: "0 0 8px",
};

const originalBox: React.CSSProperties = {
    backgroundColor: "#f4f4f5",
    border: "1px solid #e4e4e7",
    borderRadius: "8px",
    padding: "16px 20px",
    margin: "0 0 24px",
};

const originalText: React.CSSProperties = {
    fontSize: "14px",
    color: "#71717a",
    lineHeight: "1.6",
    margin: 0,
    fontStyle: "italic" as const,
};

const signoff: React.CSSProperties = {
    fontSize: "15px",
    color: "#3f3f46",
    lineHeight: "1.6",
    margin: "24px 0 0",
};

const footer: React.CSSProperties = {
    backgroundColor: "#fafafa",
    padding: "24px 32px",
    borderRadius: "0 0 12px 12px",
    border: "1px solid #e4e4e7",
    borderTop: "none",
    textAlign: "center" as const,
};

const footerAddress: React.CSSProperties = {
    margin: "0 0 8px",
    fontSize: "13px",
    color: "#71717a",
};

const footerLink: React.CSSProperties = {
    color: "#2563eb",
    textDecoration: "none",
    fontSize: "13px",
};

const footerBull: React.CSSProperties = {
    display: "inline",
    fontSize: "13px",
    color: "#71717a",
    margin: 0,
};
