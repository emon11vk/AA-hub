import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Building, Plus, Trash2, MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';

interface BankForm {
  ma: string;
  ten: string;
  soTaiKhoan: string;
  chiNhanh: string;
}

export default function Banks() {
  const banks = useLiveQuery(() => db.nganHang.toArray()) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<BankForm>();

  const filteredBanks = banks.filter((b) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.ma.toLowerCase().includes(term) ||
      b.ten.toLowerCase().includes(term) ||
      b.soTaiKhoan.toLowerCase().includes(term) ||
      b.chiNhanh.toLowerCase().includes(term)
    );
  });

  const onSubmit = async (data: BankForm) => {
    try {
      if (editingId) {
        await db.nganHang.update(editingId, {
          ma: data.ma,
          ten: data.ten,
          soTaiKhoan: data.soTaiKhoan,
          chiNhanh: data.chiNhanh,
        });
        setEditingId(null);
      } else {
        await db.nganHang.add({
          id: crypto.randomUUID(),
          ma: data.ma,
          ten: data.ten,
          soTaiKhoan: data.soTaiKhoan,
          chiNhanh: data.chiNhanh,
          daVoHieuHoa: false,
        });
      }
      reset({ ma: '', ten: '', soTaiKhoan: '', chiNhanh: '' });
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu ngân hàng.');
    }
  };

  const handleEdit = (bank: any) => {
    setEditingId(bank.id);
    reset({
      ma: bank.ma,
      ten: bank.ten,
      soTaiKhoan: bank.soTaiKhoan,
      chiNhanh: bank.chiNhanh
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ ma: '', ten: '', soTaiKhoan: '', chiNhanh: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ngân hàng này?')) {
      await db.nganHang.delete(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center gap-3">
          <Building className="text-primary" size={28} />
          <h1 className="text-2xl font-serif font-bold text-text-primary">Danh mục Ngân hàng</h1>
        </div>

        <div className="p-6 bg-white bg-opacity-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-muted p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Chỉnh sửa ngân hàng' : 'Thêm ngân hàng mới'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã NH</label>
                <input
                  {...register('ma', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: NH001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Tên ngân hàng</label>
                <input
                  {...register('ten', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Ngân hàng TMCP Ngoại Thương Việt Nam"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Số tài khoản</label>
                <input
                  {...register('soTaiKhoan', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 1234567890"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Chi nhánh</label>
                <input
                  {...register('chiNhanh', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Chi nhánh Ba Đình"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="bg-white border border-border hover:bg-gray-50 text-text-primary px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Hủy
                </button>
              )}
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                {editingId ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>

        <div className="p-6 pt-0">
          <div className="mb-4 flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Tìm theo mã, tên, số tài khoản, chi nhánh..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-sm">
            <thead className="bg-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã NH</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Tên ngân hàng</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Số tài khoản</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Chi nhánh</th>
                <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Không tìm thấy ngân hàng nào.
                  </td>
                </tr>
              ) : (
                filteredBanks.map((bank) => (
                  <tr key={bank.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                    <td className="py-4 px-4 font-medium text-black">{bank.ma}</td>
                    <td className="py-4 px-4 text-black">{bank.ten}</td>
                    <td className="py-4 px-4 text-black font-mono">{bank.soTaiKhoan}</td>
                    <td className="py-4 px-4 text-xs text-black">{bank.chiNhanh}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(bank)}
                          className="text-text-secondary hover:text-primary transition-colors p-1"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(bank.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
