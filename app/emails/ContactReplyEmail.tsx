
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Tailwind,
    Hr
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
        <Html>
            <Head />
            <Preview>Response to your inquiry from Ariana Bandenservice</Preview>
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
                        <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
                            Ariana Bandenservice
                        </Heading>
                        <Text className="text-black text-[14px] leading-[24px]">
                            Hello {customerName},
                        </Text>
                        <Text className="text-black text-[14px] leading-[24px]">
                            {adminMessage}
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Regarding your message:
                        </Text>
                        <Text className="text-[#666666] text-[12px] leading-[24px] italic">
                            "{originalMessage}"
                        </Text>
                        <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
                        <Text className="text-[#666666] text-[12px] leading-[24px]">
                            Best regards,<br />
                            The Ariana Bandenservice Team
                        </Text>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
}
