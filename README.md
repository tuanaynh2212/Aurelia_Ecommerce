<p align="center">
  <img src="Frontend/Aurelia/src/assets/aurelia_logo_svg.svg" alt="Aurelia Logo" width="140" />
</p>

## Aurelia E‑Commerce – Hệ thống thương mại điện tử thời trang thông minh

Aurelia là một hệ thống **thương mại điện tử thời trang full‑stack**, kết hợp:

- **Backend**: ASP.NET Core **.NET 9**, MongoDB, JWT, SignalR, Firebase.
- **Frontend**: **React + TypeScript + Vite**, TailwindCSS, MediaPipe Pose, Chart, Map.

Dự án hướng tới trải nghiệm mua sắm cao cấp với:

- **Mua sắm thời trang đa kênh**: web hiện đại, UX mượt, giỏ hàng & thanh toán mô phỏng (mock payment).
- **AI đo số đo cơ thể** bằng camera (MediaPipe Pose) để **gợi ý size quần áo** tự động.
- **Hệ thống loyalty & tier** (Bronze → Royal) với ưu đãi, free ship, voucher thông minh.
- **Dashboard riêng** cho:
  - **User**: đơn hàng, lịch hẹn, tracking, địa chỉ, hồ sơ cá nhân.
  - **Shop**: quản lý sản phẩm, đơn hàng, lịch hẹn, khách hàng, real‑time notification.
  - **Admin**: doanh thu toàn hệ thống, sản phẩm bán chạy, shop hiệu quả, coupon, collection, banner.

> README này mô tả **tổng quan kiến trúc, tính năng và workflow chính của toàn hệ thống**.  
> Tài liệu chi tiết frontend: xem thêm `Frontend/README.md`.

---

## Cấu trúc thư mục

```txt
Aurelia/
├── Backend/
│   └── AureliaE-Commerce/         # ASP.NET Core Web API (C#, .NET 9, MongoDB)
├── Frontend/
│   └── Aurelia/                   # React + TypeScript + Vite SPA
├── node_modules/                  # (root) – nếu dùng script chung
└── package.json                   # (root) – tài liệu / script phụ (nếu có)
```

- **Backend**: API, auth (JWT), SignalR notify, gửi email, tích hợp MongoDB & Firebase.
- **Frontend**: UI/UX, routing, AI body measurements, dashboards, kết nối tới API backend.

### Backend – `Backend/AureliaE-Commerce`

