export type PaymentProduct = {
  id: string;
  name: string;
  slug: string;
  type: string;
  price: number;
  originalPrice?: number;
  transferContent?: string;
  coverImage?: string;
};

export const paymentConfig = {
  accountNumber: "0865103062",
  bankName: "NH Quốc Tế VIB",
  accountHolder: "NGUYỄN ĐỨC TRUNG",
  qrImage: "/images/video-ai-course-payment-qr.png",
  zaloUrl: "https://zalo.me/0869823437",
  zaloLabel: "Zalo hỗ trợ: 0869823437",
} as const;

export const videoAiCoursePaymentProduct: PaymentProduct = {
  id: "khoa-hoc-video-ai-thuc-chien",
  name: "Khóa học Video AI Thực Chiến",
  slug: "video-ai-course",
  type: "Khóa học Video AI",
  price: 149000,
  originalPrice: 899000,
  transferContent: "HOC VIDEO AI",
};

export function formatPaymentPrice(price: number) {
  return new Intl.NumberFormat("vi-VN").format(price) + "đ";
}

export function getTransferContent(product: PaymentProduct) {
  if (product.transferContent?.trim()) return product.transferContent.trim();

  return product.name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}
