import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, LoaiChungTu } from '../../db/db';
import { FileText, Filter, Search } from 'lucide-react';

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

    // Flatten into journal lines
    const lines: any[] = [];
    filtered.forEach(ct => {
      ct.butToan.forEach(bt => {
        lines.push({
          id: bt.id,
          ngayHachToan: ct.ngayHachToan,
          ngayChungTu: ct.ngayChungTu,
          soChungTu: ct.soChungTu,
          loaiChungTu: ct.loaiChungTu,
          dienGiai: bt.dienGiai || ct.dienGiaiChung,
          tkNo: bt.tkNo,
          tkCo: bt.tkCo,
          soTien: bt.soTien,
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
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <FileText className="text-primary" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Sổ Nhật Ký Chung</h1>
          <p className="text-text-muted text-sm mt-1">Lịch sử chi tiết các giao dịch phát sinh</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-4 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-text-muted" />
          <h2 className="font-semibold text-text-primary">Bộ lọc</h2>
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
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-text-secondary mb-1">Loại chứng từ</label>
            <select 
              className="w-full h-10 px-3 border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-white"
              value={docType}
              onChange={(e) => setDocType(e.target.value as any)}
            >
              <option value="">Tất cả</option>
              {Object.entries(docTypeLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-bg-muted text-text-secondary font-medium border-b border-border">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Ngày HT</th>
                <th className="px-4 py-3 whitespace-nowrap">Ngày CT</th>
                <th className="px-4 py-3 whitespace-nowrap">Số CT</th>
                <th className="px-4 py-3">Loại chứng từ</th>
                <th className="px-4 py-3">Diễn giải</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">TK Nợ</th>
                <th className="px-4 py-3 whitespace-nowrap text-center">TK Có</th>
                <th className="px-4 py-3 whitespace-nowrap text-right">Số tiền</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {journalEntries.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-text-muted">
                    <div className="flex flex-col items-center justify-center">
                      <Search size={40} className="mb-3 opacity-20" />
                      <p>Không tìm thấy dữ liệu hạch toán nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                journalEntries.map((line, index) => (
                  <tr key={index} className="hover:bg-bg-muted/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(line.ngayHachToan).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {new Date(line.ngayChungTu).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 font-medium text-primary whitespace-nowrap">
                      {line.soChungTu}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {docTypeLabels[line.loaiChungTu] || line.loaiChungTu}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary min-w-[200px]">
                      {line.dienGiai}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {line.tkNo || '-'}
                    </td>
                    <td className="px-4 py-3 text-center font-mono">
                      {line.tkCo || '-'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(line.soTien)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