```txt
Backend/AureliaE-Commerce/
├── AureliaE-Commerce.csproj       # Project .NET 9
├── Program.cs                     # Khởi tạo service, DI, CORS, JWT, SignalR, Swagger
├── appsettings*.json              # Cấu hình logging, MongoDbSettings, Jwt
├── secrets/                       # Firebase service account JSON
├── Context/
│   └── MongoDbContext.cs          # Khai báo IMongoCollection, kết nối MongoDB
├── Model/
│   ├── Client.cs                  # Thông tin khách hàng, đơn hàng, địa chỉ, tier, benefit
│   ├── OrderModel.cs              # Đơn hàng, trạng thái, tracking, danh sách ItemOrder
│   ├── ItemOrder.cs               # Sản phẩm trong đơn hàng (Itemid, size, color, price…)
│   ├── Product.cs                 # Sản phẩm tổng, variants, stock, sold, season…
│   ├── AttributeProduct/          # Thuộc tính sản phẩm (Color, Variant, Size…)
│   ├── Shop/
│   │   ├── Shop.cs                # Thông tin shop, Orders, products, appointments, notify
│   │   ├── ProductAtShop.cs       # Sản phẩm gắn với từng shop
│   │   ├── Appoinment.cs          # Lịch hẹn tại shop
│   │   └── ServiceAppointment.cs  # Dịch vụ đặt lịch
│   ├── Banner/                    # MainBanner, StoryBanner
│   ├── Coupon.cs, CouponProperty/ # Mã giảm giá & thuộc tính áp dụng
│   ├── Measure.cs                 # Số đo cơ thể
│   ├── MongoDbSettings.cs         # Cấu hình MongoDB
│   └── ...                        # Các model khác (AdminAccount, benefit, ThongTinCaNhan…)
├── Dto/
│   ├── LoginDto.cs, SignUpDto.cs              # DTO auth
│   ├── ShopSignUpDto.cs, ShopFindDto.cs      # DTO cho shop
│   ├── ProductUpdateDto.cs, GetSlotDto.cs    # DTO sản phẩm & lịch hẹn
│   ├── CouponDto.cs                          # DTO coupon
│   └── ...                                   # Các DTO cập nhật profile, trạng thái…
├── Controller/
│   ├── Authentication.cs          # Đăng nhập/đăng ký User, Shop, Admin, logout, getInfo
│   ├── ProductController.cs       # CRUD sản phẩm, search, import từ JSON
│   ├── ClientController.cs        # Yêu thích, giỏ hàng, đơn hàng, tier, địa chỉ, số đo, lịch hẹn
│   ├── ShopController.cs          # Gán đơn cho shop, lịch hẹn, kho, notify, dashboard shop
│   ├── AdminCotroller.cs          # Dashboard admin, doanh thu, báo cáo năm, shop info
│   ├── CouponController.cs        # CRUD & suggest voucher theo đơn và lịch sử khách
│   ├── BannerController.cs        # Banner chính & story banner
│   ├── SeasonCollectionController.cs # Collection theo mùa & thống kê
│   └── GetAIAdvice.cs             # API AI gợi ý size dựa trên số đo đã lưu
├── Services/
│   ├── ProductItemsService.cs     # Logic truy vấn & xử lý danh sách sản phẩm
│   └── ShopService.cs             # Logic tìm kiếm shop, thêm shop từ file JSON
├── Hubs/
│   └── NotifyHub.cs               # Hub SignalR cho notify đơn hàng & lịch hẹn
└── Common/
    └── ApiResponse.cs             # Wrapper chuẩn cho response (Success/Error)
```

### Frontend – `Frontend/Aurelia`

