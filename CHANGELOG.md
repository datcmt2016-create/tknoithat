# Nhật Ký Thay Đổi — CDHome Atelier

> Chỉ ghi các chỉnh sửa **đã hoàn thành và kiểm tra thành công**. Mục mới nhất ở trên cùng.
> Thời gian theo giờ Việt Nam (GMT+7). Dấu `~` = thời gian ước tính.

## Thống kê

| Chỉ số | Giá trị |
|---|---|
| Tổng số lần cập nhật thành công | 13 |
| Lần cập nhật gần nhất | 29/09/2026 19:15 |
| Commit gần nhất trên GitHub | `52a4b24` (29/09/2026 15:01, gồm 6 cập nhật từ 13:44 đến 15:00) |
| Đang chờ kiểm tra | 0 |
| Test tự động gần nhất | 78/80 đạt toàn website (2 case lỗi: 3 danh mục con chưa có sản phẩm) |

---

## ✅ Đã hoàn thành

### 29/09/2026 19:15 — Bản vẽ theo hình dáng thực tế + bổ sung Điểm chạm chế tác · chưa commit
- **`DynamicBlueprint.tsx`**: tự nhận diện loại đồ theo tên/danh mục (sofa, giường, daybed, bàn, ghế, tủ, kệ sách, tab đầu giường); giữ nguyên nền caro vàng và nét nâu, chỉ thêm nét vẽ bên trong
  - Sofa: tay vịn, lưng tựa, nệm chia theo số chỗ, chân ghế; mặt bằng chia khối nệm + chú thích "Mặt ngồi sâu Ncm"; mặt cạnh lưng tựa vát cong, tay vịn phía trước; sofa góc L vẽ đúng hình chữ L
  - Tủ: chia cánh (2/4 cánh theo tên), tay nắm, kính phản chiếu, chân đế; kệ sách chia tầng có sách; bàn: mặt mỏng + chân + thanh giằng, bàn có tủ phụ; giường: đầu giường, gối, nệm, chân; ghế: lưng, đệm, chân (ghế xoay, ghế bar)
  - Đèn, thảm, tượng vẫn vẽ khối trơn (chưa có nét riêng)
- **`craftEnhancements.ts` (mới)**: thêm 3 "Điểm chạm chế tác" + 1-2 ý "Không gian phù hợp" + 1 ý "Gợi ý phối hợp" cho cả 24 sản phẩm; ghép trong `initialData.ts`; `dataService.ts` tự cập nhật cho sản phẩm chưa chỉnh sửa trong trình duyệt cũ
- Kiểm tra: `tsc` sạch; chụp PC + mobile các loại sofa, giường, tủ, bàn, ghế, kệ, bàn làm việc; test 78/80 (2 case cũ)
- File: `DynamicBlueprint.tsx`, `ProductSpecs.tsx`, `data/craftEnhancements.ts`, `data/initialData.ts`, `services/dataService.ts`

### 29/09/2026 18:57 — Tự động tạo bản vẽ kỹ thuật cho mọi sản phẩm · chưa commit
- **Component mới `DynamicBlueprint.tsx`**: vẽ SVG 3 góc nhìn (Mặt đứng chính, Mặt đứng cạnh, Mặt bằng) từ Dài/Rộng/Cao; nền giấy cream có lưới caro, nét nâu ấm, đường gióng kích thước D/R/C, đường tâm, khung tên
- **Responsive**: đo bề rộng thật, PC xếp 2 góc nhìn trên + mặt bằng và khung tên dưới; mobile xếp dọc, chữ luôn đọc được
- **`ProductSpecs.tsx`**: mỗi tùy chọn trong `product.items` tự có bản vẽ; ảnh tĩnh `dimensionImages` (nếu có) giữ lại làm "Bản vẽ chi tiết từ xưởng"
- `ProductDetailPage.tsx`: nút "Xem bản vẽ kỹ thuật & thông số chi tiết" hiện cho mọi sản phẩm có kích thước
- Kiểm tra: `tsc` sạch, chụp PC + mobile đạt, test 78/80 (2 case cũ)
- File: `DynamicBlueprint.tsx`, `ProductSpecs.tsx`, `ProductDetailPage.tsx`

