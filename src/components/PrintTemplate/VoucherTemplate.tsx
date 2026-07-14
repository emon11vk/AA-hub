import React from 'react';
import { ChungTu } from '../../db/db';
import { numberToWords } from '../../utils/numberToWords';
import { useAuthStore } from '../../store/authStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';

interface VoucherTemplateProps {
  voucher: ChungTu;
}

export const VoucherTemplate = React.forwardRef<HTMLDivElement, VoucherTemplateProps>(
  ({ voucher }, ref) => {
    const user = useAuthStore(state => state.user);
    const profile = useLiveQuery(() => db.hoSoDoanhNghiep.limit(1).first());
    
    const isPhieuThu = voucher.loaiChungTu.includes('THU') || voucher.loaiChungTu === 'GIAY_BAO';
    const title = isPhieuThu ? (voucher.loaiChungTu.includes('TIEN_GUI') ? 'GIẤY BÁO CÓ' : 'PHIẾU THU') 
                             : (voucher.loaiChungTu.includes('TIEN_GUI') || voucher.loaiChungTu.includes('UY_NHIEM') ? 'ỦY NHIỆM CHI' : 'PHIẾU CHI');
                             
    const totalAmount = voucher.butToan.reduce((sum, item) => sum + Number(item.soTien), 0);

    return (
      <div ref={ref} className="bg-white font-serif text-black w-full max-w-[210mm] mx-auto border border-gray-300 shadow-sm print:border-none print:shadow-none print:max-w-none print:w-full print:m-0 print:p-0">
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 20mm; }
          }
        `}</style>
        
        <div className="p-8 print:p-0 min-h-[297mm] print:min-h-[257mm] flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="font-bold uppercase">{profile?.tenDN || 'CÔNG TY TNHH ABC'}</div>
              <div className="text-sm">Địa chỉ: {profile?.diaChi || '---'}</div>
              <div className="text-sm">MST: {profile?.maSoThue || '---'}</div>
            </div>
            <div className="text-center text-sm font-bold">
              Mẫu số 01 - TT<br/>
              <span className="font-normal italic">(Ban hành theo Thông tư số 99/2025/TT-BTC)</span>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold uppercase">{title}</h1>
            <div className="italic text-sm">
              Ngày {voucher.ngayChungTu.split('-')[2]} tháng {voucher.ngayChungTu.split('-')[1]} năm {voucher.ngayChungTu.split('-')[0]}
            </div>
            <div className="text-sm mt-1">Số: <span className="font-bold">{voucher.soChungTu}</span></div>
          </div>

          <div className="space-y-2 text-sm mb-6 flex-1">
            <div className="flex">
              <span className="w-48">{isPhieuThu ? 'Họ và tên người nộp tiền:' : 'Họ và tên người nhận tiền:'}</span>
              <span className="font-bold flex-1">{voucher.tenDoiTuong}</span>
            </div>
            <div className="flex">
              <span className="w-48">Địa chỉ:</span>
              <span className="flex-1">{voucher.diaChi || '---'}</span>
            </div>
            <div className="flex">
              <span className="w-48">Lý do {isPhieuThu ? 'nộp' : 'chi'}:</span>
              <span className="flex-1">{voucher.lyDo}</span>
            </div>
            {voucher.tkNganHang && (
              <div className="flex">
                <span className="w-48">Tài khoản ngân hàng:</span>
                <span className="flex-1">{voucher.tkNganHang}</span>
              </div>
            )}
            <div className="flex">
              <span className="w-48">Số tiền:</span>
              <span className="font-bold flex-1">{totalAmount.toLocaleString('vi-VN')} VND</span>
            </div>
            <div className="flex">
              <span className="w-48">Bằng chữ:</span>
              <span className="font-bold italic flex-1">{numberToWords(totalAmount)}</span>
            </div>
            <div className="flex">
              <span className="w-48">Kèm theo:</span>
              <span className="flex-1">{voucher.chungTuGoc || '0'} chứng từ gốc</span>
            </div>
          </div>

          <div className="flex justify-between text-sm pb-16">
            <div className="text-center w-1/4">
              <div className="font-bold mb-16">Giám đốc</div>
              <div>(Ký, họ tên)</div>
            </div>
            <div className="text-center w-1/4">
              <div className="font-bold mb-16">Kế toán trưởng</div>
              <div>(Ký, họ tên)</div>
            </div>
            <div className="text-center w-1/4">
              <div className="font-bold mb-16">Người lập biểu</div>
              <div className="font-bold">{profile?.hoTenSinhVien || user?.fullName || ''}</div>
              <div>(Ký, họ tên)</div>
            </div>
            <div className="text-center w-1/4">
              <div className="font-bold mb-16">{isPhieuThu ? 'Người nộp tiền' : 'Người nhận tiền'}</div>
              <div>(Ký, họ tên)</div>
            </div>
          </div>
        </div>

        <div style={{ pageBreakBefore: 'always' }} className="pt-8 print:pt-0">
          <table className="w-full border-collapse border border-black text-sm mb-6">
            <thead>
              <tr>
                <th className="border border-black p-2 text-black font-bold">Diễn giải</th>
                <th className="border border-black p-2 text-black font-bold">Ghi Nợ</th>
                <th className="border border-black p-2 text-black font-bold">Ghi Có</th>
                <th className="border border-black p-2 text-black font-bold">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              {voucher.butToan.map((item, idx) => (
                <tr key={idx}>
                  <td className="border border-black p-2">{item.dienGiai}</td>
                  <td className="border border-black p-2 text-center">{item.tkNo}</td>
                  <td className="border border-black p-2 text-center">{item.tkCo}</td>
                  <td className="border border-black p-2 text-right">{Number(item.soTien).toLocaleString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);
