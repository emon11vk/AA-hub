import React, { useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { MoreVertical, Plus, BookOpen, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

export default function ChartOfAccounts() {
  const accounts = useLiveQuery(() => db.taiKhoanKeToan.toArray()) || [];
  
  const [editingCell, setEditingCell] = useState<{ id: string, field: 'duNoDauKy' | 'duCoDauKy' } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const totalDuNo = accounts.reduce((sum, acc) => sum + (acc.duNoDauKy || 0), 0);
  const totalDuCo = accounts.reduce((sum, acc) => sum + (acc.duCoDauKy || 0), 0);

  const startEditing = (id: string, field: 'duNoDauKy' | 'duCoDauKy', value: number) => {
    setEditingCell({ id, field });
    setEditValue(value === 0 ? '' : value.toString());
  };

  const handleSaveEdit = async () => {
    if (editingCell) {
      const numericValue = parseFloat(editValue) || 0;
      await db.taiKhoanKeToan.update(editingCell.id, {
        [editingCell.field]: numericValue
      });
      setEditingCell(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleOpenAddModal = () => {
    reset({
      soHieu: '',
      tenTaiKhoan: '',
      loaiTaiKhoan: 'TAI_SAN',
      duNoDauKy: 0,
      duCoDauKy: 0
    });
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (acc: any) => {
    reset({
      soHieu: acc.soHieu,
      tenTaiKhoan: acc.tenTaiKhoan,
      loaiTaiKhoan: acc.loaiTaiKhoan,
      duNoDauKy: acc.duNoDauKy,
      duCoDauKy: acc.duCoDauKy
    });
    setEditingAccount(acc);
    setIsModalOpen(true);
  };

  const onSaveAccount = async (data: any) => {
    if (editingAccount) {
      await db.taiKhoanKeToan.update(editingAccount.id, {
        soHieu: data.soHieu,
        tenTaiKhoan: data.tenTaiKhoan,
        loaiTaiKhoan: data.loaiTaiKhoan,
        duNoDauKy: parseFloat(data.duNoDauKy) || 0,
        duCoDauKy: parseFloat(data.duCoDauKy) || 0,
      });
    } else {
      await db.taiKhoanKeToan.add({
        id: data.soHieu,
        soHieu: data.soHieu,
        tenTaiKhoan: data.tenTaiKhoan,
        loaiTaiKhoan: data.loaiTaiKhoan,
        duNoDauKy: parseFloat(data.duNoDauKy) || 0,
        duCoDauKy: parseFloat(data.duCoDauKy) || 0,
      });
    }
    setIsModalOpen(false);
    reset();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-4 sm:p-6 border-b border-border bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={28} />
            <h1 className="text-2xl font-serif font-bold text-text-primary">Sổ chi tiết tài khoản (Thông tư 99/2025/TT-BTC)</h1>
          </div>
        </div>

        <div className="p-6 border-b border-border bg-white">
          <div className="flex gap-8 text-sm font-medium">
            {['Số dư tài khoản', 'Công nợ khách hàng', 'Công nợ nhà cung cấp', 'Tồn kho vật tư, hàng hóa', 'Tài sản cố định đầu kỳ'].map((tab, idx) => (
              <button 
                key={idx}
                className={`pb-2 px-1 border-b-2 ${idx === 0 ? 'text-primary border-primary' : 'text-text-secondary border-transparent hover:text-text-primary hover:border-gray-300'} transition-all`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white bg-opacity-50">
          <div className="flex justify-end mb-4">
            <button 
              onClick={handleOpenAddModal}
              className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
            >
              <Plus size={16} />
              Thêm Mới
            </button>
          </div>
          
          <div className="overflow-x-auto border border-border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Số tài khoản</th>
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Tên tài khoản</th>
                  <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Nợ</th>
                  <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Có</th>
                  <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Chỉnh sửa</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-text-secondary">
                      Chưa có dữ liệu. Vui lòng kiểm tra seed data.
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc) => (
                    <tr key={acc.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                      <td className="py-4 px-4 font-medium text-black">{acc.soHieu}</td>
                      <td className="py-4 px-4 text-text-primary font-medium">{acc.tenTaiKhoan}</td>
                      
                      {/* Dư Nợ */}
                      <td 
                        className="py-4 px-4 text-right text-black font-medium tabular-nums cursor-pointer hover:bg-gray-100"
                        onClick={() => startEditing(acc.id, 'duNoDauKy', acc.duNoDauKy)}
                      >
                        {editingCell?.id === acc.id && editingCell?.field === 'duNoDauKy' ? (
                          <input
                            type="number"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={handleKeyDown}
                            className="w-full text-right px-2 py-1 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          acc.duNoDauKy > 0 ? acc.duNoDauKy.toLocaleString('vi-VN') : '-'
                        )}
                      </td>

                      {/* Dư Có */}
                      <td 
                        className="py-4 px-4 text-right text-black font-medium tabular-nums cursor-pointer hover:bg-gray-100"
                        onClick={() => startEditing(acc.id, 'duCoDauKy', acc.duCoDauKy)}
                      >
                        {editingCell?.id === acc.id && editingCell?.field === 'duCoDauKy' ? (
                          <input
                            type="number"
                            autoFocus
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onBlur={handleSaveEdit}
                            onKeyDown={handleKeyDown}
                            className="w-full text-right px-2 py-1 border border-primary rounded focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        ) : (
                          acc.duCoDauKy > 0 ? acc.duCoDauKy.toLocaleString('vi-VN') : '-'
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button onClick={() => handleOpenEditModal(acc)} className="text-text-secondary hover:text-primary p-1 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {accounts.length > 0 && (
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                    <td colSpan={2} className="py-4 px-4 text-right text-text-primary uppercase text-xs">Tổng cộng:</td>
                    <td className="py-4 px-4 text-right text-black tabular-nums">
                      {totalDuNo > 0 ? totalDuNo.toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="py-4 px-4 text-right text-black tabular-nums">
                      {totalDuCo > 0 ? totalDuCo.toLocaleString('vi-VN') : '-'}
                    </td>
                    <td></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Thêm Mới Tài Khoản */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md max-h-full flex flex-col">
            <div className="flex justify-between items-center p-4 sm:p-6 border-b border-border shrink-0">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary">{editingAccount ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-text-secondary hover:text-text-primary">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSaveAccount)} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Số hiệu tài khoản</label>
                <input 
                  {...register('soHieu', { required: true })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 1111"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Tên tài khoản</label>
                <input 
                  {...register('tenTaiKhoan', { required: true })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Tiền mặt Việt Nam"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Loại tài khoản</label>
                <select 
                  {...register('loaiTaiKhoan')}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="TAI_SAN">Tài sản</option>
                  <option value="NGUON_VON">Nguồn vốn</option>
                  <option value="DOANH_THU">Doanh thu</option>
                  <option value="CHI_PHI">Chi phí</option>
                </select>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Dư nợ đầu kỳ</label>
                  <input 
                    type="number"
                    {...register('duNoDauKy')}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    defaultValue={0}
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-text-secondary mb-1">Dư có đầu kỳ</label>
                  <input 
                    type="number"
                    {...register('duCoDauKy')}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    defaultValue={0}
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-border text-text-secondary rounded-lg hover:bg-gray-50 font-medium"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-medium"
                >
                  Lưu tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