```txt
Frontend/Aurelia/
├── package.json                   # Scripts (dev/build/lint/preview) & dependencies
├── vite.config.ts                 # Cấu hình Vite + HTTPS + Tailwind plugin
├── tsconfig*.json                 # Cấu hình TypeScript
├── index.html                     # Shell HTML gốc
├── src/
│   ├── main.tsx                   # Entry React, bọc App với các provider/router
│   ├── App.tsx                    # Routing chính cho toàn bộ SPA
│   ├── index.css                  # Global styles (Tailwind, custom)
│   ├── assets/
│   │   ├── aurelia_logo_svg.svg   # Logo dự án
│   │   ├── DataMock/*.json        # Mock data sản phẩm/collection (nếu dùng)
│   │   └── ...                    # Ảnh, icon, banner
│   ├── Components/
│   │   ├── HomeLayoutComponent/   # Navbar, HeroBanner, Collection section, Footer…
│   │   ├── ProductComponent/      # ListProduct, Filter, ProductRecommend…
│   │   ├── AiModelBodySize/       # Camera + hiển thị số đo AI
│   │   ├── BookingAppointment/    # Form đặt lịch hẹn
│   │   ├── DashBoardShopComponent/# Widget dashboard shop, danh sách đơn, lịch hẹn
│   │   ├── AdminBrandComponent/   # Component dashboard admin (stats, charts…)
│   │   ├── AccountComponents/     # Tab tài khoản user, đơn hàng, địa chỉ, tier
│   │   ├── TrackingOrder/         # Giao diện tracking đơn hàng + bản đồ
│   │   └── ...                    # LoadingScreen, layout, UI shared khác
│   ├── Page/
│   │   ├── Home.tsx               # Trang chủ
│   │   ├── Product.tsx            # Danh sách tất cả sản phẩm
│   │   ├── MainProduct.tsx        # Chi tiết sản phẩm (AI size, review…)
│   │   ├── AllCollection.tsx      # Tất cả collection
│   │   ├── Collection.tsx         # Chi tiết collection
│   │   ├── Cart.tsx               # Trang giỏ hàng
│   │   ├── CheckOut.tsx           # Thanh toán
│   │   ├── MockPayMent.tsx        # Mô phỏng payment
│   │   ├── BodySize.tsx           # Giao diện đo số đo bằng AI
│   │   ├── Search.tsx             # Tìm kiếm sản phẩm
│   │   ├── About.tsx              # Giới thiệu thương hiệu
│   │   └── DashboardAccount/      # DashBoardUser, DashBoardShop, DashBoardAdmin
│   ├── contexts/
│   │   ├── Author.tsx             # Auth user (JWT, profile)
│   │   ├── AuthorForShop.tsx      # Auth shop
│   │   ├── AuthorForAdmin.tsx     # Auth admin
│   │   ├── CartContext.tsx        # State giỏ hàng
│   │   ├── AIPoseMeasure.tsx      # Số đo từ camera & AI
│   │   ├── AppointmentContext.tsx # Lịch hẹn
│   │   ├── DashBoardShopContext.tsx # Dữ liệu dashboard shop
│   │   ├── DiaChiContext.tsx      # Địa chỉ giao hàng
│   │   ├── NotifycationContext.tsx# Thông báo real‑time
│   │   ├── SeasonContext.tsx      # Collection theo mùa
│   │   ├── FIlterProduct.tsx      # Bộ lọc sản phẩm
│   │   └── Store.tsx              # Thông tin shop & store chung
│   ├── services/
│   │   ├── api.ts                 # Khai báo đường dẫn API backend (api_Config, UseApiUrl)
│   │   ├── http.ts                # Wrapper axios/fetch chung
│   │   ├── auth.service.ts        # Hàm đăng nhập/đăng ký, lấy profile
│   │   ├── EmailService.ts        # Reset/đổi mật khẩu qua email
│   │   └── firebase.ts            # Khởi tạo Firebase, login social (nếu dùng)
│   ├── types/
│   │   └── type.ts                # Khai báo type chung cho Product, Order, User…
│   └── ...
└── dist/                          # Build output production của Vite
```

Nhìn chung:

- **Backend** tập trung theo **domain**: `Client`, `Shop`, `Admin`, `Product`, `Coupon`, `Banner`, `SeasonCollection`, `AIAdvice`.
- **Frontend** tập trung theo **Layer**:
  - `Page/` (trang), `Components/` (UI chi tiết), `contexts/` (state toàn cục), `services/` (API), `types/` (kiểu dữ liệu).

---

## Tính năng chính theo vai trò

### User (Khách hàng)

- **Khám phá & tìm kiếm sản phẩm**
  - Danh sách, chi tiết, bộ sưu tập theo mùa (Season Collection), banner/stories.
- **Giỏ hàng & yêu thích**
  - Lưu sản phẩm yêu thích, tự động merge giỏ khi đăng nhập.
- **Đặt hàng & thanh toán (mock)**
  - Xác nhận đơn, dùng voucher, ước lượng phí ship theo khoảng cách & tổng tiền.
- **Loyalty & Tier**
  - Tích điểm theo giá trị đơn, tự động nâng hạng (Bronze → Silver → Gold → Diamond → Royal).
  - Quyền lợi theo tier: free ship, giảm giá theo % và ưu đãi đặc biệt.
- **AI đo số đo & gợi ý size**
  - Đo vai, ngực, eo, hông, chiều cao bằng camera.
  - Lưu số đo, AI backend gợi ý size XS–XL theo từng loại sản phẩm (top/dress).
- **Lịch hẹn & tracking**
  - Đặt lịch hẹn thử đồ tại shop, xem lịch sử hẹn.
  - Tracking đơn + vị trí giao hàng (kết hợp bản đồ ở frontend).
