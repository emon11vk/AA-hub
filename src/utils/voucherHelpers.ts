import { db, LoaiChungTu } from '../db/db';

export async function generateVoucherNumber(loaiChungTu: LoaiChungTu): Promise<string> {
  const vouchers = await db.chungTu.where('loaiChungTu').equals(loaiChungTu).toArray();
  
  let prefix = 'CT';
  switch (loaiChungTu) {
    case 'PHIEU_THU':
    case 'PHIEU_THU_KH': prefix = 'PT'; break;
    case 'PHIEU_CHI':
    case 'PHIEU_CHI_NCC': prefix = 'PC'; break;
    case 'THU_TIEN_GUI':
    case 'THU_TIEN_GUI_KH': prefix = 'GBC'; break;
    case 'UY_NHIEM_CHI':
    case 'UY_NHIEM_CHI_NCC': prefix = 'UNC'; break;
    case 'GIAY_BAO': prefix = 'GB'; break;
    case 'HOA_DON_BAN_HANG': prefix = 'HDBH'; break;
    case 'HOA_DON_MUA_HANG': prefix = 'HDMH'; break;
    case 'PHIEU_KE_TOAN': prefix = 'PKT'; break;
  }

  if (vouchers.length === 0) {
    return `${prefix}00001`;
  }

  // Find the highest number for this prefix
  let maxNum = 0;
  for (const v of vouchers) {
    if (v.soChungTu && v.soChungTu.startsWith(prefix)) {
      const numStr = v.soChungTu.replace(prefix, '');
      const num = parseInt(numStr, 10);
      if (!isNaN(num) && num > maxNum) {
        maxNum = num;
      }
    }
  }

  const count = maxNum + 1;
  const paddedCount = count.toString().padStart(5, '0');
  return `${prefix}${paddedCount}`;
}
