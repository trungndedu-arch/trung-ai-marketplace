-- This seed mirrors the current local catalog only. The application continues
-- to read its local data files until the catalog-read migration phase.

insert into public.categories (slug, name, product_type, display_order)
values
  ('ai-app', 'AI App', 'ai_app', 1),
  ('chatbot', 'Chatbot', 'chatbot', 2),
  ('kich-ban-video', 'Kịch bản video', 'chatbot', 3),
  ('lap-ke-hoach-noi-dung', 'Lập kế hoạch nội dung', 'chatbot', 4),
  ('hook-viral', 'Hook viral', 'chatbot', 5),
  ('thoi-trang-ai', 'Thời Trang AI', 'ai_app', 6),
  ('ai-hinh-anh', 'AI Hình Ảnh', 'ai_app', 7),
  ('ai-video', 'AI Video', 'ai_tool', 8),
  ('khoa-hoc-video-ai', 'Khóa Học Video AI', 'course', 9),
  ('khoa-hoc-ai', 'Khóa Học AI', 'course', 10)
on conflict (slug) do update
set
  name = excluded.name,
  product_type = excluded.product_type,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, seo_title, seo_description, price, original_price,
  access_type, sales_status, publication_status, sellable, affiliate_url,
  external_url, detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'app-lam-video-triet-ly-co-nhan', c.id, 'app-lam-video-triet-ly-co-nhan',
  'ai_app', 'App Làm Video Triết Lý Cổ Nhân',
  'Tạo video triết lý cổ nhân với hình ảnh 3D, giọng đọc AI truyền cảm và nội dung giàu chiều sâu.',
  'App Làm Video Triết Lý Cổ Nhân đang được phát triển để hỗ trợ tạo video triết lý cổ nhân với hình ảnh 3D, giọng đọc AI truyền cảm và nội dung giàu chiều sâu. Tính năng chi tiết sẽ được cập nhật trong thời gian tới.',
  null, null, 0, null, 'paid', 'coming_soon', 'published', true, null, null,
  '/workflow/chatbot/app-lam-video-triet-ly-co-nhan', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-amber-950 via-yellow-800 to-orange-500', 'icon', 'bot',
    'cover_aspect', 'portrait'
  ), true, -4
from public.categories c where c.slug = 'ai-app'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, price = excluded.price,
  original_price = excluded.original_price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, affiliate_url = excluded.affiliate_url,
  external_url = excluded.external_url, detail_url = excluded.detail_url, badge = excluded.badge, tags = excluded.tags,
  metadata = excluded.metadata, is_featured = excluded.is_featured, display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'chatbot-lam-video-hoat-hinh-3d-do-an-ca-nhan-hoa', c.id,
  'chatbot-lam-video-hoat-hinh-3d-do-an-ca-nhan-hoa', 'chatbot',
  'Chatbot Làm Video Hoạt Hình 3D Đồ Ăn Cá Nhân Hóa',
  'Tạo video hoạt hình 3D sinh động từ các món ăn, nhân vật hóa nội dung theo sản phẩm và thương hiệu.',
  'Chatbot Làm Video Hoạt Hình 3D Đồ Ăn Cá Nhân Hóa đang được phát triển để hỗ trợ tạo video hoạt hình 3D sinh động từ các món ăn, nhân vật hóa nội dung theo sản phẩm và thương hiệu. Tính năng chi tiết sẽ được cập nhật trong thời gian tới.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/chatbot-lam-video-hoat-hinh-3d-do-an-ca-nhan-hoa', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-slate-950 via-blue-900 to-amber-400', 'icon', 'bot',
    'cover_aspect', 'portrait'
  ), true, -3
