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
  icon: "bot" | "shield";
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
};

export const chatbots: Chatbot[] = [
  {
    id: "sales-copilot-pro",
    name: "Sales Copilot Pro",
    slug: "sales-copilot-pro",
    creator: "Minh Digital",
    category: "Bán hàng",
    badge: "Mới",
    shortDescription: "Chatbot AI hỗ trợ tư vấn khách hàng, gợi ý sản phẩm và theo dõi cơ hội bán hàng theo quy trình có sẵn.",
    fullDescription: "Sales Copilot Pro hỗ trợ đội ngũ bán hàng phản hồi nhanh hơn, chuẩn hóa kịch bản tư vấn và không bỏ sót các cơ hội chăm sóc khách hàng.",
    price: 599000,
    originalPrice: 799000,
    rating: "5.0",
    sales: "642",
    color: "from-blue-500 via-sky-600 to-slate-950",
    icon: "bot",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "customer-care-247",
    name: "Customer Care 24/7",
    slug: "customer-care-247",
    creator: "AutoBiz",
    category: "Chăm sóc khách hàng",
    badge: "Pro",
    shortDescription: "Chatbot chăm sóc khách hàng tự động, hỗ trợ giải đáp câu hỏi phổ biến và dẫn khách đến đúng bước tiếp theo.",
    fullDescription: "Customer Care 24/7 giúp tự động hóa các câu hỏi thường gặp, duy trì phản hồi nhất quán và hỗ trợ khách hàng mọi lúc.",
    price: 699000,
    originalPrice: 899000,
    rating: "4.8",
    sales: "447",
    color: "from-cyan-400 via-blue-700 to-zinc-950",
    icon: "shield",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
];
