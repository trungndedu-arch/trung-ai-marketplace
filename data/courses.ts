export type Course = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  coverImage: string;
  category: string;
  badge: string;
  status: string;
  price?: string;
  originalPrice?: string;
  landingPageUrl?: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
};

export const courses: Course[] = [
  {
    id: "xay-kenh-affiliate-kiem-tien-bang-video-ai",
    name: "Xây Kênh Affiliate Kiếm Tiền Bằng Video AI",
    slug: "xay-kenh-affiliate-kiem-tien-bang-video-ai",
    shortDescription:
      "Khóa học hướng dẫn người mới xây kênh nội dung, sản xuất video bằng AI và triển khai Affiliate theo một lộ trình thực chiến từ con số 0.",
    coverImage: "/images/courses/xay-kenh-affiliate-video-ai-cover.png",
    category: "Khóa Học Video AI",
    badge: "Nổi bật",
    status: "Đang mở đăng ký",
    price: "149.000đ",
    originalPrice: "899.000đ",
    landingPageUrl: "/video-ai-course",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
  },
  {
    id: "co-may-in-tien-xay-landing-page-bang-ai",
    name: "Cỗ Máy In Tiền: Xây Landing Page Bằng AI Cho Người Mới",
    slug: "co-may-in-tien-xay-landing-page-bang-ai",
    shortDescription:
      "Khóa học dành cho người mới, hướng dẫn sử dụng AI để lên ý tưởng, viết nội dung, thiết kế và xây dựng Landing Page bán hàng mà không cần giỏi lập trình.",
    coverImage: "/images/courses/co-may-in-tien-landing-page-ai-cover.png",
    category: "Khóa Học AI",
    badge: "Sắp ra mắt",
    status: "Sắp ra mắt",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
  },
];

export const featuredCourses = courses
  .filter((course) => course.isActive && course.isFeatured)
  .sort((a, b) => a.displayOrder - b.displayOrder);
