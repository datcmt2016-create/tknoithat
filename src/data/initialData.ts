import { Category, Product, StoreSettings, User, Favorite } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  name: 'CDHome',
  logo: '/cdhome-logo.svg',
  phone: '0988123456',
  zaloPhone: '0988123456',
  messengerUsername: 'cdhomeatelier',
  facebookPageUrl: 'https://facebook.com/cdhomeatelier',
  email: 'tuvan@cdhomeatelier.vn',
  address: '215 Nguyễn Văn Hưởng, Phường Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh',
  openingHours: '09:00 - 20:00 (Thứ 2 - Chủ Nhật)',
  mapsUrl: 'https://maps.google.com/?q=215+Nguyen+Van+Huong+Thao+Dien+Thu+Duc',
  heroImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&q=85',
  heroHeadline: 'Không Gian Tĩnh Tại & Nghệ Thuật Chế Tác',
  heroTagline: 'Mỗi món đồ nội thất tại CDHome là sự kết hợp giữa triết lý Japandi tối giản và kỹ nghệ thủ công chuẩn mực từ gỗ óc chó tự nhiên.',
  bandQuote: 'Sự xa xỉ đích thực không ồn ào; nó hiện diện trong từng đường mộng ghép, vân gỗ trầm mặc và sự an yên trong tâm hồn gia chủ.',
  seasonalBannerImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1920&q=85',
  seasonalBannerTitle: 'Bộ Sưu Tập Giường Ngủ & Tịnh Dưỡng 2025',
  seasonalBannerText: 'Trải nghiệm không gian nghỉ ngơi thư thái với những tác phẩm chế tác từ gỗ sồi tự nhiên, vải len dệt mộc và tỷ lệ công thái học hoàn mỹ.'
};

