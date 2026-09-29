import { ProductItemDimension, ProductMaterial, ProductSuitability } from '../types';

// Nội dung chi tiết cho khu vực "Thông Số & Chi Tiết Tác Phẩm", tra theo id sản phẩm.
// Được ghép vào INITIAL_PRODUCTS trong initialData.ts.
// materials / items (nếu có) thay thế danh sách gốc của sản phẩm.

export interface ProductDetailContent {
  usageDescription: string;
  designPhilosophy: string;
  suitability: ProductSuitability;
  materials?: ProductMaterial[];
  items?: ProductItemDimension[];
}

// Các đoạn văn cách nhau bởi một dòng trống
const p = (...paragraphs: string[]) => paragraphs.join('\n\n');

export const PRODUCT_DETAILS: Record<string, ProductDetailContent> = {
  // Tab Đầu Giường Tịnh Dưỡng An
  'prod-002': {
    usageDescription: p(
      'Một chiếc tab nhỏ nhưng gánh trọn những thói quen trước giờ ngủ: mặt trên đủ rộng cho đèn ngủ, cuốn sách đang đọc dở và ly nước; hộc kéo giảm chấn đóng êm không một tiếng động, không làm phiền người nằm cạnh.',
      'Khe thoát dây phía sau cho phép sạc điện thoại ngay trong hộc kéo, giữ mặt tab luôn trống trải. Chiều cao 48 cm được tính khớp với mặt đệm tiêu chuẩn 45 - 50 cm, tay với tới tự nhiên mà không cần nhổm người.'
    ),
    designPhilosophy: p(
      'Tịnh Dưỡng An theo tinh thần “ít mà đủ” của thiết kế Nhật: một khối gỗ sồi bo góc bán kính 12 mm, không tay nắm lộ, không chi tiết kim loại thừa. Hộc kéo được mở bằng rãnh khoét âm dưới mặt tab, nơi ngón tay chạm vào thớ gỗ mịn đã được chà nhám tới độ nhám 240.',
      'Vân sồi thẳng chạy liên tục từ mặt trên xuống hai hông nhờ kỹ thuật ghép vân (grain matching), khiến chiếc tab trông như được đẽo từ một khối gỗ duy nhất.'
    ),
    suitability: {
      summary: 'Hợp với phòng ngủ Japandi, Scandinavian hoặc Minimalist; đặt cặp hai bên giường 1m6 - 1m8 cho bố cục đối xứng tĩnh tại.',
      spaces: [
        'Phòng ngủ master và phòng ngủ con từ 10 m²',
        'Phòng khách sạn, homestay cần đồ đầu giường gọn và bền',
        'Dùng làm bàn cạnh sofa (side table) trong phòng khách nhỏ'
      ],
      pairings: [
        'Giường Gỗ Tự Nhiên Mộc Miên cùng tông sồi, cao độ khớp mặt đệm',
        'Đèn bàn chao giấy washi hoặc gốm men mờ, ánh sáng 2700K',
        'Khay gỗ óc chó nhỏ đựng trang sức, đồng hồ để tạo điểm nhấn tương phản'
      ]
    },
    materials: [
      { part: 'Khung thân', material: 'Gỗ Sồi trắng tự nhiên nguyên tấm, sấy đạt độ ẩm 10 - 12%' },
      { part: 'Hộc kéo', material: 'Lòng hộc gỗ sồi ghép mộng đuôi én, đáy gỗ dán phủ veneer sồi' },
      { part: 'Phụ kiện', material: 'Ray trượt âm giảm chấn Blum Movento (Áo), tải trọng 30 kg' },
      { part: 'Hoàn thiện', material: 'Dầu lau gốc thực vật Rubio Monocoat, an toàn cho phòng ngủ trẻ em' }
    ]
  },

  // Giường Ngủ Nệm Bouclé Oslo Serenity
  'prod-003': {
    usageDescription: p(
      'Oslo Serenity dành cho những ai coi giường là nơi sống chứ không chỉ để ngủ. Đầu giường cao 115 cm bọc đệm mút dày 8 cm cho phép tựa lưng đọc sách, xem phim hàng giờ mà vai gáy vẫn thả lỏng.',
      'Khung sồi gia cường chịu tải 500 kg cùng hệ giát nan cong đàn hồi giúp đệm không võng giữa, kể cả với đệm lò xo túi độc lập nặng. Vỏ bọc đầu giường có khóa dán ẩn, tháo ra giặt khô định kỳ dễ dàng.'
    ),
    designPhilosophy: p(
      'Đường cong vòm của đầu giường gợi nhớ những vòm cửa mềm mại trong kiến trúc Bắc Âu, làm dịu đi các góc cạnh của căn phòng. Vải Bouclé dệt từ hạt len xoắn tạo bề mặt gợn nhẹ, bắt sáng mềm và mang lại cảm giác ấm áp ngay từ lần chạm đầu tiên.',
      'Chân giường lùi sâu vào trong 6 cm khiến toàn bộ khối giường như lơ lửng trên sàn: một thủ pháp quen thuộc của thiết kế Scandinavian giúp phòng ngủ trông nhẹ và thoáng hơn.'
    ),
    suitability: {
      summary: 'Lý tưởng cho phòng ngủ master từ 16 m² trong căn hộ cao cấp, biệt thự; phong cách Quiet Luxury, Japandi ấm hoặc Modern Organic.',
      spaces: [
        'Phòng ngủ master rộng, trần cao từ 2,8 m để tôn đầu giường vòm',
        'Suite khách sạn, resort nghỉ dưỡng hướng tới trải nghiệm êm ái',
        'Phòng ngủ có cửa sổ lớn, nhiều ánh sáng tự nhiên làm nổi kết cấu vải'
      ],
      pairings: [
        'Chăn ga linen tông kem, be, nâu đất; gối tựa nhung gân',
        'Tab Đầu Giường Tịnh Dưỡng An hoặc tab gỗ óc chó để tạo tương phản',
        'Thảm len Moroccan Nomad trải lấn 60 cm ra hai bên giường',
        'Đèn thả thủy tinh khói treo lệch hai bên thay cho đèn bàn'
      ]
    },
    materials: [
      { part: 'Chất liệu bọc', material: 'Vải dệt hạt len Bouclé Pháp 450 gsm, độ bền mài mòn 40.000 chu kỳ Martindale' },
      { part: 'Đệm đầu giường', material: 'Mút ép lạnh tỷ trọng 35 kg/m³ dày 8 cm, phủ lớp bông gòn tạo độ căng mềm' },
      { part: 'Khung cốt', material: 'Gỗ sồi Nga gia cường, liên kết bu lông âm, chịu tải 500 kg' },
      { part: 'Hệ giát', material: 'Nan cong gỗ Bạch Dương 42 thanh, đế cao su giảm chấn' },
      { part: 'Chân giường', material: 'Gỗ sồi đặc sơn màu Walnut, lót nỉ bảo vệ sàn' }
    ]
  },

  // Sofa Góc L Modul Soft Japandi
  'prod-005': {
    usageDescription: p(
      'Bốn khối modul độc lập có thể xếp thành góc L trái, L phải hoặc tách rời thành sofa băng và đôn rời khi có khách. Khi chuyển nhà hay đổi bố cục, chỉ cần một người là tháo lắp được nhờ khóa liên kết dạng móc dưới gầm.',
      'Lớp vải công nghệ Nano Easy-Clean khiến nước, cà phê hay nước tương vón thành giọt trên bề mặt, lau bằng khăn ẩm là sạch. Toàn bộ vỏ đệm có khóa kéo, tháo giặt máy ở chế độ nhẹ; lý tưởng cho gia đình có trẻ nhỏ và thú cưng.',
      'Đệm ngồi sâu 62 cm, cao 42 cm: đủ sâu để ngồi xếp bằng hoặc nằm nghiêng xem phim, đủ thấp để giữ tinh thần sống gần mặt đất của Japandi.'
    ),
    designPhilosophy: p(
      'Soft Japandi đi theo triết lý thiết kế dành cho đời sống thường ngày: phom khối vuông vức nhưng mọi góc đều được bo mềm, tựa lưng thấp 74 cm để phòng khách luôn thông thoáng tầm nhìn.',
      'Vải dệt sợi dừa pha polyester có bề mặt hơi thô, gợi cảm giác vải bố mộc mạc; tông ghi xám sương trung tính dễ phối, càng dùng càng mềm tay.'
    ),
    suitability: {
      summary: 'Phù hợp phòng khách 20 - 35 m² trong căn hộ 2 - 3 phòng ngủ, gia đình trẻ có con nhỏ; phong cách Japandi, Scandinavian, Minimalist.',
      spaces: [
        'Phòng khách căn hộ chung cư có góc tường để kê chữ L',
        'Phòng sinh hoạt chung tầng trên nhà phố, phòng xem phim gia đình',
        'Không gian cần thay đổi bố cục thường xuyên nhờ cấu trúc modul'
      ],
      pairings: [
        'Bàn Trà Đôi Đá Cẩm Thạch Carrara đặt lồng ở giữa góc L',
        'Kệ Tivi Gỗ Sồi Bắc Mỹ Kanso cùng tinh thần nan gỗ thiền định',
        'Gối tựa vải linen màu đất nung, vàng mù tạt tạo điểm nhấn ấm',
        'Thảm len dệt tay tông be kích thước 240 × 300 cm'
      ]
    },
    materials: [
      { part: 'Vải bọc', material: 'Vải sợi dừa pha polyester phủ Nano Easy-Clean kháng nước, chống bám lông thú cưng' },
      { part: 'Đệm ngồi', material: 'Mút HR tỷ trọng 38 kg/m³ bọc lớp bông tấm, độ lún vừa phải kiểu “ngồi lọt mà không chìm”' },
      { part: 'Đệm tựa', material: 'Bông sợi Fiber 7D rời trong túi vải chia ngăn, vỗ nhẹ là phồng lại' },
      { part: 'Khung sườn', material: 'Gỗ thông New Zealand sấy tẩm kết hợp ván plywood 18 mm' },
      { part: 'Hệ nâng đỡ', material: 'Lò xo zic-zac thép carbon phủ sơn chống gỉ' },
      { part: 'Chân', material: 'Gỗ sồi đặc cao 8 cm, lau dầu màu tự nhiên' }
    ],
    items: [
      { name: 'Bộ sofa 4 khối (góc L)', dimensions: { length: 320, width: 185, height: 74, note: 'Góc L sâu 185 cm, chiều cao ngồi 42 cm' } },
      { name: 'Bộ sofa 3 khối (băng thẳng)', dimensions: { length: 255, width: 95, height: 74, note: 'Không kèm khối đôn góc' } }
    ]
  },

  // Armchair Thư Giãn Milano
  'prod-006': {
    usageDescription: p(
      'Milano là chiếc ghế cho khoảnh khắc riêng: đọc sách, nghe nhạc hay chợp mắt buổi trưa. Tựa lưng nghiêng 110° cùng tựa đầu liền khối nâng đỡ trọn cổ và vai; đặt chân lên đôn đi kèm là cơ thể được thả lỏng gần như nằm.',
      'Chân xoay 360° trên trục bi tĩnh âm cho phép xoay về phía cửa sổ vào buổi sáng, về phía tivi vào buổi tối mà không cần nhấc ghế. Cơ chế ngả nhẹ theo trọng lượng người ngồi, không cần cần gạt.'
    ),
    designPhilosophy: p(
      'Vỏ ghế là bảy lớp gỗ óc chó được ép và uốn nhiệt thành một đường cong liền mạch: kỹ thuật ván ép uốn nổi tiếng của thiết kế giữa thế kỷ 20. Mặt ngoài giữ vân óc chó nâu trầm, mặt trong ôm lấy lớp đệm da căng mịn.',
      'Sự tương phản giữa thớ gỗ ấm và lớp da Cognac bóng nhẹ tạo nên vẻ sang trọng không phô trương, món đồ có thể đi cùng gia chủ qua nhiều ngôi nhà.'
    ),
    suitability: {
      summary: 'Hoàn hảo cho góc đọc sách, phòng làm việc tại nhà hoặc phòng khách từ 18 m²; phong cách Mid-century Modern, Quiet Luxury.',
      spaces: [
        'Góc cạnh cửa sổ phòng khách hoặc phòng ngủ master',
        'Phòng đọc sách, phòng nghe nhạc, thư viện gia đình',
        'Sảnh chờ văn phòng điều hành, lounge khách sạn'
      ],
      pairings: [
        'Đèn Sàn Arc Lamp Chân Đá chiếu ánh sáng đọc sách từ phía sau',
        'Kệ Sách Điêu Khắc Vòm Cung Pantheon làm phông nền',
        'Sofa Băng Da Ý Roma Grand cùng tông da Cognac',
        'Bàn tab nhỏ mặt đá đặt bên tay phải để ly trà'
      ]
    },
    materials: [
      { part: 'Thân ghế', material: 'Ván ép uốn 7 lớp gỗ Óc Chó tự nhiên FAS, phủ dầu satin' },
      { part: 'Đệm bọc', material: 'Da bò Top-grain Ý màu Cognac, may chỉ nổi tông-sur-tông' },
      { part: 'Ruột đệm', material: 'Mút đúc định hình tỷ trọng 45 kg/m³ phủ lớp lông vũ mỏng' },
      { part: 'Chân xoay', material: 'Hợp kim nhôm đúc 5 cánh sơn tĩnh điện, trục bi tĩnh âm xoay 360°' },
      { part: 'Đôn chân', material: 'Cùng vỏ gỗ óc chó và da, chân xoay 4 cánh' }
    ],
    items: [
      { name: 'Ghế thư giãn', dimensions: { length: 88, width: 85, height: 84, note: 'Chiều cao ngồi 38 cm, ngả lưng 110°' } },
      { name: 'Đôn gác chân', dimensions: { length: 65, width: 54, height: 44 } }
    ]
  },

  // Bàn Trà Đôi Đá Cẩm Thạch Carrara
  'prod-007': {
    usageDescription: p(
      'Hai chiếc bàn lồng vào nhau như một bố cục tầng bậc: bàn lớn mặt đá để khay trà, bình hoa; bàn nhỏ mặt gỗ kéo ra khi có thêm khách hoặc đặt cạnh sofa làm bàn phụ.',
      'Mặt đá Carrara 18 mm đã phủ lớp chống thấm Nano, hạn chế vết ố từ trà, cà phê và rượu vang nếu được lau trong vòng vài phút. Nên dùng lót ly cho đồ uống có tính axit như chanh, giấm để giữ bề mặt bóng mờ lâu dài.'
    ),
    designPhilosophy: p(
      'Cặp bàn là cuộc đối thoại giữa hai chất liệu: vân mây xám nhạt của cẩm thạch Carrara lạnh và mát tay, bên cạnh vân sồi ấm được phay xước nhẹ để lộ thớ gỗ.',
      'Viền đồng thau mảnh 3 mm chạy quanh mép bàn gỗ bắt sáng khi hoàng hôn, như một đường chỉ vàng kín đáo. Cạnh đá được vát kiểu kim cương và bo tròn, an toàn cho trẻ nhỏ.'
    ),
    suitability: {
      summary: 'Dành cho phòng khách 18 - 35 m²; đặt trước sofa 2,2 - 3 m. Hợp phong cách Quiet Luxury, Japandi hoặc Modern Classic.',
      spaces: [
        'Phòng khách căn hộ, nhà phố đặt trước sofa băng hoặc sofa góc',
        'Sảnh tiếp khách, phòng chờ showroom, văn phòng sáng tạo',
        'Không gian nhỏ cần bàn linh hoạt: tách bàn nhỏ ra khi cần'
      ],
      pairings: [
        'Sofa Băng Da Ý Roma Grand hoặc Sofa Góc L Modul Soft Japandi',
        'Thảm len tông trung tính để làm dịu độ lạnh của đá',
        'Bình gốm men tro, sách ảnh khổ lớn và khay đồng thau nhỏ'
      ]
    },
    materials: [
      { part: 'Mặt bàn lớn', material: 'Đá cẩm thạch tự nhiên Carrara Ý 18 mm, phủ chống ố Nano, cạnh vát kim cương' },
      { part: 'Mặt bàn nhỏ', material: 'Gỗ sồi trắng phay xước bề mặt, viền nẹp đồng thau 3 mm' },
      { part: 'Khung chân', material: 'Thép hộp sơn tĩnh điện màu đồng xước, ốc cân bằng chỉnh độ cao' },
      { part: 'Lớp lót', material: 'Đệm cao su chống trượt giữa mặt đá và khung' }
    ],
    items: [
      { name: 'Bàn lớn (mặt đá)', dimensions: { length: 90, width: 90, height: 38 } },
      { name: 'Bàn nhỏ (mặt gỗ)', dimensions: { length: 60, width: 60, height: 45, note: 'Lồng gọn dưới bàn lớn khi không dùng' } }
    ]
  },

  // Bàn Ăn Mặt Đá Calacatta Gold
  'prod-008': {
    usageDescription: p(
      'Mặt bàn 240 cm đón trọn 8 người ngồi thoải mái, 10 người trong những bữa tiệc gia đình ngày Tết. Chân đế đặt lùi vào trong giúp ghế ở hai đầu bàn kéo ra vào không vướng đầu gối.',
      'Lớp men Nano Crystal phủ trên đá giúp chịu được nồi lẩu nóng tới 80°C trong thời gian ngắn và chống ố rượu vang, dầu ăn. Với bữa ăn có bếp nướng, vẫn nên dùng lót nồi để bảo vệ vân đá lâu dài.'
    ),
    designPhilosophy: p(
      'Calacatta Gold là dòng cẩm thạch hiếm của vùng Carrara, nền trắng ngà với những vệt vân vàng xám chạy như nét cọ thủy mặc. Mỗi tấm đá được chọn vân thủ công để đường vân chạy dọc chiều dài bàn, kéo dài không gian phòng ăn.',
      'Chân đế gỗ óc chó phay CNC 5 trục thành hình khối điêu khắc mềm mại, cân bằng lại độ lạnh của đá bằng sắc nâu ấm và thớ gỗ tự nhiên.'
    ),
    suitability: {
      summary: 'Cho phòng ăn từ 18 m² trong biệt thự, penthouse hoặc nhà phố rộng; gia đình đông người, thường tiếp khách. Phong cách Quiet Luxury, Modern Classic.',
      spaces: [
        'Phòng ăn riêng biệt, khoảng trống quanh bàn tối thiểu 90 cm',
        'Không gian bếp - ăn liên thông dùng bàn làm điểm nhấn trung tâm',
        'Phòng họp nhỏ, phòng tiếp khách cao cấp'
      ],
      pairings: [
        'Ghế Ăn Verona Lưng Cong Điêu Khắc bản khung Walnut',
        'Đèn Chùm Pha Lê Thổi Tay Aurora treo cách mặt bàn 75 - 85 cm',
        'Tủ Rượu & Buffet Florence cùng chất liệu đá và óc chó',
        'Khăn trải bàn runner linen, bộ đồ ăn gốm men mờ'
      ]
    },
    materials: [
      { part: 'Mặt đá', material: 'Đá Calacatta Gold tự nhiên mỏ Carrara Ý dày 20 mm, chọn vân thủ công' },
      { part: 'Lớp phủ', material: 'Men Nano Crystal chống ố, chịu nhiệt ngắn hạn 80°C' },
      { part: 'Chân bàn', material: 'Gỗ óc chó Bắc Mỹ nguyên khối gia công CNC 5 trục, lau dầu satin' },
      { part: 'Liên kết', material: 'Tấm thép gia cường âm dưới mặt đá, bu lông liên kết giấu kín' }
    ],
    items: [
      { name: 'Bàn ăn 8 - 10 người', dimensions: { length: 240, width: 100, height: 75, note: 'Nhận đặt dài tới 300 cm' } },
      { name: 'Bàn ăn 6 người', dimensions: { length: 180, width: 90, height: 75 } }
    ]
  },

  // Bàn Ăn Gỗ Óc Chó Mộc Bản Kyoto
  'prod-009': {
    usageDescription: p(
      'Một mặt bàn dày 4,5 cm đủ vững để làm mọi việc của ngôi nhà: bữa cơm tối, bàn làm việc cuối tuần, chỗ con nhỏ ngồi vẽ tranh. Gỗ óc chó càng dùng càng lên màu, những vết xước nhỏ theo năm tháng chỉ khiến mặt bàn thêm chất riêng.',
      'Bề mặt hoàn thiện bằng dầu thực vật nên có thể tự bảo dưỡng tại nhà: lau dầu lại 6 - 12 tháng một lần là vân gỗ sâu và bóng trở lại.'
    ),
    designPhilosophy: p(
      'Kyoto giữ nguyên cạnh mộc (live-edge) của thân cây: đường viền lượn sóng tự nhiên không máy móc nào tạo ra được. Đó là tinh thần Wabi-sabi: trân trọng vẻ đẹp không hoàn hảo và dấu vết của thời gian.',
      'Mỗi mặt bàn được ghép từ hai tấm gỗ cùng một thân cây (book-matched), vân gỗ đối xứng như cánh bướm, nên không có hai chiếc bàn Kyoto nào giống nhau.'
    ),
    suitability: {
      summary: 'Hợp phòng ăn 12 - 25 m², căn hộ và nhà phố yêu thích chất liệu tự nhiên; phong cách Japandi, Wabi-sabi, Rustic Modern.',
      spaces: [
        'Phòng ăn gia đình 6 - 8 người',
        'Bếp mở có ánh sáng tự nhiên làm nổi vân gỗ',
        'Bàn làm việc lớn cho kiến trúc sư, nhà thiết kế tại gia'
      ],
      pairings: [
        'Ghế Ăn Verona bản khung sồi hoặc băng ghế gỗ mộc một bên',
        'Đèn thả mây tre hoặc giấy washi treo thành hàng dọc bàn',
        'Bát đĩa gốm Bát Tràng men tro, bình hoa cành khô'
      ]
    },
    materials: [
      { part: 'Mặt bàn', material: 'Gỗ óc chó Bắc Mỹ tự nhiên FAS dày 4,5 cm, cạnh mộc live-edge, ghép book-matched' },
      { part: 'Chân bàn', material: 'Gỗ óc chó đặc dáng chữ V lệch, liên kết mộng chốt' },
      { part: 'Gia cường', material: 'Thanh thép chống cong vênh âm dưới mặt bàn' },
      { part: 'Hoàn thiện', material: 'Dầu lau gốc thực vật, an toàn tiếp xúc thực phẩm' }
    ],
    items: [
      { name: 'Bàn ăn 6 - 8 người', dimensions: { length: 220, width: 95, height: 75, note: 'Độ dày mặt gỗ 4,5 cm' } },
      { name: 'Bàn ăn 4 - 6 người', dimensions: { length: 180, width: 90, height: 75 } }
    ]
  },

  // Ghế Ăn Verona Lưng Cong Điêu Khắc
  'prod-010': {
    usageDescription: p(
      'Tựa lưng cong ôm lấy phần thắt lưng và bả vai, giữ tư thế ngồi thẳng mà không gò bó trong những bữa ăn kéo dài. Chiều cao ngồi 46 cm chuẩn cho bàn ăn cao 74 - 76 cm.',
      'Mặt ngồi đệm da Nappa êm nhưng đủ chắc để không lún theo thời gian. Khung gỗ nhẹ (khoảng 6 kg), dễ kéo ra vào và nhấc lên khi lau sàn.'
    ),
    designPhilosophy: p(
      'Thanh tựa lưng được uốn nhiệt từ một thanh sồi đặc, không ghép nối, tạo đường cong liền mạch từ tay vịn tới lưng ghế. Nhìn từ trên xuống, chiếc ghế như một nét bút thư pháp.',
      'Các mối nối chân ghế được vuốt tròn và chà tay nhiều lần, để bàn tay lướt qua chỉ cảm nhận được sự mượt mà liên tục của gỗ.'
    ),
    suitability: {
      summary: 'Dùng cho phòng ăn, bàn làm việc tại nhà hoặc quán cà phê cao cấp; phong cách Japandi, Scandinavian, Mid-century.',
      spaces: [
        'Phòng ăn gia đình, bộ 4 - 8 ghế',
        'Bàn làm việc tại nhà cần ghế đẹp mà không cồng kềnh',
        'Nhà hàng, quán cà phê theo phong cách tối giản'
      ],
      pairings: [
        'Bàn Ăn Gỗ Óc Chó Kyoto (bản khung sồi) hoặc Bàn Ăn Calacatta Gold (bản khung Walnut)',
        'Đệm ngồi rời bằng len dệt cho mùa lạnh',
        'Phối xen kẽ hai màu khung để tạo nhịp điệu cho bàn dài'
      ]
    },
    materials: [
      { part: 'Khung ghế', material: 'Gỗ Sồi (White Oak) đặc uốn nhiệt tần số cao, mối nối mộng âm dương' },
      { part: 'Đệm ngồi', material: 'Da Nappa Ý mềm mịn, mút ép lạnh tỷ trọng 40 kg/m³' },
      { part: 'Hoàn thiện', material: 'Sơn PU gốc nước độ bóng 10%, chống thấm nước và vết dầu mỡ' },
      { part: 'Chân', material: 'Nút đệm nỉ chống trầy sàn gỗ và sàn đá' }
    ]
  },

  // Bàn Làm Việc Giám Đốc Metropolitan
  'prod-011': {
    usageDescription: p(
      'Mặt bàn 220 cm đủ cho hai màn hình, tài liệu và một khoảng trống để ký hồ sơ trên tấm da viết. Cụm sạc không dây ẩn dưới lớp veneer: chỉ cần đặt điện thoại vào vị trí đánh dấu là sạc.',
      'Tủ phụ L-return mở rộng mặt làm việc thêm 120 cm, ngăn kéo khóa vân tay giữ hồ sơ bảo mật. Máng dây âm và lỗ đi dây nắp đồng giúp toàn bộ dây nguồn biến mất khỏi tầm nhìn.'
    ),
    designPhilosophy: p(
      'Metropolitan lấy cảm hứng từ kiến trúc tòa tháp văn phòng: những mặt vát góc 45° dứt khoát, chân bàn khối đặc như cột trụ. Vân óc chó chạy ngang liên tục trên toàn bộ mặt bàn tạo cảm giác bề thế, điềm tĩnh.',
      'Tấm da viết màu đen mờ khảm âm vào mặt gỗ: một chi tiết quen thuộc của bàn làm việc cổ điển châu Âu, được làm mới bằng đường khâu tay tinh gọn.'
    ),
    suitability: {
      summary: 'Dành cho phòng giám đốc, phòng làm việc tại gia từ 15 m²; phong cách Quiet Luxury, Modern Executive.',
      spaces: [
        'Phòng giám đốc, phòng chủ tịch văn phòng',
        'Phòng làm việc riêng trong biệt thự, penthouse',
        'Văn phòng luật sư, kiến trúc sư tiếp khách'
      ],
      pairings: [
        'Ghế Làm Việc Da Ý Công Thái Học màu Đen Mờ Onyx',
        'Kệ Sách Điêu Khắc Vòm Cung Pantheon phía sau lưng',
        'Đèn bàn đồng thau và tượng Đồng Balance & Harmony làm điểm nhấn'
      ]
    },
    materials: [
      { part: 'Mặt bàn', material: 'Veneer gỗ óc chó tự nhiên dày 0,6 mm trên cốt MDF chống ẩm E0, khảm tấm da viết' },
      { part: 'Chân & hông bàn', material: 'Gỗ óc chó ghép thanh, cạnh vát 45°' },
      { part: 'Công nghệ', material: 'Sạc không dây Qi 15W âm bàn, ổ cắm và cổng USB-C bật mở' },
      { part: 'Tủ phụ', material: 'Ngăn kéo ray giảm chấn, khóa vân tay điện tử' },
      { part: 'Chi tiết kim loại', material: 'Nắp lỗ đi dây và tay nắm thép mạ PVD Titan' }
    ]
  },

  // Ghế Làm Việc Da Ý Công Thái Học
  'prod-012': {
    usageDescription: p(
      'Thiết kế cho những ngày làm việc 8 - 10 tiếng: đệm đỡ thắt lưng chỉnh được độ cao và độ nhô, tựa lưng ngả 4 nấc với lực đàn hồi điều chỉnh theo cân nặng người ngồi.',
      'Tay vịn 4D nâng hạ, xoay và trượt để khuỷu tay luôn đặt ngang mặt bàn phím. Ben hơi Class 4 cùng bánh xe PU êm lướt trên cả sàn gỗ lẫn thảm.'
    ),
    designPhilosophy: p(
      'Một chiếc ghế công thái học không nhất thiết phải trông như thiết bị văn phòng. Lớp da bò hạt Top-grain được bọc căng trên các múi đệm may ngang, tạo đường nét gọn gàng hợp với phòng làm việc sang trọng.',
      'Chân nhôm đúc sơn đen mờ, cần gạt giấu dưới mặt ngồi: mọi chi tiết kỹ thuật lùi vào trong để chất liệu lên tiếng.'
    ),
    suitability: {
      summary: 'Cho phòng giám đốc, phòng làm việc tại gia và người làm việc ngồi nhiều giờ; phong cách Minimalist, Modern Executive.',
      spaces: [
        'Phòng làm việc tại nhà, phòng giám đốc',
        'Phòng họp điều hành, bàn làm việc kiến trúc sư',
        'Góc làm việc của người sáng tạo nội dung, lập trình viên'
      ],
      pairings: [
        'Bàn Làm Việc Giám Đốc Metropolitan',
        'Thảm trải sàn dệt phẳng dưới bàn để bánh xe lăn êm',
        'Đèn bàn ánh sáng trung tính 4000K khi làm việc buổi tối'
      ]
    },
    materials: [
      { part: 'Da bọc', material: '100% Da bò Top-grain Ý, bề mặt hạt tự nhiên' },
      { part: 'Đệm', material: 'Mút đúc định hình tỷ trọng 50 kg/m³, độ đàn hồi cao' },
      { part: 'Cơ cấu', material: 'Mâm ngả đa điểm khóa 4 vị trí, đỡ lưng điều chỉnh độ cao và độ nhô' },
      { part: 'Chân ghế', material: 'Hợp kim nhôm đúc 5 cánh, ben hơi chuẩn Class 4' },
      { part: 'Bánh xe', material: 'Bánh xe PU 60 mm, không gây trầy sàn gỗ' }
    ]
  },

  // Tủ Áo Cánh Kính Anodized Kyoto
  'prod-013': {
    usageDescription: p(
      'Tủ áo 4 cánh chia khoang rõ ràng: khoang treo áo dài, khoang treo sơ mi hai tầng, ngăn kéo phụ kiện và kệ gấp đồ. Cánh kính xám khói cho phép nhìn thấy trang phục bên trong, chọn đồ nhanh mà vẫn giữ vẻ kín đáo.',
      'Đèn LED cảm ứng tự sáng khi mở cánh và tắt khi đóng. Khung tủ may đo chạm trần theo từng công trình để không đọng bụi trên nóc tủ.'
    ),
    designPhilosophy: p(
      'Khung nhôm Anodized mảnh chỉ 20 mm màu Champagne gợi nhớ tủ trưng bày của các boutique thời trang. Kính khói làm mọi thứ bên trong trở nên dịu, như nhìn qua một làn sương.',
      'Lòng tủ ốp melamine vân sồi ấm, tương phản nhẹ với kim loại lạnh bên ngoài: phòng thay đồ trở thành một không gian trưng bày cá nhân.'
    ),
    suitability: {
      summary: 'Cho phòng ngủ master, phòng thay đồ (walk-in closet) từ 6 m²; phong cách Quiet Luxury, Modern Minimalist.',
      spaces: [
        'Phòng thay đồ riêng trong căn hộ cao cấp, biệt thự',
        'Tường dài phòng ngủ master từ 2,4 m',
        'Showroom thời trang, boutique trưng bày túi và giày'
      ],
      pairings: [
        'Đôn ngồi bọc Bouclé ở giữa phòng thay đồ',
        'Gương đứng khung đồng thau cao 180 cm',
        'Thảm len lông ngắn tông be dưới chân tủ'
      ]
    },
    materials: [
      { part: 'Cánh tủ', material: 'Kính cường lực màu khói 5 mm, khung nhôm Anodized Champagne 20 mm' },
      { part: 'Thùng tủ', material: 'Gỗ công nghiệp MDF chống ẩm tiêu chuẩn E0, phủ melamine vân sồi' },
      { part: 'Chiếu sáng', material: 'LED thanh nhôm 3000K cảm biến đóng mở cánh' },
      { part: 'Phụ kiện', material: 'Bản lề giảm chấn Blum, thanh treo nhôm, ngăn kéo lót nỉ' }
    ]
  },

  // Kệ Tivi Gỗ Sồi Bắc Mỹ Kanso
  'prod-014': {
    usageDescription: p(
      'Kệ dài 200 cm đặt được tivi tới 85 inch và loa soundbar. Cánh nan gỗ cho tín hiệu hồng ngoại đi qua: điều khiển đầu thu, amply bên trong mà không cần mở cánh.',
      'Khe nan thoáng khí giúp thiết bị điện tử tản nhiệt tự nhiên; lỗ đi dây phía sau gom gọn toàn bộ dây nguồn và HDMI.'
    ),
    designPhilosophy: p(
      '“Kanso” trong mỹ học Nhật nghĩa là sự giản lược: loại bỏ những gì không cần thiết. Những thanh nan sồi chạy song song đều đặn tạo nhịp điệu thị giác tĩnh lặng như hàng tre trong vườn thiền.',
      'Chân kệ thấp lùi vào trong, khiến chiếc kệ như đặt nổi trên sàn; khối gỗ dài và thấp giữ đường chân trời của phòng khách luôn thoáng.'
    ),
    suitability: {
      summary: 'Cho phòng khách 18 - 35 m², tivi 55 - 85 inch; phong cách Japandi, Scandinavian, Minimalist.',
      spaces: [
        'Phòng khách căn hộ, nhà phố',
        'Phòng sinh hoạt chung, phòng xem phim gia đình',
        'Dùng làm tủ thấp trưng bày dưới cửa sổ'
      ],
      pairings: [
        'Sofa Góc L Modul Soft Japandi đặt đối diện cách 2,8 - 3,5 m',
        'Bình gốm, cây cảnh nhỏ và sách trên mặt kệ',
        'Tường ốp lam gỗ hoặc sơn hiệu ứng vôi phía sau tivi'
      ]
    },
    materials: [
      { part: 'Toàn bộ thân', material: 'Gỗ sồi trắng tự nhiên, ghép thanh mộng finger-joint' },
      { part: 'Cánh nan', material: 'Nan sồi đặc 20 × 30 mm, khe hở 8 mm thoáng khí và cho tín hiệu remote đi qua' },
      { part: 'Phụ kiện', material: 'Bản lề giảm chấn, nút nhấn mở cánh push-open' },
      { part: 'Hoàn thiện', material: 'Dầu lau gốc thực vật màu tự nhiên' }
    ],
    items: [
      { name: 'Kệ tivi đặt sàn', dimensions: { length: 200, width: 45, height: 42, note: 'Tải trọng mặt kệ tới 100 kg' } },
      { name: 'Kệ tivi bản ngắn', dimensions: { length: 160, width: 45, height: 42 } }
    ]
  },

  // Tủ Rượu & Buffet Florence
  'prod-015': {
    usageDescription: p(
      'Tủ buffet 4 cánh là trung tâm của phòng ăn: khoang trái chứa bát đĩa, khoang phải chứa rượu vang với giá treo ly úp ngược, mặt đá phía trên dùng bày đồ ăn khi tiệc buffet tại gia.',
      'Mặt đá Nero Marquina chịu được khay nóng và dễ lau chùi; kệ bên trong chỉnh được độ cao theo chai rượu và bộ đồ ăn của gia đình.'
    ),
    designPhilosophy: p(
      'Cánh tủ được phay CNC từ gỗ óc chó nguyên tấm thành những gợn sóng 3D. Khi ánh đèn chiếu xiên, bề mặt khúc xạ thành các dải sáng tối như mặt nước.',
      'Đá Marble Nero Marquina đen tuyền với vân trắng mảnh là cặp đôi kinh điển với gỗ óc chó: sang trọng, trầm và rất “Florence”.'
    ),
    suitability: {
      summary: 'Cho phòng ăn, phòng khách từ 20 m²; phong cách Quiet Luxury, Art Deco hiện đại.',
      spaces: [
        'Tường chính phòng ăn, phía sau bàn ăn',
        'Sảnh vào nhà làm tủ console trang trí',
        'Phòng khách kết hợp quầy rượu mini'
      ],
      pairings: [
        'Bàn Ăn Mặt Đá Calacatta Gold',
        'Gương tròn khung đồng hoặc tranh trừu tượng treo phía trên',
        'Đèn bàn gốm đặt đối xứng hai đầu tủ'
      ]
    },
    materials: [
      { part: 'Mặt đá', material: 'Đá Marble Nero Marquina nhập khẩu Tây Ban Nha, dày 18 mm' },
      { part: 'Cánh tủ', material: 'Gỗ óc chó nguyên tấm phay CNC gợn sóng 3D' },
      { part: 'Thùng tủ', material: 'Cốt gỗ chống ẩm phủ veneer óc chó, kệ chỉnh độ cao' },
      { part: 'Phụ kiện', material: 'Giá treo ly inox mạ đồng, bản lề giảm chấn, chân thép PVD' }
    ]
  },

  // Kệ Sách Điêu Khắc Vòm Cung Pantheon
  'prod-016': {
    usageDescription: p(
      'Năm tầng kệ với những khoang vòm kích thước khác nhau: khoang lớn cho sách ảnh khổ to, khoang nhỏ cho tiểu thuyết và đồ lưu niệm. Mỗi tầng chịu tải 30 kg.',
      'Kệ được bắt cố định vào tường bằng bộ chống lật đi kèm, an toàn cho nhà có trẻ nhỏ.'
    ),
    designPhilosophy: p(
      'Những mái vòm cung lấy cảm hứng từ đền Pantheon ở Rome, được giản lược thành đường cong mềm trong gỗ sồi sáng màu. Cổ điển trong hình khối, hiện đại trong cách thể hiện.',
      'Các vòm lệch tầng tạo nhịp điệu như một bản nhạc, biến chiếc kệ thành một bức tường điêu khắc ngay cả khi chưa đặt cuốn sách nào.'
    ),
    suitability: {
      summary: 'Cho phòng khách, phòng đọc, phòng làm việc có tường trống từ 1,8 m; phong cách Japandi, Modern Classic, Neo-classic tối giản.',
      spaces: [
        'Phòng đọc sách, thư viện gia đình',
        'Tường nền phòng làm việc phía sau bàn',
        'Phòng khách trưng bày sưu tập gốm, tượng'
      ],
      pairings: [
        'Armchair Thư Giãn Milano và Đèn Sàn Arc Lamp cho góc đọc',
        'Tượng Điêu Khắc Đồng Balance & Harmony đặt ở khoang trung tâm',
        'Bình gốm men tro, sách bìa vải tông trung tính'
      ]
    },
    materials: [
      { part: 'Cốt gỗ', material: 'Gỗ sồi Bắc Mỹ ghép thanh, vòm cong uốn từ ván sồi dán nhiều lớp' },
      { part: 'Hoàn thiện', material: 'Sơn PU gốc nước độ bóng mờ 10%' },
      { part: 'Phụ kiện', material: 'Bộ chống lật bắt tường bằng thép, tắc kê nở' }
    ]
  },

  // Đảo Bếp Mặt Đá Thạch Anh Atelier
  'prod-017': {
    usageDescription: p(
      'Đảo bếp 260 cm gộp ba công năng: khu sơ chế, bếp từ âm và quầy bar cho 3 - 4 ghế. Người nấu vẫn trò chuyện được với cả nhà thay vì quay lưng vào tường.',
      'Mặt đá thạch anh không thấm, kháng khuẩn, an toàn khi nhào bột, cán mì trực tiếp. Hộc kéo sâu giảm chấn chứa nồi chảo, thùng rác phân loại âm tủ; đường chờ điện nước đã tính sẵn.'
    ),
    designPhilosophy: p(
      'Atelier là khối đá trắng tinh khôi đặt trên nền gỗ óc chó trầm: một khối kiến trúc giữa căn bếp. Mặt đá đổ tràn xuống hai hông (waterfall) tạo cảm giác liền khối, vững chãi.',
      'Tay nắm âm dạng rãnh chạy dọc cánh tủ giữ mặt đảo phẳng tuyệt đối, đúng tinh thần bếp châu Âu đương đại.'
    ),
    suitability: {
      summary: 'Cho bếp mở từ 20 m² trong căn hộ lớn, nhà phố, biệt thự; khoảng lối đi quanh đảo tối thiểu 100 cm. Phong cách Quiet Luxury, Modern.',
      spaces: [
        'Bếp mở liên thông phòng ăn và phòng khách',
        'Căn hộ penthouse, duplex cần điểm nhấn trung tâm',
        'Bếp trình diễn của nhà hàng nhỏ, studio ẩm thực'
      ],
      pairings: [
        'Ghế Bar Bọc Da Nappa Tuscany (3 - 4 chiếc) phía quầy bar',
        'Bộ 2 - 3 đèn thả thủy tinh treo cao 75 cm trên mặt đảo',
        'Tủ bếp trên tông sáng để đảo óc chó nổi bật'
      ]
    },
    materials: [
      { part: 'Mặt bàn đảo', material: 'Đá thạch anh cao cấp độ cứng Mohs 7 dày 20 mm, ốp tràn hai hông' },
      { part: 'Thân tủ', material: 'Cốt gỗ chống ẩm phủ veneer óc chó, cánh tay nắm âm' },
      { part: 'Chậu & vòi', material: 'Chậu Inox 304 âm bàn, vòi rút dây' },
      { part: 'Thiết bị', material: 'Bếp từ đôi âm mặt đá (tùy chọn theo hãng chủ nhà chọn)' },
      { part: 'Phụ kiện', material: 'Ray hộp giảm chấn, thùng rác phân loại âm tủ' }
    ]
  },

  // Ghế Bar Bọc Da Nappa Tuscany
  'prod-018': {
    usageDescription: p(
      'Chiều cao ngồi 75 cm dành cho quầy bar cao 100 - 105 cm. Vòng gác chân bằng thép đặc giúp ngồi vững, thoải mái khi nhâm nhi cà phê sáng hay trò chuyện bên đảo bếp.',
      'Mặt ngồi da bò hơi lõm theo dáng người, đệm mút đàn hồi cao không xẹp sau nhiều năm; da dễ lau sạch vết dầu mỡ.'
    ),
    designPhilosophy: p(
      'Bốn chân thép vuốt côn mảnh dần về phía sàn tạo dáng đứng thanh thoát. Lớp mạ PVD đồng xước ánh Champagne bắt sáng nhẹ, không bóng loáng.',
      'Da Camel ấm áp làm mềm đi vẻ công nghiệp của kim loại, cân bằng giữa sang trọng và gần gũi.'
    ),
    suitability: {
      summary: 'Cho quầy bar, đảo bếp cao 100 - 105 cm; phong cách Quiet Luxury, Minimalist, Modern.',
      spaces: [
        'Đảo bếp có quầy bar trong căn hộ, nhà phố',
        'Quầy bar mini phòng khách',
        'Quán cà phê, lounge khách sạn'
      ],
      pairings: [
        'Đảo Bếp Mặt Đá Thạch Anh Atelier',
        'Đèn thả thủy tinh khói treo thành hàng',
        'Phối cùng Tủ Rượu & Buffet Florence cho góc bar tại gia'
      ]
    },
    materials: [
      { part: 'Khung chân', material: 'Thép đặc tiện CNC vuốt côn mạ PVD Champagne' },
      { part: 'Đệm ngồi', material: 'Da bò Nappa màu Camel, mút đúc tỷ trọng 45 kg/m³' },
      { part: 'Gác chân', material: 'Vòng thép đặc Ø16 mm hàn liền khối' },
      { part: 'Chân đế', material: 'Nút nhựa POM chống trầy sàn' }
    ],
    items: [
      { name: 'Ghế bar cao', dimensions: { length: 48, width: 50, height: 95, note: 'Chiều cao ngồi 75 cm, cho quầy 100 - 105 cm' } },
      { name: 'Ghế counter', dimensions: { length: 48, width: 50, height: 85, note: 'Chiều cao ngồi 65 cm, cho quầy 90 - 95 cm' } }
    ]
  },

  // Đèn Chùm Pha Lê Thổi Tay Aurora
  'prod-019': {
    usageDescription: p(
      'Aurora vừa là nguồn sáng chính cho phòng ăn, phòng khách, vừa là tác phẩm nghệ thuật treo giữa không gian. Ánh sáng 3000K ấm, chỉ số hoàn màu CRI > 95 làm món ăn và làn da hiện lên chân thực.',
      'Dây thả điều chỉnh từ 50 tới 250 cm, lắp được cho trần 2,7 m tới thông tầng 6 m. Tương thích công tắc dimmer để hạ độ sáng cho bữa tối lãng mạn.'
    ),
    designPhilosophy: p(
      'Hàng trăm cánh thủy tinh được nghệ nhân thổi và uốn bằng tay, không cánh nào giống cánh nào. Xếp tầng quanh khung đồng, chúng mô phỏng dải cực quang lượn sóng trên bầu trời Bắc Âu.',
      'Khi tắt đèn, thủy tinh khói mờ vẫn là một khối điêu khắc; khi bật, ánh sáng khúc xạ qua từng lớp cánh thành những vệt sáng mềm trên trần.'
    ),
    suitability: {
      summary: 'Cho phòng ăn, phòng khách, sảnh thông tầng từ 20 m²; phong cách Quiet Luxury, Modern Classic.',
      spaces: [
        'Phía trên bàn ăn dài 200 - 300 cm',
        'Phòng khách thông tầng, giếng trời cầu thang',
        'Sảnh khách sạn, nhà hàng cao cấp'
      ],
      pairings: [
        'Bàn Ăn Mặt Đá Calacatta Gold, treo cách mặt bàn 75 - 85 cm',
        'Trần thạch cao phẳng, sơn màu ấm để hắt sáng',
        'Kết hợp đèn hắt khe trần 2700K làm lớp sáng nền'
      ]
    },
    materials: [
      { part: 'Chao đèn', material: 'Thủy tinh borosilicate thổi tay nhiệt độ cao, màu khói mờ' },
      { part: 'Khung', material: 'Đồng thau đúc, mạ đồng xước' },
      { part: 'Nguồn sáng', material: 'LED 3000K CRI > 95, tương thích dimmer' },
      { part: 'Dây treo', material: 'Cáp thép bọc vải, điều chỉnh 50 - 250 cm' }
    ]
  },

  // Đèn Sàn Arc Lamp Chân Đá Cẩm Thạch
  'prod-020': {
    usageDescription: p(
      'Cần đèn vòm vươn xa 2 m đưa ánh sáng tới giữa sofa hay bàn trà mà không cần khoan trần đi dây. Đế đá nặng 35 kg giữ đèn đứng vững tuyệt đối, kể cả khi trẻ nhỏ chạy va quanh.',
      'Công tắc đạp chân ngay trên đế, bật tắt bằng một cú chạm nhẹ khi tay đang bận sách hay tách trà.'
    ),
    designPhilosophy: p(
      'Một đường vòng cung duy nhất vẽ lên không gian: thiết kế kinh điển từ thập niên 60 được làm lại với thép mạ đồng xước và đá Marble đen.',
      'Khối đá thô nặng dưới chân tương phản với cần đèn mảnh và nhẹ phía trên; chiếc đèn như đang giữ thăng bằng, vừa mạnh mẽ vừa thanh thoát.'
    ),
    suitability: {
      summary: 'Cho phòng khách, góc đọc sách từ 15 m², trần từ 2,6 m; phong cách Mid-century, Minimalist, Quiet Luxury.',
      spaces: [
        'Cạnh sofa, chiếu sáng bàn trà hoặc khu ngồi',
        'Góc đọc sách với armchair',
        'Phòng khách không có đèn trần ở vị trí giữa'
      ],
      pairings: [
        'Armchair Thư Giãn Milano hoặc Sofa Băng Da Ý Roma Grand',
        'Bàn Trà Đôi Đá Cẩm Thạch Carrara cùng chất liệu đá',
        'Bóng đèn LED 2700K ánh sáng vàng ấm'
      ]
    },
    materials: [
      { part: 'Đế đèn', material: 'Đá Marble đen tự nhiên nguyên khối Ø45 cm, nặng 35 kg' },
      { part: 'Cần đèn', material: 'Thép ống mạ đồng xước, vươn 200 cm' },
      { part: 'Chao đèn', material: 'Nhôm kéo sợi mạ đồng, lòng sơn trắng tản sáng' },
      { part: 'Điện', material: 'Đui E27, công tắc đạp chân, dây vải bọc dài 250 cm' }
    ]
  },

  // Thảm Len Moroccan Nomad
  'prod-021': {
    usageDescription: p(
      'Sợi len dày 25 mm êm và ấm dưới chân, hút âm giúp phòng khách bớt vang, đặc biệt với sàn gạch và sàn đá. Len cừu tự nhiên có lớp lanolin chống bám bẩn và chậm bắt lửa.',
      'Nên hút bụi 1 - 2 lần mỗi tuần theo chiều sợi và giặt chuyên dụng 12 - 18 tháng một lần. Vài tuần đầu thảm có thể rụng lông tơ, đây là đặc tính tự nhiên của len dệt tay.'
    ),
    designPhilosophy: p(
      'Hoa văn lấy cảm hứng từ thảm của các bộ tộc du mục Berber vùng núi Atlas: những đường kẻ thoi màu đen trầm trên nền len mộc, không nhuộm tẩy.',
      'Mỗi tấm thảm cần khoảng 180 giờ thắt nút thủ công, các đường kẻ hơi lệch là dấu tay của người thợ dệt. Đây không phải lỗi, mà là linh hồn của món đồ thủ công.'
    ),
    suitability: {
      summary: 'Cho phòng khách, phòng ngủ từ 15 m²; phong cách Japandi, Wabi-sabi, Bohemian tối giản.',
      spaces: [
        'Phòng khách dưới khu sofa, chân trước sofa đặt trên thảm',
        'Phòng ngủ dưới giường, trải lấn ra hai bên',
        'Phòng đọc, phòng thiền cần sự ấm áp và yên tĩnh'
      ],
      pairings: [
        'Sofa Góc L Modul Soft Japandi hoặc Giường Nệm Bouclé Oslo',
        'Đồ gỗ tông sáng: sồi, tần bì',
        'Gối tựa vải thô, giỏ mây, cây xanh lá to'
      ]
    },
    materials: [
      { part: 'Sợi thảm', material: '100% Len cừu New Zealand chải kỹ, không nhuộm' },
      { part: 'Kỹ thuật dệt', material: 'Thắt nút tay khoảng 120.000 nút/m², sợi cao 25 mm' },
      { part: 'Lớp nền', material: 'Sợi cotton dệt chặt, viền may tay' }
    ],
    items: [
      { name: 'Thảm phòng khách', dimensions: { length: 300, width: 200, height: 3, note: 'Sợi len dày 25 mm' } },
      { name: 'Thảm cỡ vừa', dimensions: { length: 240, width: 170, height: 3 } }
    ]
  },

  // Tượng Điêu Khắc Đồng Balance & Harmony
  'prod-022': {
    usageDescription: p(
      'Một điểm nhấn nghệ thuật cho kệ sách, bàn console hay bàn làm việc. Khối đồng nặng 12,5 kg đứng vững trên đế granite, không cần gắn cố định.',
      'Lớp patina tự nhiên sẽ chuyển màu chậm theo thời gian; lau bằng khăn khô mềm, tránh hóa chất tẩy rửa để giữ vẻ cổ kính.'
    ),
    designPhilosophy: p(
      'Hai khối cong tựa vào nhau ở đúng một điểm: hình ảnh của sự cân bằng và gắn kết. Tác phẩm được đúc bằng phương pháp khuôn sáp thất truyền (lost-wax), rồi đánh bóng và tạo patina thủ công.',
      'Phiên bản giới hạn 20 bản, mỗi tượng khắc số hiệu và chữ ký nghệ nhân dưới đế.'
    ),
    suitability: {
      summary: 'Dành cho phòng khách, phòng làm việc, sảnh vào nhà; phong cách Quiet Luxury, Modern Art Collector.',
      spaces: [
        'Khoang trung tâm kệ sách, bàn console sảnh vào',
        'Bàn làm việc giám đốc, phòng tiếp khách',
        'Quà tặng tân gia, khai trương mang ý nghĩa gắn kết'
      ],
      pairings: [
        'Kệ Sách Điêu Khắc Vòm Cung Pantheon',
        'Đèn rọi LED góc hẹp 15° để tạo bóng đổ',
        'Nền tường tối màu để khối đồng nổi bật'
      ]
    },
    materials: [
      { part: 'Thân tượng', material: 'Đồng đỏ thanh khiết 95%, đúc khuôn sáp thất truyền' },
      { part: 'Bề mặt', material: 'Patina nâu cổ tạo màu thủ công, phủ sáp bảo vệ' },
      { part: 'Chân đế', material: 'Đá granite đen tuyền mài mờ, lót nỉ' }
    ]
  },

  // Bộ Bàn Ghế Ngoài Trời Teakwood
  'prod-023': {
    usageDescription: p(
      'Bộ bàn 200 cm cùng 6 ghế xếp cho những bữa trưa cuối tuần ngoài hiên, tiệc nướng sân vườn. Ghế gấp gọn cất vào góc khi mùa mưa hoặc cần không gian trống.',
      'Gỗ Teak giàu dầu tự nhiên nên chịu được nắng mưa nhiệt đới, không cần sơn phủ. Sau vài tháng ngoài trời, gỗ ngả màu xám bạc tự nhiên; muốn giữ màu mật ong, chỉ cần lau dầu Teak mỗi 6 tháng.'
    ),
    designPhilosophy: p(
      'Kết cấu mộng chốt, liên kết inox 304: không một chi tiết sắt nào có thể gỉ sét. Mặt bàn xẻ nan hở 5 mm để nước mưa thoát nhanh.',
      'Đường nét đơn giản, vuông vức theo tinh thần đồ gỗ ngoài trời Bắc Âu, để thiên nhiên xung quanh là nhân vật chính.'
    ),
    suitability: {
      summary: 'Cho sân vườn, hiên nhà, ban công từ 12 m², resort và nhà hàng ngoài trời; phong cách Minimalist, Tropical Modern.',
      spaces: [
        'Sân vườn biệt thự, nhà phố có sân sau',
        'Ban công, sân thượng căn hộ penthouse',
        'Nhà hàng sân vườn, resort ven biển'
      ],
      pairings: [
        'Ô dù lệch tâm vải Sunbrella màu kem',
        'Ghế Thư Giãn Dài Daybed Pavilion bên hồ bơi',
        'Đèn lồng năng lượng mặt trời, chậu cây lá lớn'
      ]
    },
    materials: [
      { part: 'Toàn bộ bàn ghế', material: 'Gỗ Teak Myanmar tuyển chọn phần lõi, độ dầu tự nhiên cao' },
      { part: 'Liên kết', material: 'Mộng chốt gỗ kết hợp bu lông Inox 304 không gỉ' },
      { part: 'Hoàn thiện', material: 'Để mộc tự nhiên, có thể lau dầu Teak định kỳ' }
    ],
    items: [
      { name: 'Bàn ngoài trời', dimensions: { length: 200, width: 90, height: 75, note: 'Mặt nan hở thoát nước' } },
      { name: 'Ghế xếp (6 chiếc)', dimensions: { length: 55, width: 58, height: 88, note: 'Chiều cao ngồi 45 cm, gấp dày 12 cm' } }
    ]
  },

  // Ghế Thư Giãn Dài Daybed Pavilion
  'prod-024': {
    usageDescription: p(
      'Daybed dài 200 cm cho người cao tới 1,85 m nằm duỗi thẳng. Tựa lưng nâng 5 cấp: nằm phẳng tắm nắng, ngả 45° đọc sách, hoặc ngồi thẳng trò chuyện bên hồ bơi.',
      'Nệm mút QuickDry khô ráo chỉ khoảng 30 phút sau cơn mưa rào; vải Sunbrella chống tia UV, không phai màu tối thiểu 5 năm. Bánh xe ẩn phía chân giúp một người dễ dàng di chuyển.'
    ),
    designPhilosophy: p(
      'Pavilion lấy cảm hứng từ những lều nghỉ ven biển Địa Trung Hải: khung nhôm mảnh sơn tĩnh điện, nệm trắng sữa phẳng phiu, đường nét thấp và dài hòa vào mặt nước.',
      'Khung nhôm Anodized nhẹ nhưng không gỉ, không nóng tay dưới nắng như thép. Mọi mối nối được hàn kín và mài mịn.'
    ),
    suitability: {
      summary: 'Cho hồ bơi, sân thượng, ban công rộng, resort; phong cách Quiet Luxury, Coastal, Tropical Modern.',
      spaces: [
        'Thành hồ bơi biệt thự, resort',
        'Sân thượng, ban công penthouse hướng biển',
        'Khu spa, sân vườn thiền'
      ],
      pairings: [
        'Bộ đôi Daybed đặt song song cùng bàn phụ ở giữa',
        'Ô dù chân lệch màu trắng hoặc be',
        'Khăn tắm sọc linen, gối tựa vải ngoài trời'
      ]
    },
    materials: [
      { part: 'Khung', material: 'Nhôm Anodized sơn tĩnh điện ngoài trời, hàn kín mối nối' },
      { part: 'Nệm', material: 'Mút QuickDry Foam thoát nước nhanh, dày 10 cm' },
      { part: 'Vải bọc ngoài trời', material: 'Vải dệt Sunbrella (Mỹ) chống tia UV, chống phai màu 5 năm, chống nấm mốc' },
      { part: 'Cơ cấu', material: 'Tựa lưng nâng 5 nấc, bánh xe ẩn phía chân' }
    ]
  }
};
