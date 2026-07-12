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
  isFree: boolean;
  appUrl?: string;
  hidePrice?: boolean;
  features?: string[];
  suitableFor?: string[];
  ctaTitle?: string;
  ctaDescription?: string;
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
    coverImage: "/images/workflows/photo-app-thay-do-cho-mau-cover.png",
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
    id: "video-ai-affiliate-starter",
    name: "Workflow Video AI Affiliate Starter",
    slug: "video-ai-affiliate-starter",
    shortDescription: "Quy trình miễn phí để biến một ý tưởng sản phẩm thành video ngắn có thể gắn Affiliate.",
    fullDescription: "Workflow này giúp người mới bắt đầu triển khai một video Affiliate đơn giản: chọn sản phẩm, tạo dàn ý, xây prompt hình ảnh và hoàn thiện video ngắn.\n\nBạn có thể dùng lại quy trình này cho nhiều sản phẩm khác nhau mà không cần bắt đầu lại từ đầu.",
    coverImage: "/images/ai-dancing-cover.png",
    category: "Video AI",
    badge: "FREE",
    price: 0,
    isFree: true,
    tools: ["ChatGPT", "AI Dancing", "CapCut"],
    steps: ["Chọn sản phẩm và nỗi đau khách hàng", "Viết hook, kịch bản ngắn và CTA", "Tạo hình ảnh hoặc nhân vật AI", "Dựng video dọc và gắn link Affiliate"],
    tags: ["Affiliate", "Video AI", "Người mới"],
    seoTitle: "Workflow Video AI Affiliate Starter | Trung AI Media",
    seoDescription: "Workflow miễn phí giúp người mới tạo video AI để bắt đầu làm Affiliate.",
    isFeatured: true,
    isActive: true,
    displayOrder: 2,
    createdAt: "2026-07-11T00:00:00.000Z",
  },
  {
    id: "product-review-ai",
    name: "Workflow Review Sản Phẩm AI",
    slug: "workflow-review-san-pham-ai",
    shortDescription: "Tạo video review sản phẩm không lộ mặt với kịch bản, hình minh họa và giọng nói AI.",
    fullDescription: "Đây là quy trình dành cho người bán hàng hoặc Affiliate muốn làm review nhanh mà không cần chuẩn bị thiết bị quay phức tạp.\n\nTừng bước được sắp xếp theo đúng thứ tự từ insight sản phẩm đến bản video sẵn sàng đăng TikTok, Reels hoặc Shorts.",
    coverImage: "/images/ai-dancing-cover.png",
    category: "Bán hàng",
    badge: "Bán chạy",
    price: 249000,
    originalPrice: 349000,
    isFree: false,
    tools: ["ChatGPT", "GPT Image", "Veo", "CapCut"],
    steps: ["Thu thập lợi ích và phản hồi sản phẩm", "Tạo kịch bản review theo cấu trúc Hook – Pain – Solution – CTA", "Tạo cảnh minh họa và giọng đọc AI", "Dựng video, thêm phụ đề và xuất bản"],
    tags: ["Review", "KOC AI", "TikTok"],
    seoTitle: "Workflow Review Sản Phẩm AI | Trung AI Media",
    seoDescription: "Quy trình tạo video review sản phẩm bằng AI, phù hợp bán hàng và Affiliate.",
    isFeatured: true,
    isActive: true,
    displayOrder: 3,
    createdAt: "2026-07-10T00:00:00.000Z",
  },
  {
    id: "faceless-short-channel",
    name: "Workflow Xây Kênh Video Không Lộ Mặt",
    slug: "workflow-xay-kenh-video-khong-lo-mat",
    shortDescription: "Xây nội dung video ngắn đều đặn cho các chủ đề kiến thức, sách, triết lý và kể chuyện.",
    fullDescription: "Workflow hỗ trợ bạn xây series video không lộ mặt theo chủ đề rõ ràng, từ việc chọn ngách đến cách tổ chức một lịch nội dung có thể tái sử dụng.\n\nPhù hợp cho người muốn làm kênh TikTok, YouTube Shorts hoặc Facebook Reels bằng một quy trình nhẹ, dễ lặp lại.",
    coverImage: "/images/ai-dancing-cover.png",
    category: "Xây kênh",
    badge: "Mới",
    price: 299000,
    originalPrice: 399000,
    isFree: false,
    tools: ["ChatGPT", "ElevenLabs", "Veo", "CapCut"],
    steps: ["Chọn chủ đề và định vị kênh", "Lập 30 ý tưởng video theo nhóm nội dung", "Tạo kịch bản kể chuyện và voice AI", "Dựng mẫu video, đăng bài và theo dõi hiệu quả"],
    tags: ["Faceless", "YouTube Shorts", "TikTok"],
    seoTitle: "Workflow Xây Kênh Video Không Lộ Mặt | Trung AI Media",
    seoDescription: "Quy trình xây kênh video AI không lộ mặt dành cho người mới.",
    isFeatured: true,
    isActive: true,
    displayOrder: 4,
    createdAt: "2026-07-09T00:00:00.000Z",
  },
  {
    id: "fashion-lookbook-ai",
    name: "Workflow Lookbook Thời Trang AI",
    slug: "workflow-lookbook-thoi-trang-ai",
    shortDescription: "Từ ảnh sản phẩm đến lookbook và video thời trang AI dùng cho quảng cáo và mạng xã hội.",
    fullDescription: "Workflow này gom các bước cần thiết để tạo bộ nội dung thời trang đồng bộ: chọn concept, tạo người mẫu AI, tạo ảnh lookbook và dựng video ngắn.\n\nBạn có thể thay đổi sản phẩm, màu sắc và phong cách mà vẫn giữ được bố cục quy trình nhất quán.",
    coverImage: "/images/ai-dancing-cover.png",
    category: "Thời trang",
    badge: "Pro",
    price: 349000,
    originalPrice: 499000,
    isFree: false,
    tools: ["GPT Image", "Midjourney", "AI Dancing", "CapCut"],
    steps: ["Chọn sản phẩm, khách hàng và phong cách hình ảnh", "Tạo prompt người mẫu, bối cảnh và outfit", "Tạo lookbook ảnh đồng bộ", "Chuyển ảnh thành video quảng cáo ngắn"],
    tags: ["Fashion AI", "Lookbook", "Quảng cáo"],
    seoTitle: "Workflow Lookbook Thời Trang AI | Trung AI Media",
    seoDescription: "Quy trình tạo ảnh lookbook và video thời trang bằng AI.",
    isFeatured: false,
    isActive: true,
    displayOrder: 5,
    createdAt: "2026-07-08T00:00:00.000Z",
  },
];
