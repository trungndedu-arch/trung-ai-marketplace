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

export const chatbots: Chatbot[] = [];
