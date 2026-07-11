export type AiTool = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  logo: string;
  category: string;
  badge: string;
  toolType: string;
  affiliateUrl: string;
  officialWebsite: string;
  tutorialUrl: string;
  demoVideoUrl: string;
  features: string[];
  targetUsers: string[];
  useCases: string[];
  benefits: string[];
  tags: string[];
  galleryImages: string[];
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
};

export const aiTools: AiTool[] = [
  {
    id: "ai-dancing",
    name: "AI Dancing",
    slug: "ai-dancing",
    shortDescription:
      "AI Dancing là kho công cụ AI tất cả trong một giúp tạo video quảng cáo, review sản phẩm, thời trang, AI KOL và nội dung mạng xã hội nhanh chóng chỉ với vài thao tác.",
    fullDescription:
      "AI Dancing là nền tảng tích hợp nhiều tính năng tạo video bằng trí tuệ nhân tạo trong cùng một hệ thống. Công cụ hỗ trợ người dùng tạo video quảng cáo, video review sản phẩm, video thời trang, nhân vật AI KOL, video nhảy theo nhạc và nội dung ngắn dành cho mạng xã hội.\n\nAI Dancing phù hợp với cả người mới chưa có kinh nghiệm dựng video và những người đang làm sáng tạo nội dung, Affiliate, bán hàng online, marketing hoặc cung cấp dịch vụ video AI.\n\nNền tảng giúp rút ngắn quy trình từ ý tưởng đến video hoàn chỉnh, giảm thời gian chỉnh sửa thủ công và hỗ trợ người dùng tạo nội dung cho TikTok, Facebook Reels, YouTube Shorts và các chiến dịch quảng cáo sản phẩm.",
    coverImage: "/images/ai-dancing-cover.png",
    logo: "",
    category: "AI Video",
    badge: "Đề xuất",
    toolType: "Freemium",
    affiliateUrl: "https://aidancing.net?ref=aidancing37892",
    officialWebsite: "",
    tutorialUrl: "",
    demoVideoUrl: "",
    features: [
      "Tạo video quảng cáo bằng AI",
      "Tạo video review sản phẩm",
      "Tạo video thời trang AI",
      "Tạo nhân vật AI KOL",
      "Tạo video nhảy theo nhạc trend",
      "Tạo video từ ảnh",
      "Tạo nội dung TikTok và Reels",
      "Hỗ trợ nhiều phong cách nội dung",
      "Quy trình đơn giản, phù hợp với người mới",
      "Tích hợp nhiều công cụ AI trong cùng một nền tảng",
    ],
    targetUsers: [
      "Content Creator",
      "Người làm Affiliate",
      "Chủ shop online",
      "Marketer",
      "Freelancer",
      "Doanh nghiệp nhỏ",
      "Người bán hàng trên TikTok",
      "Người mới học làm video AI",
    ],
    useCases: [
      "Video quảng cáo sản phẩm",
      "Video review sản phẩm",
      "Video thời trang",
      "Video AI KOL",
      "Video nhảy nhạc trend",
      "Video TikTok",
      "Facebook Reels",
      "YouTube Shorts",
      "Video bán hàng",
      "Nội dung mạng xã hội",
    ],
    benefits: [
      "Nhiều tính năng trong một nền tảng",
      "Không yêu cầu kỹ năng dựng video chuyên sâu",
      "Tiết kiệm thời gian sản xuất nội dung",
      "Dễ sử dụng với người mới",
      "Phù hợp với nhiều ngành hàng",
      "Hỗ trợ tạo nội dung đều đặn",
      "Có thể dùng cho sáng tạo nội dung và kinh doanh",
    ],
    tags: ["AI Dancing", "AI Video", "Video AI", "AI KOL", "Video quảng cáo", "Review sản phẩm", "Thời trang AI", "TikTok", "Reels", "Affiliate", "Content Creator", "Marketing"],
    galleryImages: [],
    seoTitle: "AI Dancing – Công cụ tạo video AI tất cả trong một",
    seoDescription:
      "Khám phá AI Dancing, nền tảng tạo video quảng cáo, review sản phẩm, thời trang, AI KOL và nội dung mạng xã hội bằng AI nhanh chóng.",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-11T00:00:00.000Z",
  },
];
