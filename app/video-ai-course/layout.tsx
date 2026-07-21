import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Khóa Học Video AI | Xây Kênh & Làm Affiliate Từ Số 0",
  description: "Landing page khóa học Video AI thực chiến cho người mới: tạo video AI, prompt, thumbnail, xây kênh TikTok, Facebook Reels, YouTube Shorts và làm Affiliate không cần lộ mặt.",
  openGraph: {
    title: "Khóa Học Video AI - Trung AI Media",
    description: "Xây kênh & làm Affiliate từ số 0 bằng Video AI.",
    type: "website",
    images: ["/images/brand/trung-ai-og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Khóa Học Video AI - Trung AI Media",
    description: "Tạo video AI, thumbnail AI, workflow nội dung và Affiliate cho người mới.",
    images: ["/images/brand/trung-ai-og.png"],
  },
};

export default function VideoAICourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
