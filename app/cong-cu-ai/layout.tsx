import type { Metadata } from "next";
import { AiToolsShell } from "@/components/ai-tools/AiToolsShell";

export const metadata: Metadata = {
  title: "Công Cụ AI Nên Dùng | Trung AI Media",
  description: "Khám phá những công cụ AI hữu ích cho video, hình ảnh, marketing, sáng tạo nội dung và tự động hóa công việc.",
};

export default function AiToolsLayout({ children }: { children: React.ReactNode }) {
  return <AiToolsShell>{children}</AiToolsShell>;
}