from public.categories c where c.slug = 'chatbot'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'ai-app-lam-video-thoi-trang-mau-nu-ngoi-tren-o-to', c.id,
  'ai-app-lam-video-thoi-trang-mau-nu-ngoi-tren-o-to', 'ai_app',
  'AI App Làm Video Thời Trang – Mẫu Nữ Ngồi Trên Ô Tô',
  'Tạo video thời trang AI với mẫu nữ trên ô tô, giữ phong cách chân thực, sang trọng và phù hợp quảng cáo.',
  'AI App Làm Video Thời Trang – Mẫu Nữ Ngồi Trên Ô Tô đang được phát triển để hỗ trợ tạo video thời trang AI với mẫu nữ trên ô tô, giữ phong cách chân thực, sang trọng và phù hợp quảng cáo. Tính năng chi tiết sẽ được cập nhật trong thời gian tới.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/ai-app-lam-video-thoi-trang-mau-nu-ngoi-tren-o-to', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-purple-950 via-fuchsia-800 to-orange-400', 'icon', 'bot',
    'cover_aspect', 'portrait'
  ), true, -2
from public.categories c where c.slug = 'ai-app'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'ai-app-lam-video-thoi-trang-mau-nu-truoc-guong', c.id,
  'ai-app-lam-video-thoi-trang-mau-nu-truoc-guong', 'ai_app',
  'AI App Làm Video Thời Trang – Mẫu Nữ Trước Gương',
  'Tạo video thời trang AI với mẫu nữ trước gương, hình ảnh tự nhiên, hiện đại và phù hợp nội dung bán hàng.',
  'AI App Làm Video Thời Trang – Mẫu Nữ Trước Gương đang được phát triển để hỗ trợ tạo video thời trang AI với mẫu nữ trước gương, hình ảnh tự nhiên, hiện đại và phù hợp nội dung bán hàng. Tính năng chi tiết sẽ được cập nhật trong thời gian tới.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/ai-app-lam-video-thoi-trang-mau-nu-truoc-guong', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-rose-950 via-pink-700 to-orange-300', 'icon', 'bot',
    'cover_aspect', 'portrait'
  ), true, -1
from public.categories c where c.slug = 'ai-app'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'chatbot-kich-ban-viral', c.id, 'chatbot-ai-viet-kich-ban-viral', 'chatbot',
  'Chatbot AI Viết Kịch Bản Viral',
  'Chatbot hỗ trợ lên ý tưởng, viết hook, kịch bản video ngắn và CTA theo phong cách dễ viral.',
  'Chatbot AI Viết Kịch Bản Viral đang được Trung AI Media phát triển để hỗ trợ người làm nội dung tạo ý tưởng, hook, kịch bản video ngắn và lời kêu gọi hành động nhanh hơn. Tính năng sẽ được cập nhật trong thời gian tới.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/chatbot-ai-viet-kich-ban-viral', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-blue-900 via-sky-700 to-cyan-500', 'icon', 'bot'
  ), true, 1
from public.categories c where c.slug = 'kich-ban-video'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'chatbot-sang-tao-kich-ban-viral', c.id, 'chatbot-ai-sang-tao-kich-ban-viral', 'chatbot',
  'Chatbot AI Sáng Tạo Kịch Bản Viral',
  'Trợ lý AI giúp biến ý tưởng thô thành kịch bản cuốn hút cho TikTok, Reels và YouTube Shorts.',
  'Chatbot AI Sáng Tạo Kịch Bản Viral đang trong giai đoạn chuẩn bị. Công cụ hướng tới việc giúp creator, chủ shop và người làm affiliate tạo kịch bản video ngắn có cấu trúc rõ ràng, hấp dẫn và dễ triển khai.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/chatbot-ai-sang-tao-kich-ban-viral', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-sky-100 via-cyan-400 to-blue-600', 'icon', 'bot'
  ), true, 2
from public.categories c where c.slug = 'kich-ban-video'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'chatbot-content-planner-365', c.id, 'chatbot-content-planner-ai-365-ngay', 'chatbot',
  'Chatbot Content Planner AI 365 Ngày',
  'Chatbot lập kế hoạch nội dung dài hạn, gợi ý lịch đăng bài và ý tưởng video đều đặn.',
  'Chatbot Content Planner AI 365 Ngày đang được xây dựng để hỗ trợ lên kế hoạch nội dung liên tục cho các kênh TikTok, Facebook, Reels, YouTube Shorts và blog. Mục tiêu là giúp người mới có lộ trình đăng bài rõ ràng hơn.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/chatbot-content-planner-ai-365-ngay', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-emerald-900 via-sky-700 to-cyan-500', 'icon', 'bot'
  ), true, 3