- **Quản lý tài khoản**
  - Cập nhật profile, avatar, số điện thoại, địa chỉ giao hàng (nhiều địa chỉ).
  - Xem lịch sử đơn hàng, thống kê số đơn và tổng chi tiêu.

### Shop (Cửa hàng)

- **Dashboard tổng quan**
  - Doanh thu hôm nay vs hôm qua, số đơn, số khách mới, lịch hẹn, lịch chờ.
- **Quản lý đơn hàng**
  - Tiếp nhận đơn được hệ thống gán theo **kho & khoảng cách**.
  - Cập nhật trạng thái: Xác nhận → Đóng gói → Giao vận.
- **Quản lý sản phẩm tại shop**
  - Upload sản phẩm mới.
  - Đồng bộ với kho tổng (Product), quản lý variants, tồn kho, giá trị kho.
- **Lịch hẹn khách hàng**
  - Nhận thông báo real‑time khi khách đặt lịch.
  - Xem tất cả slot theo ngày, danh sách lịch hẹn & đơn hàng.
- **Thông báo & khách hàng**
  - Gửi thông báo cho khách (notification), nhận real‑time qua SignalR.
  - Thống kê khách hàng, doanh thu trung bình trên mỗi khách.

### Admin

- **Tổng quan doanh thu**
  - Doanh thu tháng hiện tại & tháng trước, số đơn, % tăng trưởng.
- **Phân tích khách hàng & coupon**
  - Số khách đăng ký theo tháng, số coupon, tỉ lệ tăng trưởng.
- **Phân tích theo cửa hàng**
  - Doanh thu từng shop, tốc độ tăng trưởng, rating, review.
- **Quản trị sản phẩm & kho**
  - Xem sản phẩm bán chạy.
  - Reset số lượng `sold` trên toàn hệ thống khi cần.
- **Báo cáo theo năm**
  - Doanh thu từng tháng, số đơn, cơ cấu tồn kho theo loại sản phẩm, top dịch vụ booking.
- **Nội dung & chiến dịch**
  - Quản lý banner chính & story banner.
  - Quản lý voucher/coupon: tạo, chỉnh sửa, xóa, kích hoạt/khóa, gợi ý voucher phù hợp đơn & lịch sử khách.
  - Quản lý collection theo mùa (Season Collection).

---

## Workflow nghiệp vụ tổng quan

### 1. Auth & định danh

- User/Shop/Admin đăng nhập qua các endpoint:
  - `/api/Authentication/LogIn`, `/LogInShop`, `/LogInAdminSite`.
  - Hoặc user đăng nhập bằng Firebase: `/LogInWithFirebase`.
- Backend sinh JWT và lưu trong cookie HttpOnly:
  - `access_token_client`, `access_token_shop`, `access_token_admin`.
- Lấy thông tin tài khoản:
  - `/api/Authentication/GetData?typeAccount=client|shop|admin`.

### 2. Hành trình mua sắm của User

- Duyệt danh sách & tìm kiếm sản phẩm:
  - `/api/Product/GetProduct`, `/api/Product/GetProductBySearch`.
- Thao tác giỏ & yêu thích:
  - Thêm yêu thích: `/api/Client/AddItems`, lấy: `/GetItemFavourite`.
  - Auto-add giỏ khi login: `/AutoAddGioHangKhiLog`, xóa giỏ: `/XoaGioHang`.
- Ước lượng phí ship & gán đơn cho shop:
  - Gửi `OrderModel` + tọa độ khách đến `/api/Shop/SapXepDonChoCuaHang?nana=true` để:
    - Tìm shop gần nhất còn đủ hàng.
    - Tính phí ship theo khoảng cách & tổng tiền.
  - Sau khi khách xác nhận & thanh toán (mock), gọi lại:
    - `/SapXepDonChoCuaHang?nana=false` để ghi đơn vào shop.
