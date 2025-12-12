import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: {
    default: "Ariana Bandenservice | Premium Tire Shop",
    template: "%s | Ariana Bandenservice",
  },
  description: "Professional tire services in Amsterdam. Quality tire fitting, balancing, alignment, and repair. Top brands at competitive prices.",
  keywords: ["tires", "banden", "tire shop", "wheel alignment", "tire fitting", "Amsterdam", "Netherlands"],
  authors: [{ name: "Ariana Bandenservice" }],
  creator: "Ariana Bandenservice",
  metadataBase: new URL("https://arianabandenservice.com"),
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://arianabandenservice.com",
    siteName: "Ariana Bandenservice",
    title: "Ariana Bandenservice | Premium Tire Shop",
    description: "Professional tire services in Amsterdam. Quality tire fitting, balancing, alignment, and repair.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ariana Bandenservice | Premium Tire Shop",
    description: "Professional tire services in Amsterdam. Quality tire fitting, balancing, alignment, and repair.",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
