import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Trung AI Media — AI Marketplace",
    template: "%s | Trung AI Media",
  },
  description: "Khám phá prompt, chatbot, workflow và ứng dụng AI chất lượng cao.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className="dark">
      <body>{children}</body>
    </html>
  );
}
