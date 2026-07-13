import React, { useMemo, useRef, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { FileBarChart, Filter, Printer, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export default function BalanceSheet() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');

  const taiKhoanList = useLiveQuery(() => db.taiKhoanKeToan.toArray());
  const chungTuList = useLiveQuery(() => db.chungTu.toArray());

  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Bang-Can-Doi-Ke-Toan',
  });

  const reportData = useMemo(() => {
    if (!taiKhoanList || !chungTuList) return null;

    let filteredCT = chungTuList;
    if (fromDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan >= fromDate);
    if (toDate) filteredCT = filteredCT.filter(ct => ct.ngayHachToan <= toDate);

    // 1. Calculate Phat sinh
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

    const tkMap = new Map(taiKhoanList.map(tk => [tk.soHieu, tk]));

    // 2. Calculate Ending Balances for specific accounts
    const getEndBalance = (tkCode: string, type: 'no' | 'co') => {
      const tk = tkMap.get(tkCode);
      if (!tk) return 0;
      const ps = phatSinhMap[tkCode] || { no: 0, co: 0 };
      
      let endNo = 0, endCo = 0;
      if (tk.loaiTaiKhoan === 'TAI_SAN' || tk.loaiTaiKhoan === 'CHI_PHI') {
        const bal = tk.duNoDauKy - tk.duCoDauKy + ps.no - ps.co;
        if (bal > 0) endNo = bal; else endCo = -bal;
      } else {
        const bal = tk.duCoDauKy - tk.duNoDauKy + ps.co - ps.no;
        if (bal > 0) endCo = bal; else endNo = -bal;
      }
      return type === 'no' ? endNo : endCo;
    };

    // 3. Profit Calculation (for 420)
    const getPhatSinh = (tk: string, type: 'no' | 'co') => phatSinhMap[tk]?.[type] || 0;
    const dtThuan = getPhatSinh('511', 'co') - getPhatSinh('511', 'no');
    const giaVon = getPhatSinh('632', 'no');
    const lnThuanTuHD = (dtThuan - giaVon) + getPhatSinh('515', 'co') - getPhatSinh('635', 'no') - getPhatSinh('641', 'no') - getPhatSinh('642', 'no');
    const lnKhac = getPhatSinh('711', 'co') - getPhatSinh('811', 'no');
    const profit = (lnThuanTuHD + lnKhac) - getPhatSinh('821', 'no');

    // 4. Map to Balance Sheet Codes
    const data: Record<string, number> = {};
    
    // TÀI SẢN
    data['111'] = getEndBalance('111', 'no') + getEndBalance('112', 'no');
    data['110'] = data['111'] + (data['112'] || 0); // Assuming 112 is mapped if present, here we just use 111 for cash equivalent
    
    data['131'] = getEndBalance('131', 'no');
    data['130'] = data['131']; // Phải thu ngắn hạn

    data['141'] = getEndBalance('152', 'no') + getEndBalance('153', 'no') + getEndBalance('156', 'no');
    data['140'] = data['141']; // Hàng tồn kho

    data['162'] = getEndBalance('133', 'no');
    data['160'] = data['162']; // Tài sản ngắn hạn khác

    data['100'] = (data['110'] || 0) + (data['120'] || 0) + (data['130'] || 0) + (data['140'] || 0) + (data['150'] || 0) + (data['160'] || 0);
    
    // TÀI SẢN DÀI HẠN
    data['222'] = getEndBalance('211', 'no') - getEndBalance('214', 'co'); // TSCĐ
    data['220'] = data['222'];
    data['200'] = data['220']; 

    data['280'] = data['100'] + data['200']; // TỔNG TÀI SẢN

    // NỢ PHẢI TRẢ
    data['311'] = getEndBalance('331', 'co');
    data['313'] = getEndBalance('333', 'co') + getEndBalance('3331', 'co') + getEndBalance('33311', 'co');
    data['314'] = getEndBalance('334', 'co');
    data['310'] = data['311'] + data['313'] + data['314']; 
    
    data['330'] = 0; // Nợ dài hạn
    data['300'] = data['310'] + data['330']; // Nợ phải trả

    // VỐN CHỦ SỞ HỮU
    data['411'] = getEndBalance('411', 'co');
    data['420'] = profit + getEndBalance('421', 'co') - getEndBalance('421', 'no'); // Lợi nhuận sau thuế
    
    data['400'] = (data['411'] || 0) + (data['420'] || 0); // Tổng vốn CSH

    data['440'] = data['300'] + data['400']; // TỔNG NGUỒN VỐN

    return data;
  }, [taiKhoanList, chungTuList, fromDate, toDate]);

  const formatValue = (amount?: number) => {
    if (!amount || amount === 0) return '-';
    return new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
  };

  if (!reportData) return <div className="p-6">Đang tải...</div>;

  const isBalanced = reportData['280'] === reportData['440'];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="border border-primary bg-transparent p-2 rounded-lg">
            <FileBarChart className="text-primary" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Báo Cáo Tình Hình Tài Chính</h1>
            <p className="text-text-muted text-sm mt-1">(Báo cáo tình hình tài chính)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {!isBalanced ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
              <AlertTriangle size={18} />
              <span className="font-medium text-sm">Bảng cân đối đang bị lệch!</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <CheckCircle2 size={18} />
              <span className="font-medium text-sm">Cân đối chính xác</span>
            </div>
          )}

          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-lg shadow-sm hover:bg-bg-muted transition-colors font-medium text-text-primary"
          >
            <Printer size={18} />
            In Báo Cáo
          </button>
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
        {/* Printable Area */}
        <div ref={componentRef} className="p-8 bg-white print:p-0">
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold uppercase mb-1">Báo cáo tình hình tài chính</h2>
            <p className="text-sm italic text-gray-600 mb-2">(Áp dụng cho doanh nghiệp đáp ứng giả định hoạt động liên tục)</p>
            <p className="text-sm font-medium">Tại ngày {new Date().toLocaleDateString('vi-VN')}</p>
            <p className="text-sm text-gray-600 mt-2">Đơn vị tính: VNĐ</p>
          </div>

          <table className="w-full border-collapse border border-gray-300 text-sm font-serif">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-center w-2/5">TÀI SẢN</th>
                <th className="border border-gray-300 px-2 py-2 text-center w-16">Mã số</th>
                <th className="border border-gray-300 px-2 py-2 text-center w-24">Thuyết minh</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Số cuối năm</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Số đầu năm</th>
              </tr>
            </thead>
            <tbody>
              {/* TÀI SẢN NGẮN HẠN */}
              <tr className="font-bold bg-gray-50/50">
                <td className="border border-gray-300 px-4 py-2">A - TÀI SẢN NGẮN HẠN</td>
                <td className="border border-gray-300 px-2 py-2 text-center">100</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['100'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">I. Tiền và các khoản tương đương tiền</td>
                <td className="border border-gray-300 px-2 py-2 text-center">110</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['110'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Tiền</td>
                <td className="border border-gray-300 px-2 py-2 text-center">111</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['111'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">II. Đầu tư tài chính ngắn hạn</td>
                <td className="border border-gray-300 px-2 py-2 text-center">120</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">III. Các khoản phải thu ngắn hạn</td>
                <td className="border border-gray-300 px-2 py-2 text-center">130</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['130'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Phải thu ngắn hạn của khách hàng</td>
                <td className="border border-gray-300 px-2 py-2 text-center">131</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['131'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">IV. Hàng tồn kho</td>
                <td className="border border-gray-300 px-2 py-2 text-center">140</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['140'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Hàng tồn kho</td>
                <td className="border border-gray-300 px-2 py-2 text-center">141</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['141'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">V. Tài sản ngắn hạn khác</td>
                <td className="border border-gray-300 px-2 py-2 text-center">160</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['160'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Thuế GTGT được khấu trừ</td>
                <td className="border border-gray-300 px-2 py-2 text-center">162</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['162'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              
              {/* TÀI SẢN DÀI HẠN */}
              <tr className="font-bold bg-gray-50/50">
                <td className="border border-gray-300 px-4 py-2">B - TÀI SẢN DÀI HẠN</td>
                <td className="border border-gray-300 px-2 py-2 text-center">200</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>

              {/* TỔNG TÀI SẢN */}
              <tr className="font-bold bg-blue-50/30 text-blue-900">
                <td className="border border-gray-300 px-4 py-2">TỔNG CỘNG TÀI SẢN (280 = 100 + 200)</td>
                <td className="border border-gray-300 px-2 py-2 text-center">280</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['280'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>

              {/* NGUỒN VỐN SECTION */}
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 text-center w-2/5">NGUỒN VỐN</th>
                <th className="border border-gray-300 px-2 py-2 text-center w-16">Mã số</th>
                <th className="border border-gray-300 px-2 py-2 text-center w-24">Thuyết minh</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Số cuối năm</th>
                <th className="border border-gray-300 px-4 py-2 text-center">Số đầu năm</th>
              </tr>
              
              <tr className="font-bold bg-gray-50/50">
                <td className="border border-gray-300 px-4 py-2">C - NỢ PHẢI TRẢ</td>
                <td className="border border-gray-300 px-2 py-2 text-center">300</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['300'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">I. Nợ ngắn hạn</td>
                <td className="border border-gray-300 px-2 py-2 text-center">310</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['310'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Phải trả người bán ngắn hạn</td>
                <td className="border border-gray-300 px-2 py-2 text-center">311</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['311'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>

              <tr className="font-bold bg-gray-50/50">
                <td className="border border-gray-300 px-4 py-2">D - VỐN CHỦ SỞ HỮU</td>
                <td className="border border-gray-300 px-2 py-2 text-center">400</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['400'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr className="font-semibold">
                <td className="border border-gray-300 px-4 py-2">I. Vốn chủ sở hữu</td>
                <td className="border border-gray-300 px-2 py-2 text-center">410</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['400'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">1. Vốn góp của chủ sở hữu</td>
                <td className="border border-gray-300 px-2 py-2 text-center">411</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['411'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2 pl-8">2. Lợi nhuận sau thuế chưa phân phối</td>
                <td className="border border-gray-300 px-2 py-2 text-center">420</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['420'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>

              {/* TỔNG NGUỒN VỐN */}
              <tr className="font-bold bg-green-50/30 text-green-900">
                <td className="border border-gray-300 px-4 py-2">TỔNG CỘNG NGUỒN VỐN (440 = 300 + 400)</td>
                <td className="border border-gray-300 px-2 py-2 text-center">440</td>
                <td className="border border-gray-300 px-2 py-2 text-center"></td>
                <td className="border border-gray-300 px-4 py-2 text-right">{formatValue(reportData['440'])}</td>
                <td className="border border-gray-300 px-4 py-2 text-right">-</td>
              </tr>
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="flex justify-between mt-12 px-8">
            <div className="text-center">
              <p className="font-bold">Người lập biểu</p>
              <p className="text-sm italic">(Ký, họ tên)</p>
              <div className="h-24"></div>
            </div>
            <div className="text-center">
              <p className="font-bold">Kế toán trưởng</p>
              <p className="text-sm italic">(Ký, họ tên)</p>
              <div className="h-24"></div>
            </div>
            <div className="text-center">
              <p className="italic mb-1">Lập, ngày ... tháng ... năm ...</p>
              <p className="font-bold">Giám đốc</p>
              <p className="text-sm italic">(Ký, họ tên, đóng dấu)</p>
              <div className="h-24"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
