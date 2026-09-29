import { ProductHighlight } from '../types';

// Bổ sung nội dung cho hai khu vực "Điểm Chạm Chế Tác" và "Độ phù hợp" (phong cách Quiet Luxury / Japandi).
// Tra theo id sản phẩm, được ghép vào INITIAL_PRODUCTS trong initialData.ts:
//  - highlights: nối thêm vào sau các điểm chạm chế tác sẵn có
//  - spaces / pairings: nối thêm vào danh sách "Không gian phù hợp" / "Gợi ý phối hợp"

export interface CraftEnhancement {
  highlights: ProductHighlight[];
  spaces: string[];
  pairings: string[];
}

export const CRAFT_ENHANCEMENTS: Record<string, CraftEnhancement> = {
  // Giường Gỗ Tự Nhiên Mộc Miên
  'prod-001': {
    highlights: [
      {
        title: 'Vân sồi thô mộc còn nguyên cảm giác chạm',
        text: 'Lớp dầu lau Rubio Monocoat thấm sâu vào thớ gỗ thay vì phủ kín, giữ nguyên độ nhám mịn của vân sồi để bàn tay chạm vào vẫn nhận ra gỗ thật.'
      },
      {
        title: 'Cạnh bo mềm R15 an toàn tuyệt đối',
        text: 'Mọi góc giường được bo bán kính 15 mm và chà nhám tay, không còn cạnh sắc khi đi lại trong phòng tối hay khi có trẻ nhỏ trèo lên giường.'
      },
      {
        title: 'Khối giường lơ lửng nhẹ tênh',
        text: 'Chân giường thu vào trong khung, tạo khe tối phía dưới khiến cả khối gỗ như nổi trên sàn, phòng ngủ nhỏ vẫn thoáng và dễ lau dọn.'
      }
    ],
    spaces: [
      'Căn hộ chung cư 65 - 90 m² với phòng ngủ master 12 - 16 m², dư lối đi hai bên giường tối thiểu 60 cm'
    ],
    pairings: ['Ga giường lanh rửa mềm màu kem hoặc xám đá, thêm một tấm chăn len mỏng gấp cuối giường']
  },

  // Tab Đầu Giường Tịnh Dưỡng An
  'prod-002': {
    highlights: [
      {
        title: 'Rãnh khoét âm thay tay nắm',
        text: 'Hộc kéo mở bằng rãnh khoét dưới mặt tab, không kim loại lộ ra ngoài, giữ mặt tiền phẳng lặng như một khối gỗ liền.'
      },
      {
        title: 'Vân gỗ ghép liền mạch',
        text: 'Vân sồi chạy liên tục từ mặt trên xuống hai hông nhờ kỹ thuật ghép vân, người nhìn chỉ thấy một khối gỗ duy nhất.'
      },
      {
        title: 'Đóng êm không một tiếng động',
        text: 'Ray Blum giảm chấn đưa hộc về vị trí nhẹ như thở, không đánh thức người nằm cạnh trong đêm.'
      }
    ],
    spaces: ['Phòng ngủ nhỏ 10 - 12 m² trong căn hộ 65 m², nơi từng centimet lối đi đều quý'],
    pairings: ['Cặp hai tab đối xứng hai bên giường 1m6 - 1m8 cùng một cây đèn ngủ ánh sáng ấm 2700K']
  },

  // Giường Ngủ Nệm Bouclé Oslo Serenity
  'prod-003': {
    highlights: [
      {
        title: 'Đường viền chần may tay tinh tế',
        text: 'Từng đường may trên đầu giường được canh thẳng bằng tay, nút bọc vải tông-sur-tông tạo nhịp điệu dịu mắt thay vì họa tiết nổi bật.'
      },
      {
        title: 'Khối giường lơ lửng Scandinavian',
        text: 'Chân lùi sâu 6 cm khiến giường như nổi trên sàn, phòng ngủ trông nhẹ và rộng hơn thực tế.'
      },
      {
        title: 'Vỏ bọc tháo rời giặt khô',
        text: 'Khóa dán ẩn phía sau cho phép tháo vải bọc đầu giường để vệ sinh định kỳ, vẻ sang trọng bền lâu mà không tốn công chăm sóc.'
      }
    ],
    spaces: ['Phòng ngủ master 16 - 20 m² trong căn hộ 75 - 90 m² cần một điểm nhấn mềm mại duy nhất'],
    pairings: ['Rèm voan lọc sáng màu ngà, thảm len ngắn dưới chân giường và ánh sáng gián tiếp ẩn trần']
  },

  // Sofa Băng Da Ý Roma Grand
  'prod-004': {
    highlights: [
      {
        title: 'Đường chỉ may nổi thủ công',
        text: 'Thợ may canh từng mũi chỉ tông-sur-tông dọc mép đệm, đường may thẳng và đều là dấu ấn nhận diện của đồ da làm thủ công.'
      },
      {
        title: 'Chân đồng thau xước mờ',
        text: 'Chân thép tiện CNC mạ PVD đồng thau xước mờ nâng khối sofa lên nhẹ nhàng, ánh kim loại ấm hòa cùng màu da cognac.'
      },
      {
        title: 'Đệm lưng lông vũ vỗ là phồng',
        text: 'Đệm tựa lưng có khóa kéo tháo rời, vỗ nhẹ là hồi phục dáng phồng, giữ dáng sofa gọn gàng suốt nhiều năm.'
      }
    ],
    spaces: ['Căn hộ chung cư cao cấp 90 - 120 m² có phòng khách liền bếp, tường dài từ 3,2 m'],
    pairings: ['Bàn trà đá cẩm thạch Carrara cùng tông trung tính và một tấm thảm len sợi dày dưới sofa']
  },

  // Sofa Góc L Modul Soft Japandi
  'prod-005': {
    highlights: [
      {
        title: 'Chân sồi tiện tròn vuốt côn',
        text: 'Chân gỗ sồi đặc cao 8 cm tiện tròn, vuốt côn nhẹ, nâng sofa khỏi sàn tạo cảm giác thanh thoát cho phòng khách nhỏ.'
      },
      {
        title: 'Vải sợi dừa dệt nổi dịu mắt',
        text: 'Bề mặt dệt thô mờ không bắt sáng gắt, nhìn ấm và tĩnh như lanh nhưng có lớp phủ Nano Easy-Clean kháng nước, chống bám lông thú cưng.'
      },
      {
        title: 'Modul đổi góc tùy ý',
        text: 'Các khối rời ghép lại bằng khớp ẩn, đổi từ trái sang phải trong vài phút khi mặt bằng phòng thay đổi.'
      }
    ],
    spaces: [
      'Kích thước tối ưu cho căn hộ chung cư từ 65 m² - 90 m², dài 3,2 m vừa vặn trục tường chính phòng khách',
      'Góc L có thể tùy biến linh hoạt trái/phải theo layout phòng khách'
    ],
    pairings: ['Bàn trà gỗ sồi thấp, thảm dệt màu ngà và cây xanh lá lớn đặt ở góc để cân bằng khối sofa']
  },

  // Armchair Thư Giãn Milano Nâu Ấm
  'prod-006': {
    highlights: [
      {
        title: 'Lưng gỗ óc chó uốn 7 lớp',
        text: 'Ván ép 7 lớp uốn nhiệt ôm theo đường cong lưng, mặt gỗ lộ vân óc chó tự nhiên sau lớp dầu satin mờ.'
      },
      {
        title: 'Da Cognac lên nước theo năm tháng',
        text: 'Da bò Top-grain giữ nguyên hạt tự nhiên, càng dùng bề mặt càng bóng nhẹ và đậm màu, mỗi chiếc ghế mang dấu ấn riêng của người ngồi.'
      },
      {
        title: 'Đôn gác chân cùng ngôn ngữ',
        text: 'Đôn dùng chung vỏ gỗ và da với ghế, kê chân hoặc kéo ra làm ghế phụ, tạo bộ đôi liền mạch góc đọc sách.'
      }
    ],
    spaces: ['Góc đọc sách hoặc cạnh cửa sổ rộng 2 m² trong căn hộ từ 65 m², không chiếm diện tích lối đi'],
    pairings: ['Đèn sàn cần vòm ánh sáng ấm và một kệ sách thấp cạnh ghế cho góc đọc trọn vẹn']
  },

  // Bàn Trà Đôi Đá Cẩm Thạch Carrara
  'prod-007': {
    highlights: [
      {
        title: 'Cặp bàn lồng linh hoạt',
        text: 'Hai bàn cao thấp lồng vào nhau, tách ra khi tiếp khách hoặc gộp lại khi cần khoảng trống, thu gọn diện tích phòng khách chung cư.'
      },
      {
        title: 'Vân mây cẩm thạch không trùng lặp',
        text: 'Mỗi mặt đá được chọn vân thủ công, đường mây xám mảnh chạy tự nhiên, không hai bàn nào giống hệt nhau.'
      },
      {
        title: 'Viền đồng thau 3 mm sắc nét',
        text: 'Nẹp đồng thau viền quanh mặt gỗ sồi như một nét mực mảnh, đủ để làm sang mà không phô trương.'
      }
    ],
    spaces: ['Phòng khách căn hộ 65 - 90 m², nơi cần mặt bàn linh hoạt thay vì một khối bàn lớn'],
    pairings: ['Sofa vải sợi dừa hoặc da cognac cùng một khay gốm men mờ và bình cành khô đặt trên mặt đá']
  },

  // Bàn Ăn Mặt Đá Calacatta Gold
  'prod-008': {
    highlights: [
      {
        title: 'Vân chỉ vàng trải liền mặt bàn',
        text: 'Tấm đá được chọn và ghép vân thủ công để đường vàng chạy liên tục theo chiều dài bàn, như một bức tranh trừu tượng.'
      },
      {
        title: 'Cạnh đá mài mờ an toàn',
        text: 'Mép đá mài vát nhẹ, bo tròn êm tay, tránh va chạm sắc cạnh cho người ngồi và trẻ nhỏ.'
      },
      {
        title: 'Chân gỗ óc chó điêu khắc CNC 5 trục',
        text: 'Chân bàn cắt liền khối với đường cong mềm, tạo bóng đổ dịu dưới mặt đá và giúp bàn trông nhẹ dù khối lượng lớn.'
      }
    ],
    spaces: ['Phòng ăn 18 - 25 m² của căn hộ cao cấp, penthouse, nơi bàn 8 - 10 người là điểm nhấn trung tâm'],
    pairings: ['Ghế ăn khung gỗ uốn Verona cùng tông ấm và đèn chùm treo cách mặt bàn 75 - 80 cm']
  },

  // Bàn Ăn Gỗ Óc Chó Mộc Bản Kyoto
  'prod-009': {
    highlights: [
      {
        title: 'Cạnh mộc live-edge giữ dáng cây',
        text: 'Đường viền tự nhiên của thân cây được giữ nguyên, chỉ chà mịn và phủ dầu, để mỗi chiếc bàn là một dáng riêng.'
      },
      {
        title: 'Ghép book-matched đối xứng',
        text: 'Hai tấm gỗ cùng thân được mở như trang sách, vân hai bên đối xứng qua trục giữa tạo nhịp điệu tĩnh tại.'
      },
      {
        title: 'Chân chữ V lệch nhẹ',
        text: 'Chân đặc vát chữ V nâng mặt bàn dày 4,5 cm như lơ lửng, tạo không gian để chân người ngồi thoải mái.'
      }
    ],
    spaces: ['Phòng ăn 12 - 16 m² của căn hộ 65 - 90 m², dài 2,2 m vẫn chừa lối đi thoải mái'],
    pairings: ['Ghế sồi mộc, lọ gốm nung mộc và ánh sáng ấm 2700K để vân óc chó lên màu trầm']
  },

  // Ghế Ăn Verona Lưng Cong Điêu Khắc
  'prod-010': {
    highlights: [
      {
        title: 'Bề mặt sơn PU mờ OSEVEN',
        text: 'Lớp sơn PU gốc nước mờ 10% giữ nguyên cảm giác thô mộc của vân gỗ sồi, chống thấm nước và vết dầu mỡ mà không bóng nhựa.'
      },
      {
        title: 'Chân vuốt thon thanh thoát',
        text: 'Chân ghế tiện tròn, vuốt nhỏ về phía sàn tạo cảm giác nhẹ nhàng cho không gian hẹp.'
      },
      {
        title: 'Lưng cong ôm trọn thắt lưng',
        text: 'Đường cong lưng được uốn nhiệt theo sinh trắc học, người ngồi tựa lưng thoải mái suốt bữa ăn dài.'
      }
    ],
    spaces: ['Phòng ăn nhỏ 8 - 12 m² hoặc bếp liền phòng khách trong căn hộ 65 - 90 m², ghế xếp gọn sát bàn không cản lối đi'],
    pairings: ['Bàn ăn gỗ óc chó hoặc mặt đá, bộ 4 - 6 ghế đặt xen kẽ hai chiều để bố cục tự nhiên']
  },

  // Bàn Làm Việc Giám Đốc Metropolitan
  'prod-011': {
    highlights: [
      {
        title: 'Mặt bàn khảm da viết êm tay',
        text: 'Vùng làm việc phủ da viết chống trượt, mềm và ấm khi tỳ tay, gõ phím hoặc ký giấy tờ đều không phát ra tiếng cạch.'
      },
      {
        title: 'Đường vát 45° sắc gọn',
        text: 'Cạnh hông và chân vát 45° tạo bóng đổ sắc nét, khối bàn vững chãi mà không nặng nề.'
      },
      {
        title: 'Dây điện giấu hoàn toàn',
        text: 'Nắp lỗ đi dây thép mạ PVD Titan khớp với tay nắm, mặt bàn không một sợi dây hở khi làm việc.'
      }
    ],
    spaces: ['Phòng làm việc tại gia 15 - 20 m² trong căn hộ 80 - 120 m², dài 2,2 m dựa trọn một bức tường'],
    pairings: ['Ghế công thái học da Ý cùng tông và đèn bàn cần xoay ánh sáng ấm 3000K']
  },

  // Ghế Làm Việc Da Ý Công Thái Học
  'prod-012': {
    highlights: [
      {
        title: 'Da hạt tự nhiên không dập giả',
        text: 'Da bò Top-grain giữ nguyên hạt và vết tự nhiên, sờ thấy độ ấm dịu và mượt tay ngay khi chạm.'
      },
      {
        title: 'Chân nhôm đúc 5 cánh gọn',
        text: 'Chân nhôm đúc thanh mảnh, bánh xe PU 60 mm lăn êm và không để lại vết trên sàn gỗ.'
      },
      {
        title: 'Điều chỉnh độ nhô lưng tựa',
        text: 'Đỡ lưng tăng giảm cả độ cao lẫn độ nhô, ôm đúng đường cong thắt lưng của từng người.'
      }
    ],
    spaces: ['Phòng làm việc tại gia 8 - 12 m² trong căn hộ 65 - 90 m², bán kính xoay 68 cm vẫn thoải mái'],
    pairings: ['Bàn làm việc veneer óc chó hoặc sồi tự nhiên, thảm len mỏng dưới bánh xe để giảm tiếng ồn']
  },

  // Tủ Áo Cánh Kính Anodized Kyoto
  'prod-013': {
    highlights: [
      {
        title: 'Khung nhôm siêu mỏng 20 mm',
        text: 'Viền khung Anodized Champagne chỉ dày 20 mm, cánh kính khói trông như một mặt phẳng lơ lửng trong gỗ.'
      },
      {
        title: 'Đèn LED thanh nhôm cảm biến',
        text: 'Mở cánh là đèn 3000K sáng nhẹ soi rõ từng ngăn, đóng lại đèn tắt, không cần công tắc.'
      },
      {
        title: 'Kính khói giấu đồ mà vẫn nhẹ',
        text: 'Kính màu khói che vừa đủ đồ bên trong nhưng vẫn giữ chiều sâu ánh sáng, phòng ngủ trông không nặng nề.'
      }
    ],
    spaces: ['Phòng ngủ master 14 - 18 m² hoặc phòng thay đồ 6 - 8 m² trong căn hộ 75 - 100 m²'],
    pairings: ['Giường gỗ sồi Mộc Miên và thảm len sát tường, ánh sáng trần ẩn để kính khói phản chiếu dịu mắt']
  },

  // Kệ Tivi Gỗ Sồi Bắc Mỹ Kanso
  'prod-014': {
    highlights: [
      {
        title: 'Nan sồi 20 x 30 mm đều tăm tắp',
        text: 'Từng thanh nan được bào cùng khổ, khe hở 8 mm đều như nhịp thở, che thiết bị mà vẫn nhận tín hiệu điều khiển.'
      },
      {
        title: 'Cánh push-open không tay nắm',
        text: 'Nhấn nhẹ là cánh bật mở, mặt tiền phẳng lặng không một chi tiết thừa, đúng tinh thần Kanso giản dị.'
      },
      {
        title: 'Thân sồi ghép finger-joint',
        text: 'Mộng ngón tay giữ ổn định thân tủ lâu dài, hạn chế cong vênh khi thời tiết đổi mùa.'
      }
    ],
    spaces: ['Phòng khách 18 - 25 m² căn hộ 65 - 90 m², tivi 55 - 75 inch treo hoặc đặt trên kệ thấp 42 cm'],
    pairings: ['Sofa vải tông ngà, thảm len mỏng và một bình gốm mờ đặt lệch một bên để cân bằng bố cục']
  },

  // Tủ Rượu & Buffet Florence
  'prod-015': {
    highlights: [
      {
        title: 'Cánh sóng phay CNC 3D',
        text: 'Nguyên tấm óc chó được phay gợn sóng liên tục, ánh sáng khúc xạ tạo bóng chuyển động theo giờ trong ngày.'
      },
      {
        title: 'Mặt đá Nero Marquina đen tuyền',
        text: 'Mặt đá đen với vân trắng mảnh làm điểm nhấn tương phản, dày 18 mm chống ố, chịu được ly rượu và khay tiệc.'
      },
      {
        title: 'Giá treo ly mạ đồng giấu kín',
        text: 'Ly rượu được treo gọn trong hộc tủ, mở cánh mới thấy, giữ mặt tiền trầm lặng đúng kiểu Quiet Luxury.'
      }
    ],
    spaces: ['Phòng ăn 15 - 20 m² trong căn hộ 75 - 100 m² cần thêm mặt phẳng lưu trữ sát tường'],
    pairings: ['Gương tròn viền mảnh treo phía trên và đèn bàn nhỏ ánh sáng ấm tạo góc tiếp khách']
  },

  // Kệ Sách Điêu Khắc Vòm Cung Pantheon
  'prod-016': {
    highlights: [
      {
        title: 'Vòm cung bo mềm như kiến trúc cổ',
        text: 'Các tầng kệ uốn vòm bán kính lớn, viền chà nhám mịn tay, biến nơi để sách thành một mảng tường điêu khắc.'
      },
      {
        title: 'Sơn PU mờ OSEVEN 10%',
        text: 'Lớp phủ mờ giữ nguyên cảm giác thô mộc của vân sồi, không bóng nhựa dưới ánh đèn đọc sách.'
      },
      {
        title: 'Chống lật bắt tường an toàn',
        text: 'Bộ thép chống lật cố định thân kệ vào tường, yên tâm cho nhà có trẻ nhỏ dù kệ cao 2,1 m.'
      }
    ],
    spaces: ['Phòng khách hoặc phòng đọc có tường trống rộng 1,6 - 1,8 m trong căn hộ 65 - 90 m²'],
    pairings: ['Ghế armchair da cognac đặt cạnh kệ, đèn sàn cần vòm và vài cuốn sách bìa trung tính xếp xen kẽ']
  },

  // Đảo Bếp Mặt Đá Thạch Anh Atelier
  'prod-017': {
    highlights: [
      {
        title: 'Đá ốp tràn hai hông',
        text: 'Mặt đá kéo dài xuống hai bên như thác nước, tạo khối vững chãi liền mạch không lộ mối nối.'
      },
      {
        title: 'Tay nắm âm không cấn tay',
        text: 'Mặt cánh phẳng hoàn toàn, mở bằng rãnh âm, khi đi ngang không vướng áo hay hông người.'
      },
      {
        title: 'Ray hộp giảm chấn êm ái',
        text: 'Ngăn kéo sâu lướt êm và tự đóng nhẹ, chịu tải nồi chảo nặng mà không xệ dần theo thời gian.'
      }
    ],
    spaces: ['Bếp mở 20 - 28 m² trong căn hộ 90 m² trở lên, chừa lối đi quanh đảo tối thiểu 100 cm'],
    pairings: ['Ba ghế bar da Nappa cao 65 cm và đèn thả dây kim loại tông đồng cùng chiều dài đảo']
  },

  // Ghế Bar Bọc Da Nappa Tuscany
  'prod-018': {
    highlights: [
      {
        title: 'Chân thép vuốt côn PVD Champagne',
        text: 'Thép đặc tiện CNC vuốt nhỏ về phía sàn, ánh kim loại champagne mờ dịu, không chói như crom.'
      },
      {
        title: 'Da Nappa Camel mềm như găng',
        text: 'Lớp da mỏng và mềm ôm theo dáng ngồi, đệm mút đúc 45 kg/m³ giữ form không xẹp.'
      },
      {
        title: 'Vòng gác chân Ø16 liền khối',
        text: 'Vòng thép hàn liền, chịu lực đạp mà không rung, tư thế ngồi cao vẫn vững chãi.'
      }
    ],
    spaces: ['Đảo bếp hoặc quầy bar mini cao 100 - 105 cm trong căn hộ 65 - 90 m², ghế nhỏ gọn 48 cm xếp sát nhau'],
    pairings: ['Đảo bếp đá thạch anh Atelier và đèn thả kim loại tông đồng xước phía trên quầy']
  },

  // Đèn Chùm Pha Lê Thổi Tay Aurora
  'prod-019': {
    highlights: [
      {
        title: 'Thổi tay từng cánh thủy tinh',
        text: 'Mỗi cánh borosilicate được nghệ nhân thổi và uốn tay, độ dày và đường cong không cánh nào giống hẳn nhau.'
      },
      {
        title: 'Ánh sáng 3000K dịu, CRI > 95',
        text: 'Ánh vàng ấm trung thực màu sắc món ăn và làn da, tương thích dimmer để giảm sáng theo từng bữa tối.'
      },
      {
        title: 'Cáp treo điều chỉnh 50 - 250 cm',
        text: 'Điều chỉnh độ cao theo trần thấp hay thông tầng, giữ đèn luôn ở đúng tầm mắt trên bàn ăn.'
      }
    ],
    spaces: ['Phòng ăn hoặc phòng khách trần 2,7 - 3,2 m trong căn hộ 75 - 120 m², đường kính 110 cm hợp bàn 6 - 8 người'],
    pairings: ['Bàn ăn gỗ óc chó hoặc mặt đá, treo lệch tâm nhẹ trên trục bàn để tạo chiều sâu']
  },

  // Đèn Sàn Arc Lamp Chân Đá Cẩm Thạch
  'prod-020': {
    highlights: [
      {
        title: 'Đế đá nguyên khối 35 kg',
        text: 'Đế marble Ø45 cm nặng 35 kg giữ đèn đứng vững khi cần vươn 2 m, ngã đổ không còn là nỗi lo.'
      },
      {
        title: 'Cần đồng xước mảnh vươn xa',
        text: 'Ống thép mạ đồng xước mờ uốn thành vòm duyên dáng, cho phép đặt đèn cạnh sofa mà ánh sáng vươn tới bàn trà.'
      },
      {
        title: 'Chao nhôm tản sáng lòng trắng',
        text: 'Lòng chao sơn trắng phản xạ tản sáng đều, tránh chói mắt khi ngồi đọc sách.'
      }
    ],
    spaces: ['Góc phòng khách cạnh sofa trong căn hộ 65 - 90 m² trần từ 2,6 m, thay thế đèn trần lớn'],
    pairings: ['Sofa góc L và bàn trà thấp, đặt sát tay vịn để cần vòm vươn phía trên chỗ ngồi']
  },

  // Thảm Len Moroccan Nomad Tự Nhiên
  'prod-021': {
    highlights: [
      {
        title: 'Len cừu không nhuộm',
        text: 'Màu ngà tự nhiên của len New Zealand được giữ nguyên, sờ mềm ấm và không lo hóa chất nhuộm trong phòng có trẻ nhỏ.'
      },
      {
        title: 'Họa tiết nomad bất đối xứng',
        text: 'Đường kẻ dệt tay lệch nhẹ mang chất Wabi-sabi, không đều tăm tắp nhưng chính điều đó tạo nét sang.'
      },
      {
        title: 'Sợi cao 25 mm giảm tiếng bước chân',
        text: 'Tấm thảm dày 25 mm hút tiếng ồn, sàn phòng khách chung cư êm hơn hẳn và ấm chân vào mùa lạnh.'
      }
    ],
    spaces: ['Phòng khách 20 - 30 m² căn hộ 65 - 90 m², kích thước 300 x 200 cm phủ trọn bộ sofa và bàn trà'],
    pairings: ['Sofa vải ngà hoặc da cognac, bàn trà gỗ sồi thấp; đặt chân trước sofa lên thảm cho bố cục vững']
  },

  // Tượng Điêu Khắc Đồng Balance & Harmony
  'prod-022': {
    highlights: [
      {
        title: 'Đúc khuôn sáp thất truyền',
        text: 'Mỗi tượng được đúc từ một khuôn sáp chỉ dùng một lần rồi phá bỏ, nên không thể sao chép, mỗi bản là độc bản.'
      },
      {
        title: 'Patina nâu cổ phủ tay',
        text: 'Lớp patina tạo màu thủ công cho bề mặt đồng thẫm ấm, càng để lâu càng bóng dịu như đồng cổ.'
      },
      {
        title: 'Đế granite đen chống ngã',
        text: 'Đế đá đen mài mờ lót nỉ tạo trọng tâm thấp, tượng đứng vững trên kệ và không xước mặt bàn.'
      }
    ],
    spaces: ['Sảnh vào nhà, kệ console hoặc mặt tủ buffet, cao 62 cm hợp cả căn hộ 65 m² lẫn biệt thự'],
    pairings: ['Đặt trên kệ tivi gỗ sồi hoặc buffet đá đen, chừa khoảng trống rộng xung quanh để tượng thở']
  },

  // Bộ Bàn Ghế Ngoài Trời Teakwood Sân Vườn
  'prod-023': {
    highlights: [
      {
        title: 'Gỗ Teak lõi đủ dầu',
        text: 'Chỉ dùng phần lõi giàu dầu tự nhiên, chịu mưa nắng nhiệt đới, không cần lớp sơn phủ dày che vân.'
      },
      {
        title: 'Cạnh bo mềm R10 an toàn',
        text: 'Cạnh bàn ghế bo tròn, chà nhám tay, vuốt qua không dằm và không cấn khi trẻ chạy quanh.'
      },
      {
        title: 'Ngả bạc theo thời gian',
        text: 'Gỗ dần ngả xám bạc quý phái dưới nắng sương, lau dầu Teak định kỳ nếu muốn giữ màu mật ong ban đầu.'
      }
    ],
    spaces: ['Sân vườn, hiên nhà hoặc ban công rộng từ 12 m² của nhà phố và biệt thự nhỏ'],
    pairings: ['Đệm ngồi vải Sunbrella tông ngà, cây lá xanh trong chậu gốm nung và đèn lồng ngoài trời ánh vàng ấm']
  },

  // Ghế Thư Giãn Dài Daybed Pavilion
  'prod-024': {
    highlights: [
      {
        title: 'Vải Sunbrella dệt nổi mờ',
        text: 'Bề mặt dệt mờ như lanh nhưng chống UV, chống nấm mốc, giữ nguyên màu ngà sau nhiều mùa nắng.'
      },
      {
        title: 'Khung nhôm hàn kín mối',
        text: 'Mối hàn được mài phẳng phủ sơn tĩnh điện, không rỉ sét dù đặt bên hồ bơi có hơi muối và clo.'
      },
      {
        title: 'Bánh xe ẩn tiện dời chỗ',
        text: 'Bánh xe giấu dưới chân, kéo daybed theo bóng nắng hoặc gác vào hiên khi mưa mà không nhấc nặng.'
      }
    ],
    spaces: ['Ban công hoặc sân thượng từ 10 m² của căn hộ 65 - 90 m², hồ bơi khách sạn nhỏ và homestay'],
    pairings: ['Bàn phụ gỗ Teak tròn và một chiếc ô lệch tâm, tông ngà - xám đá để mặt hồ và nắng làm điểm nhấn']
  }
};
