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
    displayOrder: 1,
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
    displayOrder: 2,
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
    displayOrder: 3,
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
    displayOrder: 4,
    createdAt: "2026-07-08T00:00:00.000Z",
  },
];