from public.categories c where c.slug = 'lap-ke-hoach-noi-dung'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'chatbot-tiktok-hook-generator', c.id, 'chatbot-tiktok-hook-generator', 'chatbot',
  'Chatbot TikTok Hook Generator',
  'Công cụ gợi ý hook mở đầu video, tiêu đề và góc nội dung giúp tăng tỷ lệ giữ chân người xem.',
  'Chatbot TikTok Hook Generator đang được chuẩn bị để giúp người làm nội dung tạo hook mở đầu, tiêu đề, góc kể chuyện và ý tưởng giữ chân người xem cho video ngắn. Thông tin chi tiết sẽ được cập nhật sau.',
  0, 'paid', 'coming_soon', 'published', true,
  '/workflow/chatbot/chatbot-tiktok-hook-generator', 'Sắp ra mắt', '{}',
  jsonb_build_object(
    'creator', 'Trung AI Media', 'rating', 'Coming soon', 'sales_label', 'Sắp ra mắt',
    'color', 'from-slate-950 via-blue-900 to-cyan-600', 'icon', 'bot'
  ), true, 4
from public.categories c where c.slug = 'hook-viral'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  price = excluded.price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, seo_title, seo_description, price, original_price, access_type,
  sales_status, publication_status, sellable, external_url, detail_url, badge, tags,
  metadata, is_featured, display_order, created_at
)
select
  'photo-app-thay-do-cho-mau', c.id, 'photo-app-thay-do-cho-mau', 'ai_app',
  'Photo App Thay Đồ Cho Mẫu',
  'Ứng dụng AI giúp thay đổi trang phục cho người mẫu từ ảnh có sẵn, giữ nguyên khuôn mặt và tạo ảnh thời trang chuyên nghiệp chỉ với vài thao tác.',
  $$Photo App Thay Đồ Cho Mẫu là ứng dụng AI giúp người dùng thay đổi trang phục cho người mẫu bằng cách tải ảnh người mẫu và ảnh sản phẩm lên hệ thống.

AI sẽ tự động thay trang phục, đồng thời cố gắng giữ nguyên khuôn mặt, dáng người, tư thế và bối cảnh ban đầu.

Ứng dụng đặc biệt phù hợp với người làm Affiliate thời trang, chủ shop, Content Creator, Freelancer và người bán hàng online muốn tạo ảnh mẫu mặc sản phẩm mà không cần chụp hình mới.$$, 
  'Photo App Thay Đồ Cho Mẫu | Trung AI Media',
  'Ứng dụng AI miễn phí giúp thay đổi trang phục cho người mẫu và tạo ảnh lookbook chuyên nghiệp.',
  null, null, 'free', 'on_sale', 'published', false,
  'https://labs.google/fx/tools/flow/shared/tool/b87d1207-3fcd-4d71-b12c-836db4044e69',
  '/workflow/photo-app-thay-do-cho-mau', 'FREE',
  array['Thời Trang AI', 'Thay Đồ AI', 'Lookbook', 'Affiliate'],
  jsonb_build_object(
    'hide_price', true,
    'features', jsonb_build_array('Thay trang phục bằng AI', 'Giữ khuôn mặt người mẫu', 'Giữ dáng người và bối cảnh', 'Hỗ trợ nhiều loại quần áo', 'Tạo ảnh lookbook và quảng cáo', 'Phù hợp TikTok Shop và Shopee', 'Xuất ảnh chất lượng cao'),
    'suitable_for', jsonb_build_array('Affiliate thời trang', 'Chủ shop quần áo', 'Người bán hàng online', 'Content Creator', 'Freelancer', 'Marketer', 'Người mới học AI'),
    'cta_title', 'Bắt đầu sử dụng miễn phí',
    'cta_description', 'Truy cập Photo App Thay Đồ Cho Mẫu để tạo ảnh người mẫu mặc trang phục bằng AI chỉ với vài thao tác.',
    'tools', jsonb_build_array('Google Flow', 'Ảnh người mẫu', 'Ảnh trang phục'),
    'steps', jsonb_build_array('Tải ảnh người mẫu.', 'Tải ảnh trang phục.', 'Nhấn tạo ảnh.', 'Đợi AI xử lý.', 'Tải kết quả về.'),
    'source_created_at', '2026-07-12T00:00:00.000Z'
  ), true, 1, '2026-07-12T00:00:00.000Z'