- Ghi nhận đơn cho user:
  - `/api/Client/AddDonHang?shopId=...`:
    - Lưu đơn vào `Client.DonHangCuaBan`.
    - Cộng điểm loyalty.
    - Giảm số lượng voucher đã dùng, cập nhật `Shop.products.sold`.
    - Gửi notification SignalR tới shop.
- Hậu mãi:
  - Xem đơn: `/LayDonHang`.
  - Đơn gần nhất: `/LayDonHangGanDay`.
  - Thống kê số đơn & tổng chi tiêu: `/GetSoLuongDonHang`.
  - Hủy đơn: `/HuyDonHang` (đồng bộ sang shop & trả lại tồn kho).

### 3. AI đo số đo & gợi ý size

- Frontend dùng MediaPipe Pose để đo số đo, sau đó:
  - Lưu số đo: `POST /api/Client/UpMeasure`.
  - Lấy số đo: `GET /api/Client/GetSoDo`.
- Khi xem sản phẩm:
  - Gửi `subCategory` & JWT qua `/api/GetAIAdvice/GetAdviceSize`.
  - Backend đọc số đo đã lưu, tính size XS–XL theo bảng size & logic tối ưu, trả về:
    - `size`, `note` và `message` gợi ý size.

### 4. Lịch hẹn & dịch vụ tại cửa hàng

- User:
  - Lưu lịch hẹn: `/api/Client/AddCuocHenUser`.
  - Xem lịch hẹn: `/LayCuocHenUser`.
- Shop:
  - Thêm lịch hẹn vào shop: `/api/Shop/AddAppointment`.
  - Lấy slot theo ngày: `/LayTatCaSlotTheoNgay`.
  - Xem danh sách đơn + lịch hẹn: `/LayDanhSachLichHenVaDonHang`.
- Notification:
  - Khi có lịch hẹn mới, backend gửi SignalR tới group `Shop_Appointment{ShopId}`.

### 5. Voucher/Coupon, Banner, Collection

- Voucher:
  - CRUD qua `CouponController`.
  - Gợi ý voucher phù hợp đơn & lịch sử mua: `/api/Coupon/SuggestVoucher`.
- Banner:
  - Lấy & quản trị banner trang chủ và story qua `BannerController`.
- Season Collection:
  - Quản lý các bộ sưu tập theo mùa, liên kết sản phẩm, thống kê rating/lượt xem.

### 6. Dashboard Shop & Admin

- Shop:
  - `/api/Shop/DataForDashBoard`, `/LaySanPham`, `/GetAllCustomer`, `/UpdateTrangThai`…
- Admin:
  - `/api/Admin/Revenue`, `/GetKhachHangAndDiscount`, `/GetDoanhThuCuaHang`,
    `/InformationShop`, `/DoanhThuCaNam`, `/LaySanPhamBanChay`, `/ResetSold`.

---

## Công nghệ chính

- **Backend**
  - .NET 9 (`net9.0`), ASP.NET Core Web API.
  - MongoDB (`MongoDB.Driver`), `MongoDbContext`.
  - JWT Auth (`Microsoft.AspNetCore.Authentication.JwtBearer`, `System.IdentityModel.Tokens.Jwt`).
  - Firebase Admin (`FirebaseAdmin`, `Google.Apis.Auth`) cho xác thực / dịch vụ khác.
  - SignalR (`Microsoft.AspNetCore.SignalR`) cho **real‑time notification**.
  - Swagger / OpenAPI (`Swashbuckle.AspNetCore.*`) cho tài liệu API.
  - BCrypt, MailKit, dotenv.net, v.v.

- **Frontend**
  - React 19 + TypeScript + Vite.
  - Tailwind CSS 4, Framer Motion, Lucide React.
  - React Router, React Hot Toast.
  - MediaPipe Pose (`@mediapipe/pose`, `@mediapipe/camera_utils`) cho đo số đo cơ thể.
  - Chart.js, Recharts, Leaflet + React‑Leaflet.
  - Axios, SignalR client, XLSX, v.v.

