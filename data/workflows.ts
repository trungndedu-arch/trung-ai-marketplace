export type Workflow = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  coverImage: string;
  category: string;
  badge: string;
  price: number;
  originalPrice?: number;
  transferContent?: string;
  isFree: boolean;
  appUrl?: string;
  purchaseUrl?: string;
  license?: string;
  hidePrice?: boolean;
  features?: string[];
  suitableFor?: string[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaLabel?: string;
  tools: string[];
  steps: string[];
  demoVideoUrl?: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
};

export const workflows: Workflow[] = [
  {
    id: "photo-app-thay-do-cho-mau",
    name: "Photo App Thay Đồ Cho Mẫu",
    slug: "photo-app-thay-do-cho-mau",
    shortDescription: "Ứng dụng AI giúp thay đổi trang phục cho người mẫu từ ảnh có sẵn, giữ nguyên khuôn mặt và tạo ảnh thời trang chuyên nghiệp chỉ với vài thao tác.",
    fullDescription: "Photo App Thay Đồ Cho Mẫu là ứng dụng AI giúp người dùng thay đổi trang phục cho người mẫu bằng cách tải ảnh người mẫu và ảnh sản phẩm lên hệ thống.\n\nAI sẽ tự động thay trang phục, đồng thời cố gắng giữ nguyên khuôn mặt, dáng người, tư thế và bối cảnh ban đầu.\n\nỨng dụng đặc biệt phù hợp với người làm Affiliate thời trang, chủ shop, Content Creator, Freelancer và người bán hàng online muốn tạo ảnh mẫu mặc sản phẩm mà không cần chụp hình mới.",
    coverImage: "/images/workflows/photo-app-thay-do-cho-mau-cover-20260725.png",
    category: "Thời Trang AI",
    badge: "FREE",
    price: 0,
    isFree: true,
    appUrl: "https://labs.google/fx/tools/flow/shared/tool/b87d1207-3fcd-4d71-b12c-836db4044e69",
    hidePrice: true,
    features: [
      "Thay trang phục bằng AI",
      "Giữ khuôn mặt người mẫu",
      "Giữ dáng người và bối cảnh",
      "Hỗ trợ nhiều loại quần áo",
      "Tạo ảnh lookbook và quảng cáo",
      "Phù hợp TikTok Shop và Shopee",
      "Xuất ảnh chất lượng cao",
    ],
    suitableFor: [
      "Affiliate thời trang",
      "Chủ shop quần áo",
      "Người bán hàng online",
      "Content Creator",
      "Freelancer",
      "Marketer",
      "Người mới học AI",
    ],
    ctaTitle: "Bắt đầu sử dụng miễn phí",
    ctaDescription: "Truy cập Photo App Thay Đồ Cho Mẫu để tạo ảnh người mẫu mặc trang phục bằng AI chỉ với vài thao tác.",
    tools: ["Google Flow", "Ảnh người mẫu", "Ảnh trang phục"],
    steps: ["Tải ảnh người mẫu.", "Tải ảnh trang phục.", "Nhấn tạo ảnh.", "Đợi AI xử lý.", "Tải kết quả về."],
    tags: ["Thời Trang AI", "Thay đồ AI", "Lookbook", "Affiliate"],
    seoTitle: "Photo App Thay Đồ Cho Mẫu | Trung AI Media",
    seoDescription: "Ứng dụng AI miễn phí giúp thay đổi trang phục cho người mẫu và tạo ảnh lookbook chuyên nghiệp.",
    isFeatured: true,
    isActive: true,
    displayOrder: 1,
    createdAt: "2026-07-12T00:00:00.000Z",
  },
  {
    id: "app-lam-net-anh",
    name: "App Làm Nét Ảnh",
    slug: "app-lam-net-anh",
    shortDescription: "Ứng dụng AI giúp làm nét ảnh bị mờ, khôi phục chi tiết và tăng chất lượng hình ảnh mà vẫn giữ nguyên khuôn mặt, bố cục và màu sắc tự nhiên.",
    fullDescription: "App Làm Nét Ảnh sử dụng công nghệ AI để khôi phục những bức ảnh bị mờ, thiếu nét hoặc có chất lượng thấp.\n\nHệ thống tự động tăng độ sắc nét, cải thiện chi tiết và chất lượng tổng thể nhưng vẫn cố gắng giữ nguyên khuôn mặt, màu da, bố cục và phong cách ban đầu.\n\nỨng dụng phù hợp để nâng cấp ảnh chân dung, ảnh sản phẩm, ảnh thời trang, ảnh quảng cáo, ảnh cũ hoặc hình ảnh dùng cho mạng xã hội.",
    coverImage: "/images/workflows/app-lam-net-anh-cover-20260725.png",
    category: "AI Hình Ảnh",
    badge: "HOT",
    price: 49000,
    originalPrice: 159000,
    transferContent: "APP LAM NET ANH",
    isFree: false,
    appUrl: "",
    purchaseUrl: "",
    license: "Mua một lần • Sử dụng vĩnh viễn",
    features: [
      "Làm nét ảnh bằng AI",
      "Khôi phục chi tiết ảnh",
      "Tăng độ phân giải",
      "Giữ nguyên khuôn mặt",
      "Giữ nguyên bố cục",
      "Giữ màu sắc tự nhiên",
      "Hạn chế biến dạng khuôn mặt",
      "Xuất ảnh chất lượng cao",
      "Phù hợp ảnh thời trang",
      "Phù hợp ảnh sản phẩm",
      "Phù hợp ảnh quảng cáo",
      "Xử lý nhanh chỉ với vài thao tác",
    ],
    suitableFor: ["Người bán hàng Online", "Chủ Shop", "Affiliate Marketing", "Content Creator", "Freelancer", "Designer", "Marketer", "Người mới sử dụng AI"],
    ctaTitle: "Nâng cấp chất lượng ảnh chỉ với vài thao tác",
    ctaDescription: "Sử dụng App Làm Nét Ảnh để khôi phục ảnh mờ, tăng độ sắc nét và tạo hình ảnh chất lượng cao bằng AI.",
    ctaLabel: "Mua ngay",
    tools: ["AI Image Enhancement", "AI Super Resolution", "AI Detail Recovery"],
    steps: ["Tải ảnh cần làm nét.", "Chọn chế độ nâng cao chất lượng.", "Nhấn xử lý.", "Đợi AI hoàn thành.", "Tải ảnh chất lượng cao về máy."],
    tags: ["Làm nét ảnh", "Khôi phục ảnh", "AI Hình Ảnh", "Ảnh sản phẩm"],
    seoTitle: "App Làm Nét Ảnh | Trung AI Media",
    seoDescription: "Ứng dụng AI làm nét ảnh, khôi phục chi tiết và nâng cao chất lượng hình ảnh nhanh chóng.",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-12T00:00:00.000Z",
  },
];