### 29/09/2026 15:00 — Sửa lỗi nút tim, rà soát vùng chạm, thay ảnh hỏng
- **Nút tim trên thẻ sản phẩm**: bấm tim không còn bị chuyển sang trang chi tiết (chặn nổi bọt sự kiện); nút Zalo trên thẻ cũng chặn tương tự
- **Lỗi ngầm**: tim ở mục "Tác Phẩm Liên Quan" luôn trống → giờ hiện đúng sản phẩm đã lưu
- **Lỗi ngầm**: 4 ảnh Unsplash đã bị xóa (404) làm hỏng ảnh 11 sản phẩm + ảnh danh mục Giường ngủ → thay ảnh mới cùng chủ đề (tự thay cả trong trình duyệt đã lưu dữ liệu cũ)
- **Vùng chạm mobile ≥ 44px**: ô tìm kiếm mobile, link "Catalog CDHome", nút phóng to ảnh, link "Xem bản vẽ", hotline + email ở Footer, nút bỏ yêu thích; PC: nút tìm kiếm & nút mở danh mục ở Sidebar ≥ 32px
- Rà soát `initialData.ts` (SĐT/Zalo/địa chỉ/giờ/Maps đồng nhất) và `AuthModal.tsx` (đủ ô xác nhận + kiểm tra khớp)
- Bộ test: 80 case (thêm kiểm tra nút tim, ảnh hỏng, đủ 4 tab thông số cho 24 sản phẩm); đạt 78/80
- File: `ProductCard.tsx`, `ProductDetailPage.tsx`, `App.tsx`, `Navbar.tsx`, `Sidebar.tsx`, `Footer.tsx`, `FavoritesPage.tsx`, `data/initialData.ts`, `dataService.ts`, `tests/website-test.mjs`, `.gitignore`

### 29/09/2026 14:26 — Vá lỗi bảo mật mật khẩu · chưa commit
- Đăng nhập khách **bắt buộc đúng mật khẩu** (trước đây mật khẩu bất kỳ ≥ 6 ký tự đều vào được)
- Sai 5 lần → khóa tài khoản; mỗi lần sai báo "còn N lần thử"; nhập đúng thì bộ đếm về 0
- Admin **cấp mật khẩu mới** cho khách (trang Người dùng) → mở khóa luôn; có nhãn "Khóa do sai mật khẩu", "Sai x/5 lần"
- Cổng quản trị: bắt buộc đúng email + mật khẩu (trước đây mọi mật khẩu ≥ 6 ký tự đều vào); sai 5 lần → khóa 15 phút; bỏ dòng lộ "Gợi ý mật khẩu demo"
- Admin **đổi mật khẩu quản trị** trong Cài đặt (≥ 8 ký tự, có chữ + số); cảnh báo khi còn dùng mật khẩu mặc định
- Mật khẩu lưu dạng mã băm SHA-256 + salt (1.000 vòng), không lưu chữ thật
- Bộ test: thêm 14 case bảo mật; chạy nhóm riêng bằng `ONLY=SEC,ADM npm run test:web`
- File: `services/authService.ts`, `utils/hash.ts` (mới), `AuthModal.tsx`, `admin/AdminLogin.tsx`, `admin/AdminUsers.tsx`, `admin/AdminLayout.tsx`, `admin/AdminPasswordCard.tsx` (mới), `tests/website-test.mjs`, `package.json`

### 29/09/2026 14:16 — Nội dung chi tiết cho toàn bộ sản phẩm & nút "Về CDHome" · chưa commit
- Viết đủ Công dụng, Thiết kế, Độ phù hợp, Vật liệu (3 - 6 dòng) cho **24/24 sản phẩm**; thêm kích thước tùy chọn cho 9 sản phẩm
- Nội dung đặt trong `data/productDetails.ts`, tự ghép vào `INITIAL_PRODUCTS`; trình duyệt đã lưu dữ liệu cũ tự được bổ sung (giữ nguyên sản phẩm admin đã sửa)
- Navbar (PC): nút "Về CDHome" nền nâu đậm, cạnh Hotline → trang Showroom; menu mobile: đổi "Showroom CDHome" → "Về CDHome"
- Đã kiểm tra: không lỗi biên dịch/JS, PC 1280 + 1024 + mobile 430 không tràn ngang
- File: `data/productDetails.ts` (mới), `data/initialData.ts`, `dataService.ts`, `Navbar.tsx`, `MobileDrawer.tsx`, `App.tsx`

### 29/09/2026 14:16 — Xác nhận mật khẩu, địa chỉ Quảng Ngãi, dọn Footer · chưa commit
- Form Đăng ký: thêm ô "Nhập lại mật khẩu xác minh", báo "Mật khẩu xác nhận không khớp" và không tạo tài khoản
- Địa chỉ: Xã Tịnh Khê, TP. Quảng Ngãi, Tỉnh Quảng Ngãi · Giờ đón khách 07:00 - 20:30 (cập nhật cả link Google Maps và trình duyệt đã lưu dữ liệu cũ)
- Footer: bỏ dòng "Showroom Catalog • Chế tác theo yêu cầu kiến trúc sư" và nút "Trang Quản Trị Hệ Thống"
- Đã kiểm tra trên PC + mobile
- File: `AuthModal.tsx`, `Footer.tsx`, `App.tsx`, `data/initialData.ts`, `dataService.ts`