---

## Chuẩn bị môi trường

- **Backend**
  - .NET SDK **9.0** trở lên.
  - MongoDB instance (local hoặc cloud).
  - Tài khoản Firebase + file service account JSON.

- **Frontend**
  - Node.js **>= 18**.
  - npm (hoặc pnpm/yarn).
  - Webcam (cho tính năng AI đo số đo).

---

## Chạy Backend (ASP.NET Core)

Thư mục: `Backend/AureliaE-Commerce`

1. **Cấu hình biến môi trường** (khuyến nghị dùng `.env` vì dự án đã dùng `dotenv.net`):

   - `MONGODB_URI` – connection string MongoDB.
   - `JWT_KEY` – secret key ký JWT.

   File `appsettings.json` có dạng:

   ```json
   "MongoDbSettings": {
     "ConnectionString": "",
     "DataBaseName": "Aurelia"
   },
   "Jwt": {
     "Key": ""
   }
   ```

   nhưng giá trị runtime sẽ được override bằng biến môi trường ở `Program.cs`.

2. **Đặt file credential Firebase**  
   Copy file service account JSON vào:

   ```txt
   Backend/Aurelia-E-Commerce/secrets/aurelia-e-commerce-*.json
   ```

   và đảm bảo đường dẫn trong `Program.cs` trỏ đúng file:

   ```csharp
   Credential = GoogleCredential.FromFile("secrets/aurelia-e-commerce-b24aaf6123da.json")
   ```

3. **Khởi động API**

   ```bash
   cd Backend/AureliaE-Commerce
   dotnet restore
   dotnet run
   ```

4. **Swagger / tài liệu API**

   Ở môi trường Development, API expose Swagger tại:

   - `https://localhost:<port>/swagger`  
   - Hoặc route gốc nếu được cấu hình `RoutePrefix = string.Empty`.

5. **CORS & Frontend URL**

   Trong `Program.cs`, CORS được cấu hình với policy `AllowFrontEnd`:

   - `https://localhost:5173`
   - `https://localhost:3000`

   Nếu frontend chạy ở port khác, cập nhật lại danh sách origin tương ứng.

---

## Chạy Frontend (React + Vite)

Thư mục: `Frontend/Aurelia`

1. **Cài đặt dependencies**

   ```bash
   cd Frontend/Aurelia
   npm install
   ```

2. **Cấu hình URL Backend**

   Mở `src/services/api.ts` và kiểm tra/điều chỉnh `api_Url` cho khớp với backend:

   ```ts
   const api_Url = "https://localhost:7143"; // ví dụ
   ```

   hoặc dùng biến môi trường Vite (`VITE_API_URL`) nếu đã hỗ trợ.

3. **Chạy development server**

   ```bash
   npm run dev
   ```

   Mặc định Vite chạy ở `https://localhost:5173` (theo `vite.config.ts` với HTTPS).

4. **Build & preview production**

   ```bash
   npm run build
   npm run preview
   ```

Chi tiết các tính năng & module frontend xem trong: **`Frontend/README.md`**.

---

## Tài liệu thêm

- **Frontend**: `Frontend/README.md` – mô tả chi tiết kiến trúc, routing, context, API endpoints.
- **Docs khác** (nếu dùng):
  - `DOCS.md`, `CONTRIBUTING.md`, `PERFORMANCE.md` trong thư mục `Frontend/`.

---

## Quy ước code & đặt tên (Coding Style)

- **Ngôn ngữ & framework**
  - Backend: C# (.NET 9) với ASP.NET Core Web API, MongoDB Driver.
  - Frontend: React + TypeScript, dùng functional components & hooks.

