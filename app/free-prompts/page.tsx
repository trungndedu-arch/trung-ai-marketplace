"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Baby,
  Bell,
  Bot,
  Boxes,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clipboard,
  Copy,
  Heart,
  Home,
  GraduationCap,
  Image as ImageIcon,
  Menu,
  MessageSquareMore,
  Play,
  Search,
  Shirt,
  ShoppingBag,
  Sparkles,
  Store,
  Video,
  Workflow,
  X,
} from "lucide-react";

const filters = ["Tất cả model", "Nano Banana Pro", "Nano Banana 2", "GPT Image", "Midjourney", "Grok", "Veo 3", "Sora", "Kling", "Runway", "Khác"];

type PromptItem = {
  id: number;
  title: string;
  model: string;
  count: string;
  category: string;
  gradient: string;
  icon: LucideIcon;
  height: string;
  prompt: string;
  image?: string;
  images?: string[];
  description?: string;
};

const prompts: PromptItem[] = [
  {
    id: 35,
    title: "Poster Quảng Cáo Đồng Hồ Cao Cấp",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Sản Phẩm",
    description: "Tạo poster quảng cáo đồng hồ cao cấp phong cách commercial product, ánh sáng studio kịch tính, bề mặt vật liệu chân thực và typography mạnh như chiến dịch luxury watch.",
    image: "/images/prompts/poster-quang-cao-dong-ho-cao-cap-01.png",
    images: ["/images/prompts/poster-quang-cao-dong-ho-cao-cap-01.png"],
    gradient: "from-slate-400 via-zinc-700 to-zinc-950",
    icon: ShoppingBag,
    height: "h-80",
    prompt: `TAG Heuer — Track Surface (REAL, NOT FAKE) High-end commercial watch advertisement, TAG Heuer chronograph, single watch leaning against its box, centered composition, slight front three-quarter angle environment: real wet asphalt surface inspired by race track texture, subtle tire marks, light moisture, NOT full scene background: soft dark depth with slight motion blur light streak hints, minimal, not literal track lighting: controlled studio lighting with strong key for dial clarity, subtle red rim light for racing identity, crisp reflections on metal and glass composition: tight grouping, grounded, realistic spacing perspective typography (primary): large “PRECISION” in background, soft perspective, slightly diffused, low opacity, blending into depth secondary typography: “CHRONOGRAPH SERIES” “SWISS MADE” branding: logo top center, “MURPHY AI” beneath surface: wet asphalt reflection, controlled, not exaggerated color palette: black, steel, red accents ultra-realistic materials (brushed metal, sapphire reflections, lume details) 1:1 square format

Casio G-Shock — Rugged Ground (LIKE YOUR CHARCOAL SHOT) High-end commercial watch advertisement, G-Shock rugged watch, single watch leaning against its box, centered environment: controlled rough stone / cracked surface with dust particles, minimal debris (like your Nivea charcoal setup) background: dark soft gradient with slight haze, no literal landscape lighting: directional studio lighting, strong highlights on edges, controlled shadow depth composition: grounded, tight product grouping perspective typography (primary): bold “TOUGH” in background, slightly broken texture, soft perspective depth, low opacity secondary typography: “SHOCK RESISTANT” “BUILT TO LAST” branding: logo top center, “MURPHY AI” beneath surface: matte rough texture, minimal reflection color palette: charcoal, black, muted tones ultra-detailed rugged material finish 1:1 square format

Garmin — Outdoor Tech (CONTROLLED, NOT LANDSCAPE) High-end commercial watch advertisement, Garmin GPS smartwatch, single watch leaning against its box, centered environment: textured rock surface with subtle moisture and fine dust, clean minimal outdoor feel (not full mountain scene) background: deep cool gradient with faint mist layers for depth lighting: soft controlled lighting, cool rim highlights, clean display visibility composition: tight, balanced, grounded perspective typography (primary): “ENDURANCE” large in background, geometric, fading into depth with soft haze secondary typography: “GPS MULTISPORT” “PERFORMANCE TRACKING” branding: logo top center, “MURPHY AI” beneath surface: natural rock with subtle reflection color palette: blue-grey, black ultra-clean product rendering 1:1 square format

Fastrack — Urban Surface (LIKE GARNIER WATER BUT DRY) High-end commercial watch advertisement, Fastrack sports watch, single watch leaning against its box, centered environment: dark smooth surface with slight gloss and subtle texture, faint moisture or light reflection, urban tone background: soft gradient with slight haze, minimal depth lighting: contrast studio lighting with subtle colored accent reflections, controlled highlights composition: tight and clean perspective typography (primary): “MOVE FAST” large in background, soft perspective, slightly glowing edges, integrated subtly secondary typography: “SPORT MODE” “URBAN ACTIVE” branding: logo top center, “MURPHY AI” beneath surface: controlled reflection, not mirror-like color palette: black, grey, subtle accent color ultra-detailed modern finish`,
  },
  {
    id: 34,
    title: "Minh họa lịch sử: Công cụ cổ đại",
    model: "GPT Image",
    count: "3 ảnh",
    category: "Infographic",
    description: "Tạo minh họa lịch sử chân thực về công cụ cổ đại như rìu đá, mũi tên và gốm thô, phù hợp cho sách lịch sử, bài giảng hoặc bảo tàng ảo.",
    image: "/images/prompts/minh-hoa-lich-su-cong-cu-co-dai-01.png",
    images: [
      "/images/prompts/minh-hoa-lich-su-cong-cu-co-dai-01.png",
      "/images/prompts/minh-hoa-lich-su-cong-cu-co-dai-02.png",
      "/images/prompts/minh-hoa-lich-su-cong-cu-co-dai-03.png",
    ],
    gradient: "from-amber-200 via-stone-500 to-zinc-950",
    icon: ImageIcon,
    height: "h-80",
    prompt: `Một bộ công cụ cổ đại (ví dụ: rìu đá, mũi tên, đồ gốm thô sơ) được sắp xếp trên một bề mặt đất hoặc đá. Style: Historical illustration, realistic, detailed. Composition: Flat lay hoặc góc nhìn 3/4, tập trung vào kết cấu và chi tiết của từng món đồ. Lighting: Ánh sáng tự nhiên, làm nổi bật kết cấu thô sơ và dấu vết thời gian. Details: Các vết sứt mẻ trên đá, hoa văn đơn giản trên đồ gốm, sợi dây thô buộc. Background: Nền đất khô hoặc tảng đá lớn. Mood: Lịch sử, cổ kính, thô sơ. Intended Use: Sách lịch sử, bảo tàng ảo.`,
  },
  {
    id: 33,
    title: "Thời Trang Thể Thao Nike Siêu Thực",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo artwork quảng cáo thời trang thể thao Nike phong cách siêu thực, năng lượng tím bùng nổ, chuyển động mạnh và visual premium athletic advertising.",
    image: "/images/prompts/thoi-trang-the-thao-nike-sieu-thuc-01.png",
    images: ["/images/prompts/thoi-trang-the-thao-nike-sieu-thuc-01.png"],
    gradient: "from-violet-500 via-slate-800 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `A highly detailed digital artwork in a surreal, dynamic style inspired by premium athletic advertising for Nike, Inc. A young athletic woman with platinum blonde hair tied in a messy bun, fair skin, and a fiercely focused expression is captured mid-jump or leap, her body leaning slightly forward as if bursting with raw, untamed energy. She wears a loose, off-white Nike crewneck sweatshirt with subtle embossed Nike branding on the chest, paired with flowy, semi-transparent pants featuring a swirling marbled pattern in graphite grey and electric violet, billowing dramatically around her legs. On her feet are sleek, futuristic white Nike sneakers with glowing violet accents, visible Air-inspired sole details, and an aerodynamic design. Vibrant electric violet energy or ethereal smoke erupts dramatically from behind her, swirling and dissolving into abstract, cloud-like forms that interact with her clothing, creating a powerful sense of motion and release. The background is a deep, moody gradient transitioning from charcoal grey to luminous twilight violet, emphasizing a minimalist yet striking composition. Overlay large, bold metallic silver text reading “Just Do It” in a sharp, modern sans-serif font, partially integrated and obscured by the energy smoke and the figure, making it feel like an organic part of the scene. Include the iconic Nike Swoosh logo in the top-left corner in shimmering silver.`,
  },
  {
    id: 32,
    title: "Doodle Tương Tác Ảnh Gốc",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Chỉnh sửa ảnh",
    description: "Thêm doodle vẽ tay vui nhộn tương tác trực tiếp với chủ thể trong ảnh, vẫn giữ nguyên bố cục, ánh sáng và nhận diện của ảnh gốc.",
    image: "/images/prompts/doodle-tuong-tac-anh-goc-01.png",
    images: ["/images/prompts/doodle-tuong-tac-anh-goc-01.png"],
    gradient: "from-emerald-300 via-rose-400 to-zinc-950",
    icon: ImageIcon,
    height: "h-[30rem]",
    prompt: `Analyze the uploaded image and preserve the original subject, composition, and lighting. Do not alter the identity or structure of the main subject. Add playful, hand-drawn doodles that interact directly with the subject in the image. The doodles should mimic, follow, or exaggerate the shapes, gestures, or motion present-such as outlining poses, extending limbs, adding motion lines, or creating imaginative elements that "respond" to the subject.`,
  },
  {
    id: 31,
    title: "Tạp Chí Thời Trang ORBIT",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh thời trang streetwear ORBIT phong cách tạp chí tương lai, phối cam tangerine nổi bật, chrome phản chiếu và năng lượng hypebeast Seoul cao cấp.",
    image: "/images/prompts/tap-chi-thoi-trang-orbit-01.png",
    images: ["/images/prompts/tap-chi-thoi-trang-orbit-01.png"],
    gradient: "from-orange-500 via-zinc-800 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Semi-realistic anime-inspired portrait of a stylish young Korean woman based on the uploaded reference image, high-end streetwear campaign aesthetic for ORBIT, oversized matte tangerine and ivory utility bomber with layered technical details, relaxed charcoal cargo trousers, futuristic chunky sneakers with metallic accents, bold monochrome orange studio backdrop, reflective chrome structures and floating geometric ring elements, dynamic orbit-inspired composition, crisp direct flash photography with glossy highlights and soft skin realism, luxury urban fashion editorial mood, cutting-edge Seoul street style, premium hypebeast campaign energy, minimal yet futuristic art direction, cinematic fashion magazine quality.`,
  },
  {
    id: 30,
    title: "Nhân vật 3D Cường Điệu Hóa",
    model: "GPT Image",
    count: "4 ảnh",
    category: "Nhân vật AI",
    description: "Tạo chân dung nhân vật 3D caricature cường điệu từ ảnh tham chiếu, giữ nhận diện gương mặt nhưng biến tấu thành phong cách collectible street-luxury độc lạ.",
    image: "/images/prompts/nhan-vat-3d-cuong-dieu-hoa-01.png",
    images: [
      "/images/prompts/nhan-vat-3d-cuong-dieu-hoa-01.png",
      "/images/prompts/nhan-vat-3d-cuong-dieu-hoa-02.png",
      "/images/prompts/nhan-vat-3d-cuong-dieu-hoa-03.png",
      "/images/prompts/nhan-vat-3d-cuong-dieu-hoa-04.png",
    ],
    gradient: "from-zinc-200 via-slate-500 to-zinc-950",
    icon: ImageIcon,
    height: "h-[30rem]",
    prompt: `Create an exaggerated stylized 3D caricature character portrait with strong intentional deformation and a clean, controlled surface finish. Use the person from the ATTACHED REFERENCE PHOTO. Preserve the subject’s identity, facial likeness, skin tone, and defining features, but reinterpret them into a bold caricatured 3D form with an elongated neck, oversized head-to-neck ratio, droopy eyelids, heavy lips, and slightly asymmetrical facial structure. Render as a human-like 3D character with smooth, studio-clean skin and intentionally designed detail, avoiding random texture or noise. Style with bold accessories such as round or oval glasses, hoop earrings, gold chains, headscarves or bandanas, and street-luxury clothing. Use neutral studio lighting with soft shadows and even illumination, no dramatic contrast, against a plain neutral grey or off-white background. The overall aesthetic should feel weird, fashion-forward, collectible, and character-driven rather than cute or realistic. Ultra high definition, premium cinematic 3D render quality, hyper realistic hyper realism, clean materials, no freckles, no dirt, no grain, no noise, no speckling, no text, no logos, no watermarks. Aspect ratio 4:5`,
  },
  {
    id: 29,
    title: "Nhân Vật Chó Streetwear 3D Thời Trang",
    model: "GPT Image",
    count: "3 ảnh",
    category: "Nhân vật AI",
    description: "Tạo nhân vật chó hoạt hình 3D phong cách streetwear hiện đại với hoodie neon, kính phản quang, sneaker chunky và bố cục studio editorial sạch đẹp.",
    image: "/images/prompts/nhan-vat-cho-streetwear-3d-01.png",
    images: [
      "/images/prompts/nhan-vat-cho-streetwear-3d-01.png",
      "/images/prompts/nhan-vat-cho-streetwear-3d-02.png",
      "/images/prompts/nhan-vat-cho-streetwear-3d-03.png",
    ],
    gradient: "from-lime-300 via-emerald-500 to-zinc-950",
    icon: ImageIcon,
    height: "h-[30rem]",
    prompt: `Full-body 3D stylized anthropomorphic cartoon dog character wearing modern streetwear, oversized neon green hoodie, cargo pants, chunky sneakers, reflective sunglasses, silver chain necklace. Confident relaxed pose with hands in pockets. Minimal studio background in solid lime green. Soft studio lighting, smooth shadows, high detail fabric texture, Pixar-quality 3D render, ultra-clean composition, centered framing, fashion editorial character design, 8K resolution.`,
  },
  {
    id: 28,
    title: "Bìa Tạp Chí Beauty Pop Art",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo bìa tạp chí beauty phong cách pop-art cao cấp, kết hợp chân dung thời trang siêu thực với màu đỏ, vàng, chấm halftone và typography magazine nổi bật.",
    image: "/images/prompts/bia-tap-chi-beauty-pop-art-01.png",
    images: ["/images/prompts/bia-tap-chi-beauty-pop-art-01.png"],
    gradient: "from-yellow-300 via-red-500 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Ultra-realistic pop-art luxury beauty magazine cover featuring a striking Korean woman in a bold Roy Lichtenstein-meets-real-life aesthetic: a primary-red structured sleeveless column dress with white graphic polka dot waist belt, yellow geometric clutch. Hair in a sleek high ponytail with a vivid cobalt-blue dye fade at the tips. Graphic pop-art makeup — thick black liner dots under eyes, exaggerated cartoon-smooth blush circles, cherry-red glossy lips. Chrome sphere earrings, yellow gold bangles. Background: comic-book halftone dot pattern in bold primary yellow bleeding into clean white, Ben-Day dot grain overlay. "DAZED BEAUTY" in thick outlined bold graphic masthead. Ultra-detailed fabric sheen, photorealistic pop-art skin, 8K cinematic, sharp focus. Negative: soft pastel, realistic background, cartoon fully, blurry, watermark. 1744x2336`,
  },
  {
    id: 27,
    title: "Ảnh Sản Phẩm Doodle Tối Giản",
    model: "Nano Banana Pro",
    count: "1 ảnh",
    category: "Sản Phẩm",
    description: "Tạo ảnh sản phẩm tối giản trên nền studio ấm, ánh nắng dài, bố cục playful và doodle vẽ tay tương tác với sản phẩm theo phong cách mixed media cao cấp.",
    image: "/images/prompts/anh-san-pham-doodle-toi-gian-01.png",
    images: ["/images/prompts/anh-san-pham-doodle-toi-gian-01.png"],
    gradient: "from-amber-100 via-stone-400 to-zinc-950",
    icon: ShoppingBag,
    height: "h-80",
    prompt: `[product setup], minimalist product photo, clean warm studio scene, textured beige wall background, soft directional sunlight creating long shadows, simple tabletop surface, product arranged in a playful concept composition, hand drawn white line doodle overlay of [character] interacting with the product, mixed media look combining real photography and sketch illustration, high end branding feel, shallow depth of field, ultra realistic, no extra text, no watermark`,
  },
  {
    id: 26,
    title: "Poster Quảng Cáo Mỹ Phẩm Phong Cách Mềm Mại",
    model: "GPT Image",
    count: "3 ảnh",
    category: "Sản Phẩm",
    description: "Tạo poster quảng cáo mỹ phẩm/skincare phong cách mềm mại, pastel nữ tính, ánh nắng vàng, doodle dễ thương và bố cục beauty ad phù hợp Instagram, TikTok, X.",
    image: "/images/prompts/poster-quang-cao-my-pham-phong-cach-mem-mai-01.png",
    images: [
      "/images/prompts/poster-quang-cao-my-pham-phong-cach-mem-mai-01.png",
      "/images/prompts/poster-quang-cao-my-pham-phong-cach-mem-mai-02.png",
      "/images/prompts/poster-quang-cao-my-pham-phong-cach-mem-mai-03.png",
    ],
    gradient: "from-violet-200 via-rose-300 to-violet-950",
    icon: ShoppingBag,
    height: "h-[30rem]",
    prompt: `Luxury aesthetic skincare advertisement, soft pastel background, warm golden sunlight, dreamy soft focus, feminine vanity setup with mirror, pearls, candle and baby breath flowers. Cozy purple fluffy surface, high-end beauty branding style, ultra realistic, 4k, studio lighting, glossy reflection, soft shadows, bokeh background. Add cute doodle elements (white and purple hand-drawn arrows, sparkles, hearts), handwritten notes and stickers. Text overlay: "Glowy Skin In A Bottle" (big hand writing font) "Nourish • Hydrate • Glow" "For Soft, Smooth & Glowing Skin", "Self care Everyday" clean composition, aesthetic, viral beauty ad style, Instagram / TikTok / X friendly (but no UI), premium soft feminine branding`,
  },
  {
    id: 25,
    title: "Tạo KOL Thời Trang Trẻ Trung Sang Trọng",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh KOL thời trang nữ trẻ trung, sang trọng trong bối cảnh sân khấu/studio cao cấp với ánh sáng điện ảnh, váy đen avant-garde và khí chất editorial luxury.",
    image: "/images/prompts/tao-kol-thoi-trang-tre-trung-sang-trong-01.png",
    images: ["/images/prompts/tao-kol-thoi-trang-tre-trung-sang-trong-01.png"],
    gradient: "from-zinc-900 via-slate-700 to-violet-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Generate a visually young and elegant East Asian woman with tight, smooth, and elastic skin, with a subtle natural texture, a bright and transparent complexion, and no signs of sagging, fine lines, eye bags, or middle-aged feelings. Her facial contours are clear and layered, with a sharp and natural jawline, soft and delicate features, and clear and calm eyes with a distant and sophisticated intellectual depth. Her hair is a light brown, natural, and long, with a rich and smooth texture. Her overall demeanor is quiet and restrained, with a balance between youthful energy and elegant composure, and a sense of high-end detachment. She sits elegantly on the edge of the stage, with her body straight and dignified, one hand resting naturally on her side, and her legs crossed naturally to one side, with her head slightly raised and her gaze looking beyond the camera. Her posture is calm and full of dramatic tension, showcasing a high-end, quiet atmosphere of stage art. She wears a high-end, avant-garde, and dark-colored long dress with a sleek and geometric cut and a three-dimensional design, with a luxurious and dark fabric texture, presenting a dark and luxurious avant-garde fashion style. Her body is naturally proportional, with a relaxed and elegant shoulder and neck line. The scene is a professional dark-colored stage or a high-end photography studio with a deep-colored backdrop, a lightly blurred foreground with professional photography equipment, and a sense of high-end behind-the-scenes recording. Soft and focused lighting is used to highlight the subject, creating a dramatic and contrasty effect, with a deep and dark background. The overall style is a high-end, dark, and luxurious editorial style, with a shallow depth of field that emphasizes the subject's and clothing's texture, with a realistic and natural skin texture, and a clear and high-end clothing detail, with a overall sense of quietness, restraint, and artistic performance and dramatic tension. The image style is high-quality realism, with a natural and realistic transition of light and shadow, a balance of warm and cool tones, high-definition details, and a masterpiece-level quality, like a high-end fashion magazine's dark and avant-garde big piece.`,
  },
  {
    id: 24,
    title: "Storyboard Skincare",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Storyboard",
    description: "Tạo storyboard quảng cáo skincare 9 khung phong cách tối giản, ánh sáng tự nhiên, mood trong trẻo và câu chuyện chuyển đổi làn da từ mệt mỏi sang căng bóng rạng rỡ.",
    image: "/images/prompts/storyboard-skincare-01.png",
    images: ["/images/prompts/storyboard-skincare-01.png"],
    gradient: "from-white via-sky-200 to-violet-900",
    icon: ImageIcon,
    height: "h-80",
    prompt: `Create a clean, bright skincare commercial storyboard in a 16:9 layout with 9 panels. Use soft natural lighting, minimal aesthetic, and a fresh, airy mood with white and pastel tones. The main character is a young woman with soft makeup and styled hair, wearing light, elegant clothing. The setting is a modern, sunlit interior with large windows and a calm atmosphere. No text or subtitles anywhere. Show a clear story flow: she starts at her desk looking slightly tired or concerned, then a close-up of her face showing dry or dull skin. She discovers a clear skincare bottle and gently presents it. Show a close-up of the liquid pouring onto her hand, followed by her applying it to her face. After use, her skin looks hydrated, glowing, and smooth. Transition to her feeling confident and refreshed, walking in a bright, clean space with soft breeze and flowing elements. End with a calm product beauty shot on a minimal surface, then a final frame of her smiling softly at the camera while holding the product. Focus on natural expressions, glowing skin, and a transformation from dull to fresh. Include cinematic close-ups, soft focus, light reflections, and subtle sparkles to enhance the clean beauty feel. Keep everything elegant, minimal, and visually soothing with no branding text.`,
  },
  {
    id: 23,
    title: "Poster Quảng Cáo Thời Trang Cao Cấp",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo poster quảng cáo thời trang cao cấp phong cách editorial luxury với bố cục magazine, typography sang trọng, ảnh người mẫu chân thực và card chi tiết sản phẩm tinh tế.",
    image: "/images/prompts/poster-quang-cao-thoi-trang-cao-cap-01.png",
    images: ["/images/prompts/poster-quang-cao-thoi-trang-cao-cap-01.png"],
    gradient: "from-stone-200 via-amber-500 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Luxury fashion advertisement poster, ultra-premium editorial style (Gucci aesthetic), soft warm beige gradient background with subtle shadows and depth. A confident elegant young woman posing naturally beside a minimal stool, wearing flowy high-waist wide-leg trousers (rich warm brown) and a silky cream blouse, soft curls, minimal gold jewelry, cinematic soft lighting, realistic skin texture, high-end fashion photography. Clean modern layout with strong hierarchy and spacing: Left side: Large vertical text “TROUSERS” in premium serif font (Didot / Bodoni style), high letter spacing, slightly faded brown tone. Small vertical subtext: “EFFORTLESS STYLE. PERFECT FIT.” in thin sans-serif, minimal and elegant. Right side product card: Rounded soft card showing zoomed-in waist detail (same outfit as model) Title: “HIGH WAIST” in serif font Subtext: Flattering Fit, All-Day Comfort in light sans-serif Soft shadow and subtle border Below: Color swatches (navy, beige, taupe, black), perfectly aligned, evenly spaced Sizes row (XS S M L) styled as premium pill buttons “S” filled others outlined Remove unnecessary text like heights, keep layout minimal and breathable. Overall look: High fashion magazine aesthetic Clean spacing, grid aligned Soft shadows, subtle gradients Ultra realistic, sharp, 4K, luxury branding feel`,
  },
  {
    id: 22,
    title: "Quảng Cáo Nước Hoa Điện Ảnh Cao Cấp",
    model: "GPT Image",
    count: "3 ảnh",
    category: "Sản Phẩm",
    description: "Tạo ảnh quảng cáo nước hoa cao cấp phong cách điện ảnh với chai thủy tinh sang trọng, ánh sáng kịch tính, khói, nước, gia vị và bối cảnh luxury giàu cảm xúc.",
    image: "/images/prompts/quang-cao-nuoc-hoa-dien-anh-cao-cap-01.png",
    images: [
      "/images/prompts/quang-cao-nuoc-hoa-dien-anh-cao-cap-01.png",
      "/images/prompts/quang-cao-nuoc-hoa-dien-anh-cao-cap-02.png",
      "/images/prompts/quang-cao-nuoc-hoa-dien-anh-cao-cap-03.png",
    ],
    gradient: "from-amber-300 via-sky-900 to-zinc-950",
    icon: ShoppingBag,
    height: "h-[30rem]",
    prompt: `Create a hyper-realistic cinematic luxury perfume product photograph featuring [PERFUME BOTTLE DESIGN] positioned in [COMPOSITION / ANGLE] within a dramatic elemental environment of [ELEMENTAL SETTING: water, smoke, ice, firelight, forest, florals, spices, gemstones]. The bottle should feel premium and tactile, with [MATERIAL DETAILS: glossy glass, metallic cap, gold label, transparent liquid, frosted surface, engraved text], sharp reflections, realistic refractions, and crisp readable branding: [BRAND / LABEL TEXT]. Surround the product with carefully arranged sensory ingredients such as [BOTANICALS / SPICES / FRUITS / OBJECTS], using strong contrast between [PRIMARY COLOR PALETTE] and [ACCENT COLORS]. Lighting should be cinematic and high-contrast, with [LIGHTING STYLE], deep shadows, sparkling highlights, volumetric atmosphere, and a luxurious commercial advertising finish. Background: [BACKGROUND DESCRIPTION], shallow depth of field, premium editorial composition, ultra-detailed textures, 8k resolution, photorealistic studio quality.

Cheat Sheet:
[PERFUME BOTTLE DESIGN]: shape, color, cap, label style
[COMPOSITION / ANGLE]: tilted crash, centered still life, close-up tray, hand interaction
[ELEMENTAL SETTING]: splash, smoke, candlelight, ice, forest, aurora
[MATERIAL DETAILS]: glass, metal, liquid, frost, reflections
[BRAND / LABEL TEXT]: exact readable perfume text
[BOTANICALS / SPICES / FRUITS / OBJECTS]: lemons, vanilla pods, roses, pinecones, gemstones
[PRIMARY COLOR PALETTE]: navy, amber, silver, black, icy blue
[ACCENT COLORS]: gold, red, lime green, magenta, teal
[LIGHTING STYLE]: dramatic spotlight, candle glow, cool moonlight, golden rim light
[BACKGROUND DESCRIPTION]: moody studio, dark forest, blurred luxury interior, smoky backdrop`,
  },
  {
    id: 21,
    title: "Prompt Video Sức Khỏe Hoạt Hình 3D",
    model: "Veo 3",
    count: "4 ảnh",
    category: "Video AI",
    description: "Tạo kịch bản và prompt video 8 giây/cảnh cho các món ăn tốt cho sức khỏe được nhân hóa thành nhân vật hoạt hình 3D hài hước, biểu cảm mạnh, dễ viral trên TikTok.",
    image: "/images/prompts/prompt-video-suc-khoe-hoat-hinh-3d-01.png",
    images: [
      "/images/prompts/prompt-video-suc-khoe-hoat-hinh-3d-01.png",
      "/images/prompts/prompt-video-suc-khoe-hoat-hinh-3d-02.png",
      "/images/prompts/prompt-video-suc-khoe-hoat-hinh-3d-03.png",
      "/images/prompts/prompt-video-suc-khoe-hoat-hinh-3d-04.png",
    ],
    gradient: "from-lime-400 via-orange-500 to-zinc-950",
    icon: Video,
    height: "h-[30rem]",
    prompt: `Câu lệnh kịch bản:

Viết kịch bản 30s về 4 loại đồ ăn tốt cho sức khỏe theo phong cách hoạt hình hài hước – lố – biểu cảm mạnh giống trend đồ ăn biết nói trên TikTok.

Mỗi món có voice 8s.

Yêu cầu kịch bản:
- Nhân vật: Món ăn được nhân hóa thành nhân vật hoạt hình 3D
- Khuôn mặt biểu cảm cực mạnh: mắt trợn, cau mày, cười đểu, gân cổ
- Tính cách: bá đạo, tự tin, nói chuyện thẳng mặt
- Xưng “Tao”, gọi người xem là “Mày”
- Nội dung:
  + Nêu 1 lợi ích sức khỏe cụ thể (tăng cơ, đẹp da, tốt tim, tiêu hóa...)
  + Nói theo kiểu cà khịa, hài hước, dễ viral
  + Dùng ví von đời thường, gần gũi
- Có 1 câu nói vần điệu (rhyme) cho mỗi nhân vật
- Kết thúc bằng câu đắc thắng kiểu:
  “Ăn tao vào, mày lên đời liền!”
  hoặc tiếng cười khoái chí “Ha ha ha!”

Câu lệnh Viết prompt video:
Tôi có một kịch bản về 4 loại đồ ăn tốt cho sức khỏe. Kịch bản của tôi [Dán kịch bản vào đây]
Hãy giúp tôi viết các Prompt để tạo video chi tiết cho công cụ AI (như Veo 3) theo phong cách hoạt hình hài hước giống trend đồ ăn biết nói trên TikTok.

Yêu cầu mỗi Prompt:
Thời lượng: 8 giây / cảnh
Có voice tiếng việt như trong kịch bản
Các prompt là các prompt hoàn chỉnh dùng được ngay

Phong cách hình ảnh:
+ Hoạt hình 3D
+ Đồ ăn được nhân hóa
+ Khuôn mặt biểu cảm cực gắt: trợn mắt, nhe răng, cau mày, cười gian
+ Tư thế cử động mạnh: chỉ tay, đập bàn, vung tay

Bối cảnh:
+ Nhà bếp, chợ, quầy thực phẩm, nồi chảo, lò nướng...

Hình ảnh:
+ 9:16 dọc
+ Chất lượng cao
+ Màu sắc nổi, tương phản mạnh
+ Không chữ trên màn hình

Cấu trúc Prompt (viết bằng tiếng Anh):
[Anthropomorphic healthy food character, exaggerated facial expression]
+ [Funny aggressive action in 8s]
+ [Kitchen / market background]
+ [Strong contrast lighting, vibrant colors]
+ [Dynamic camera movement: zoom in, shake, cinematic pan]

Voice:
- Giọng nam
- Trầm, gắt, hơi “hổ báo”
- Nói chuyện kiểu cà khịa, tự tin`,
  },
  {
    id: 20,
    title: "Tạo Ảnh Quảng Cáo Đồ Lót",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh quảng cáo lingerie cao cấp phong cách beauty-fashion Nhật Bản, ánh sáng mềm, màu ivory sang trọng và bố cục e-commerce premium.",
    image: "/images/prompts/lingerie-nhat-ban-cao-cap-01.png",
    images: ["/images/prompts/lingerie-nhat-ban-cao-cap-01.png"],
    gradient: "from-stone-100 via-amber-200 to-violet-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Create a hyper-realistic luxury lingerie e-commerce detail-page visual inspired by premium Japanese beauty-fashion brands. IMPORTANT: Generate ONLY ONE SINGLE VERTICAL IMAGE. Do NOT create multiple posters. Do NOT create collages. STYLE: Luxury glossy beauty-commercial realism. Soft dreamy fashion aesthetics. Premium feminine branding. MAIN CONCEPT: A glowing soft-beauty lingerie campaign focused on: radiant feminine elegance, luxury comfort, soft body glow, and dreamy romantic styling. MODEL: Adult female model with glowing skin texture. Soft cinematic makeup. Elegant emotional beauty. Luxury fashion styling. PRODUCT: Luxury ivory-white lace lingerie with: soft reflective fabric, light floral lace details, premium smooth texture, and natural support fit. VISUAL STRUCTURE: cinematic beauty hero shot dreamy close-up details luxury typography overlays premium spacing hierarchy soft glowing beauty atmosphere BACKGROUND: Minimal ivory-beauty studio with dreamy sunlight diffusion and floating light particles. COLOR PALETTE: Ivory white, soft pearl, light champagne, warm blush glow, cream beige. MOOD: Dreamy. Luxury. Elegant. Soft romantic beauty. QUALITY: Ultra realistic HDR. 8K cinematic realism. Looks like a real premium Japanese lingerie e-commerce detail-page campaign.`,
  },
  {
    id: 19,
    title: "Character Sheet Đồng Nhất Nhân Vật",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Nhân vật AI",
    description: "Tạo character sheet đồng nhất nhân vật từ ảnh tham chiếu, giữ nguyên khuôn mặt, phong cách, trang phục và nhiều góc biểu cảm để dùng cho AI image generation.",
    image: "/images/prompts/character-sheet-dong-nhat-nhan-vat-01.png",
    images: ["/images/prompts/character-sheet-dong-nhat-nhan-vat-01.png"],
    gradient: "from-slate-200 via-zinc-400 to-violet-950",
    icon: ImageIcon,
    height: "h-80",
    prompt: `Use the attached image as the highest-priority reference and create a character sheet that clearly depicts the same person or character.

If the attached image is a photograph, keep it photorealistic. If it is an illustration, anime, manga, 3D render, or chibi/deformed style, preserve the original art style, linework, coloring, textures, and level of stylization exactly.
Do not arbitrarily convert it into a photo, illustration, or a different art style.

The purpose is not to introduce a character profile, but to create a visual reference sheet for character creation, AI image generation, and character consistency.
Do not include profile information such as name, age, personality, hobbies, or descriptions.
The only text inside the image should be short English labels indicating each panel.

Image format:
A single 16:9 horizontal image. White to light gray background. High resolution. A clean, easy-to-read character sheet layout organized with thin guide lines and boxes.

Highest priority requirements:
Faithfully reproduce the face, eyes, eyebrows, nose, mouth, face shape, hairstyle, hair color, skin tone, rendering texture, body proportions, overall atmosphere, and clothing impression from the original image.
The result must clearly look like the same person or character.
Do not turn them into a different person or character.
Do not excessively beautify, oversimplify, alter body proportions, or redesign the face.
Temporary objects appearing in the original image, such as accessories, food, background elements, poses, or handheld items, should be omitted unless they are essential to the character design.

Clothing:
If the original clothing is clearly visible, keep it unchanged.
If the full body is not visible, naturally complete the outfit while matching the original atmosphere.
The front, side, and back views must all use the same outfit, hairstyle, and body proportions.
Avoid revealing clothing, underwear, swimsuits, or sexualized outfits.

Include:
[Full Body] Front, Side, Back
[Face Close-up] Front, Profile, 45-degree angle
[Expressions] Neutral, Smile, Big Smile, Serious, Surprised, Embarrassed, Thinking, Troubled
[Facial Features] Eyes, Eyebrows, Nose, Mouth, Ears, Face Contour, Skin, Texture
[Hair Details] Bangs, Side Hair, Back Hair, Hair Flow
[Additional Angles] Left 3/4, Right 3/4, Top View, Bottom View, Back of the Head

Layout:
Make it easy to read as a production reference, with clean spacing and each section organized inside boxes.
Do not make it look like a magazine profile, résumé, or poster.
Do not include long descriptions; only short English labels.

Negative prompt:
Different person, different character, changed face, changed art style, unintended photorealism, unintended anime style, different hairstyle, different hair color, inconsistent clothing, altered body proportions, excessive beautification, excessive simplification, profile text, name, age, personality, hobbies, long descriptions, garbled text, unreadable text, messy layout, low resolution, distorted face, malformed eyes, broken hands, broken fingers, duplicated faces, sexualized clothing, underwear, swimsuits, unnecessary accessories, food in the mouth, random objects, cluttered background.`,
  },
  {
    id: 18,
    title: "Ốp Điện Thoại Xinh",
    model: "GPT Image",
    count: "3 ảnh",
    category: "Sản Phẩm",
    description: "Tạo ảnh quảng cáo ốp điện thoại dễ thương với phong cách kawaii, màu pastel và chất lượng siêu chân thực. Phù hợp cho bán hàng, quảng cáo và nội dung mạng xã hội.",
    image: "/images/prompts/op-dien-thoai-xinh-01.png",
    images: [
      "/images/prompts/op-dien-thoai-xinh-01.png",
      "/images/prompts/op-dien-thoai-xinh-02.png",
      "/images/prompts/op-dien-thoai-xinh-03.png",
    ],
    gradient: "from-pink-300 via-rose-400 to-violet-900",
    icon: ShoppingBag,
    height: "h-[30rem]",
    prompt: `Ultra-cute kawaii aesthetic close-up photo of a feminine hand holding a fully assembled smartphone with the transparent iPhone Pro case already installed on the phone, clearly showing the actual iPhone inside the glossy transparent case instead of the case alone. The smartphone remains visible through the crystal-clear transparent materials, with realistic metallic iPhone edges, camera lenses, subtle Apple-style premium details, and soft reflections visible beneath the case design.

The installed transparent phone case is the absolute main subject, highly emphasized and visually separated from the background, decorated with pastel pink 3D charms including miniature strawberry bubble tea cups, glossy bows, tiny hearts, soft silicone accents, and delicate kawaii embellishments attached onto the case surface. Crystal rhinestone nails sparkling elegantly under focused soft lighting.

Background intentionally contrasted to enhance product visibility: cozy Korean kawaii phone case boutique with shelves of plush toys and colorful accessories in muted creamy beige, warm ivory, soft peach, and slightly desaturated pastel tones, avoiding dominant pink near the product area. Background lights softly golden and warm white instead of pink, creating strong visual separation between the transparent glossy phone case and surroundings.

The smartphone with the installed case remains the brightest and sharpest object in frame with enhanced reflections, crisp transparent materials, luxury glossy finish, and subtle rim lighting around the phone and case edges for clear subject isolation. Cinematic shallow depth of field with creamy bokeh, soft blurred boutique environment, elegant composition, premium product photography style.

Soft diffused studio lighting focused on the phone and installed case, subtle backlight glow outlining the charms and transparent edges, HDR reflections, ultra-realistic textures, photorealistic transparent materials, Korean luxury kawaii aesthetic, Instagram luxury lifestyle photography, clean polished look, vertical composition, 85mm lens, f/1.8, 8K resolution, hyper-detailed, dreamy atmosphere with balanced color contrast between foreground and background for maximum product emphasis.`,
  },
  {
    id: 17,
    title: "Thời Trang Áo Dài Trung Niên",
    model: "GPT Image",
    count: "2 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh thời trang áo dài trung niên sang trọng, thanh lịch, phù hợp cho quảng cáo sản phẩm, lookbook thời trang và nội dung bán hàng.",
    image: "/images/prompts/thoi-trang-ao-dai-trung-nien-01.png",
    images: [
      "/images/prompts/thoi-trang-ao-dai-trung-nien-01.png",
      "/images/prompts/thoi-trang-ao-dai-trung-nien-02.png",
    ],
    gradient: "from-emerald-500 via-teal-800 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: "Full-body photograph of a middle-aged Vietnamese woman, around 50 years old, standing confidently and full of grace, with a warm, natural smile in a luxurious Indochine-style living room. She is captured completely from head to toe, with her entire figure including her feet on the floor visible. Her neat black hair is natural, and her makeup is refined and suitable for her age. She wears an elegant, high-quality emerald green silk ao dai tunic over black silk trousers, with subtle embroidery, and stylish low-heeled pearl sandals. She stands in a richly decorated living room featuring dark, polished teak wood furniture, classic Vietnamese blue and white ceramics, and soft lantern lighting. Behind her is a plush velvet sofa and a large arched window looking out onto a lush green courtyard. The lighting is soft, warm, and natural. The view captures the entire space, maintaining vertical focus. Shot at eye level. High resolution. 9:16",
  },
  {
    id: 16,
    title: "Thời Trang Bóng Rổ Nam",
    model: "GPT Image",
    count: "5 ảnh",
    category: "Chỉnh sửa ảnh",
    description: "Tạo ảnh thời trang bóng rổ nam phong cách thể thao hiện đại, với nam người mẫu Việt Nam trẻ trung, vóc dáng cân đối và thần thái tự tin. Phù hợp cho lookbook thời trang, quảng cáo sản phẩm và nội dung mạng xã hội chất lượng cao.",
    image: "/images/prompts/thoi-trang-bong-ro-nam-01.jpeg",
    images: [
      "/images/prompts/thoi-trang-bong-ro-nam-01.jpeg",
      "/images/prompts/thoi-trang-bong-ro-nam-02.jpeg",
      "/images/prompts/thoi-trang-bong-ro-nam-03.jpeg",
      "/images/prompts/thoi-trang-bong-ro-nam-04.jpeg",
      "/images/prompts/thoi-trang-bong-ro-nam-05.jpeg",
    ],
    gradient: "from-sky-400 via-orange-500 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: "Create a high-quality full-body fashion portrait of a young Vietnamese male fashion KOL, around 25 years old, with a tall model-like physique, well-proportioned body, stylish appearance, and confident charisma. He has a handsome modern Vietnamese face, clear skin, sharp jawline, neatly styled black hair, and a cool, trendy expression. He is standing confidently on an outdoor basketball court, posing like a professional fashion influencer. Outfit should be modern, sporty, and fashionable, combining premium streetwear and athletic style, such as a fitted oversize sports T-shirt or sleeveless top, stylish shorts or jogger pants, fashionable sneakers, accessories like a watch, chain, or sunglasses, creating a trendy masculine summer look. The basketball court should look clean, urban, and visually appealing, with visible court lines, basketball hoop, fence, and a modern city or neighborhood background. Lighting should be natural and cinematic, with soft sunlight, realistic shadows, and a premium lifestyle fashion atmosphere. Composition should emphasize the full body, long legs, and strong fashion presence of the model. Pose should be relaxed but confident, like a real men’s fashion KOL doing a lifestyle shoot. Ultra-detailed, realistic photography, sharp focus, high-end fashion editorial style, vibrant yet natural colors, vertical 9:16 aspect ratio.",
  },
  {
    id: 15,
    title: "Làm nét ảnh",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Chỉnh sửa ảnh",
    description: "Khôi phục và làm nét ảnh bị mờ, tăng độ sắc nét, cải thiện chi tiết và nâng cao chất lượng hình ảnh bằng AI.",
    image: "/images/prompts/lam-net-anh-01.png",
    images: ["/images/prompts/lam-net-anh-01.png"],
    gradient: "from-zinc-500 via-orange-800 to-zinc-950",
    icon: ImageIcon,
    height: "h-80",
    prompt: "Enhance and sharpen this image to make it clear and high-resolution. Keep the original composition, details, colors, lighting, objects, faces, background, text, and overall appearance exactly the same. Do not add, remove, replace, retouch, stylize, or change anything. Only reduce blur/noise and improve sharpness while preserving the image 100% faithfully.",
  },
  {
    id: 14,
    title: "Doanh nhân nữ studio",
    model: "GPT Image",
    count: "4 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh chân dung doanh nhân nữ trong studio cao cấp với phong cách thời trang sang trọng, ánh sáng chuyên nghiệp và chất lượng siêu chân thực.",
    image: "/images/prompts/doanh-nhan-nu-studio-01.png",
    images: [
      "/images/prompts/doanh-nhan-nu-studio-01.png",
      "/images/prompts/doanh-nhan-nu-studio-02.png",
      "/images/prompts/doanh-nhan-nu-studio-03.png",
      "/images/prompts/doanh-nhan-nu-studio-04.png",
    ],
    gradient: "from-red-600 via-rose-900 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Ultra-realistic professional studio portrait of a beautiful young East Asian woman with fair porcelain skin, delicate facial features, almond-shaped eyes, soft natural makeup, subtle eyeliner, nude pink lips, and sleek black hair styled in a high elegant bun with loose strands framing the face. She is seated gracefully on a modern dark walnut wooden chair with black leather upholstery, posing with crossed legs and both hands gently resting on her knee in a confident and sophisticated posture. She wears a tailored vibrant red pantsuit consisting of an oversized blazer and wide-leg trousers, layered over a white inner top, paired with elegant black pointed-toe high heels with metallic accents. Her expression is calm, refined, and confident, looking directly into the camera.

Background is a seamless monochromatic deep burgundy and dark red studio backdrop with smooth gradient tones, creating a luxurious and minimalist atmosphere. Soft cinematic studio lighting with large diffused key light from the front left and subtle fill light creates smooth skin texture, delicate shadows, and gentle highlights. Composition is vertically centered with ample negative space, full-body framing, fashion editorial style, premium magazine photoshoot aesthetic, clean background, symmetrical balance, ultra-detailed fabric textures, realistic skin pores, natural shadows, color harmony in red tones, shallow depth of field, extremely sharp focus, high dynamic range, 85mm lens, f/2.0 aperture, ISO 100, professional photography, Vogue fashion editorial style, masterpiece, ultra photorealistic, 8K, HDR, no text, no watermark, no extra objects, elegant luxury portrait.`,
  },
  {
    id: 13,
    title: "Mẫu Nữ Ngồi Ô Tô",
    model: "GPT Image",
    count: "1 ảnh",
    category: "Thời Trang",
    description: "Tạo ảnh mẫu nữ ngồi trong ô tô SUV sang trọng với phong cách thời trang cao cấp, ánh sáng golden hour và chất lượng siêu chân thực.",
    image: "/images/prompts/mau-nu-ngoi-o-to.png",
    images: [
      "/images/prompts/mau-nu-ngoi-o-to.png",
      "/images/prompts/mau-nu-ngoi-o-to-02.png",
      "/images/prompts/mau-nu-ngoi-o-to-03.png",
    ],
    gradient: "from-amber-300 via-stone-500 to-zinc-950",
    icon: Shirt,
    height: "h-[30rem]",
    prompt: `Ultra-realistic cinematic vertical photograph, 9:16 aspect ratio, captured from the front passenger seat inside a premium modern SUV with luxurious beige leather interior. A beautiful young East Asian woman with fair skin, slim body, long wavy dark brown hair, delicate facial features, natural makeup, soft pink lips, and large expressive eyes is sitting in the driver’s seat. She is wearing thin silver round eyeglasses, a black strapless top, short beige leather shorts, and a matching beige leather jacket casually draped over her shoulders. She is secured with a beige seat belt and holding the steering wheel naturally with both hands in a relaxed driving posture. Her expression is calm, elegant, and confident.

The vehicle interior is highly detailed, showing the beige leather seats, center console, dashboard controls, armrest, roof lights, panoramic sunroof frame, and door panels with metallic accents. The camera angle provides a clear view of her upper body and legs, emphasizing the luxurious atmosphere.

Outside the side windows and windshield is a modern downtown cityscape with tall buildings, shops, pedestrians crossing the street, traffic lights, and several cars in soft focus. Late afternoon golden-hour sunlight enters from the left side, creating warm highlights and soft shadows on her face and the car interior. The scene feels candid, realistic, and sophisticated.

Photography style: ultra-photorealistic, cinematic lifestyle photography, luxury automotive editorial, shallow depth of field, natural skin texture, soft bokeh, HDR, global illumination, ray tracing, high dynamic range, crisp focus, realistic reflections, 85mm lens, f/1.8, ISO 100, 1/500s shutter speed, premium color grading, subtle film grain, masterpiece quality, extremely detailed, 8K resolution.

Negative prompt: blurry, low quality, deformed hands, extra fingers, duplicate limbs, distorted face, exaggerated proportions, cartoon, CGI, oversaturated colors, bad anatomy, unrealistic skin, watermark, text, logo, cropped body, motion blur.`,
  },
];

const orderedPrompts = prompts
  .map((item, originalIndex) => ({
    item,
    originalIndex,
    isReal: Boolean(item.image && item.title.trim() && item.prompt.trim()),
  }))
  .sort((a, b) => {
    if (a.isReal !== b.isReal) return a.isReal ? -1 : 1;
    if (a.isReal && b.isReal) return b.item.id - a.item.id;
    return a.originalIndex - b.originalIndex;
  })
  .map(({ item }) => item);

function Brand() {
  return <Link href="/" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-glow"><Sparkles className="h-5 w-5 text-white" /></span><span className="text-[18px] font-extrabold tracking-tight text-white">Trung AI <b className="text-violet-400">Studio</b></span></Link>;
}

function Sidebar({ open, close }: { open: boolean; close: () => void }) {
  const links = [
    { label: "Khám phá", icon: Home, href: "/" },
    { label: "Prompt AI Miễn Phí", icon: MessageSquareMore, href: "/free-prompts", active: true },
    { label: "Chatbot", icon: Bot, href: "/#products" },
    { label: "Khóa Học Video AI", icon: GraduationCap, href: "/video-ai-course" },
    { label: "Workflow", icon: Workflow, href: "/#products" },
    { label: "AI Apps", icon: Boxes, href: "/#products" },
  ];
  return <>
    {open && <button aria-label="Đóng menu" className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden" onClick={close} />}
    <aside className={`fixed inset-y-0 left-0 z-50 flex w-[252px] flex-col border-r border-white/[0.07] bg-[#0c0b12]/95 px-4 py-5 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
      <div className="mb-8 flex items-center justify-between px-2"><Brand /><button aria-label="Đóng menu" onClick={close} className="text-zinc-400 lg:hidden"><X className="h-5 w-5" /></button></div>
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Khám phá</p>
      <nav className="space-y-1">{links.map(({ label, icon: Icon, href, active }) => <Link key={label} href={href} onClick={close} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active ? "bg-violet-500/15 text-violet-300" : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"}`}><Icon className={`h-[18px] w-[18px] ${active ? "text-violet-400" : "text-zinc-500 group-hover:text-zinc-300"}`} />{label}{active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_#a78bfa]" />}</Link>)}</nav>
      <div className="my-6 h-px bg-white/[0.06]" />
      <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-600">Cá nhân</p>
      <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-zinc-400 hover:bg-white/[0.04] hover:text-white"><Heart className="h-[18px] w-[18px] text-zinc-500" /> Yêu thích</button>
      <div className="mt-auto rounded-2xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-fuchsia-500/[0.04] p-4"><div className="mb-3 grid h-9 w-9 place-items-center rounded-xl bg-violet-500/20"><Store className="h-[18px] w-[18px] text-violet-300" /></div><p className="text-sm font-bold text-white">Trở thành creator</p><p className="mt-1 text-xs leading-5 text-zinc-500">Chia sẻ sản phẩm AI với cộng đồng.</p><button className="mt-3 flex items-center gap-1 text-xs font-bold text-violet-300">Bắt đầu ngay <ChevronRight className="h-3.5 w-3.5" /></button></div>
    </aside>
  </>;
}

function Header({ openMenu }: { openMenu: () => void }) {
  return <header className="sticky top-0 z-30 flex h-[72px] items-center gap-3 border-b border-white/[0.06] bg-ink/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8"><button onClick={openMenu} aria-label="Mở menu" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-zinc-300 lg:hidden"><Menu className="h-5 w-5" /></button><span className="hidden md:block lg:hidden"><Brand /></span><div className="flex-1" /><span className="hidden text-xs font-semibold text-zinc-500 sm:block">Prompt mới mỗi tuần</span><button aria-label="Thông báo" className="relative grid h-10 w-10 place-items-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-zinc-400 hover:text-white"><Bell className="h-[18px] w-[18px]" /><span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-fuchsia-500" /></button><Link href="/" className="hidden rounded-xl bg-white px-4 py-2.5 text-sm font-extrabold text-zinc-950 transition hover:bg-violet-100 sm:block">Marketplace</Link></header>;
}

function PromptVisual({ item, modal = false }: { item: PromptItem; modal?: boolean }) {
  const Icon = item.icon;
  return <div className={`relative overflow-hidden bg-gradient-to-br ${item.gradient} ${modal ? "h-64 sm:h-full sm:min-h-[460px]" : item.height}`}>
    {item.image ? <Image src={item.image} alt={item.title} fill priority={item.id === 13} sizes={modal ? "(max-width: 640px) 100vw, 45vw" : "(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"} className={`${modal ? "object-contain bg-black" : "object-cover"} transition duration-500 group-hover:scale-[1.025]`} /> : <>
      <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-[28px] border-white/10" />
      <div className="absolute -bottom-16 -left-12 h-56 w-56 rounded-full bg-black/25 blur-sm" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:34px_34px]" />
      <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[30px] border border-white/20 bg-black/20 shadow-2xl backdrop-blur-md"><Icon className="h-11 w-11 text-white" /></div>
    </>}
    {item.image && <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent" />}
    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between"><span className="rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-widest text-white backdrop-blur-md">{item.category}</span><ImageIcon className="h-4 w-4 text-white/60" /></div>
  </div>;
}

function PromptCard({ item, open }: { item: PromptItem; open: () => void }) {
  return <button onClick={open} className="prompt-card group mb-5 w-full break-inside-avoid overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111019] text-left shadow-[0_12px_45px_rgba(0,0,0,.24)]"><PromptVisual item={item} /><div className="p-4"><div className="mb-2 flex items-center gap-2"><span className="rounded-full bg-violet-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-violet-300">{item.category}</span></div><h2 className="text-[15px] font-extrabold leading-6 text-white transition group-hover:text-violet-300">{item.title}</h2>{item.description && <p className="mt-2 line-clamp-3 text-xs leading-5 text-zinc-500">{item.description}</p>}<div className="mt-3 flex items-center justify-between gap-3"><span className="truncate text-xs font-semibold text-violet-400">{item.model}</span><span className="whitespace-nowrap rounded-md bg-white/[0.06] px-2 py-1 text-[10px] font-bold text-zinc-400">{item.count}</span></div></div></button>;
}

function PromptGallery({ item }: { item: PromptItem }) {
  const images = item.images ?? (item.image ? [item.image] : []);
  const [activeIndex, setActiveIndex] = useState(0);
  const previous = () => setActiveIndex((current) => (current - 1 + images.length) % images.length);
  const next = () => setActiveIndex((current) => (current + 1) % images.length);

  return <div className="flex min-h-[520px] flex-col bg-black p-3 sm:min-h-[620px] sm:p-4">
    <div className="relative min-h-0 flex-1 overflow-hidden rounded-2xl bg-[#08070d]">
      <Image src={images[activeIndex]} alt={`${item.title} — ảnh ${activeIndex + 1}`} fill priority sizes="(max-width: 640px) 100vw, 45vw" className="object-contain" />
      <button type="button" aria-label="Ảnh trước" onClick={previous} className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-violet-600"><ChevronLeft className="h-5 w-5" /></button>
      <button type="button" aria-label="Ảnh tiếp theo" onClick={next} className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/55 text-white shadow-xl backdrop-blur-md transition hover:scale-105 hover:bg-violet-600"><ChevronRight className="h-5 w-5" /></button>
      <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">{activeIndex + 1}/{images.length}</span>
    </div>
    <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
      {images.map((image, index) => <button type="button" key={image} onClick={() => setActiveIndex(index)} aria-label={`Chọn ảnh ${index + 1}`} className={`relative h-16 w-12 flex-none overflow-hidden rounded-lg border-2 transition sm:h-20 sm:w-14 ${activeIndex === index ? "border-violet-400 shadow-[0_0_18px_rgba(139,92,246,.55)]" : "border-transparent opacity-55 hover:opacity-100"}`}><Image src={image} alt="" fill sizes="56px" className="object-cover" /><span className={`absolute inset-x-0 bottom-0 h-1 ${activeIndex === index ? "bg-violet-400" : "bg-transparent"}`} /></button>)}
    </div>
  </div>;
}

function PromptModal({ item, close, copied, copy }: { item: PromptItem; close: () => void; copied: boolean; copy: () => void }) {
  useEffect(() => { const onKey = (event: KeyboardEvent) => event.key === "Escape" && close(); window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden"; return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; }; }, [close]);
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={close}>
    <div role="dialog" aria-modal="true" aria-label={item.title} onMouseDown={(event) => event.stopPropagation()} className="grid max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[24px] border border-white/10 bg-[#111019] shadow-[0_0_80px_rgba(124,58,237,.22)] sm:grid-cols-[.9fr_1.1fr]">
      {item.images && item.images.length > 1 ? <PromptGallery item={item} /> : <PromptVisual item={item} modal />}
      <div className="flex flex-col p-5 sm:p-8">
        <button aria-label="Đóng" onClick={close} className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-white/10 text-zinc-500 hover:bg-white/[0.06] hover:text-white"><X className="h-4 w-4" /></button>
        <span className="mt-2 text-[10px] font-black uppercase tracking-[.18em] text-violet-400">{item.category}</span>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">{item.title}</h2>
        {item.description && <p className="mt-3 text-sm leading-6 text-zinc-400">{item.description}</p>}
        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-400"><Sparkles className="h-4 w-4 text-violet-400" /> Model AI <b className="text-zinc-200">{item.model}</b></div>
        <div className="mt-6 rounded-2xl border border-white/[0.07] bg-black/25 p-4"><p className="mb-3 text-[10px] font-black uppercase tracking-[.17em] text-zinc-600">Nội dung prompt</p><p className="max-h-48 whitespace-pre-line overflow-y-auto text-sm leading-7 text-zinc-300">{item.prompt}</p></div>
        <div className="mt-auto flex flex-col gap-3 pt-6 sm:flex-row"><button onClick={copy} className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-extrabold text-white transition ${copied ? "bg-emerald-600" : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:brightness-110"}`}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? "Đã sao chép Prompt" : "Sao chép Prompt"}</button><button onClick={close} className="rounded-xl border border-white/10 px-5 py-3.5 text-sm font-bold text-zinc-400 hover:bg-white/[0.05] hover:text-white">Đóng</button></div>
      </div>
    </div>
  </div>;
}

export default function FreePromptsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<PromptItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(false);

  const visible = useMemo(() => orderedPrompts.filter((item) => (activeFilter === "Tất cả model" || item.model === activeFilter) && `${item.title} ${item.category} ${item.model}`.toLowerCase().includes(query.toLowerCase().trim())), [activeFilter, query]);
  const closeModal = () => { setSelected(null); setCopied(false); };
  const copyPrompt = async () => { if (!selected) return; await navigator.clipboard.writeText(selected.prompt); setCopied(true); setToast(true); window.setTimeout(() => setToast(false), 2200); };

  return <div className="min-h-screen bg-ink text-zinc-200"><Sidebar open={menuOpen} close={() => setMenuOpen(false)} /><div className="lg:pl-[252px]"><Header openMenu={() => setMenuOpen(true)} /><main className="mx-auto max-w-[1500px] px-4 py-9 sm:px-6 lg:px-8 lg:py-12"><section className="relative overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#100d1a] px-6 py-10 sm:px-10 lg:px-12"><div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-600/20 blur-[90px]" /><div className="relative"><span className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.18em] text-violet-300"><Sparkles className="h-3.5 w-3.5" /> Miễn phí · Cập nhật mỗi tuần</span><h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-[-.04em] text-white sm:text-5xl">Thư viện Prompt AI <span className="gradient-text">miễn phí</span></h1><p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400 sm:text-base">Sao chép và sử dụng ngay với ChatGPT, Gemini, Midjourney, Nano Banana, Veo 3 và các công cụ AI phổ biến.</p></div></section><section className="mt-8"><div className="relative"><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm prompt theo chủ đề, model..." className="h-14 w-full rounded-2xl border border-white/[0.08] bg-white/[0.035] pl-12 pr-4 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-violet-500/50 focus:ring-4 focus:ring-violet-500/10" /></div><div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-2">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition ${activeFilter === filter ? "bg-violet-600 text-white shadow-[0_0_24px_rgba(124,58,237,.28)]" : "border border-white/[0.08] bg-white/[0.03] text-zinc-500 hover:border-violet-400/30 hover:text-white"}`}>{filter}</button>)}</div></section><div className="mb-5 mt-9 flex items-center justify-between"><p className="text-sm text-zinc-500"><b className="text-white">{visible.length}</b> prompt phù hợp</p><span className="text-xs text-zinc-600">Nhấn vào thẻ để xem chi tiết</span></div>{visible.length > 0 ? <section className="columns-1 gap-5 sm:columns-2 xl:columns-3 2xl:columns-4">{visible.map((item) => <PromptCard key={item.id} item={item} open={() => { setSelected(item); setCopied(false); }} />)}</section> : <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-white/10 text-center"><div><Search className="mx-auto h-8 w-8 text-zinc-700" /><p className="mt-3 font-bold text-zinc-400">Không tìm thấy prompt phù hợp</p><button onClick={() => { setQuery(""); setActiveFilter(filters[0]); }} className="mt-3 text-sm font-bold text-violet-400">Xóa bộ lọc</button></div></div>}<footer className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] py-8 text-xs text-zinc-600 sm:flex-row"><Brand /><p>© 2026 Trung AI Studio. Prompt tốt, ý tưởng lớn.</p></footer></main></div>{selected && <PromptModal item={selected} close={closeModal} copied={copied} copy={copyPrompt} />}{toast && <div className="fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-950/95 px-4 py-3 text-sm font-bold text-emerald-200 shadow-2xl backdrop-blur-md"><Check className="h-4 w-4" /> Đã sao chép Prompt</div>}</div>;
}
