import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Truck, Plus, Trash2, MoreVertical, Search } from 'lucide-react';
import { useState } from 'react';

interface SupplierForm {
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  tenHangHoa: string;
  duNoDauKy: number;
  duCoDauKy: number;
}

export default function Suppliers() {
  const suppliers = useLiveQuery(() => db.nhaCungCap.toArray()) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierForm>();

  const filteredSuppliers = suppliers.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      s.ma.toLowerCase().includes(term) ||
      s.ten.toLowerCase().includes(term) ||
      s.diaChi.toLowerCase().includes(term) ||
      s.maSoThue.toLowerCase().includes(term) ||
      (s.tenHangHoa || '').toLowerCase().includes(term)
    );
  });

  const onSubmit = async (data: SupplierForm) => {
    try {
      if (editingId) {
        await db.nhaCungCap.update(editingId, {
          ma: data.ma,
          ten: data.ten,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
          tenHangHoa: data.tenHangHoa,
          duNoDauKy: Number(data.duNoDauKy) || 0,
          duCoDauKy: Number(data.duCoDauKy) || 0,
        });
        setEditingId(null);
      } else {
        await db.nhaCungCap.add({
          id: crypto.randomUUID(),
          ma: data.ma,
          ten: data.ten,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
          tenHangHoa: data.tenHangHoa,
          duNoDauKy: Number(data.duNoDauKy) || 0,
          duCoDauKy: Number(data.duCoDauKy) || 0,
          daVoHieuHoa: false,
        });
      }
      reset({ ma: '', ten: '', diaChi: '', maSoThue: '', tenHangHoa: '', duNoDauKy: 0, duCoDauKy: 0 });
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu nhà cung cấp.');
    }
  };

  const handleEdit = (supplier: any) => {
    setEditingId(supplier.id);
    reset({
      ma: supplier.ma,
      ten: supplier.ten,
      diaChi: supplier.diaChi,
      maSoThue: supplier.maSoThue,
      tenHangHoa: supplier.tenHangHoa,
      duNoDauKy: supplier.duNoDauKy || 0,
      duCoDauKy: supplier.duCoDauKy || 0
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ ma: '', ten: '', diaChi: '', maSoThue: '', tenHangHoa: '', duNoDauKy: 0, duCoDauKy: 0 });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhà cung cấp này?')) {
      await db.nhaCungCap.delete(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center gap-3">
          <Truck className="text-primary" size={28} />
          <h1 className="text-2xl font-serif font-bold text-text-primary">Danh mục Nhà cung cấp</h1>
        </div>

        <div className="p-4 sm:p-6 bg-white bg-opacity-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-muted p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Chỉnh sửa nhà cung cấp' : 'Thêm nhà cung cấp mới'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã NCC</label>
                <input
                  {...register('ma', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: NCC001"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-medium text-text-secondary">Tên nhà cung cấp</label>
                <input
                  {...register('ten', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Công ty TNHH Cung Cấp ABC"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-xs font-medium text-text-secondary">Địa chỉ</label>
                <input
                  {...register('diaChi', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 123 Đường X, Quận Y"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã số thuế</label>
                <input
                  {...register('maSoThue', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: 0123456789"
                />
              </div>
              <div className="space-y-1.5 md:col-span-3">
                <label className="block text-xs font-medium text-text-secondary">Hàng hóa cung cấp (để gợi ý)</label>
                <input
                  {...register('tenHangHoa', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Xi măng, Sắt thép, Máy tính..."
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-medium text-text-secondary">Dư Nợ đầu kỳ</label>
                <input
                  type="number"
                  {...register('duNoDauKy')}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0"
                />
              </div>
              <div className="space-y-1.5 md:col-span-1">
                <label className="block text-xs font-medium text-text-secondary">Dư Có đầu kỳ</label>
                <input
                  type="number"
                  {...register('duCoDauKy')}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="0"
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
                className="bg-text-primary hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
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
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã NCC</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Tên nhà cung cấp</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Địa chỉ</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mặt hàng</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã số thuế</th>
                <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Nợ đầu kỳ</th>
                <th className="py-3 px-4 text-right font-bold text-text-primary">Dư Có đầu kỳ</th>
                <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredSuppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    Không tìm thấy nhà cung cấp nào.
                  </td>
                </tr>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                    <td className="py-4 px-4 font-medium text-black">{supplier.ma}</td>
                    <td className="py-4 px-4 text-black">{supplier.ten}</td>
                    <td className="py-4 px-4 text-black truncate max-w-xs">{supplier.diaChi}</td>
                    <td className="py-4 px-4 text-black">{supplier.tenHangHoa}</td>
                    <td className="py-4 px-4 font-mono text-xs text-black">{supplier.maSoThue}</td>
                    <td className="py-4 px-4 text-right tabular-nums text-black">{supplier.duNoDauKy ? supplier.duNoDauKy.toLocaleString('vi-VN') : '-'}</td>
                    <td className="py-4 px-4 text-right tabular-nums text-black">{supplier.duCoDauKy ? supplier.duCoDauKy.toLocaleString('vi-VN') : '-'}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(supplier)}
                          className="text-text-secondary hover:text-primary transition-colors p-1"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(supplier.id)}
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
