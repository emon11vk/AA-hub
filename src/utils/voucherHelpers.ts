import { db, LoaiChungTu } from '../db/db';

export async function generateVoucherNumber(loaiChungTu: LoaiChungTu): Promise<string> {
  const vouchers = await db.chungTu.where('loaiChungTu').equals(loaiChungTu).toArray();
  const count = vouchers.length + 1;
  const paddedCount = count.toString().padStart(5, '0');

  switch (loaiChungTu) {
    case 'PHIEU_THU':
    case 'PHIEU_THU_KH':
      return `PT${paddedCount}`;
    case 'PHIEU_CHI':
    case 'PHIEU_CHI_NCC':
      return `PC${paddedCount}`;
    case 'THU_TIEN_GUI':
    case 'THU_TIEN_GUI_KH':
      return `GBC${paddedCount}`; // Giấy báo có
    case 'UY_NHIEM_CHI':
    case 'UY_NHIEM_CHI_NCC':
      return `UNC${paddedCount}`;
    case 'GIAY_BAO':
      return `GB${paddedCount}`;
    case 'HOA_DON_BAN_HANG':
      return `HDBH${paddedCount}`;
    case 'HOA_DON_MUA_HANG':
      return `HDMH${paddedCount}`;
    case 'PHIEU_KE_TOAN':
      return `PKT${paddedCount}`;
    default:
      return `CT${paddedCount}`;
  }
}