from public.categories c where c.slug = 'thoi-trang-ai'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, price = excluded.price,
  original_price = excluded.original_price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, external_url = excluded.external_url,
  detail_url = excluded.detail_url, badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata,
  is_featured = excluded.is_featured, display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, seo_title, seo_description, price, original_price, access_type,
  sales_status, publication_status, sellable, detail_url, badge, tags, metadata,
  is_featured, display_order, created_at
)
select
  'app-lam-net-anh', c.id, 'app-lam-net-anh', 'ai_app', 'App Làm Nét Ảnh',
  'Ứng dụng AI giúp làm nét ảnh bị mờ, khôi phục chi tiết và tăng chất lượng hình ảnh mà vẫn giữ nguyên khuôn mặt, bố cục và màu sắc tự nhiên.',
  $$App Làm Nét Ảnh sử dụng công nghệ AI để khôi phục những bức ảnh bị mờ, thiếu nét hoặc có chất lượng thấp.

Hệ thống tự động tăng độ sắc nét, cải thiện chi tiết và chất lượng tổng thể nhưng vẫn cố gắng giữ nguyên khuôn mặt, màu da, bố cục và phong cách ban đầu.

Ứng dụng phù hợp để nâng cấp ảnh chân dung, ảnh sản phẩm, ảnh thời trang, ảnh quảng cáo, ảnh cũ hoặc hình ảnh dùng cho mạng xã hội.$$, 
  'App Làm Nét Ảnh | Trung AI Media',
  'Ứng dụng AI làm nét ảnh, khôi phục chi tiết và nâng cao chất lượng hình ảnh nhanh chóng.',
  49000, 159000, 'paid', 'on_sale', 'published', true,
  '/workflow/app-lam-net-anh', 'HOT',
  array['Làm nét ảnh', 'Khôi phục ảnh', 'AI Hình Ảnh', 'Ảnh sản phẩm'],
  jsonb_build_object(
    'transfer_content', 'APP LAM NET ANH',
    'license', 'Mua một lần • Sử dụng vĩnh viễn',
    'features', jsonb_build_array('Làm nét ảnh bằng AI', 'Khôi phục chi tiết ảnh', 'Tăng độ phân giải', 'Giữ nguyên khuôn mặt', 'Giữ nguyên bố cục', 'Giữ màu sắc tự nhiên', 'Hạn chế biến dạng khuôn mặt', 'Xuất ảnh chất lượng cao', 'Phù hợp ảnh thời trang', 'Phù hợp ảnh sản phẩm', 'Phù hợp ảnh quảng cáo', 'Xử lý nhanh chỉ với vài thao tác'),
    'suitable_for', jsonb_build_array('Người bán hàng Online', 'Chủ Shop', 'Affiliate Marketing', 'Content Creator', 'Freelancer', 'Designer', 'Marketer', 'Người mới sử dụng AI'),
    'cta_title', 'Nâng cấp chất lượng ảnh chỉ với vài thao tác',
    'cta_description', 'Sử dụng App Làm Nét Ảnh để khôi phục ảnh mờ, tăng độ sắc nét và tạo hình ảnh chất lượng cao bằng AI.',
    'cta_label', 'Mua ngay',
    'tools', jsonb_build_array('AI Image Enhancement', 'AI Super Resolution', 'AI Detail Recovery'),
    'steps', jsonb_build_array('Tải ảnh cần làm nét.', 'Chọn chế độ nâng cao chất lượng.', 'Nhấn xử lý.', 'Đợi AI hoàn thành.', 'Tải ảnh chất lượng cao về máy.'),
    'source_created_at', '2026-07-12T00:00:00.000Z'
  ), true, 2, '2026-07-12T00:00:00.000Z'