export const INITIAL_CATEGORIES: Category[] = [
  // 8 Top-level Categories (parentId = null)
  {
    id: 'cat-sofa',
    name: 'Sofa và Armchair',
    slug: 'sofa-va-armchair',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    description: 'Nơi khởi đầu của mọi câu chuyện sum vầy với sofa da bò Ý và armchair phom dáng công thái học tĩnh lặng.',
    order: 1,
    isVisible: true
  },
  {
    id: 'cat-ban',
    name: 'Bàn',
    slug: 'ban',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
    description: 'Từ bàn trà mặt đá Carrara vát cạnh kim cương đến bàn ăn gỗ óc chó nguyên khối cho bữa tiệc gia đình.',
    order: 2,
    isVisible: true
  },
  {
    id: 'cat-ghe',
    name: 'Ghế',
    slug: 'ghe',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    description: 'Nâng niu từng tư thế ngồi với đường cong uốn gỗ nhiệt điêu luyện và lớp da nappa êm ái.',
    order: 3,
    isVisible: true
  },
  {
    id: 'cat-giuong',
    name: 'Giường ngủ',
    slug: 'giuong-ngu',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
    description: 'Chốn tịnh dưỡng thân tâm cùng các thiết kế giường ngủ gỗ tự nhiên Mộc Miên mang phong vị Japandi thuần khiết.',
    order: 4,
    isVisible: true
  },
  {
    id: 'cat-tu-ke',
    name: 'Tủ và kệ',
    slug: 'tu-va-ke',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
    description: 'Hệ tủ kệ tối giản, cánh kính anodized và giải pháp lưu trữ thông minh giữ không gian luôn gọn gàng.',
    order: 5,
    isVisible: true
  },
  {
    id: 'cat-bep',
    name: 'Bếp',
    slug: 'bep',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
    description: 'Không gian ẩm thực đậm chất nghệ thuật với đảo bếp đá cẩm thạch và hệ phụ kiện âm tủ tinh xảo.',
    order: 6,
    isVisible: true
  },
  {
    id: 'cat-decor',
    name: 'Hàng trang trí',
    slug: 'hang-trang-tri',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
    description: 'Đèn chùm pha lê thổi tay, thảm len New Zealand và tượng điêu khắc đồng tạo điểm chạm cảm xúc.',
    order: 7,
    isVisible: true
  },
  {
    id: 'cat-ngoai-that',
    name: 'Ngoại thất',
    slug: 'ngoai-that',
    parentId: null,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'Nội thất sân vườn, ban công chế tác từ gỗ Teak kháng nước thích nghi hoàn hảo với khí hậu nhiệt đới.',
    order: 8,
    isVisible: true
  },

  // Sub-categories mapped to parentId
  // 1. Sofa và Armchair
  { id: 'sub-sofa-bang', name: 'Sofa Băng', slug: 'sofa-bang', parentId: 'cat-sofa', image: '', order: 1, isVisible: true },
  { id: 'sub-sofa-goc', name: 'Sofa Góc L-Shape', slug: 'sofa-goc', parentId: 'cat-sofa', image: '', order: 2, isVisible: true },
  { id: 'sub-armchair', name: 'Armchair & Ghế Đơn', slug: 'armchair-ghe-don', parentId: 'cat-sofa', image: '', order: 3, isVisible: true },
  { id: 'sub-don-sofa', name: 'Đôn Sofa', slug: 'don-sofa', parentId: 'cat-sofa', image: '', order: 4, isVisible: true },

  // 2. Bàn
  { id: 'sub-ban-tra', name: 'Bàn Trà & Bàn Tab', slug: 'ban-tra', parentId: 'cat-ban', image: '', order: 1, isVisible: true },
  { id: 'sub-ban-an-go', name: 'Bàn Ăn Gỗ Tự Nhiên', slug: 'ban-an-go', parentId: 'cat-ban', image: '', order: 2, isVisible: true },
  { id: 'sub-ban-an-da', name: 'Bàn Ăn Mặt Đá', slug: 'ban-an-da', parentId: 'cat-ban', image: '', order: 3, isVisible: true },
  { id: 'sub-ban-lam-viec', name: 'Bàn Làm Việc', slug: 'ban-lam-viec', parentId: 'cat-ban', image: '', order: 4, isVisible: true },

  // 3. Ghế
  { id: 'sub-ghe-an', name: 'Ghế Ăn', slug: 'ghe-an', parentId: 'cat-ghe', image: '', order: 1, isVisible: true },
  { id: 'sub-ghe-thu-gian', name: 'Ghế Thư Giãn', slug: 'ghe-thu-gian', parentId: 'cat-ghe', image: '', order: 2, isVisible: true },
  { id: 'sub-ghe-lam-viec', name: 'Ghế Làm Việc', slug: 'ghe-lam-viec', parentId: 'cat-ghe', image: '', order: 3, isVisible: true },
  { id: 'sub-ghe-bar', name: 'Ghế Bar & Counter', slug: 'ghe-bar', parentId: 'cat-ghe', image: '', order: 4, isVisible: true },

  // 4. Giường ngủ
  { id: 'sub-giuong-go', name: 'Giường Gỗ Tự Nhiên', slug: 'giuong-go-tu-nhien', parentId: 'cat-giuong', image: '', order: 1, isVisible: true },
  { id: 'sub-giuong-nem', name: 'Giường Bọc Nệm', slug: 'giuong-boc-nem', parentId: 'cat-giuong', image: '', order: 2, isVisible: true },
  { id: 'sub-tab-dau-giuong', name: 'Tab Đầu Giường', slug: 'tab-dau-giuong', parentId: 'cat-giuong', image: '', order: 3, isVisible: true },

  // 5. Tủ và kệ
  { id: 'sub-tu-quan-ao', name: 'Tủ Quần Áo', slug: 'tu-quan-ao', parentId: 'cat-tu-ke', image: '', order: 1, isVisible: true },
  { id: 'sub-ke-tivi', name: 'Kệ Tivi', slug: 'ke-tivi', parentId: 'cat-tu-ke', image: '', order: 2, isVisible: true },
  { id: 'sub-tu-ruou', name: 'Tủ Rượu & Buffet', slug: 'tu-ruou-buffet', parentId: 'cat-tu-ke', image: '', order: 3, isVisible: true },
  { id: 'sub-ke-sach', name: 'Kệ Sách', slug: 'ke-sach', parentId: 'cat-tu-ke', image: '', order: 4, isVisible: true },

  // 6. Bếp
  { id: 'sub-he-tu-bep', name: 'Hệ Tủ Bếp Module', slug: 'he-tu-bep', parentId: 'cat-bep', image: '', order: 1, isVisible: true },
  { id: 'sub-dao-bep', name: 'Đảo Bếp Đá Tự Nhiên', slug: 'dao-bep', parentId: 'cat-bep', image: '', order: 2, isVisible: true },

  // 7. Hàng trang trí
  { id: 'sub-den-trang-tri', name: 'Đèn Trang Trí & Chiếu Sáng', slug: 'den-trang-tri', parentId: 'cat-decor', image: '', order: 1, isVisible: true },
  { id: 'sub-tham-det', name: 'Thảm Dệt Len', slug: 'tham-det', parentId: 'cat-decor', image: '', order: 2, isVisible: true },
  { id: 'sub-gom-dieu-khac', name: 'Gốm & Điêu Khắc', slug: 'gom-dieu-khac', parentId: 'cat-decor', image: '', order: 3, isVisible: true },

  // 8. Ngoại thất
  { id: 'sub-ban-ghe-ngoai-troi', name: 'Bàn Ghế Ngoài Trời', slug: 'ban-ghe-ngoai-troi', parentId: 'cat-ngoai-that', image: '', order: 1, isVisible: true },
  { id: 'sub-sofa-san-vuon', name: 'Sofa Sân Vườn', slug: 'sofa-san-vuon', parentId: 'cat-ngoai-that', image: '', order: 2, isVisible: true }
];

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Giường Gỗ Tự Nhiên Mộc Miên (Main highlight)
  {
    id: 'prod-001',
    code: 'CDH-BD-01',
    name: 'Giường Gỗ Tự Nhiên Mộc Miên',
    slug: 'giuong-go-tu-nhien-moc-mien',
    categoryId: 'cat-giuong',
    subCategoryId: 'sub-giuong-go',
    shortDescription: 'Tác phẩm giường ngủ gỗ sồi tự nhiên FAS mang triết lý Japandi, đầu giường uốn cong nhẹ nhàng tạo cảm giác tĩnh tại trọn vẹn.',
    isVisible: true,
    isFeatured: true,
    isNew: true,
    createdAt: '2025-01-10T08:00:00Z',
    updatedAt: '2025-01-10T08:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    hoverImageIndex: 1,
    colors: [
      { name: 'Gỗ Sồi Tự Nhiên', hex: '#C2A385' },
      { name: 'Gỗ Óc Chó Trầm', hex: '#5C4433' }
    ],
    materialTags: ['Gỗ sồi tự nhiên', 'Gỗ óc chó', 'Lau dầu thực vật'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)', 'Lớn (>2m)'],
    styleTags: ['Japandi', 'Minimalist', 'Quiet Luxury'],
    items: [
      {
        name: 'Giường King Size',
        dimensions: { length: 215, width: 190, height: 95, note: 'Kích thước lọt lòng đệm 180 x 200 cm' }
      },
      {
        name: 'Giường Queen Size',
        dimensions: { length: 215, width: 170, height: 95, note: 'Kích thước lọt lòng đệm 160 x 200 cm' }
      }
    ],
    materials: [
      { part: 'Khung sườn chính', material: 'Gỗ Sồi (White Oak) nhập khẩu Bắc Mỹ tiêu chuẩn FAS' },
      { part: 'Hệ giát giường', material: 'Hệ thanh nan cong gỗ Bạch Dương chịu lực nâng đỡ cột sống' },
      { part: 'Bề mặt hoàn thiện', material: 'Sơn lau dầu gốc thực vật hữu cơ Rubio Monocoat (Bỉ) không mùi hóa chất' }
    ],
    highlights: [
      {
        title: 'Đường mộng giấu kín tinh tế',
        text: 'Sử dụng kỹ thuật ghép mộng mộng chốt truyền thống không để lộ ốc vít kim loại ra bề mặt.',
        image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80'
      },
      {
        title: 'Tựa đầu giường vát góc 105°',
        text: 'Góc nghiêng được tính toán dựa trên sinh trắc học đem lại sự êm ái khi đọc sách trước khi ngủ.'
      }
    ],
    details: [
      {
        itemName: 'Giường Mộc Miên',
        title: 'Không gian tĩnh lặng cho giấc ngủ sâu',
        text: 'Lấy cảm hứng từ những đóa mộc miên nở rộ vào mùa xuân, chiếc giường như một nét chấm phá an yên trong gian phòng ngủ.'
      }
    ],
    dimensionImages: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=800&q=80'
    ],
    materialCards: [
      {
        name: 'Gỗ Sồi Trắng Bắc Mỹ',
        text: 'Cốt gỗ đanh chắc, vân núi cuộn sóng đẹp mắt, được sấy đạt độ ẩm tiêu chuẩn 10-12% chống co ngót nứt nẻ.'
      }
    ],
    lifestyleImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80',
    relatedProductIds: ['prod-002', 'prod-003', 'prod-008']
  },

  // 2. Tab Đầu Giường Tịnh Dưỡng An
  {
    id: 'prod-002',
    code: 'CDH-TB-02',
    name: 'Tab Đầu Giường Tịnh Dưỡng An',
    slug: 'tab-dau-giuong-tinh-duong-an',
    categoryId: 'cat-giuong',
    subCategoryId: 'sub-tab-dau-giuong',
    shortDescription: 'Thiết kế tủ đầu giường bo góc mềm mại, kết hợp hộc kéo giảm chấn ẩn hoàn toàn vẻ cơ khí.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-01-12T09:00:00Z',
    updatedAt: '2025-01-12T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Gỗ Sồi Trắng', hex: '#C2A385' }],
    materialTags: ['Gỗ sồi tự nhiên', 'Đồng thau'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Japandi', 'Minimalist'],
    items: [
      {
        name: 'Tab đầu giường đơn',
        dimensions: { length: 50, width: 42, height: 48, note: 'Khớp chiều cao với giường Mộc Miên' }
      }
    ],
    materials: [
      { part: 'Khung thân', material: 'Gỗ Sồi tự nhiên nguyên tấm' },
      { part: 'Phụ kiện', material: 'Ray trượt âm giảm chấn Blum (Áo)' }
    ],
    highlights: [{ title: 'Khay đặt sạc ẩn', text: 'Thiết kế khe thoát dây tinh tế không làm rối mắt.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-001', 'prod-003']
  },

  // 3. Giường Ngủ Nệm Bouclé Oslo Serenity
  {
    id: 'prod-003',
    code: 'CDH-BD-03',
    name: 'Giường Ngủ Nệm Bouclé Oslo Serenity',
    slug: 'giuong-ngu-nem-boucle-oslo',
    categoryId: 'cat-giuong',
    subCategoryId: 'sub-giuong-nem',
    shortDescription: 'Đầu giường cong vòm bọc vải dệt hạt len Bouclé cao cấp nhập khẩu từ Pháp êm ái như đám mây.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [
      { name: 'Trắng Kem Bouclé', hex: '#F5F2EB' },
      { name: 'Cát Sa Mạc', hex: '#D7C7B5' }
    ],
    materialTags: ['Vải Bouclé', 'Gỗ tự nhiên', 'Đệm lông vũ'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury', 'Japandi'],
    items: [
      {
        name: 'Giường Super King',
        dimensions: { length: 228, width: 205, height: 115, note: 'Đệm 200 x 220 cm' }
      }
    ],
    materials: [
      { part: 'Chất liệu bọc', material: 'Vải dệt hạt len Bouclé Pháp 450gsm' },
      { part: 'Khung cốt', material: 'Gỗ sồi Nga gia cường chịu lực 500kg' }
    ],
    highlights: [{ title: 'Cảm giác chạm êm ái', text: 'Chất vải sợi xoắn giữ ấm mùa đông và thoáng mát mùa hè.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-001', 'prod-002']
  },

  // 4. Sofa Băng Da Ý Roma Grand
  {
    id: 'prod-004',
    code: 'CDH-SF-01',
    name: 'Sofa Băng Da Ý Roma Grand',
    slug: 'sofa-bang-da-y-roma-grand',
    categoryId: 'cat-sofa',
    subCategoryId: 'sub-sofa-bang',
    shortDescription: 'Chế tác từ da bò thuộc thảo mộc nguyên tấm nhập khẩu Tuscany, đệm mút kết hợp lông vũ tự nhiên.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-01-16T11:00:00Z',
    updatedAt: '2025-01-16T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [
      { name: 'Nâu Cognac', hex: '#7A4B29' },
      { name: 'Kem Ivory', hex: '#EDE8DF' }
    ],
    materialTags: ['Da Ý', 'Gỗ Teak', 'Thép mạ PVD'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Sofa 3 chỗ',
        dimensions: { length: 260, width: 102, height: 78, note: 'Chiều cao ngồi 43 cm' }
      }
    ],
    materials: [
      { part: 'Bề mặt bọc', material: 'Da bò Aniline mộc 100% tuyển chọn từ Ý' },
      { part: 'Khung sườn', material: 'Gỗ Dẻ Gai Châu Âu sấy nhiệt cao' }
    ],
    highlights: [{ title: 'Da thở tự nhiên', text: 'Bề mặt giữ trọn vân da nguyên thủy, càng dùng càng lên nước bóng đẹp.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-005', 'prod-006']
  },

  // 5. Sofa Góc L Modul Soft Japandi
  {
    id: 'prod-005',
    code: 'CDH-SF-02',
    name: 'Sofa Góc L Modul Soft Japandi',
    slug: 'sofa-goc-l-modul-soft-japandi',
    categoryId: 'cat-sofa',
    subCategoryId: 'sub-sofa-goc',
    shortDescription: 'Kết cấu khối modul linh hoạt cho phép đổi góc L trái phải dễ dàng, vải dệt công nghệ chống thấm.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-01-18T14:00:00Z',
    updatedAt: '2025-01-18T14:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Ghi Xám Sương', hex: '#C7C2BA' }],
    materialTags: ['Vải dệt công nghệ', 'Gỗ sồi'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Japandi', 'Minimalist'],
    items: [
      {
        name: 'Bộ sofa 4 khối',
        dimensions: { length: 320, width: 185, height: 74, note: 'Góc L sâu 185 cm' }
      }
    ],
    materials: [
      { part: 'Vải bọc', material: 'Vải sợi dừa kháng nước Nano Easy-Clean' }
    ],
    highlights: [{ title: 'Dễ dàng tháo giặt', text: 'Vỏ đệm tháo rời giặt hấp tiện lợi cho gia đình có trẻ nhỏ.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-006']
  },

  // 6. Armchair Thư Giãn Milano Nâu Ấm
  {
    id: 'prod-006',
    code: 'CDH-AC-03',
    name: 'Armchair Thư Giãn Milano Nâu Ấm',
    slug: 'armchair-thu-gian-milano',
    categoryId: 'cat-sofa',
    subCategoryId: 'sub-armchair',
    shortDescription: 'Chiếc ghế biểu tượng với lưng uốn cong từ 7 lớp gỗ óc chó ép nhiệt, chân xoay 360 độ êm ái.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-01-20T15:00:00Z',
    updatedAt: '2025-01-20T15:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580481077195-c228ff31a78a?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Da Bò Cognac & Walnut', hex: '#634832' }],
    materialTags: ['Gỗ óc chó', 'Da Ý', 'Hợp kim nhôm'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Ghế và đôn',
        dimensions: { length: 88, width: 85, height: 84, note: 'Bao gồm đôn chân 65 x 54 cm' }
      }
    ],
    materials: [
      { part: 'Thân ghế', material: 'Ván ép uốn gỗ Óc Chó tự nhiên FAS' }
    ],
    highlights: [{ title: 'Xoay 360° êm ru', text: 'Trục bi hợp kim tĩnh âm chống xước sàn nhà.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-007']
  },

  // 7. Bàn Trà Đôi Đá Cẩm Thạch Carrara
  {
    id: 'prod-007',
    code: 'CDH-TB-04',
    name: 'Bàn Trà Đôi Đá Cẩm Thạch Carrara',
    slug: 'ban-tra-doi-da-cam-thach-carrara',
    categoryId: 'cat-ban',
    subCategoryId: 'sub-ban-tra',
    shortDescription: 'Cặp bàn lồng thông minh kết hợp mặt đá Carrara vân mây Ý và mặt gỗ sồi phay xước viền đồng.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-01-22T08:00:00Z',
    updatedAt: '2025-01-22T08:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Trắng Carrara & Đồng', hex: '#EAE6DF' }],
    materialTags: ['Đá cẩm thạch', 'Đồng thau', 'Gỗ sồi'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Quiet Luxury', 'Japandi'],
    items: [
      {
        name: 'Bộ 2 bàn lồng',
        dimensions: { length: 90, width: 90, height: 38, note: 'Bàn nhỏ D60 x C45 cm' }
      }
    ],
    materials: [
      { part: 'Mặt bàn lớn', material: 'Đá cẩm thạch tự nhiên Carrara Ý 18mm chống ố Nano' }
    ],
    highlights: [{ title: 'Vát cạnh kim cương', text: 'Bo tròn an toàn cho trẻ em.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-006']
  },

  // 8. Bàn Ăn Mặt Đá Calacatta Gold
  {
    id: 'prod-008',
    code: 'CDH-DT-05',
    name: 'Bàn Ăn Mặt Đá Calacatta Gold',
    slug: 'ban-an-mat-da-calacatta-gold',
    categoryId: 'cat-ban',
    subCategoryId: 'sub-ban-an-da',
    shortDescription: 'Đá tự nhiên Calacatta vân chỉ vàng quý hiếm phối cùng chân đế gỗ óc chó điêu khắc tinh xảo.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-01-25T09:00:00Z',
    updatedAt: '2025-01-25T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533779283484-8da497b1736c?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Calacatta Vân Vàng', hex: '#FAF6EF' }],
    materialTags: ['Đá cẩm thạch', 'Gỗ óc chó'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Bàn ăn 8 - 10 người',
        dimensions: { length: 240, width: 100, height: 75, note: 'Có thể đặt dài tới 300 cm' }
      }
    ],
    materials: [
      { part: 'Mặt đá', material: 'Đá Calacatta Gold tự nhiên mỏ Carrara Ý' },
      { part: 'Chân bàn', material: 'Gỗ óc chó tự nhiên gia công CNC 5 trục' }
    ],
    highlights: [{ title: 'Men phủ Nano Crystal', text: 'Chống ố cà phê, rượu vang và nhiệt độ cao.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-009', 'prod-010']
  },

  // 9. Bàn Ăn Gỗ Óc Chó Mộc Bản Kyoto
  {
    id: 'prod-009',
    code: 'CDH-DT-06',
    name: 'Bàn Ăn Gỗ Óc Chó Mộc Bản Kyoto',
    slug: 'ban-an-go-oc-cho-kyoto',
    categoryId: 'cat-ban',
    subCategoryId: 'sub-ban-an-go',
    shortDescription: 'Gỗ óc chó nguyên khối bề mặt giữ cạnh mộc tự nhiên (Live-edge), đậm chất Wabi Sabi tĩnh lặng.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-01-28T10:00:00Z',
    updatedAt: '2025-01-28T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1533779283484-8da497b1736c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Nâu Óc Chó Mộc', hex: '#4A3525' }],
    materialTags: ['Gỗ óc chó', 'Lau dầu thực vật'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Japandi', 'Wabi Sabi'],
    items: [
      {
        name: 'Bàn ăn 6 - 8 người',
        dimensions: { length: 220, width: 95, height: 75, note: 'Độ dày mặt gỗ 4.5 cm' }
      }
    ],
    materials: [{ part: 'Mặt bàn', material: 'Gỗ óc chó Bắc Mỹ tự nhiên FAS' }],
    highlights: [{ title: 'Vân gỗ độc bản', text: 'Mỗi thân cây sở hữu một đường lượn sóng tự nhiên duy nhất.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-008', 'prod-010']
  },

  // 10. Ghế Ăn Verona Lưng Cong Điêu Khắc
  {
    id: 'prod-010',
    code: 'CDH-CH-07',
    name: 'Ghế Ăn Verona Lưng Cong Điêu Khắc',
    slug: 'ghe-an-verona-lung-cong',
    categoryId: 'cat-ghe',
    subCategoryId: 'sub-ghe-an',
    shortDescription: 'Đường cong thanh tao ôm trọn lưng người ngồi với khung gỗ sồi uốn nhiệt nghệ thuật và đệm da Nappa.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-01T11:00:00Z',
    updatedAt: '2025-02-01T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533779283484-8da497b1736c?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [
      { name: 'Da Bò Đen Khung Sồi', hex: '#262422' },
      { name: 'Da Nâu Khung Walnut', hex: '#5E4633' }
    ],
    materialTags: ['Gỗ sồi tự nhiên', 'Da Ý'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Japandi', 'Minimalist'],
    items: [
      {
        name: 'Ghế ăn đơn',
        dimensions: { length: 54, width: 56, height: 78, note: 'Chiều cao ngồi 46 cm' }
      }
    ],
    materials: [{ part: 'Khung ghế', material: 'Gỗ Sồi (White Oak) uốn nhiệt tần số cao' }],
    highlights: [{ title: 'Đệm da siêu mềm', text: 'Mút ép lạnh giữ độ nảy suốt nhiều năm không xẹp lún.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-008', 'prod-009']
  },

  // 11. Bàn Làm Việc Giám Đốc Metropolitan
  {
    id: 'prod-011',
    code: 'CDH-DK-08',
    name: 'Bàn Làm Việc Giám Đốc Metropolitan',
    slug: 'ban-lam-viec-metropolitan',
    categoryId: 'cat-ban',
    subCategoryId: 'sub-ban-lam-viec',
    shortDescription: 'Đường nét vát góc dũng mãnh, tích hợp cụm sạc không dây ẩn dưới mặt veneer óc chó và tủ ngăn kéo khóa vân tay.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-03T09:00:00Z',
    updatedAt: '2025-02-03T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Óc Chó Bắc Mỹ & Titan', hex: '#3E3127' }],
    materialTags: ['Gỗ óc chó', 'Thép mạ PVD'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Bàn chính kèm tủ phụ',
        dimensions: { length: 220, width: 95, height: 76, note: 'Tủ phụ L-return 120 x 50 cm' }
      }
    ],
    materials: [{ part: 'Mặt bàn', material: 'Gỗ óc chó tự nhiên phối tấm da viết ký tên' }],
    highlights: [{ title: 'Quản lý dây ẩn', text: 'Cụm ổ điện và cổng kết nối bật mở êm ái.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-012', 'prod-014']
  },

  // 12. Ghế Làm Việc Da Ý Công Thái Học
  {
    id: 'prod-012',
    code: 'CDH-OC-09',
    name: 'Ghế Làm Việc Da Ý Công Thái Học',
    slug: 'ghe-lam-viec-da-y-ergonomic',
    categoryId: 'cat-ghe',
    subCategoryId: 'sub-ghe-lam-viec',
    shortDescription: 'Cơ chế ngả lưng đa điểm với đệm đỡ thắt lưng điều chỉnh linh hoạt, bọc da bò hạt sang trọng.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-05T10:00:00Z',
    updatedAt: '2025-02-05T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1580481077195-c228ff31a78a?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Đen Mờ Onyx', hex: '#1F1E1D' }],
    materialTags: ['Da Ý', 'Hợp kim nhôm'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Minimalist'],
    items: [
      {
        name: 'Ghế xoay giám đốc',
        dimensions: { length: 68, width: 68, height: 122, note: 'Ben hơi nâng hạ chuẩn Class 4' }
      }
    ],
    materials: [{ part: 'Da bọc', material: '100% Da bò Top-grain Ý' }],
    highlights: [{ title: 'Nâng đỡ thắt lưng', text: 'Hạn chế tối đa mỏi lưng khi làm việc kéo dài.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-011']
  },

  // 13. Tủ Áo Cánh Kính Anodized Kyoto
  {
    id: 'prod-013',
    code: 'CDH-WR-10',
    name: 'Tủ Áo Cánh Kính Anodized Kyoto',
    slug: 'tu-ao-canh-kinh-anodized-kyoto',
    categoryId: 'cat-tu-ke',
    subCategoryId: 'sub-tu-quan-ao',
    shortDescription: 'Hệ tủ áo khung nhôm siêu mỏng mạ Anodized màu Champagne kết hợp kính xám khói và đèn LED cảm ứng.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-07T11:00:00Z',
    updatedAt: '2025-02-07T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Kính Khói Khung Champagne', hex: '#A89988' }],
    materialTags: ['Kính cường lực', 'Nhôm Anodized', 'Gỗ công nghiệp E0'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury', 'Minimalist'],
    items: [
      {
        name: 'Tủ áo 4 cánh',
        dimensions: { length: 240, width: 60, height: 260, note: 'May đo chạm trần theo công trình' }
      }
    ],
    materials: [{ part: 'Cánh kính', material: 'Kính cường lực màu khói 5mm không vỡ' }],
    highlights: [{ title: 'LED âm thanh nhôm', text: 'Đèn sáng dịu mắt khi mở cánh cửa tủ.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-001', 'prod-002']
  },

  // 14. Kệ Tivi Gỗ Sồi Bắc Mỹ Kanso
  {
    id: 'prod-014',
    code: 'CDH-TV-11',
    name: 'Kệ Tivi Gỗ Sồi Bắc Mỹ Kanso',
    slug: 'ke-tivi-go-soi-kanso',
    categoryId: 'cat-tu-ke',
    subCategoryId: 'sub-ke-tivi',
    shortDescription: 'Thiết kế nan gỗ chạy song song đậm chất thiền định, giấu kín thiết bị amply mà vẫn nhận tín hiệu điều khiển.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-09T08:00:00Z',
    updatedAt: '2025-02-09T08:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1533090161767-e6ffed986b88?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Sồi Tự Nhiên Mộc', hex: '#C2A385' }],
    materialTags: ['Gỗ sồi tự nhiên'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Japandi', 'Minimalist'],
    items: [
      {
        name: 'Kệ tivi đặt sàn',
        dimensions: { length: 200, width: 45, height: 42, note: 'Tải trọng đặt tivi tới 100kg' }
      }
    ],
    materials: [{ part: 'Toàn bộ thân', material: 'Gỗ sồi trắng tự nhiên' }],
    highlights: [{ title: 'Nan gió thoáng khí', text: 'Giúp tản nhiệt cho các thiết bị âm thanh giải trí.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-007']
  },

  // 15. Tủ Rượu & Buffet Florence
  {
    id: 'prod-015',
    code: 'CDH-BF-12',
    name: 'Tủ Rượu & Buffet Florence',
    slug: 'tu-ruou-buffet-florence',
    categoryId: 'cat-tu-ke',
    subCategoryId: 'sub-tu-ruou',
    shortDescription: 'Cánh tủ uốn lượn 3D phay CNC nguyên tấm gỗ óc chó, mặt trên ốp đá Marble Nero Marquina đen tuyền.',
    isVisible: true,
    isFeatured: false,
    isNew: false,
    createdAt: '2025-02-11T13:00:00Z',
    updatedAt: '2025-02-11T13:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Gỗ Óc Chó & Đá Đen', hex: '#3B2F25' }],
    materialTags: ['Gỗ óc chó', 'Đá cẩm thạch'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Tủ buffet 4 cánh',
        dimensions: { length: 180, width: 50, height: 86, note: 'Kèm giá treo ly rượu vang' }
      }
    ],
    materials: [{ part: 'Mặt đá', material: 'Đá Marble Nero Marquina nhập khẩu Tây Ban Nha' }],
    highlights: [{ title: 'Cánh gỗ điêu khắc', text: 'Hiệu ứng gợn sóng khúc xạ ánh sáng huyền ảo.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-008', 'prod-010']
  },

  // 16. Kệ Sách Điêu Khắc Vòm Cung Pantheon
  {
    id: 'prod-016',
    code: 'CDH-BK-13',
    name: 'Kệ Sách Điêu Khắc Vòm Cung Pantheon',
    slug: 'ke-sach-dieu-khac-pantheon',
    categoryId: 'cat-tu-ke',
    subCategoryId: 'sub-ke-sach',
    shortDescription: 'Lấy cảm hứng từ mái vòm đền Pantheon, các tầng kệ uốn lượn phân chia không gian lưu trữ và trưng bày sách quý.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-13T09:00:00Z',
    updatedAt: '2025-02-13T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Sồi Tự Nhiên', hex: '#C2A385' }],
    materialTags: ['Gỗ sồi tự nhiên'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Japandi', 'Minimalist'],
    items: [
      {
        name: 'Kệ sách cao 5 tầng',
        dimensions: { length: 160, width: 38, height: 210, note: 'Gắn cố định vào tường' }
      }
    ],
    materials: [{ part: 'Cốt gỗ', material: 'Gỗ sồi Bắc Mỹ' }],
    highlights: [{ title: 'Vòm cong điêu khắc', text: 'Mang phong vị kiến trúc cổ điển vào căn hộ hiện đại.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-011', 'prod-012']
  },

  // 17. Đảo Bếp Mặt Đá Thạch Anh Atelier
  {
    id: 'prod-017',
    code: 'CDH-KT-14',
    name: 'Đảo Bếp Mặt Đá Thạch Anh Atelier',
    slug: 'dao-bep-mat-da-thach-anh',
    categoryId: 'cat-bep',
    subCategoryId: 'sub-dao-bep',
    shortDescription: 'Khối đảo bếp trung tâm bề thế, mặt đá thạch anh nhân tạo kháng khuẩn kháng ố vĩnh viễn tích hợp bếp từ âm.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-15T10:00:00Z',
    updatedAt: '2025-02-15T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Đá Trắng Vicostone & Gỗ Óc Chó', hex: '#ECE8E1' }],
    materialTags: ['Đá cẩm thạch', 'Gỗ óc chó', 'Inox 304'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Đảo bếp kèm quầy bar',
        dimensions: { length: 260, width: 90, height: 90, note: 'Đã sẵn sàng đường chờ điện nước' }
      }
    ],
    materials: [{ part: 'Mặt bàn đảo', material: 'Đá thạch anh cao cấp độ cứng cấp 7' }],
    highlights: [{ title: 'Kháng khuẩn 99.9%', text: 'An toàn trực tiếp khi nhào bột và chế biến món ăn.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-018', 'prod-008']
  },

  // 18. Ghế Bar Bọc Da Nappa Tuscany
  {
    id: 'prod-018',
    code: 'CDH-BC-15',
    name: 'Ghế Bar Bọc Da Nappa Tuscany',
    slug: 'ghe-bar-boc-da-nappa-tuscany',
    categoryId: 'cat-ghe',
    subCategoryId: 'sub-ghe-bar',
    shortDescription: 'Ghế quầy bar thanh thoát với chân thép đặc vuốt côn mạ PVD đồng xước và đệm ngồi bọc da bò êm ái.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-17T11:00:00Z',
    updatedAt: '2025-02-17T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Da Bò Camel & Đồng', hex: '#875631' }],
    materialTags: ['Da Ý', 'Thép mạ PVD'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Quiet Luxury', 'Minimalist'],
    items: [
      {
        name: 'Ghế bar cao',
        dimensions: { length: 48, width: 50, height: 95, note: 'Chiều cao ngồi 75 cm' }
      }
    ],
    materials: [{ part: 'Khung chân', material: 'Thép đặc tiện CNC mạ PVD Champagne' }],
    highlights: [{ title: 'Vòng gác chân vững chắc', text: 'Tạo tư thế ngồi vững chãi, thoải mái uống trà.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-017', 'prod-010']
  },

  // 19. Đèn Chùm Pha Lê Thổi Tay Aurora
  {
    id: 'prod-019',
    code: 'CDH-LP-16',
    name: 'Đèn Chùm Pha Lê Thổi Tay Aurora',
    slug: 'den-chum-pha-le-aurora',
    categoryId: 'cat-decor',
    subCategoryId: 'sub-den-trang-tri',
    shortDescription: 'Hàng trăm cánh thủy tinh thổi thủ công uốn lượn như dải cực quang, khúc xạ ánh sáng vàng ấm 3000K dịu mắt.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-19T14:00:00Z',
    updatedAt: '2025-02-19T14:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Thủy Tinh Khói Mờ', hex: '#E0D8CE' }],
    materialTags: ['Thủy tinh thổi', 'Đồng thau'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Đèn chùm vòm',
        dimensions: { length: 110, width: 110, height: 80, note: 'Dây thả điều chỉnh 50 - 250 cm' }
      }
    ],
    materials: [{ part: 'Chao đèn', material: 'Thủy tinh borosilicate thổi nhiệt độ cao' }],
    highlights: [{ title: 'Chỉ số hoàn màu CRI>95', text: 'Tôn vinh màu sắc da người và món ăn chân thực.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-008', 'prod-004']
  },

  // 20. Đèn Sàn Arc Lamp Chân Đá Cẩm Thạch
  {
    id: 'prod-020',
    code: 'CDH-LP-17',
    name: 'Đèn Sàn Arc Lamp Chân Đá Cẩm Thạch',
    slug: 'den-san-arc-lamp-chan-da',
    categoryId: 'cat-decor',
    subCategoryId: 'sub-den-trang-tri',
    shortDescription: 'Cần đèn vòm kim loại vươn xa 2 mét trên đế đá Marble nguyên khối nặng 35kg chống ngã tuyệt đối.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-21T09:00:00Z',
    updatedAt: '2025-02-21T09:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Đồng Xước & Đá Đen', hex: '#B89B7B' }],
    materialTags: ['Đá cẩm thạch', 'Đồng thau'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Minimalist'],
    items: [
      {
        name: 'Đèn sàn cần vòm',
        dimensions: { length: 200, width: 45, height: 220, note: 'Đế đá đường kính 45 cm' }
      }
    ],
    materials: [{ part: 'Đế đèn', material: 'Đá Marble đen tự nhiên' }],
    highlights: [{ title: 'Công tắc đạp chân', text: 'Bật tắt tiện lợi bằng chân kim loại.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-006']
  },

  // 21. Thảm Len Moroccan Nomad Tự Nhiên
  {
    id: 'prod-021',
    code: 'CDH-CP-18',
    name: 'Thảm Len Moroccan Nomad Tự Nhiên',
    slug: 'tham-len-moroccan-nomad',
    categoryId: 'cat-decor',
    subCategoryId: 'sub-tham-det',
    shortDescription: '100% Sợi len lông cừu New Zealand dệt thắt nút tay truyền thống 180 giờ lao động thủ công.',
    isVisible: true,
    isFeatured: false,
    isNew: false,
    createdAt: '2025-02-23T11:00:00Z',
    updatedAt: '2025-02-23T11:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Len Mộc Vân Đen Trầm', hex: '#EBE5D8' }],
    materialTags: ['Len lông cừu'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Japandi', 'Wabi Sabi'],
    items: [
      {
        name: 'Tấm thảm phòng khách',
        dimensions: { length: 300, width: 200, height: 3, note: 'Sợi len dày 25 mm êm ái' }
      }
    ],
    materials: [{ part: 'Sợi thảm', material: '100% Len cừu New Zealand chải kỹ' }],
    highlights: [{ title: 'Dệt nút tay 120.000 nút/m2', text: 'Không bị bung sợi hay xơ cứng theo thời gian.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-004', 'prod-001']
  },

  // 22. Tượng Điêu Khắc Đồng Balance & Harmony
  {
    id: 'prod-022',
    code: 'CDH-SC-19',
    name: 'Tượng Điêu Khắc Đồng Balance & Harmony',
    slug: 'tuong-dieu-khac-dong-balance',
    categoryId: 'cat-decor',
    subCategoryId: 'sub-gom-dieu-khac',
    shortDescription: 'Đúc thủ công từ đồng đỏ nguyên khối và đánh bóng thủ công tỉ mỉ, đặt trên chân đế đá granite đen tuyền.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-24T15:00:00Z',
    updatedAt: '2025-02-24T15:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Đồng Cổ Patina', hex: '#87694A' }],
    materialTags: ['Đồng thau', 'Đá granite'],
    sizeTags: ['Nhỏ (<1m5)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Tượng điêu khắc',
        dimensions: { length: 32, width: 24, height: 62, note: 'Trọng lượng 12.5 kg' }
      }
    ],
    materials: [{ part: 'Thân tượng', material: 'Đồng đỏ thanh khiết 95%' }],
    highlights: [{ title: 'Phiên bản giới hạn 20 bản', text: 'Có khắc số hiệu và chữ ký nghệ nhân.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-007', 'prod-011']
  },

  // 23. Bộ Bàn Ghế Ngoài Trời Teakwood Sân Vườn
  {
    id: 'prod-023',
    code: 'CDH-OD-20',
    name: 'Bộ Bàn Ghế Ngoài Trời Teakwood Sân Vườn',
    slug: 'bo-ban-ghe-teakwood-ngoai-troi',
    categoryId: 'cat-ngoai-that',
    subCategoryId: 'sub-ban-ghe-ngoai-troi',
    shortDescription: 'Gỗ Teak (Giá Tỵ) tự nhiên chứa hàm lượng dầu cao, không mục nát mối mọt trước nắng mưa nhiệt đới.',
    isVisible: true,
    isFeatured: false,
    isNew: true,
    createdAt: '2025-02-25T10:00:00Z',
    updatedAt: '2025-02-25T10:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Gỗ Teak Nắng Mộc', hex: '#8F6744' }],
    materialTags: ['Gỗ Teak'],
    sizeTags: ['Lớn (>2m)'],
    styleTags: ['Minimalist'],
    items: [
      {
        name: 'Bàn ngoài trời kèm 6 ghế',
        dimensions: { length: 200, width: 90, height: 75, note: 'Ghế xếp gọn tiện lợi' }
      }
    ],
    materials: [{ part: 'Toàn bộ bàn ghế', material: 'Gỗ Teak Myanmar tuyển chọn lõi' }],
    highlights: [{ title: 'Kháng nước tuyệt đối', text: 'Càng dầm sương nắng càng ngả màu xám bạc quý phái.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-024']
  },

  // 24. Ghế Thư Giãn Dài Daybed Pavilion
  {
    id: 'prod-024',
    code: 'CDH-OD-21',
    name: 'Ghế Thư Giãn Dài Daybed Pavilion',
    slug: 'ghe-thu-gian-daybed-pavilion',
    categoryId: 'cat-ngoai-that',
    subCategoryId: 'sub-sofa-san-vuon',
    shortDescription: 'Daybed tắm nắng bên hồ bơi với khung nhôm sơn tĩnh điện cao cấp, nệm thoát nước nhanh bọc vải Sunbrella.',
    isVisible: true,
    isFeatured: true,
    isNew: false,
    createdAt: '2025-02-26T16:00:00Z',
    updatedAt: '2025-02-26T16:00:00Z',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    ],
    mainImageIndex: 0,
    colors: [{ name: 'Trắng Sữa Sunbrella', hex: '#EDE8E1' }],
    materialTags: ['Vải Sunbrella', 'Nhôm Anodized'],
    sizeTags: ['Tiêu chuẩn (1m6 - 2m)'],
    styleTags: ['Quiet Luxury'],
    items: [
      {
        name: 'Giường tắm nắng đơn',
        dimensions: { length: 200, width: 80, height: 35, note: 'Lưng nâng 5 cấp độ thư giãn' }
      }
    ],
    materials: [{ part: 'Vải bọc ngoài trời', material: 'Vải dệt Sunbrella chống tia UV chống phai màu 5 năm' }],
    highlights: [{ title: 'Mút QuickDry Foam', text: 'Khô ráo chỉ sau 30 phút dính mưa rào.' }],
    details: [],
    dimensionImages: [],
    materialCards: [],
    relatedProductIds: ['prod-023']
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-001',
    username: 'hoanganh_decor',
    createdAt: '2025-01-15T08:00:00Z',
    disabled: false
  },
  {
    id: 'usr-002',
    username: 'thanhhang_villa',
    createdAt: '2025-02-01T10:00:00Z',
    disabled: false
  }
];

export const INITIAL_FAVORITES: Favorite[] = [
  { userId: 'usr-001', productId: 'prod-001', createdAt: '2025-02-10T08:00:00Z' },
  { userId: 'usr-001', productId: 'prod-004', createdAt: '2025-02-12T09:00:00Z' },
  { userId: 'usr-001', productId: 'prod-008', createdAt: '2025-02-15T11:00:00Z' },
  { userId: 'usr-002', productId: 'prod-001', createdAt: '2025-02-20T14:00:00Z' }
];
