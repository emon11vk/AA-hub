import Dexie, { Table } from 'dexie';
import { seedTaiKhoanKeToan } from './seedData';
import { dummyChungTu } from './dummyTransactions';

export interface HoSoDoanhNghiep {
  id: string;
  tenDN: string;
  diaChi: string;
  maSoThue: string;
  hoTenSinhVien: string;
  chucDanh: string;
  lop?: string;
  kyThucHanh: string;
  trangThai: 'DANG_LAM' | 'DA_NOP';
  ngayNop?: string;
  createdAt: string;
}

export interface NhaCungCap {
  id: string;
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  tenHangHoa?: string; // App gợi ý mặt hàng
  daVoHieuHoa?: boolean;
}

export interface KhachHang {
  id: string;
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  daVoHieuHoa?: boolean;
}

export interface TaiKhoanKeToan {
  id: string;
  soHieu: string;
  tenTaiKhoan: string;
  duNoDauKy: number;
  duCoDauKy: number;
  loaiTaiKhoan: 'TAI_SAN' | 'NGUON_VON' | 'DOANH_THU' | 'CHI_PHI';
}

export type LoaiChungTu =
  | 'PHIEU_THU' | 'PHIEU_THU_KH'
  | 'PHIEU_CHI' | 'PHIEU_CHI_NCC'
  | 'THU_TIEN_GUI' | 'THU_TIEN_GUI_KH'
  | 'UY_NHIEM_CHI' | 'UY_NHIEM_CHI_NCC'
  | 'GIAY_BAO'
  | 'HOA_DON_BAN_HANG'
  | 'HOA_DON_MUA_HANG'
  | 'PHIEU_KE_TOAN';

export interface ButToan {
  id: string;
  chungTuId: string;
  dienGiai: string;
  tkNo: string;
  tkCo: string;
  soTien: number;
  doiTuong?: string;
  tkThueGTGT?: string;
  soTienThue?: number;
  donVi?: string;
  congTrinh?: string;
  hopDong?: string;
}

export interface ChungTu {
  id: string;
  soChungTu: string;
  loaiChungTu: LoaiChungTu;
  ngayHachToan: string;
  ngayChungTu: string;
  doiTuongId?: string;
  tenDoiTuong: string;
  diaChi?: string;
  lyDo?: string;
  dienGiaiChung?: string;
  nguoiNop?: string;
  nguoiNhan?: string;
  nhanVien?: string;
  chungTuGoc?: string;
  tkNganHang?: string; // Bank account if applicable
  loaiTien: string;
  tyGia: number;
  daKhoa: boolean;
  createdAt: string;
  butToan: ButToan[]; // Can store directly inside or separate table. Since indexedDb can store objects, let's keep it here for easy retrieval
}

export interface ThanhToan {
  id: string;
  chungTuThuChiId: string;
  chungTuHoaDonId: string;
  soTienThanhToan: number;
}

export class AccountingDB extends Dexie {
  hoSoDoanhNghiep!: Table<HoSoDoanhNghiep>;
  nhaCungCap!: Table<NhaCungCap>;
  khachHang!: Table<KhachHang>;
  taiKhoanKeToan!: Table<TaiKhoanKeToan>;
  chungTu!: Table<ChungTu>;
  thanhToan!: Table<ThanhToan>;

  constructor() {
    super('AccountingDB');
    this.version(2).stores({
      hoSoDoanhNghiep: 'id, trangThai',
      nhaCungCap: 'id, ma',
      khachHang: 'id, ma',
      taiKhoanKeToan: 'id, soHieu',
      chungTu: 'id, soChungTu, loaiChungTu, ngayHachToan',
      thanhToan: 'id, chungTuThuChiId, chungTuHoaDonId'
    });
    
    this.on('populate', () => {
      this.taiKhoanKeToan.bulkAdd(seedTaiKhoanKeToan as TaiKhoanKeToan[]);
      this.chungTu.bulkAdd(dummyChungTu);
    });
  }
}

export const db = new AccountingDB();
