import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../../db/db';
import { MoreVertical, Plus, BookOpen } from 'lucide-react';

export default function ChartOfAccounts() {
  const accounts = useLiveQuery(() => db.taiKhoanKeToan.toArray()) || [];

  const totalDuNo = accounts.reduce((sum, acc) => sum + (acc.duNoDauKy || 0), 0);
  const totalDuCo = accounts.reduce((sum, acc) => sum + (acc.duCoDauKy || 0), 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BookOpen className="text-primary" size={28} />
            <h1 className="text-2xl font-serif font-bold text-text-primary">Hệ thống Tài khoản (Thông tư 99/2025/TT-BTC)</h1>
          </div>
        </div>

        <div className="p-6 border-b border-border bg-white">
          <div className="flex gap-8 text-sm font-medium">
            {['Danh sách tài khoản', 'Công nợ khách hàng', 'Công nợ nhà cung cấp', 'Tồn kho vật tư, hàng hóa', 'Tài sản cố định đầu kỳ'].map((tab, idx) => (
              <button 
                key={idx}
                className={`pb-2 px-1 border-b-2 ${idx === 0 ? 'text-primary border-primary' : 'text-text-secondary border-transparent hover:text-text-primary hover:border-gray-300'} transition-all`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 bg-white bg-opacity-50">
          <div className="flex justify-end mb-4">
            <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
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
                  <th className="py-3 px-4 text-left font-bold text-text-primary">Tính chất</th>
                  <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Nợ</th>
                  <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Có</th>
                  <th className="py-3 px-4 text-center font-bold text-text-primary w-20">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {accounts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-text-secondary">
                      Chưa có dữ liệu. Vui lòng kiểm tra seed data.
                    </td>
                  </tr>
                ) : (
                  accounts.map((acc) => (
                    <tr key={acc.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                      <td className="py-4 px-4 font-medium text-text-primary">{acc.soHieu}</td>
                      <td className="py-4 px-4 text-text-primary font-medium">{acc.tenTaiKhoan}</td>
                      <td className="py-4 px-4 text-text-secondary text-xs">
                        {acc.loaiTaiKhoan === 'TAI_SAN' ? 'Tài sản' : 
                         acc.loaiTaiKhoan === 'NGUON_VON' ? 'Nguồn vốn' : 
                         acc.loaiTaiKhoan === 'DOANH_THU' ? 'Doanh thu' : 'Chi phí'}
                      </td>
                      <td className="py-4 px-4 text-right text-text-primary font-medium tabular-nums">
                        {acc.duNoDauKy > 0 ? acc.duNoDauKy.toLocaleString('vi-VN') : '-'}
                      </td>
                      <td className="py-4 px-4 text-right text-text-primary font-medium tabular-nums">
                        {acc.duCoDauKy > 0 ? acc.duCoDauKy.toLocaleString('vi-VN') : '-'}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button className="text-text-secondary hover:text-text-primary p-1">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                {accounts.length > 0 && (
                  <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                    <td colSpan={3} className="py-4 px-4 text-right text-text-primary uppercase text-xs">Tổng cộng:</td>
                    <td className="py-4 px-4 text-right text-text-primary tabular-nums">
                      {totalDuNo > 0 ? totalDuNo.toLocaleString('vi-VN') : '-'}
                    </td>
                    <td className="py-4 px-4 text-right text-text-primary tabular-nums">
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
    </div>
  );
}