from public.categories c where c.slug = 'ai-hinh-anh'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, price = excluded.price,
  original_price = excluded.original_price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  full_description, seo_title, seo_description, access_type, sales_status, publication_status,
  sellable, affiliate_url, detail_url, badge, tags, metadata, is_featured, display_order, created_at
)
select
  'ai-dancing', c.id, 'ai-dancing', 'ai_tool', 'AI Dancing',
  'AI Dancing là kho công cụ AI tất cả trong một giúp tạo video quảng cáo, review sản phẩm, thời trang, AI KOL và nội dung mạng xã hội nhanh chóng chỉ với vài thao tác.',
  $$AI Dancing là nền tảng tích hợp nhiều tính năng tạo video bằng trí tuệ nhân tạo trong cùng một hệ thống. Công cụ hỗ trợ người dùng tạo video quảng cáo, video review sản phẩm, video thời trang, nhân vật AI KOL, video nhảy theo nhạc và nội dung ngắn dành cho mạng xã hội.

AI Dancing phù hợp với cả người mới chưa có kinh nghiệm dựng video và những người đang làm sáng tạo nội dung, Affiliate, bán hàng online, marketing hoặc cung cấp dịch vụ video AI.

Nền tảng giúp rút ngắn quy trình từ ý tưởng đến video hoàn chỉnh, giảm thời gian chỉnh sửa thủ công và hỗ trợ người dùng tạo nội dung cho TikTok, Facebook Reels, YouTube Shorts và các chiến dịch quảng cáo sản phẩm.$$, 
  'AI Dancing – Công cụ tạo video AI tất cả trong một',
  'Khám phá AI Dancing, nền tảng tạo video quảng cáo, review sản phẩm, thời trang, AI KOL và nội dung mạng xã hội bằng AI nhanh chóng.',
  'free', 'on_sale', 'published', false,
  'https://aidancing.net?ref=aidancing37892', '/cong-cu-ai/ai-dancing', 'Đề xuất',
  array['AI Dancing', 'AI Video', 'Video AI', 'AI KOL', 'Video quảng cáo', 'Review sản phẩm', 'Thời trang AI', 'TikTok', 'Reels', 'Affiliate', 'Content Creator', 'Marketing'],
  jsonb_build_object(
    'tool_type', 'Freemium',
    'logo', '', 'official_website', '', 'tutorial_url', '', 'demo_video_url', '',
    'features', jsonb_build_array('Tạo video quảng cáo bằng AI', 'Tạo video review sản phẩm', 'Tạo video thời trang AI', 'Tạo nhân vật AI KOL', 'Tạo video nhảy theo nhạc trend', 'Tạo video từ ảnh', 'Tạo nội dung TikTok và Reels', 'Hỗ trợ nhiều phong cách nội dung', 'Quy trình đơn giản, phù hợp với người mới', 'Tích hợp nhiều công cụ AI trong cùng một nền tảng'),
    'target_users', jsonb_build_array('Content Creator', 'Người làm Affiliate', 'Chủ shop online', 'Marketer', 'Freelancer', 'Doanh nghiệp nhỏ', 'Người bán hàng trên TikTok', 'Người mới học làm video AI'),
    'use_cases', jsonb_build_array('Video quảng cáo sản phẩm', 'Video review sản phẩm', 'Video thời trang', 'Video AI KOL', 'Video nhảy nhạc trend', 'Video TikTok', 'Facebook Reels', 'YouTube Shorts', 'Video bán hàng', 'Nội dung mạng xã hội'),
    'benefits', jsonb_build_array('Nhiều tính năng trong một nền tảng', 'Không yêu cầu kỹ năng dựng video chuyên sâu', 'Tiết kiệm thời gian sản xuất nội dung', 'Dễ sử dụng với người mới', 'Phù hợp với nhiều ngành hàng', 'Hỗ trợ tạo nội dung đều đặn', 'Có thể dùng cho sáng tạo nội dung và kinh doanh'),
    'gallery_images', jsonb_build_array(),
    'source_created_at', '2026-07-11T00:00:00.000Z'
  ), true, 1, '2026-07-11T00:00:00.000Z'
