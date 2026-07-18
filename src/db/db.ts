import Dexie, { Table } from 'dexie';
import { seedTaiKhoanKeToan } from './seedData';
import { dummyChungTu } from './dummyTransactions';

export interface BaseSyncRecord {
  user_id?: string;
  isSynced?: boolean;
  updatedAt?: number;
}


export interface HoSoDoanhNghiep extends BaseSyncRecord {
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

export interface NhaCungCap extends BaseSyncRecord {
  id: string;
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  tenHangHoa?: string; // App gợi ý mặt hàng
  daVoHieuHoa?: boolean;
}

export interface NhanVien extends BaseSyncRecord {
  id: string;
  ma: string;
  ten: string;
  phongBan: string;
  viTri: string;
}

export interface KhachHang extends BaseSyncRecord {
  id: string;
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  daVoHieuHoa?: boolean;
}

export interface NganHang extends BaseSyncRecord {
  id: string;
  ma: string;
  ten: string;
  soTaiKhoan: string;
  chiNhanh: string;
  daVoHieuHoa?: boolean;
}

export interface TaiKhoanKeToan extends BaseSyncRecord {
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

export interface ChungTu extends BaseSyncRecord {
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

export interface ThanhToan extends BaseSyncRecord {
  id: string;
  chungTuThuChiId: string;
  chungTuHoaDonId: string;
  soTienThanhToan: number;
}

export class AccountingDB extends Dexie {
  hoSoDoanhNghiep!: Table<HoSoDoanhNghiep>;
  nhaCungCap!: Table<NhaCungCap>;
  khachHang!: Table<KhachHang>;
  nganHang!: Table<NganHang>;
  taiKhoanKeToan!: Table<TaiKhoanKeToan>;
  chungTu!: Table<ChungTu>;
  thanhToan!: Table<ThanhToan>;
  nhanVien!: Table<NhanVien>;

  constructor() {
    super('AccountingDB_v2');
    this.version(5).stores({
      hoSoDoanhNghiep: 'id, trangThai, user_id, isSynced, updatedAt',
      nhaCungCap: 'id, ma, user_id, isSynced, updatedAt',
      khachHang: 'id, ma, user_id, isSynced, updatedAt',
      nganHang: 'id, ma, user_id, isSynced, updatedAt',
      taiKhoanKeToan: 'id, soHieu, user_id, isSynced, updatedAt',
      chungTu: 'id, soChungTu, loaiChungTu, ngayHachToan, user_id, isSynced, updatedAt',
      thanhToan: 'id, chungTuThuChiId, chungTuHoaDonId, user_id, isSynced, updatedAt',
      nhanVien: 'id, ma, user_id, isSynced, updatedAt'
    }).upgrade(trans => {
      // Upgrade logic if needed
    });
    
    this.on('populate', () => {
      this.taiKhoanKeToan.bulkAdd(seedTaiKhoanKeToan as TaiKhoanKeToan[]);
      this.chungTu.bulkAdd(dummyChungTu);
    });
  }
}

export const db = new AccountingDB();

export async function clearLocalDB() {
  await Promise.all([
    db.hoSoDoanhNghiep.clear(),
    db.nhaCungCap.clear(),
    db.khachHang.clear(),
    db.nganHang.clear(),
    db.taiKhoanKeToan.clear(),
    db.chungTu.clear(),
    db.thanhToan.clear(),
    db.nhanVien.clear()
  ]);
  
  // Re-seed default accounts
  await db.taiKhoanKeToan.bulkAdd(seedTaiKhoanKeToan as TaiKhoanKeToan[]);
}
