import type { Metadata } from "next";
import { AiToolsShell } from "@/components/ai-tools/AiToolsShell";

export const metadata: Metadata = {
  title: "App Tạo Ảnh & Video AI | Trung AI Media",
  description: "Khám phá App AI giúp tạo ảnh, tạo video, xây nội dung và bán hàng hiệu quả hơn.",
};

export default function WorkflowsLayout({ children }: { children: React.ReactNode }) {
  return <AiToolsShell activeModule="workflows">{children}</AiToolsShell>;
}
