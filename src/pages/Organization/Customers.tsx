import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Users, Plus, Trash2, MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';

interface CustomerForm {
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
}

export default function Customers() {
  const customers = useLiveQuery(() => db.khachHang.toArray()) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerForm>();

  const filteredCustomers = customers.filter((c) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      c.ma.toLowerCase().includes(term) ||
      c.ten.toLowerCase().includes(term) ||
      c.diaChi.toLowerCase().includes(term) ||
      c.maSoThue.toLowerCase().includes(term)
    );
  });

  const onSubmit = async (data: CustomerForm) => {
    try {
      if (editingId) {
        await db.khachHang.update(editingId, {
          ma: data.ma,
          ten: data.ten,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
        });
        setEditingId(null);
      } else {
        await db.khachHang.add({
          id: crypto.randomUUID(),
          ma: data.ma,
          ten: data.ten,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
          daVoHieuHoa: false,
        });
      }
      reset({ ma: '', ten: '', diaChi: '', maSoThue: '' });
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu khách hàng.');
    }
  };

  const handleEdit = (customer: any) => {
    setEditingId(customer.id);
    reset({
      ma: customer.ma,
      ten: customer.ten,
      diaChi: customer.diaChi,
      maSoThue: customer.maSoThue
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ ma: '', ten: '', diaChi: '', maSoThue: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
      await db.khachHang.delete(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center gap-3">
          <Users className="text-primary" size={28} />
          <h1 className="text-2xl font-serif font-bold text-text-primary">Danh mục Khách hàng</h1>
        </div>

        <div className="p-6 bg-white bg-opacity-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-muted p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã KH</label>
                <input
                  {...register('ma', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: KH001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Tên khách hàng</label>
                <input
                  {...register('ten', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Công ty TNHH Mua Hàng XYZ"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Địa chỉ</label>
                <input
                  {...register('diaChi', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 456 Đường Z, Quận W"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã số thuế</label>
                <input
                  {...register('maSoThue', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 9876543210"
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
                placeholder="Tìm theo mã, tên, địa chỉ, mã số thuế..." 
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
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã KH</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Tên khách hàng</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Địa chỉ</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã số thuế</th>
                <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                    <td className="py-4 px-4 font-medium text-black">{customer.ma}</td>
                    <td className="py-4 px-4 text-black">{customer.ten}</td>
                    <td className="py-4 px-4 text-black truncate max-w-xs">{customer.diaChi}</td>
                    <td className="py-4 px-4 font-mono text-xs text-black">{customer.maSoThue}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(customer)}
                          className="text-text-secondary hover:text-primary transition-colors p-1"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(customer.id)}
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