from public.categories c where c.slug = 'ai-video'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, full_description = excluded.full_description,
  seo_title = excluded.seo_title, seo_description = excluded.seo_description, access_type = excluded.access_type,
  sales_status = excluded.sales_status, publication_status = excluded.publication_status, sellable = excluded.sellable,
  affiliate_url = excluded.affiliate_url, detail_url = excluded.detail_url, badge = excluded.badge, tags = excluded.tags,
  metadata = excluded.metadata, is_featured = excluded.is_featured, display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  price, original_price, access_type, sales_status, publication_status, sellable,
  detail_url, badge, tags, metadata, is_featured, display_order
)
select
  'xay-kenh-affiliate-kiem-tien-bang-video-ai', c.id,
  'xay-kenh-affiliate-kiem-tien-bang-video-ai', 'course',
  'Xây Kênh Affiliate Kiếm Tiền Bằng Video AI',
  'Khóa học hướng dẫn người mới xây kênh nội dung, sản xuất video bằng AI và triển khai Affiliate theo một lộ trình thực chiến từ con số 0.',
  149000, 899000, 'paid', 'on_sale', 'published', false,
  '/video-ai-course', 'Nổi bật', '{}',
  jsonb_build_object('status_label', 'Đang mở đăng ký'), true, 1
from public.categories c where c.slug = 'khoa-hoc-video-ai'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, price = excluded.price,
  original_price = excluded.original_price, access_type = excluded.access_type, sales_status = excluded.sales_status,
  publication_status = excluded.publication_status, sellable = excluded.sellable, detail_url = excluded.detail_url,
  badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata, is_featured = excluded.is_featured,
  display_order = excluded.display_order;

insert into public.products (
  legacy_id, category_id, slug, product_type, title, short_description,
  access_type, sales_status, publication_status, sellable, detail_url, badge,
  tags, metadata, is_featured, display_order
)
select
  'co-may-in-tien-xay-landing-page-bang-ai', c.id,
  'co-may-in-tien-xay-landing-page-bang-ai', 'course',
  'Cỗ Máy In Tiền: Xây Landing Page Bằng AI Cho Người Mới',
  'Khóa học dành cho người mới, hướng dẫn sử dụng AI để lên ý tưởng, viết nội dung, thiết kế và xây dựng Landing Page bán hàng mà không cần giỏi lập trình.',
  'paid', 'coming_soon', 'published', false, null, 'Sắp ra mắt', '{}',
  jsonb_build_object('status_label', 'Sắp ra mắt'), true, 2
from public.categories c where c.slug = 'khoa-hoc-ai'
on conflict (slug) do update set
  legacy_id = excluded.legacy_id, category_id = excluded.category_id, product_type = excluded.product_type,
  title = excluded.title, short_description = excluded.short_description, access_type = excluded.access_type,
  sales_status = excluded.sales_status, publication_status = excluded.publication_status, sellable = excluded.sellable,
  detail_url = excluded.detail_url, badge = excluded.badge, tags = excluded.tags, metadata = excluded.metadata,
  is_featured = excluded.is_featured, display_order = excluded.display_order;

