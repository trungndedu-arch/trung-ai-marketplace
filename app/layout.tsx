import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: {
    default: "Trung AI Studio — AI Marketplace",
    template: "%s | Trung AI Studio",
  },
  description: "Khám phá prompt, chatbot, workflow và ứng dụng AI chất lượng cao.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body className={manrope.variable}>{children}</body>
    </html>
  );
}
