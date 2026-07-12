const ChuSo = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const Tien = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];

function docSo3ChuSo(baso: number): string {
  let tram: number;
  let chuc: number;
  let donvi: number;
  let KetQua = '';
  
  tram = Math.floor(baso / 100);
  chuc = Math.floor((baso % 100) / 10);
  donvi = baso % 10;
  
  if (tram === 0 && chuc === 0 && donvi === 0) return '';
  
  if (tram !== 0) {
    KetQua += ChuSo[tram] + ' trăm ';
    if ((chuc === 0) && (donvi !== 0)) KetQua += ' linh ';
  }
  
  if ((chuc !== 0) && (chuc !== 1)) {
    KetQua += ChuSo[chuc] + ' mươi ';
    if ((chuc === 0) && (donvi !== 0)) KetQua = KetQua + ' linh ';
  }
  
  if (chuc === 1) KetQua += 'mười ';
  
  switch (donvi) {
    case 1:
      if ((chuc !== 0) && (chuc !== 1)) {
        KetQua += ' mốt ';
      } else {
        KetQua += ChuSo[donvi] + ' ';
      }
      break;
    case 5:
      if (chuc === 0) {
        KetQua += ChuSo[donvi] + ' ';
      } else {
        KetQua += ' lăm ';
      }
      break;
    default:
      if (donvi !== 0) {
        KetQua += ChuSo[donvi] + ' ';
      }
      break;
  }
  return KetQua;
}

export function numberToWords(SoTien: number): string {
  if (SoTien === 0) return 'Không đồng';
  
  let lan = 0;
  let i = 0;
  let so = 0;
  let KetQua = '';
  let tmp = '';
  let viTri = new Array(6);
  
  if (SoTien < 0) return 'Số tiền âm !';
  
  let soTienStr = SoTien.toString();
  if (soTienStr.length > 18) return 'Số quá lớn';
  
  so = SoTien;
  if (SoTien > 0) {
    so = SoTien;
  }
  
  let stringRevert = soTienStr.split('').reverse().join('');
  let lengthString = stringRevert.length;
  lan = Math.floor(lengthString / 3);
  let phanDu = lengthString % 3;
  
  if (phanDu > 0) lan += 1;
  
  for (i = 0; i < lan; i++) {
    viTri[i] = parseInt(stringRevert.substring(i * 3, i * 3 + 3).split('').reverse().join(''));
  }
  
  for (i = lan - 1; i >= 0; i--) {
    if (viTri[i] > 0) {
      tmp = docSo3ChuSo(viTri[i]);
      KetQua += tmp;
      if (Tien[i]) KetQua += Tien[i] + ' ';
    }
  }
  
  if (KetQua.substring(KetQua.length - 1) === ' ') {
    KetQua = KetQua.substring(0, KetQua.length - 1);
  }
  
  KetQua = KetQua.replace(/lẻ/g, 'linh');
  let finalResult = KetQua.substring(0, 1).toUpperCase() + KetQua.substring(1).trim() + ' đồng chẵn';
  return finalResult;
}
