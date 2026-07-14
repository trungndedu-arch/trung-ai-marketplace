export type Chatbot = {
  id: string;
  name: string;
  slug: string;
  creator: string;
  category: string;
  badge: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  rating: string;
  sales: string;
  color: string;
  coverImage?: string;
  icon: "bot" | "shield";
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
};

export const chatbots: Chatbot[] = [
  {
    id: "chatbot-kich-ban-viral",
    name: "Chatbot AI Viết Kịch Bản Viral",
    slug: "chatbot-ai-viet-kich-ban-viral",
    creator: "Trung AI Media",
    category: "Kịch bản video",
    badge: "Sắp ra mắt",
    shortDescription: "Chatbot hỗ trợ lên ý tưởng, viết hook, kịch bản video ngắn và CTA theo phong cách dễ viral.",
    fullDescription: "Chatbot AI Viết Kịch Bản Viral đang được Trung AI Media phát triển để hỗ trợ người làm nội dung tạo ý tưởng, hook, kịch bản video ngắn và lời kêu gọi hành động nhanh hơn. Tính năng sẽ được cập nhật trong thời gian tới.",
    price: 0,
    rating: "Coming soon",
    sales: "Sắp ra mắt",
    color: "from-blue-900 via-sky-700 to-cyan-500",
    coverImage: "/images/chatbots/chatbot-kich-ban-viral-01.png",
    icon: "bot",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "chatbot-sang-tao-kich-ban-viral",
    name: "Chatbot AI Sáng Tạo Kịch Bản Viral",
    slug: "chatbot-ai-sang-tao-kich-ban-viral",
    creator: "Trung AI Media",
    category: "Kịch bản video",
    badge: "Sắp ra mắt",
    shortDescription: "Trợ lý AI giúp biến ý tưởng thô thành kịch bản cuốn hút cho TikTok, Reels và YouTube Shorts.",
    fullDescription: "Chatbot AI Sáng Tạo Kịch Bản Viral đang trong giai đoạn chuẩn bị. Công cụ hướng tới việc giúp creator, chủ shop và người làm affiliate tạo kịch bản video ngắn có cấu trúc rõ ràng, hấp dẫn và dễ triển khai.",
    price: 0,
    rating: "Coming soon",
    sales: "Sắp ra mắt",
    color: "from-sky-100 via-cyan-400 to-blue-600",
    coverImage: "/images/chatbots/chatbot-kich-ban-viral-02.png",
    icon: "bot",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
  {
    id: "chatbot-content-planner-365",
    name: "Chatbot Content Planner AI 365 Ngày",
    slug: "chatbot-content-planner-ai-365-ngay",
    creator: "Trung AI Media",
    category: "Lập kế hoạch nội dung",
    badge: "Sắp ra mắt",
    shortDescription: "Chatbot lập kế hoạch nội dung dài hạn, gợi ý lịch đăng bài và ý tưởng video đều đặn.",
    fullDescription: "Chatbot Content Planner AI 365 Ngày đang được xây dựng để hỗ trợ lên kế hoạch nội dung liên tục cho các kênh TikTok, Facebook, Reels, YouTube Shorts và blog. Mục tiêu là giúp người mới có lộ trình đăng bài rõ ràng hơn.",
    price: 0,
    rating: "Coming soon",
    sales: "Sắp ra mắt",
    color: "from-emerald-900 via-sky-700 to-cyan-500",
    coverImage: "/images/chatbots/chatbot-content-planner-365.png",
    icon: "bot",
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
  },
  {
    id: "chatbot-tiktok-hook-generator",
    name: "Chatbot TikTok Hook Generator",
    slug: "chatbot-tiktok-hook-generator",
    creator: "Trung AI Media",
    category: "Hook viral",
    badge: "Sắp ra mắt",
    shortDescription: "Công cụ gợi ý hook mở đầu video, tiêu đề và góc nội dung giúp tăng tỷ lệ giữ chân người xem.",
    fullDescription: "Chatbot TikTok Hook Generator đang được chuẩn bị để giúp người làm nội dung tạo hook mở đầu, tiêu đề, góc kể chuyện và ý tưởng giữ chân người xem cho video ngắn. Thông tin chi tiết sẽ được cập nhật sau.",
    price: 0,
    rating: "Coming soon",
    sales: "Sắp ra mắt",
    color: "from-slate-950 via-blue-900 to-cyan-600",
    coverImage: "/images/chatbots/chatbot-tiktok-hook-generator.png",
    icon: "bot",
    isFeatured: true,
    isActive: true,
    displayOrder: 4,
  },
];
