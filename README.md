# AA-hub (Hệ thống Kế toán FTU)

Dự án Hệ thống Kế toán (Web Thực hành Kế toán) - Ứng dụng mô phỏng bài tập và thực hành kế toán dành cho sinh viên. 

## 🌟 Giới thiệu

Đây là một ứng dụng Web mô phỏng Hệ thống Kế toán, cung cấp môi trường thực hành cho các nghiệp vụ kế toán doanh nghiệp bao gồm: thiết lập thông tin ban đầu, quản lý danh mục (tài khoản, khách hàng, nhà cung cấp, ngân hàng), lập chứng từ kế toán, và tự động trích xuất các báo cáo tài chính cơ bản.

Điểm đặc biệt của hệ thống là hoạt động hoàn toàn ở phía **Client-side (Frontend)**. Ứng dụng sử dụng **IndexedDB** (thông qua thư viện Dexie.js) để lưu trữ toàn bộ dữ liệu trực tiếp trên trình duyệt của người dùng. Mọi thao tác nhập liệu, hạch toán đều được xử lý và lưu trữ cục bộ, đảm bảo tính riêng tư, tốc độ cao mà không cần đến Backend hay Database Server riêng biệt.

## 🚀 Các tính năng đã phát triển (Hiện có)

Dựa trên cấu trúc dự án hiện tại, hệ thống đã hoàn thiện các phân hệ sau:

### 1. Phân hệ Tổ chức & Danh mục (Organization)
- **Hồ sơ doanh nghiệp**: Khai báo thông tin sinh viên thực hành, thông tin doanh nghiệp, kỳ kế toán.
- **Danh mục Khách hàng & Nhà cung cấp**: Quản lý thông tin, mã số thuế, số dư công nợ đầu kỳ.
- **Danh mục Nhân viên**: Quản lý nhân viên theo phòng ban, vị trí.
- **Danh mục Ngân hàng**: Quản lý tài khoản ngân hàng của doanh nghiệp.
- **Hệ thống Tài khoản Kế toán**: Dựa trên chế độ kế toán chuẩn (Tài sản, Nguồn vốn, Doanh thu, Chi phí), có thể thiết lập số dư đầu kỳ.

### 2. Phân hệ Chứng từ (Vouchers)
- **Lập chứng từ thu/chi**: Phiếu thu, phiếu chi tiền mặt, thu tiền gửi, ủy nhiệm chi.
- **Lập hóa đơn**: Hóa đơn mua hàng, hóa đơn bán hàng.
- **Phiếu kế toán (Chứng từ chung)**: Dành cho các bút toán điều chỉnh, kết chuyển, hạch toán khác.
- **Quản lý & Thanh toán**: Xem danh sách chứng từ, theo dõi các khoản thanh toán cho hóa đơn/chứng từ công nợ (Debt Payment).
- **In chứng từ**: Tích hợp template in ấn chuyên nghiệp cho các loại phiếu (React-to-print).

### 3. Phân hệ Báo cáo (Reports)
- **Sổ Nhật ký chung (General Journal)**: Liệt kê chi tiết mọi bút toán phát sinh theo trình tự thời gian.
- **Bảng Cân đối số phát sinh (Trial Balance)**: Tổng hợp số dư đầu kỳ, số phát sinh trong kỳ và số dư cuối kỳ của tất cả tài khoản.
- **Bảng Cân đối kế toán (Balance Sheet)**: Trình bày tình hình Tài sản, Nợ phải trả và Vốn chủ sở hữu.
- **Báo cáo Kết quả Hoạt động Kinh doanh (Income Statement)**: Tính toán và hiển thị doanh thu, chi phí, lợi nhuận trong kỳ.

### 4. Tổng quan (Dashboard)
- Giao diện Dashboard hiển thị thông tin tổng quan về tình hình tài chính của doanh nghiệp thực hành.

## 🛠 Công nghệ sử dụng (Tech Stack)