### 29/09/2026 13:50 — Xóa toàn bộ Messenger & test chức năng liên hệ · chưa commit
- Xóa nút Messenger ở trang sản phẩm (nút "Gọi Hotline" giãn full chiều ngang, hiện kèm số), hàm `copyAndOpenMessenger`, ô nhập Messenger trong Admin → Cài đặt, trường `messengerUsername` (tự dọn khỏi trình duyệt đã lưu)
- Test tự động 10 màn hình (PC + mobile: trang chủ, menu mobile, footer, sản phẩm, showroom, yêu thích): mọi link gọi là `tel:0973247076`, mọi nút Zalo mở `zalo.me/0973247076` kèm tin nhắn đúng ngữ cảnh, không còn chữ "Messenger", không lỗi JS
- File: `ProductDetailPage.tsx`, `FloatingContact.tsx`, `utils/contact.ts`, `admin/AdminSettings.tsx`, `types/index.ts`, `data/initialData.ts`, `dataService.ts`

### 29/09/2026 13:44 — Gọn Sidebar & bỏ nút Messenger · chưa commit
- Sidebar: bỏ nhãn đếm "8 bộ sưu tập", tiêu đề chỉ còn icon + "DANH MỤC KHÔNG GIAN"
- Nút liên hệ nổi: bỏ nút Messenger, giữ Hotline và Zalo (kiểm tra: `tel:0973247076`, `zalo.me/0973247076`)
- Rà soát số điện thoại: không còn chỗ nào ghi cứng số cũ
- Đã kiểm tra: không lỗi biên dịch, chụp màn hình PC + mobile
- File: `Sidebar.tsx`, `FloatingContact.tsx`

### 29/09/2026 13:44 — Trang Chi tiết sản phẩm: Thông số & Chi tiết tác phẩm · chưa commit
- Thêm trường dữ liệu: `usageDescription`, `designPhilosophy`, `suitability` (không gian phù hợp, gợi ý phối đồ)
- Nội dung mẫu cho Giường Mộc Miên và Sofa Roma Grand; 2 bản vẽ kỹ thuật SVG
- PC: 4 Tabs (Kích thước & Bản vẽ · Thiết kế · Vật liệu · Công dụng & Độ phù hợp); Mobile: Accordion; phóng to bản vẽ 1x–3x
- Đã kiểm tra: không lỗi biên dịch, không lỗi JS, không tràn ngang trên mobile
- File: `types/index.ts`, `data/initialData.ts`, `ProductSpecs.tsx` (mới), `ProductDetailPage.tsx`, `dataService.ts`, `index.css`, `public/drawings/*.svg` (mới)

### 29/09/2026 11:02 — Đổi "Thảo Điền" thành "CDHome" · commit `3a67b84`
- Đổi toàn bộ chữ "Thảo Điền" hiển thị thành "CDHome" trên **PC và mobile** (Hero, Sidebar, menu mobile, Footer, trang sản phẩm, trang Showroom, tin nhắn Zalo soạn sẵn)
- Giữ nguyên địa chỉ "Phường Thảo Điền" (tên phường thật)
- File: `HomePage`, `Sidebar`, `MobileDrawer`, `Footer`, `ProductDetailPage`, `ShowroomPage`, `App.tsx`
- Đã push lên GitHub

### 29/09/2026 ~10:50 — Chuyển sang địa chỉ cá nhân: Navbar & Hotline · commit `3a67b84`
- Xóa thanh thông báo trên cùng ("Không gian trưng bày Thảo Điền… • Hotline")
- Xóa nút "Showroom Thảo Điền" trên Navbar, căn lại bố cục thanh điều hướng
- Đổi hotline và Zalo `0988123456` → `0973247076` (tự cập nhật cả trình duyệt đã lưu số cũ)
- File: `Navbar.tsx`, `App.tsx`, `data/initialData.ts`, `services/dataService.ts`

### 29/09/2026 ~10:35 — Sửa lỗi cài đặt thư viện
- Nâng `esbuild` lên `^0.28.1`: hết xung đột với Vite 8, vá lỗ hổng bảo mật; `npm install` chạy bình thường
- File: `package.json`

### 29/09/2026 ~10:30 — Cài đặt & chạy dự án lần đầu
- Cài thư viện, chạy `npm run dev` thành công
