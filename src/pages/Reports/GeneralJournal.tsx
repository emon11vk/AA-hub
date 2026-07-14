import React, { useState, useMemo, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LoaiChungTu } from '../../db/db';
import { Filter, Search, Send, ChevronLeft, ChevronRight, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';

export default function GeneralJournal() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [docType, setDocType] = useState<LoaiChungTu | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'So-Nhat-Ky-Chung',
  });

  const chungTuList = useLiveQuery(() => db.chungTu.toArray());

  const journalEntries = useMemo(() => {
    if (!chungTuList) return [];

    let filtered = chungTuList;

    if (fromDate) {
      filtered = filtered.filter(ct => ct.ngayHachToan >= fromDate);
    }
    if (toDate) {
      filtered = filtered.filter(ct => ct.ngayHachToan <= toDate);
    }
    if (docType) {
      filtered = filtered.filter(ct => ct.loaiChungTu === docType);
    }

    const lines: any[] = [];
    filtered.forEach(ct => {
      ct.butToan.forEach((bt, index) => {
        const excludedPrefixes = ['5', '6', '7', '8'];
        
        // Push Debit Line if not excluded
        if (bt.tkNo && !excludedPrefixes.includes(bt.tkNo.charAt(0))) {
          lines.push({
            id: `${ct.id}-no-${index}`,
            ngayHachToan: ct.ngayHachToan,
            ngayChungTu: ct.ngayChungTu,
            soChungTu: ct.soChungTu,
            loaiChungTu: ct.loaiChungTu,
            dienGiai: bt.dienGiai || ct.dienGiaiChung,
            soHieuTK: bt.tkNo,
            tkDoiUng: bt.tkCo,
            psNo: bt.soTien,
            psCo: 0,
          });
        }
        
        // Push Credit Line if not excluded
        if (bt.tkCo && !excludedPrefixes.includes(bt.tkCo.charAt(0))) {
          lines.push({
            id: `${ct.id}-co-${index}`,
            ngayHachToan: ct.ngayHachToan,
            ngayChungTu: ct.ngayChungTu,
            soChungTu: ct.soChungTu,
            loaiChungTu: ct.loaiChungTu,
            dienGiai: bt.dienGiai || ct.dienGiaiChung,
            soHieuTK: bt.tkCo,
            tkDoiUng: bt.tkNo,
            psNo: 0,
            psCo: bt.soTien,
          });
        }
      });
    });

    // Sort by date desc
    lines.sort((a, b) => new Date(b.ngayHachToan).getTime() - new Date(a.ngayHachToan).getTime());
    return lines;
  }, [chungTuList, fromDate, toDate, docType]);

  const totalPsNo = useMemo(() => journalEntries.reduce((sum, line) => sum + (line.psNo || 0), 0), [journalEntries]);
  const totalPsCo = useMemo(() => journalEntries.reduce((sum, line) => sum + (line.psCo || 0), 0), [journalEntries]);

  // Pagination Logic
  const totalPages = Math.ceil(journalEntries.length / itemsPerPage);
  const currentEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return journalEntries.slice(startIndex, startIndex + itemsPerPage);
  }, [journalEntries, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const docTypeLabels: Record<string, string> = {
    'PHIEU_THU': 'Phiếu thu',
    'PHIEU_THU_KH': 'Phiếu thu khách hàng',
    'PHIEU_CHI': 'Phiếu chi',
    'PHIEU_CHI_NCC': 'Phiếu chi NCC',
    'THU_TIEN_GUI': 'Thu tiền gửi',
    'THU_TIEN_GUI_KH': 'Thu tiền gửi KH',
    'UY_NHIEM_CHI': 'Ủy nhiệm chi',
    'UY_NHIEM_CHI_NCC': 'Ủy nhiệm chi NCC',
    'GIAY_BAO': 'Giấy báo',
    'HOA_DON_BAN_HANG': 'Hóa đơn bán hàng',
    'HOA_DON_MUA_HANG': 'Hóa đơn mua hàng',
    'PHIEU_KE_TOAN': 'Phiếu kế toán'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-12">
      <div className="card !p-0 overflow-hidden shadow-sm bg-white">
        <div className="p-4 sm:p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-text-primary">Sổ nhật ký chung</h1>
            <p className="text-text-secondary text-sm mt-1">Danh sách hạch toán theo chứng từ</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="bg-[#111827] hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Search size={16} /> Tìm Kiếm
            </button>

            <button 
              onClick={handlePrint}
              className="bg-white border border-border hover:bg-bg-muted text-text-primary px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <Printer size={16} /> In Báo Cáo
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6 border-b border-border flex flex-wrap gap-4 sm:gap-6">
          <div className="flex-1 min-w-[140px] sm:min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Từ Ngày Hạch Toán</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={fromDate}
              onChange={(e) => { setFromDate(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Đến Ngày Hạch Toán</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={toDate}
              onChange={(e) => { setToDate(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Loại Chứng Từ</label>
            <select 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              value={docType}
              onChange={(e) => { setDocType(e.target.value as any); setCurrentPage(1); }}
            >
              <option value="">Chọn loại chứng từ</option>
              {Object.entries(docTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-0 sm:p-6">
          <div ref={componentRef} className="overflow-x-auto sm:border sm:border-border sm:rounded-lg print:border-none print:shadow-none print:p-4 print:overflow-visible">
            {/* Print Header only visible when printing */}
            <div className="hidden print:block text-center mb-6">
              <h2 className="text-xl font-bold uppercase mb-1">Sổ nhật ký chung</h2>
              <p className="text-sm font-medium">
                {fromDate && toDate ? `Từ ngày ${new Date(fromDate).toLocaleDateString('vi-VN')} đến ${new Date(toDate).toLocaleDateString('vi-VN')}` : `Tại ngày ${new Date().toLocaleDateString('vi-VN')}`}
              </p>
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-[#E2E8F0] text-text-primary font-bold">
                <tr>
                  <th className="px-4 py-4 whitespace-nowrap">Ngày hạch toán</th>
                  <th className="px-4 py-4 whitespace-nowrap">Ngày chứng từ</th>
                  <th className="px-4 py-4 whitespace-nowrap">Số chứng từ</th>
                  <th className="px-4 py-4">Diễn giải</th>
                  <th className="px-4 py-4 whitespace-nowrap text-center">Số hiệu TK</th>
                  <th className="px-4 py-4 whitespace-nowrap text-center">TK đối ứng</th>
                  <th className="px-4 py-4 whitespace-nowrap text-right">Phát sinh Nợ</th>
                  <th className="px-4 py-4 whitespace-nowrap text-right">Phát sinh Có</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                      Không tìm thấy dữ liệu hạch toán nào
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((line) => (
                    <tr key={line.id} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-text-primary">
                        {line.ngayHachToan}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap font-medium text-text-primary">
                        {line.ngayChungTu}
                      </td>
                      <td className="px-4 py-4 font-bold text-text-primary whitespace-nowrap">
                        {line.soChungTu}
                      </td>
                      <td className="px-4 py-4 text-text-secondary min-w-[200px]">
                        {line.dienGiai}
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-primary">
                        {line.soHieuTK || '-'}
                      </td>
                      <td className="px-4 py-4 text-center font-medium text-text-primary">
                        {line.tkDoiUng || '-'}
                      </td>
                      <td className="px-4 py-4 text-right text-black tabular-nums">
                        {line.psNo > 0 ? formatCurrency(line.psNo) : '0'}
                      </td>
                      <td className="px-4 py-4 text-right text-black tabular-nums">
                        {line.psCo > 0 ? formatCurrency(line.psCo) : '0'}
                      </td>
                    </tr>
                  ))
                )}
                {/* Dòng Tổng cộng */}
                {journalEntries.length > 0 && (
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                    <td colSpan={6} className="px-4 py-4 text-right text-text-primary uppercase text-xs">Tổng cộng:</td>
                    <td className="px-4 py-4 text-right text-black tabular-nums">
                      {totalPsNo > 0 ? formatCurrency(totalPsNo) : '0'}
                    </td>
                    <td className="px-4 py-4 text-right text-black tabular-nums">
                      {totalPsCo > 0 ? formatCurrency(totalPsCo) : '0'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4 p-4 sm:p-0">
              <span className="text-sm text-text-secondary text-center sm:text-left">
                Hiển thị {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, journalEntries.length)} trong tổng số {journalEntries.length} bản ghi
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="flex items-center px-4 font-medium text-sm">
                  Trang {currentPage} / {totalPages}
                </span>
                <button 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
