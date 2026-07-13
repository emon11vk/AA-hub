# AA-hub (Hệ thống Kế toán FTU)

Dự án Hệ thống Kế toán - Bài tập/Thực hành kế toán dành cho sinh viên FTU.

##  Giới thiệu

Đây là một ứng dụng Web mô phỏng Hệ thống Kế toán, cung cấp các tính năng quản lý danh mục (tài khoản, khách hàng, nhà cung cấp), lập chứng từ, và xem các báo cáo tài chính cơ bản.

Ứng dụng được xây dựng hoàn toàn ở phía Frontend, sử dụng **IndexedDB** (thông qua Dexie.js) để lưu trữ dữ liệu trực tiếp trên trình duyệt của người dùng. Điều này có nghĩa là mọi dữ liệu bạn nhập vào sẽ được lưu trên máy của bạn mà không cần đến Backend hay Database riêng biệt.

## 🛠 Công nghệ sử dụng

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Ngôn ngữ**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database (Client-side)**: [Dexie.js](https://dexie.org/) (Wrapper cho IndexedDB)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Routing**: [React Router](https://reactrouter.com/)
- **Form Management**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Cấu trúc thư mục

```text
AA-hub/
├── docs/                 # Chứa các tài liệu thiết kế, yêu cầu (PRD, PRODUCT, DESIGN) và file PDF
├── specs/                # Chứa các tài liệu đặc tả kỹ thuật chi tiết
├── public/               # Chứa các tài nguyên tĩnh (static assets) như logo, hình ảnh
├── src/                  # Mã nguồn chính của ứng dụng
│   ├── components/       # Các UI components dùng chung (Layout, Sidebar, In ấn...)
│   ├── db/               # Định nghĩa Database Dexie, dữ liệu mẫu (seed data)
│   ├── pages/            # Các trang giao diện chính (Dashboard, Organization, Vouchers, Reports)
│   ├── store/            # Quản lý state toàn cục (Zustand)
│   ├── utils/            # Các hàm hỗ trợ (format tiền tệ, xử lý chuỗi, đọc số thành chữ...)
│   ├── App.tsx           # Component gốc, cấu hình Routing
│   └── main.tsx          # Điểm bắt đầu (entry point) của ứng dụng
├── package.json          # Quản lý dependencies và scripts
└── vite.config.ts        # Cấu hình Vite
```

## 💻 Hướng dẫn Cài đặt & Chạy dự án (Local Development)

### Yêu cầu hệ thống
- [Node.js](https://nodejs.org/) (Phiên bản >= 18.x)
- Trình quản lý gói `npm`, `yarn`, hoặc `pnpm`.

### Các bước cài đặt

**1. Clone kho lưu trữ (repository) về máy:**
```bash
git clone <địa-chỉ-repo-của-bạn>
cd AA-hub
```

**2. Cài đặt các gói phụ thuộc (dependencies):**
```bash
npm install
# hoặc nếu bạn dùng yarn
yarn install
```

**3. Chạy server phát triển (development server):**
```bash
npm run dev
# hoặc
yarn dev
```

**4. Mở ứng dụng:**
Mở trình duyệt và truy cập vào [http://localhost:5173](http://localhost:5173) (hoặc cổng mà Vite cung cấp trong terminal) để trải nghiệm hệ thống.

## 📦 Các Scripts hỗ trợ (NPM Scripts)

- `npm run dev`: Khởi động ứng dụng trong môi trường phát triển với tính năng Hot-Module-Replacement (HMR).
- `npm run build`: Đóng gói (build) ứng dụng để chuẩn bị cho môi trường Production (kết quả sẽ nằm trong thư mục `dist/`).
- `npm run preview`: Xem trước bản build Production ở môi trường local.

## 📝 Quản lý Dữ liệu

Ứng dụng sử dụng **IndexedDB**. Để làm sạch hoặc khởi tạo lại dữ liệu, bạn có thể:
1. Mở Developer Tools trên trình duyệt (F12).
2. Chuyển sang tab **Application** (đối với Chrome) hoặc **Storage** (đối với Firefox).
3. Tìm mục **IndexedDB** -> Xóa database `HeThongKeToanDB`.
4. Refresh lại trang, ứng dụng sẽ tự động chạy file `seedData.ts` để nạp lại dữ liệu mẫu ban đầu.

---
*Chúc bạn có những trải nghiệm tốt nhất với AA-hub!*