insert into public.product_images (
  product_id, image_type, public_url, alt_text, aspect_ratio, is_primary, sort_order
)
select p.id, 'cover', v.public_url, 'Ảnh bìa ' || p.title, '9:16', true, 0
from (
  values
    ('app-lam-video-triet-ly-co-nhan', '/images/chatbots/app-lam-video-triet-ly-co-nhan.png'),
    ('chatbot-lam-video-hoat-hinh-3d-do-an-ca-nhan-hoa', '/images/chatbots/chatbot-video-hoat-hinh-3d-do-an-ca-nhan-hoa.png'),
    ('ai-app-lam-video-thoi-trang-mau-nu-ngoi-tren-o-to', '/images/chatbots/ai-app-video-thoi-trang-mau-nu-ngoi-tren-o-to.png'),
    ('ai-app-lam-video-thoi-trang-mau-nu-truoc-guong', '/images/chatbots/ai-app-video-thoi-trang-mau-nu-truoc-guong.png'),
    ('chatbot-ai-viet-kich-ban-viral', '/images/chatbots/chatbot-kich-ban-viral-01.png'),
    ('chatbot-ai-sang-tao-kich-ban-viral', '/images/chatbots/chatbot-kich-ban-viral-02.png'),
    ('chatbot-content-planner-ai-365-ngay', '/images/chatbots/chatbot-content-planner-365.png'),
    ('chatbot-tiktok-hook-generator', '/images/chatbots/chatbot-tiktok-hook-generator.png'),
    ('photo-app-thay-do-cho-mau', '/images/workflows/photo-app-thay-do-cho-mau-cover-20260725.png'),
    ('app-lam-net-anh', '/images/workflows/app-lam-net-anh-cover-20260725.png'),
    ('ai-dancing', '/images/ai-dancing-cover-20260725.png'),
    ('xay-kenh-affiliate-kiem-tien-bang-video-ai', '/images/courses/xay-kenh-affiliate-video-ai-cover-20260725.png'),
    ('co-may-in-tien-xay-landing-page-bang-ai', '/images/courses/co-may-in-tien-landing-page-ai-cover-20260725.png')
) as v(slug, public_url)
join public.products p on p.slug = v.slug
on conflict (product_id, image_type) where (is_primary) do update set
  public_url = excluded.public_url,
  alt_text = excluded.alt_text,
  aspect_ratio = excluded.aspect_ratio,
  sort_order = excluded.sort_order;

insert into public.product_access_links (product_id, label, url, link_type, is_active, sort_order)
select
  p.id,
  'Sử dụng miễn phí',
  'https://labs.google/fx/tools/flow/shared/tool/b87d1207-3fcd-4d71-b12c-836db4044e69',
  'app',
  true,
  0
from public.products p
where p.slug = 'photo-app-thay-do-cho-mau'
  and not exists (
    select 1
    from public.product_access_links link
    where link.product_id = p.id
      and link.url = 'https://labs.google/fx/tools/flow/shared/tool/b87d1207-3fcd-4d71-b12c-836db4044e69'
  );

do $$
declare
  seeded_product_count integer;
begin
  select count(*) into seeded_product_count
  from public.products
  where legacy_id in (
    'app-lam-video-triet-ly-co-nhan',
    'chatbot-lam-video-hoat-hinh-3d-do-an-ca-nhan-hoa',
    'ai-app-lam-video-thoi-trang-mau-nu-ngoi-tren-o-to',
    'ai-app-lam-video-thoi-trang-mau-nu-truoc-guong',
    'chatbot-kich-ban-viral',
    'chatbot-sang-tao-kich-ban-viral',
    'chatbot-content-planner-365',
    'chatbot-tiktok-hook-generator',
    'photo-app-thay-do-cho-mau',
    'app-lam-net-anh',
    'ai-dancing',
    'xay-kenh-affiliate-kiem-tien-bang-video-ai',
    'co-may-in-tien-xay-landing-page-bang-ai'
  );

  if seeded_product_count <> 13 then
    raise exception 'Expected 13 initial products, found %', seeded_product_count;
  end if;
end;
$$;
