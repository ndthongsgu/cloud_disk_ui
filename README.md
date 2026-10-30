# ☁️ Cloud Disk Web UI (Frontend)

Dự án Giao diện Người dùng và Quản trị cho nền tảng **Cloud Disk** — hệ thống lưu trữ đám mây vô hạn tận dụng Telegram Bot API làm node lưu trữ vật lý, phân tách dữ liệu thành các file chunk và quản lý bằng metadata chặt chẽ.

Dự án được xây dựng trên nền tảng **React 19**, **TypeScript** và sử dụng công cụ build siêu tốc **Rsbuild** (dựa trên Rust-based Rspack).

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

Hệ thống frontend được thiết kế tối ưu hiệu năng và trải nghiệm người dùng với các công nghệ hiện đại:

*   **Core**: React 19, TypeScript
*   **Build Tool / Bundler**: [Rsbuild](https://rsbuild.dev/) (Rust-based bundler từ ByteDance, thay thế cực kỳ mạnh mẽ cho Vite)
*   **Định tuyến (Routing)**: `@tanstack/react-router` (Hệ thống routing an toàn kiểu dữ liệu - Type-safe routing)
*   **Quản lý State & Cache Server**: `@tanstack/react-query` (React Query v5) mang lại khả năng đồng bộ dữ liệu thời gian thực và tự động lưu bộ nhớ đệm.
*   **Quản lý State Toàn cục (Global State)**: `Zustand` (Gọn nhẹ, hiệu năng cao để quản lý tiến trình upload tệp và trạng thái đăng nhập)
*   **Thiết kế & Giao diện (Styling)**:
    *   `Tailwind CSS v4` (Phiên bản Tailwind mới nhất với hiệu năng vượt trội)
    *   `Radix UI` (Thư viện các components nền tảng dễ tiếp cận)
    *   `Lucide React` (Bộ icons giao diện trực quan sắc nét)
    *   `Sonner` (Hệ thống thông báo toast mượt mà)
*   **Quản lý Form & Validation**: `React Hook Form` kết hợp với `Zod` để kiểm tra dữ liệu đầu vào.
*   **Kết nối API**: `Axios` cấu hình sẵn cơ chế tự động xoay vòng Access Token (Token Rotation) bằng Refresh Token khi gặp lỗi `401 Unauthorized`.

---

## 🚀 Các tính năng nổi bật

1.  🔐 **Xác thực người dùng**: Đăng ký, Đăng nhập bảo mật với JWT. Tự động gia hạn phiên đăng nhập (Refresh Token) dưới nền mà không làm gián đoạn trải nghiệm của người dùng.
2.  📂 **Cấu trúc Thư mục ảo Vô hạn Cấp**:
    *   Tạo thư mục mới, điều hướng cây thư mục mượt mà.
    *   Tải lên tệp tin và tự động bẻ nhỏ thành các chunk (phân mảnh) ở phía backend để lưu trữ lên Telegram.
    *   Xem danh sách tệp tin dưới dạng **Lưới (Grid)** hoặc **Danh sách (List)**.
    *   Tìm kiếm tệp tin/thư mục thời gian thực.
3.  📊 **Giám sát Tiến trình Upload**: Hộp thoại góc màn hình hiển thị tiến trình tải lên (tỷ lệ %) chi tiết từng file thông qua Zustand Store.
4.  🤖 **Quản lý Storage Nodes (Telegram Bots Pool)**:
    *   Thêm mới, kích hoạt hoặc vô hiệu hóa các Bot Telegram làm nhiệm vụ lưu trữ vật lý.
    *   Hiển thị/Ẩn Token của Bot trực quan, an toàn.
5.  👥 **Quản lý người dùng (Dành cho Quyền Admin)**: Xem danh sách tài khoản thành viên trong hệ thống, vai trò và trạng thái hoạt động của họ.
6.  ⭐ **Đánh dấu Sao & Thùng rác**:
    *   Gắn dấu sao các tệp quan trọng để truy cập nhanh.
    *   Đưa tệp tin vào Thùng rác (Trash) để tránh xóa nhầm, cho phép khôi phục hoặc xóa vĩnh viễn.

---

## 📁 Cấu trúc thư mục nguồn (`src/`)

```text
src/
├── assets/          # Logo, hình ảnh và tài nguyên tĩnh
├── components/      # Các component dùng chung cho toàn dự án
│   ├── layout/      # Sidebar, Header định hình giao diện chính
│   └── ui/          # Các component UI cơ bản (Button, Input, v.v. từ shadcn/radix)
├── hooks/           # Custom React Hooks kết nối TanStack Query (Query & Mutation)
├── lib/             # Cấu hình thư viện dùng chung (Axios instance, utility class merger)
├── providers/       # Các Provider bọc ngoài ứng dụng (QueryClientProvider)
├── routes/          # Các file routes của TanStack Router (Login, Register, Files, Bots, Admin...)
├── services/        # Khai báo các API endpoints gọi lên Actix Web Backend
├── stores/          # Zustand Stores (AuthStore, FileStore quản lý upload)
├── types/           # Định nghĩa các TypeScript Interface/Type
├── App.css          # CSS cục bộ của App
├── App.tsx          # Điểm khởi đầu định tuyến ứng dụng
├── index.css        # Khai báo cấu hình Tailwind CSS v4 & Fonts
├── main.tsx         # Khởi tạo React DOM root
└── routeTree.gen.ts # File routes tự động tạo bởi TanStack Router
```

---

## ⚙️ Cài đặt & Khởi động dự án

### Yêu cầu hệ thống
*   Đã cài đặt **Node.js** (phiên bản `>= 18`) hoặc **Bun** (khuyên dùng vì tốc độ vượt trội).
*   Đã chạy Backend Server [cloud_disk_api](file:///d:/HOC_TAP/PROJECT/cloud_disk_api).

### Bước 1: Cấu hình biến môi trường
Tạo tệp tin `.env` trong thư mục gốc của dự án `cloud_disk_ui/` với nội dung sau:

```env
REACT_API_URL=http://localhost:8080/api
REACT_APP_ENV=dev
```

### Bước 2: Cài đặt các gói phụ thuộc (Dependencies)
Chạy lệnh sau để cài đặt các thư viện cần thiết:

```bash
# Sử dụng Bun (khuyên dùng)
bun install

# Hoặc sử dụng npm
npm install
```

### Bước 3: Khởi chạy dự án ở chế độ Phát triển (Development)
Chạy dev server cục bộ:

```bash
# Sử dụng Bun
bun dev

# Hoặc sử dụng npm
npm run dev
```

Ứng dụng sẽ khởi chạy tại địa chỉ: `http://localhost:5137/`

### Bước 4: Biên dịch ứng dụng cho môi trường Production
Để đóng gói sản phẩm tối ưu nhất:

```bash
# Sử dụng Bun
bun run build

# Hoặc sử dụng npm
npm run build
```

Các tệp tĩnh đã biên dịch sẽ nằm trong thư mục `build/` (được cấu hình trong `rsbuild.config.ts`).

---

## 🤝 Liên kết với Backend

Dự án này giao tiếp trực tiếp với Rest API được viết bằng **Rust (Actix-web)**.
*   **Mã nguồn API**: [cloud_disk_api](file:///d:/HOC_TAP/PROJECT/cloud_disk_api)
*   **Cơ sở dữ liệu**: PostgreSQL
*   Hãy đảm bảo bạn đã khởi chạy Docker Postgres Database và Actix Web server trước khi thao tác trên giao diện UI này.

