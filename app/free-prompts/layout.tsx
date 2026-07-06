import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư viện Prompt AI miễn phí",
  description: "Prompt AI miễn phí dành cho ChatGPT, Gemini, Midjourney, Nano Banana, Veo 3 và nhiều công cụ AI khác.",
};

export default function FreePromptsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
