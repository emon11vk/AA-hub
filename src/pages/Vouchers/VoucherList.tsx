import { useState, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ChungTu } from '../../db/db';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, Edit, FileText, X } from 'lucide-react';
import { VoucherTemplate } from '../../components/PrintTemplate/VoucherTemplate';
import React from 'react';

export default function VoucherList() {
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVoucher, setSelectedVoucher] = useState<ChungTu | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fundType, setFundType] = useState('CASH'); // CASH or BANK
  const [actionType, setActionType] = useState('RECEIPT'); // RECEIPT or PAYMENT
  
  const printRef = useRef<HTMLDivElement>(null);

  const vouchers = useLiveQuery(
    () => db.chungTu
            .reverse()
            .sortBy('ngayChungTu')
  ) || [];

  const filteredVouchers = vouchers.filter((v) => {
    // Both Cash and Bank are shown, we only filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        v.soChungTu.toLowerCase().includes(term) ||
        v.tenDoiTuong.toLowerCase().includes(term) ||
        (v.lyDo && v.lyDo.toLowerCase().includes(term))
      );
    }
    return true;
  });

  const handlePrint = (voucher: ChungTu) => {
    setSelectedVoucher(voucher);
    setTimeout(() => {
      window.print();
      setSelectedVoucher(null);
    }, 100);
  };

  const handleCreateVoucher = () => {
    let route = '';
    if (fundType === 'CASH') {
      if (actionType === 'RECEIPT') route = '/vouchers/form/PHIEU_THU';
      else if (actionType === 'RECEIPT_CUSTOMER') route = '/vouchers/form/PHIEU_THU_KH';
      else if (actionType === 'PAYMENT') route = '/vouchers/form/PHIEU_CHI';
      else if (actionType === 'PAYMENT_SUPPLIER') route = '/vouchers/form/PHIEU_CHI_NCC';
    } else {
      if (actionType === 'RECEIPT') route = '/vouchers/form/THU_TIEN_GUI';
      else if (actionType === 'RECEIPT_CUSTOMER') route = '/vouchers/form/THU_TIEN_GUI_KH';
      else if (actionType === 'PAYMENT') route = '/vouchers/form/UY_NHIEM_CHI';
      else if (actionType === 'PAYMENT_SUPPLIER') route = '/vouchers/form/UY_NHIEM_CHI_NCC';
    }
    navigate(route);
  };

  const getVoucherTypeLabel = (type: string) => {
    switch(type) {
      case 'PHIEU_THU': case 'PHIEU_THU_KH': return 'Phiếu thu (TM)';
      case 'PHIEU_CHI': case 'PHIEU_CHI_NCC': return 'Phiếu chi (TM)';
      case 'THU_TIEN_GUI': case 'THU_TIEN_GUI_KH': return 'Giấy báo có (TGNH)';
      case 'UY_NHIEM_CHI': case 'UY_NHIEM_CHI_NCC': return 'Ủy nhiệm chi (TGNH)';
      case 'GIAY_BAO': return 'Giấy báo';
      default: return type;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative print:static print:max-w-none print:w-full print:m-0 print:p-0 print:space-y-0">
      <div className="card !p-0 overflow-hidden shadow-sm print:hidden">
        <div className="p-6 border-b border-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="text-primary" size={28} />
            <h1 className="text-2xl font-serif font-bold text-text-primary">
              Nghiệp vụ Tiền (Cốt lõi)
            </h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              <Plus size={16} /> Tạo chứng từ
            </button>
          </div>
        </div>

        <div className="p-6 bg-white bg-opacity-50">
          <div className="mb-6 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm theo số chứng từ, đối tượng, nội dung..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg bg-white">
            <table className="w-full text-sm">
              <thead className="bg-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Ngày CT</th>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Số CT</th>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Loại CT</th>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Đối tượng</th>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Nội dung</th>
                  <th className="py-3 px-4 text-right font-bold text-text-primary">Tổng tiền</th>
                  <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredVouchers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-secondary">
                      Chưa có chứng từ nào.
                    </td>
                  </tr>
                ) : (
                  filteredVouchers.map((v) => {
                    const total = v.butToan.reduce((s, i) => s + Number(i.soTien), 0);
                    return (
                      <tr key={v.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                        <td className="py-3 px-4">{v.ngayChungTu}</td>
                        <td className="py-3 px-4 font-bold text-primary">{v.soChungTu}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-gray-100 rounded text-xs">{getVoucherTypeLabel(v.loaiChungTu)}</span>
                        </td>
                        <td className="py-3 px-4 font-medium truncate max-w-[200px]">{v.tenDoiTuong}</td>
                        <td className="py-3 px-4 text-text-secondary truncate max-w-[250px]">{v.lyDo}</td>
                        <td className="py-3 px-4 text-right font-bold text-black tabular-nums">
                          {total > 0 ? total.toLocaleString('vi-VN') : '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handlePrint(v)} className="text-gray-500 hover:text-primary p-1" title="In/Xem chứng từ">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => navigate(`/vouchers/form/${v.loaiChungTu}/${v.id}`)} className="text-gray-500 hover:text-blue-600 p-1" title="Sửa chứng từ">
                              <Edit size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Tạo Chứng Từ */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-border">
              <h2 className="text-xl font-bold text-text-primary">Tạo chứng từ mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Quỹ (Loại tiền)</label>
                <select 
                  value={fundType}
                  onChange={(e) => setFundType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="CASH">Tiền mặt (111)</option>
                  <option value="BANK">Tiền gửi ngân hàng (112)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Loại nghiệp vụ</label>
                <select 
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="RECEIPT">Thu tiền</option>
                  <option value="RECEIPT_CUSTOMER">Thu tiền Khách hàng</option>
                  <option value="PAYMENT">Chi tiền</option>
                  <option value="PAYMENT_SUPPLIER">Chi tiền Nhà cung cấp</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-gray-50 font-medium"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleCreateVoucher}
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium"
                >
                  Tạo chứng từ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Print Template */}
      <div className="hidden print:block print:w-full print:m-0 print:p-0 bg-white">
        {selectedVoucher && <VoucherTemplate voucher={selectedVoucher} ref={printRef} />}
      </div>
    </div>
  );
}
