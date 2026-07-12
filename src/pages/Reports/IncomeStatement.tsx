import React, { useMemo, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { TrendingUp, Filter } from 'lucide-react';

export default function IncomeStatement() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const taiKhoanList = useLiveQuery(() => db.taiKhoanKeToan.toArray());
  const chungTuList = useLiveQuery(() => db.chungTu.toArray());

  const reportData = useMemo(() => {
    if (!taiKhoanList || !chungTuList) return null;

    let filteredCT = chungTuList;
    if (fromDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan >= fromDate);
    if (toDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan <= toDate);

    const phatSinhMap: Record<string, { no: number, co: number }> = {};
    
    filteredCT.forEach(ct => {
      ct.butToan.forEach(bt => {
        const parent3No = bt.tkNo.substring(0, 3);
        if (!phatSinhMap[parent3No]) phatSinhMap[parent3No] = { no: 0, co: 0 };
        phatSinhMap[parent3No].no += bt.soTien;

        const parent3Co = bt.tkCo.substring(0, 3);
        if (!phatSinhMap[parent3Co]) phatSinhMap[parent3Co] = { no: 0, co: 0 };
        phatSinhMap[parent3Co].co += bt.soTien;
      });
    });

    const getPhatSinh = (tk: string, type: 'no' | 'co') => {
      return phatSinhMap[tk]?.[type] || 0;
    };

    // Calculate lines
    // Doanh thu (Co)
    const dtBanHang = getPhatSinh('511', 'co');
    const dtTaiChinh = getPhatSinh('515', 'co');
    const thuNhapKhac = getPhatSinh('711', 'co');
    const cacKhoanGiamTru = getPhatSinh('511', 'no'); // Giảm trừ doanh thu
    const dtThuan = dtBanHang - cacKhoanGiamTru;

    // Chi phi (No)
    const giaVon = getPhatSinh('632', 'no');
    const cpTaiChinh = getPhatSinh('635', 'no');
    const cpBanHang = getPhatSinh('641', 'no');
    const cpQuanLy = getPhatSinh('642', 'no');
    const chiPhiKhac = getPhatSinh('811', 'no');
    const cpThueTNDN = getPhatSinh('821', 'no');

    // Lợi nhuận
    const lnGop = dtThuan - giaVon;
    const lnThuanTuHD = lnGop + dtTaiChinh - cpTaiChinh - cpBanHang - cpQuanLy;
    const lnKhac = thuNhapKhac - chiPhiKhac;
    const tongLNKtTruocThue = lnThuanTuHD + lnKhac;
    const lnSauThue = tongLNKtTruocThue - cpThueTNDN;

    return {
      dtBanHang, cacKhoanGiamTru, dtThuan, giaVon, lnGop,
      dtTaiChinh, cpTaiChinh, cpBanHang, cpQuanLy, lnThuanTuHD,
      thuNhapKhac, chiPhiKhac, lnKhac, tongLNKtTruocThue,
      cpThueTNDN, lnSauThue
    };
  }, [taiKhoanList, chungTuList, fromDate, toDate]);

  const formatValue = (amount: number, isExpense: boolean = false) => {
    if (amount === 0) return '-';
    // As per user requirement, expenses are shown as negative in calculation displays
    // The requirement says: "mấy dòng chi phí (đầu 6, 8) để ( số )"
    const formatted = new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
    if (isExpense && amount !== 0) {
      return `(${formatted})`;
    }
    return formatted;
  };

  const formatProfit = (amount: number) => {
    if (amount === 0) return '-';
    const formatted = new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
    return amount < 0 ? `(${formatted})` : formatted;
  };

  if (!reportData) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/10 p-2 rounded-lg">
          <TrendingUp className="text-green-600" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Báo Cáo Kết Quả Hoạt Động Kinh Doanh</h1>
          <p className="text-text-muted text-sm mt-1">Phân tích doanh thu, chi phí và lợi nhuận</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Thời gian báo cáo</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-secondary mb-1">Từ ngày</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-secondary mb-1">Đến ngày</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border text-center bg-gray-50/50">
          <h2 className="text-lg font-bold text-text-primary uppercase tracking-wide">Báo cáo kết quả hoạt động kinh doanh</h2>
          <p className="text-sm text-text-secondary mt-1">Đơn vị tính: VNĐ</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-muted text-text-secondary font-medium border-b border-border">
              <tr>
                <th className="px-6 py-3 w-16 text-center">STT</th>
                <th className="px-6 py-3">Chỉ tiêu</th>
                <th className="px-6 py-3 w-32 text-center">Mã số</th>
                <th className="px-6 py-3 w-48 text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-serif">
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">1</td>
                <td className="px-6 py-3 font-medium">Doanh thu bán hàng và cung cấp dịch vụ</td>
                <td className="px-6 py-3 text-center">01</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.dtBanHang)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">2</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Các khoản giảm trừ doanh thu</td>
                <td className="px-6 py-3 text-center">02</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.cacKhoanGiamTru, true)}</td>
              </tr>
              <tr className="hover:bg-blue-50/50 bg-blue-50/10 font-bold">
                <td className="px-6 py-3 text-center">3</td>
                <td className="px-6 py-3 text-primary">Doanh thu thuần về bán hàng và cung cấp dịch vụ</td>
                <td className="px-6 py-3 text-center text-primary">10</td>
                <td className="px-6 py-3 text-right text-primary">{formatProfit(reportData.dtThuan)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">4</td>
                <td className="px-6 py-3">Giá vốn hàng bán</td>
                <td className="px-6 py-3 text-center">11</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.giaVon, true)}</td>
              </tr>
              <tr className="hover:bg-blue-50/50 bg-blue-50/20 font-bold">
                <td className="px-6 py-3 text-center">5</td>
                <td className="px-6 py-3 text-primary">Lợi nhuận gộp về bán hàng và cung cấp dịch vụ</td>
                <td className="px-6 py-3 text-center text-primary">20</td>
                <td className="px-6 py-3 text-right text-primary">{formatProfit(reportData.lnGop)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">6</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Doanh thu hoạt động tài chính</td>
                <td className="px-6 py-3 text-center">21</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.dtTaiChinh)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">7</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Chi phí tài chính</td>
                <td className="px-6 py-3 text-center">22</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.cpTaiChinh, true)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">8</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Chi phí bán hàng</td>
                <td className="px-6 py-3 text-center">25</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.cpBanHang, true)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">9</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Chi phí quản lý doanh nghiệp</td>
                <td className="px-6 py-3 text-center">26</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.cpQuanLy, true)}</td>
              </tr>
              <tr className="hover:bg-blue-50/50 bg-blue-50/30 font-bold">
                <td className="px-6 py-3 text-center">10</td>
                <td className="px-6 py-3 text-primary text-base">Lợi nhuận thuần từ hoạt động kinh doanh</td>
                <td className="px-6 py-3 text-center text-primary">30</td>
                <td className="px-6 py-3 text-right text-primary text-base">{formatProfit(reportData.lnThuanTuHD)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">11</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Thu nhập khác</td>
                <td className="px-6 py-3 text-center">31</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.thuNhapKhac)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">12</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Chi phí khác</td>
                <td className="px-6 py-3 text-center">32</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.chiPhiKhac, true)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30 font-medium">
                <td className="px-6 py-3 text-center">13</td>
                <td className="px-6 py-3">Lợi nhuận khác</td>
                <td className="px-6 py-3 text-center">40</td>
                <td className="px-6 py-3 text-right">{formatProfit(reportData.lnKhac)}</td>
              </tr>
              <tr className="hover:bg-green-50/50 bg-green-50/30 font-bold text-green-800">
                <td className="px-6 py-3 text-center">14</td>
                <td className="px-6 py-3 text-base">Tổng lợi nhuận kế toán trước thuế</td>
                <td className="px-6 py-3 text-center">50</td>
                <td className="px-6 py-3 text-right text-base">{formatProfit(reportData.tongLNKtTruocThue)}</td>
              </tr>
              <tr className="hover:bg-bg-muted/30">
                <td className="px-6 py-3 text-center">15</td>
                <td className="px-6 py-3 pl-10 text-text-secondary">Chi phí thuế TNDN</td>
                <td className="px-6 py-3 text-center">51</td>
                <td className="px-6 py-3 text-right">{formatValue(reportData.cpThueTNDN, true)}</td>
              </tr>
              <tr className="hover:bg-green-50/50 bg-green-50/50 font-bold text-green-900 border-t-2 border-green-200">
                <td className="px-6 py-4 text-center">16</td>
                <td className="px-6 py-4 text-lg">Lợi nhuận sau thuế TNDN</td>
                <td className="px-6 py-4 text-center">60</td>
                <td className="px-6 py-4 text-right text-lg">{formatProfit(reportData.lnSauThue)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <style>{`
        @media print {
          table td.text-right, table td.text-right * {
            color: black !important;
          }
        }
      `}</style>
    </div>
  );
}