- **Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Ngôn ngữ**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database (Client-side)**: [Dexie.js](https://dexie.org/) (Wrapper cho IndexedDB)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- **Routing**: [React Router DOM](https://reactrouter.com/)
- **Form & Validation**: [React Hook Form](https://react-hook-form.com/) kết hợp [Zod](https://zod.dev/)
- **Biểu đồ (Charts)**: [Recharts](https://recharts.org/)
- **In ấn**: `react-to-print`
- **Icons**: [Lucide React](https://lucide.dev/)
- **BaaS (Dự phòng)**: [@supabase/supabase-js](https://supabase.com/) (Có trong dependencies phục vụ mục đích mở rộng)

## 📂 Cấu trúc thư mục

```text
AA-hub/
├── docs/                 # Tài liệu thiết kế, yêu cầu (PRD, PRODUCT, DESIGN) và file PDF
├── specs/                # Tài liệu đặc tả kỹ thuật chi tiết
├── public/               # Tài nguyên tĩnh (static assets) như logo, hình ảnh
├── src/                  # Mã nguồn chính của ứng dụng
│   ├── components/       # Các UI components tái sử dụng (Layout, Form, PrintTemplate...)
│   ├── db/               # Định nghĩa Schema Dexie (db.ts), dữ liệu mẫu (seedData.ts)
│   ├── pages/            # Các trang giao diện chính:
│   │   ├── Dashboard/    # Trang chủ tổng quan
│   │   ├── Organization/ # Hồ sơ DN, Danh mục (KH, NCC, TK KeToan...)
│   │   ├── Reports/      # Các báo cáo: BalanceSheet, IncomeStatement, GeneralJournal...
│   │   └── Vouchers/     # Giao diện lập và danh sách chứng từ (VoucherForm, VoucherList...)
│   ├── store/            # Quản lý state toàn cục (vd: authStore.ts dùng Zustand)
│   ├── utils/            # Các hàm tiện ích hỗ trợ định dạng số, ngày tháng...
│   ├── App.tsx           # Component gốc, cấu hình React Router
│   ├── index.css         # Reset CSS, khai báo biến Tailwind
│   └── main.tsx          # Điểm bắt đầu (entry point) của ứng dụng
├── package.json          # Quản lý dependencies và scripts
├── tailwind.config.js    # Cấu hình Tailwind CSS
├── tsconfig.json         # Cấu hình TypeScript
└── vite.config.ts        # Cấu hình Vite
```

## 🗄 Kiến trúc Dữ liệu (Database Schema)

Dữ liệu được lưu tại IndexedDB với tên Database `AccountingDB_v2`. Các bảng (collections) chính bao gồm:
- `hoSoDoanhNghiep`: Thông tin DN & Sinh viên.
- `taiKhoanKeToan`: Hệ thống tài khoản và số dư.
- `chungTu`: Lưu trữ các phiếu thu/chi, hóa đơn, kèm theo các bút toán (bảng chi tiết) bên trong.
- `thanhToan`: Theo dõi lịch sử thanh toán hóa đơn.
- `nhaCungCap`, `khachHang`, `nganHang`, `nhanVien`: Các đối tượng liên quan.

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
```

**3. Chạy server phát triển (development server):**
```bash
npm run dev
```

**4. Mở ứng dụng:**
Mở trình duyệt và truy cập vào [http://localhost:5173](http://localhost:5173) để trải nghiệm hệ thống.

## 📦 Các lệnh hỗ trợ (NPM Scripts)

- `npm run dev`: Khởi động ứng dụng trong môi trường phát triển (HMR).
- `npm run build`: Đóng gói ứng dụng để deploy (sản phẩm nằm trong `dist/`).
- `npm run preview`: Xem trước bản build Production ở môi trường local.

## 📝 Xóa / Đặt lại Dữ liệu

Vì ứng dụng sử dụng **IndexedDB**, nếu bạn muốn làm sạch toàn bộ dữ liệu làm thử hoặc khôi phục lại dữ liệu mẫu gốc:
1. Mở Developer Tools trên trình duyệt (Nhấn `F12` hoặc `Ctrl+Shift+I`).
2. Chuyển sang tab **Application** (Chrome/Edge) hoặc **Storage** (Firefox).
3. Ở menu bên trái, tìm mục **IndexedDB** -> Xóa database có tên `AccountingDB_v2`.
4. Tải lại trang (F5), ứng dụng sẽ tự động chạy file `seedData.ts` để nạp lại hệ thống tài khoản và dữ liệu mẫu ban đầu.

---
*Dự án Hệ thống Kế toán (AA-hub) - Phục vụ môn Thực hành Kế toán FTU!*
