import { ChungTu } from './db';

const currentYear = new Date().getFullYear();
const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');

export const dummyChungTu: ChungTu[] = [
  {
    id: 'ct1',
    soChungTu: 'PT001',
    loaiChungTu: 'PHIEU_THU_KH',
    ngayHachToan: `${currentYear}-${currentMonth}-01`,
    ngayChungTu: `${currentYear}-${currentMonth}-01`,
    doiTuongId: 'kh1',
    tenDoiTuong: 'Công ty ABC',
    lyDo: 'Thu tiền khách hàng ABC',
    dienGiaiChung: 'Thu tiền khách hàng ABC thanh toán nợ',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-01T08:00:00Z`,
    butToan: [
      {
        id: 'bt1',
        chungTuId: 'ct1',
        dienGiai: 'Thu tiền khách hàng ABC',
        tkNo: '111', // Tiền mặt
        tkCo: '131', // Phải thu khách hàng
        soTien: 50000000
      }
    ]
  },
  {
    id: 'ct2',
    soChungTu: 'PC001',
    loaiChungTu: 'PHIEU_CHI_NCC',
    ngayHachToan: `${currentYear}-${currentMonth}-05`,
    ngayChungTu: `${currentYear}-${currentMonth}-05`,
    doiTuongId: 'ncc1',
    tenDoiTuong: 'Công ty XYZ',
    lyDo: 'Chi trả nợ nhà cung cấp XYZ',
    dienGiaiChung: 'Thanh toán tiền mua hàng hóa đợt 1',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-05T10:00:00Z`,
    butToan: [
      {
        id: 'bt2',
        chungTuId: 'ct2',
        dienGiai: 'Chi trả nợ nhà cung cấp XYZ',
        tkNo: '331', // Phải trả người bán
        tkCo: '111', // Tiền mặt
        soTien: 20000000
      }
    ]
  },
  {
    id: 'ct3',
    soChungTu: 'HDB001',
    loaiChungTu: 'HOA_DON_BAN_HANG',
    ngayHachToan: `${currentYear}-${currentMonth}-10`,
    ngayChungTu: `${currentYear}-${currentMonth}-10`,
    doiTuongId: 'kh2',
    tenDoiTuong: 'Khách hàng Lẻ',
    lyDo: 'Bán hàng hóa cho khách hàng',
    dienGiaiChung: 'Bán hàng hóa doanh thu lớn',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-10T14:30:00Z`,
    butToan: [
      {
        id: 'bt3_1',
        chungTuId: 'ct3',
        dienGiai: 'Ghi nhận doanh thu bán hàng',
        tkNo: '131', // Phải thu khách hàng
        tkCo: '511', // Doanh thu
        soTien: 100000000
      },
      {
        id: 'bt3_2',
        chungTuId: 'ct3',
        dienGiai: 'Thuế GTGT đầu ra',
        tkNo: '131', 
        tkCo: '333', // Thuế phải nộp (giả lập 3331 -> 333)
        soTien: 10000000
      },
      {
        id: 'bt3_3',
        chungTuId: 'ct3',
        dienGiai: 'Ghi nhận giá vốn',
        tkNo: '632', // Giá vốn
        tkCo: '156', // Hàng hóa
        soTien: 60000000
      }
    ]
  },
  {
    id: 'ct4',
    soChungTu: 'HDM001',
    loaiChungTu: 'HOA_DON_MUA_HANG',
    ngayHachToan: `${currentYear}-${currentMonth}-15`,
    ngayChungTu: `${currentYear}-${currentMonth}-15`,
    doiTuongId: 'ncc2',
    tenDoiTuong: 'Nhà cung cấp Nguyên Vật Liệu',
    lyDo: 'Mua nguyên vật liệu nhập kho',
    dienGiaiChung: 'Nhập kho nguyên vật liệu',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-15T09:15:00Z`,
    butToan: [
      {
        id: 'bt4_1',
        chungTuId: 'ct4',
        dienGiai: 'Mua nguyên vật liệu chưa thanh toán',
        tkNo: '152', // Nguyên liệu, vật liệu
        tkCo: '331', // Phải trả người bán
        soTien: 30000000
      },
      {
        id: 'bt4_2',
        chungTuId: 'ct4',
        dienGiai: 'Thuế GTGT đầu vào được khấu trừ',
        tkNo: '133', // Thuế GTGT được khấu trừ
        tkCo: '331',
        soTien: 3000000
      }
    ]
  },
  {
    id: 'ct5',
    soChungTu: 'PKT001',
    loaiChungTu: 'PHIEU_KE_TOAN',
    ngayHachToan: `${currentYear}-${currentMonth}-28`,
    ngayChungTu: `${currentYear}-${currentMonth}-28`,
    tenDoiTuong: 'Nội bộ',
    lyDo: 'Trả lương nhân viên',
    dienGiaiChung: 'Chi phí lương bộ phận quản lý',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-28T16:00:00Z`,
    butToan: [
      {
        id: 'bt5_1',
        chungTuId: 'ct5',
        dienGiai: 'Chi phí quản lý doanh nghiệp',
        tkNo: '642', // Chi phí QLDN
        tkCo: '334', // Phải trả người lao động
        soTien: 15000000
      }
    ]
  },
  {
    id: 'ct6',
    soChungTu: 'PTG001',
    loaiChungTu: 'THU_TIEN_GUI',
    ngayHachToan: `${currentYear}-${currentMonth}-29`,
    ngayChungTu: `${currentYear}-${currentMonth}-29`,
    tenDoiTuong: 'Cổ đông',
    lyDo: 'Góp vốn kinh doanh',
    dienGiaiChung: 'Góp vốn bằng chuyển khoản',
    loaiTien: 'VND',
    tyGia: 1,
    daKhoa: true,
    createdAt: `${currentYear}-${currentMonth}-29T10:00:00Z`,
    butToan: [
      {
        id: 'bt6_1',
        chungTuId: 'ct6',
        dienGiai: 'Nhận vốn góp bằng TGNH',
        tkNo: '112', // TGNH
        tkCo: '411', // Vốn chủ sở hữu
        soTien: 200000000
      }
    ]
  }
];
