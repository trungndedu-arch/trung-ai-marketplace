import type { Metadata } from "next";
import "./globals.css";

// Root metadata and shared stylesheet entry point.

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Trung AI Media — AI Marketplace",
    template: "%s | Trung AI Media",
  },
  description: "Khám phá prompt, chatbot, workflow và ứng dụng AI chất lượng cao.",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  openGraph: {
    title: "Trung AI Media — AI Marketplace",
    description: "Khám phá prompt, chatbot, workflow và ứng dụng AI chất lượng cao.",
    type: "website",
    images: [{ url: "/images/brand/trung-ai-og.png", alt: "Trung AI Media" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Trung AI Media — AI Marketplace",
    description: "Khám phá prompt, chatbot, workflow và ứng dụng AI chất lượng cao.",
    images: ["/images/brand/trung-ai-og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body>{children}</body>
    </html>
  );
}
