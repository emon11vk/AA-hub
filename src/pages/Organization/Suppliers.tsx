import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { Truck, Plus, Trash2 } from 'lucide-react';

interface SupplierForm {
  ma: string;
  ten: string;
  diaChi: string;
  maSoThue: string;
  tenHangHoa: string;
}

export default function Suppliers() {
  const suppliers = useLiveQuery(() => db.nhaCungCap.toArray()) || [];
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierForm>();

  const onSubmit = async (data: SupplierForm) => {
    try {
      await db.nhaCungCap.add({
        id: crypto.randomUUID(),
        ma: data.ma,
        ten: data.ten,
        diaChi: data.diaChi,
        maSoThue: data.maSoThue,
        tenHangHoa: data.tenHangHoa,
        daVoHieuHoa: false,
      });
      reset();
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi thêm nhà cung cấp.');
    }
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

        <div className="p-6 bg-white bg-opacity-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-muted p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} /> Thêm nhà cung cấp mới
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
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="bg-text-primary hover:bg-black text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Thêm mới
              </button>
            </div>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#E2E8F0]">
              <tr>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã NCC</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Tên nhà cung cấp</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Địa chỉ</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mặt hàng</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã số thuế</th>
                <th className="py-3 px-4 text-center font-bold text-text-primary w-20">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-text-secondary">
                    Chưa có nhà cung cấp nào. Hãy thêm mới!
                  </td>
                </tr>
              ) : (
                suppliers.map((supplier) => (
                  <tr key={supplier.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                    <td className="py-4 px-4 font-medium text-black">{supplier.ma}</td>
                    <td className="py-4 px-4 text-black">{supplier.ten}</td>
                    <td className="py-4 px-4 text-black truncate max-w-xs">{supplier.diaChi}</td>
                    <td className="py-4 px-4 text-black">{supplier.tenHangHoa}</td>
                    <td className="py-4 px-4 font-mono text-xs text-black">{supplier.maSoThue}</td>
                    <td className="py-4 px-4 text-center">
                      <button 
                        onClick={() => handleDelete(supplier.id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
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
