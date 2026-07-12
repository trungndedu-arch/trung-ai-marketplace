import type { Metadata } from "next";
import { AiToolsShell } from "@/components/ai-tools/AiToolsShell";

export const metadata: Metadata = {
  title: "Chatbot & AI App | Trung AI Media",
  description: "Khám phá chatbot và AI App giúp tạo nội dung, xây kênh, bán hàng và làm Affiliate hiệu quả hơn.",
};

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
  return <AiToolsShell activeModule="workflows">{children}</AiToolsShell>;
}
