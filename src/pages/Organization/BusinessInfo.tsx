import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useAuthStore } from '../../store/authStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { Building2, Save } from 'lucide-react';

interface BusinessInfoForm {
  tenDN: string;
  diaChi: string;
  maSoThue: string;
  hoTenSinhVien: string;
  lop: string;
}

export default function BusinessInfo() {
  const user = useAuthStore((state) => state.user);
  
  // Try to load existing profile
  const profile = useLiveQuery(() => db.hoSoDoanhNghiep.limit(1).first());

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BusinessInfoForm>();

  useEffect(() => {
    if (profile) {
      reset({
        tenDN: profile.tenDN,
        diaChi: profile.diaChi,
        maSoThue: profile.maSoThue,
        hoTenSinhVien: user?.fullName || profile.hoTenSinhVien,
        lop: user?.class || profile.lop || '',
      });
    } else if (user) {
      reset({
        hoTenSinhVien: user.fullName,
        lop: user.class,
      });
    }
  }, [profile, user, reset]);

  const onSubmit = async (data: BusinessInfoForm) => {
    try {
      if (profile) {
        await db.hoSoDoanhNghiep.update(profile.id, {
          tenDN: data.tenDN,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
          hoTenSinhVien: data.hoTenSinhVien,
          lop: data.lop,
        });
      } else {
        await db.hoSoDoanhNghiep.add({
          id: crypto.randomUUID(),
          tenDN: data.tenDN,
          diaChi: data.diaChi,
          maSoThue: data.maSoThue,
          hoTenSinhVien: data.hoTenSinhVien,
          chucDanh: 'Kế toán viên',
          lop: data.lop,
          kyThucHanh: new Date().getFullYear().toString(),
          trangThai: 'DANG_LAM',
          createdAt: new Date().toISOString(),
        });
      }
      alert('Lưu thông tin doanh nghiệp thành công!');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center gap-3">
          <Building2 className="text-primary" size={28} />
          <h1 className="text-2xl font-serif font-bold text-text-primary">Thông tin doanh nghiệp</h1>
        </div>

        <div className="p-6 bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">Tên doanh nghiệp</label>
                <input
                  {...register('tenDN', { required: 'Vui lòng nhập tên doanh nghiệp' })}
                  className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ví dụ: Công ty TNHH ABC"
                />
                {errors.tenDN && <span className="text-red-500 text-xs">{errors.tenDN.message}</span>}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-text-secondary">Địa chỉ</label>
                <input
                  {...register('diaChi', { required: 'Vui lòng nhập địa chỉ' })}
                  className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ví dụ: 123 Đường A, Quận B, TP.HCM"
                />
                {errors.diaChi && <span className="text-red-500 text-xs">{errors.diaChi.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-text-secondary">Mã số thuế</label>
                <input
                  {...register('maSoThue', { required: 'Vui lòng nhập mã số thuế' })}
                  className="w-full px-4 py-2.5 bg-bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  placeholder="Ví dụ: 0101234567"
                />
                {errors.maSoThue && <span className="text-red-500 text-xs">{errors.maSoThue.message}</span>}
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-6">
              <h3 className="text-lg font-serif font-bold text-text-primary mb-4">Thông tin người lập biểu (Tự động)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">Họ và tên học sinh</label>
                  <input
                    {...register('hoTenSinhVien')}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-text-secondary">Lớp</label>
                  <input
                    {...register('lop')}
                    readOnly
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              <p className="text-xs text-text-muted mt-3 italic">
                * Thông tin này được lấy tự động từ tài khoản đăng nhập của bạn và sẽ hiển thị trên các chứng từ.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
              >
                <Save size={18} />
                Lưu thông tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
