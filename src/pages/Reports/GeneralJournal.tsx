import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LoaiChungTu } from '../../db/db';
import { Filter, Search, Send } from 'lucide-react';

export default function GeneralJournal() {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [docType, setDocType] = useState<LoaiChungTu | ''>('');

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
      ct.butToan.forEach(bt => {
        lines.push({
          id: bt.id + '-no',
          ngayHachToan: ct.ngayHachToan,
          ngayChungTu: ct.ngayChungTu,
          soChungTu: ct.soChungTu,
          loaiChungTu: ct.loaiChungTu,
          dienGiai: bt.dienGiai || ct.dienGiaiChung,
          tkDoiUng: bt.tkNo,
          psNo: bt.soTien,
          psCo: 0,
        });
        lines.push({
          id: bt.id + '-co',
          ngayHachToan: ct.ngayHachToan,
          ngayChungTu: ct.ngayChungTu,
          soChungTu: ct.soChungTu,
          loaiChungTu: ct.loaiChungTu,
          dienGiai: bt.dienGiai || ct.dienGiaiChung,
          tkDoiUng: bt.tkCo,
          psNo: 0,
          psCo: bt.soTien,
        });
      });
    });

    // Sort by date desc
    lines.sort((a, b) => new Date(b.ngayHachToan).getTime() - new Date(a.ngayHachToan).getTime());
    return lines;
  }, [chungTuList, fromDate, toDate, docType]);

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
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm bg-white">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-serif font-bold text-text-primary">Sổ nhật ký chung</h1>
            <p className="text-text-secondary text-sm mt-1">Danh sách hạch toán theo chứng từ</p>
          </div>
          <div className="flex gap-3">
            <button className="bg-[#111827] hover:bg-gray-800 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Search size={16} /> Tìm Kiếm
            </button>
            <button className="bg-[#b91c1c] hover:bg-red-800 text-white px-5 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              <Send size={16} /> Nộp Bài
            </button>
          </div>
        </div>

        <div className="p-6 border-b border-border flex flex-wrap gap-6">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Từ Ngày Hạch Toán</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Đến Ngày Hạch Toán</label>
            <input 
              type="date" 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-primary mb-2">Loại Chứng Từ</label>
            <select 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
            >
              <option value="">Chọn loại chứng từ</option>
              {Object.entries(docTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#E2E8F0] text-text-primary font-bold">
                <tr>
                  <th className="px-4 py-4 whitespace-nowrap">Ngày hạch toán</th>
                  <th className="px-4 py-4 whitespace-nowrap">Ngày chứng từ</th>
                  <th className="px-4 py-4 whitespace-nowrap">Số chứng từ</th>
                  <th className="px-4 py-4">Diễn giải</th>
                  <th className="px-4 py-4 whitespace-nowrap text-center">TK đối ứng</th>
                  <th className="px-4 py-4 whitespace-nowrap text-right">Phát sinh Nợ</th>
                  <th className="px-4 py-4 whitespace-nowrap text-right">Phát sinh Có</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {journalEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-text-muted">
                      Không tìm thấy dữ liệu hạch toán nào
                    </td>
                  </tr>
                ) : (
                  journalEntries.map((line, index) => (
                    <tr key={index} className="even:bg-gray-50 hover:bg-gray-100 transition-colors">
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
                      <td className="px-4 py-4 text-center font-medium text-text-primary">
                        {line.tkDoiUng || '-'}
                      </td>
                      <td className="px-4 py-4 text-right text-text-secondary tabular-nums">
                        {line.psNo > 0 ? formatCurrency(line.psNo) : '0'}
                      </td>
                      <td className="px-4 py-4 text-right text-text-secondary tabular-nums">
                        {line.psCo > 0 ? formatCurrency(line.psCo) : '0'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