- **Đặt tên**
  - C#:
    - Class/Model/DTO/Controller: **PascalCase** (`Client`, `OrderModel`, `ShopController`).
    - Thuộc tính/Property: **PascalCase** (`NgayTaoDon`, `SoLuongDonHang`).
    - Biến cục bộ, tham số: **camelCase** (`orderModel`, `shopId`, `filter`).
  - TypeScript/React:
    - Component: **PascalCase** (`MainProduct`, `DashBoardShop`, `AiModelBodySize`).
    - Hooks, biến, hàm: **camelCase** (`useCart`, `fetchOrders`, `handleSubmit`).
    - Context: tên file và Provider rõ vai trò (`AuthorForAdmin`, `CartContext`, `SeasonContext`).

- **Cấu trúc file**
  - Backend:
    - Logic nghiệp vụ chia vào `Services/`, Controller chỉ điều phối request/response.
    - DTO tách riêng trong `Dto/` để không phụ thuộc trực tiếp vào entity Mongo.
  - Frontend:
    - UI phức tạp tách thành nhiều component nhỏ dưới `Components/` theo domain (Home, Product, Dashboard…).
    - State dùng Context cho các domain lớn (auth, cart, appointment, season, notification).
    - Gọi API qua `services/api.ts` + `UseApiUrl`, không hard‑code URL trong component.

- **Xử lý lỗi & response**
  - Backend trả về dạng chuẩn với `ApiResponse` (Success/Error) cho các API quan trọng (Product, Shop…).
  - Frontend sử dụng toast (React Hot Toast) và UI state loading/error rõ ràng.

- **Security**
  - JWT lưu trong cookie HttpOnly ở backend.
  - CORS cấu hình cụ thể domain frontend (`https://localhost:5173`, `https://localhost:3000`).

---

## Hướng dẫn đóng góp (Contribution Guide)

1. **Chuẩn bị môi trường**
   - Cài .NET SDK 9 + MongoDB + Node.js >= 18.
   - Đảm bảo chạy được:
     - Backend: `dotnet run` trong `Backend/AureliaE-Commerce`.
     - Frontend: `npm install && npm run dev` trong `Frontend/Aurelia`.

2. **Quy trình làm việc**
   - Fork repository (nếu public) hoặc tạo branch mới từ `main`/`develop`:
     - `git checkout -b feature/<ten-tinh-nang>` hoặc `bugfix/<ma-lỗi>`.
   - Chạy app và test manual với các luồng chính liên quan tới thay đổi:
     - Auth, mua hàng, AI size, lịch hẹn, dashboard…

3. **Nguyên tắc code**
   - Không hard‑code URL backend; dùng `UseApiUrl(api_Config.X.Y)`.
   - Không thay đổi schema MongoDB (Model) nếu không cập nhật đồng bộ:
     - Model C# + Dto + Controller + Frontend types + UI liên quan.
   - Giữ nguyên style: functional component, hooks, contexts.
   - Với tính năng mới:
     - Thêm API vào `api_Config` trong `services/api.ts`.
     - Thêm type vào `types/type.ts` nếu có model mới.

4. **Commit & PR**
   - Commit message rõ ràng (tiếng Anh hoặc tiếng Việt nhất quán):
     - `feat: add AI size suggestion for skirt`
     - `fix: correct voucher filter for loyal customers`
   - Mô tả PR:
     - Mục tiêu thay đổi.
     - Các endpoint/API mới hoặc thay đổi.
     - Ảnh chụp màn hình (nếu là thay đổi UI lớn).

5. **Review**
   - Ưu tiên:
     - Không phá vỡ các luồng chính đã liệt kê trong phần **Workflow**.
     - Giữ trải nghiệm mượt (loading state, error state rõ ràng).
     - Không log thông tin nhạy cảm (token, mật khẩu, key) ra console/log công khai.

---

## License & trạng thái

Dự án đang trong quá trình phát triển nội bộ.  
Vui lòng xem/chỉnh sửa thêm các file tài liệu con nếu bạn mở rộng chức năng mới.


#   A u r e l i a _ E c o m m e r c e  
 