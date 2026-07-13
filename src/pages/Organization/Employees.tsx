import { useForm } from 'react-hook-form';
import { db } from '../../db/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { UserCircle, Plus, Trash2, MoreVertical, Search } from 'lucide-react';
import { useState, useEffect } from 'react';

interface EmployeeForm {
  ma: string;
  ten: string;
  phongBan: string;
  viTri: string;
}

const MOCK_EMPLOYEES = [
  { id: 'emp-1', ma: 'KT001', ten: 'Nguyễn Năng Hoàng', phongBan: 'Kế toán', viTri: 'Trưởng phòng' },
  { id: 'emp-2', ma: 'NS001', ten: 'Phan Anh Lân', phongBan: 'Nhân sự', viTri: 'Trưởng phòng' },
  { id: 'emp-3', ma: 'KD001', ten: 'Trần Thị A', phongBan: 'Kinh doanh', viTri: 'Nhân viên' },
  { id: 'emp-4', ma: 'IT001', ten: 'Lê Văn B', phongBan: 'IT', viTri: 'Chuyên viên' },
  { id: 'emp-5', ma: 'MK001', ten: 'Phạm Quỳnh C', phongBan: 'Marketing', viTri: 'Nhân viên' },
  { id: 'emp-6', ma: 'KT002', ten: 'Hoàng Trọng D', phongBan: 'Kế toán', viTri: 'Nhân viên' },
  { id: 'emp-7', ma: 'NS002', ten: 'Vũ Thị E', phongBan: 'Nhân sự', viTri: 'Chuyên viên' },
  { id: 'emp-8', ma: 'KD002', ten: 'Đặng Xuân F', phongBan: 'Kinh doanh', viTri: 'Phó phòng' },
  { id: 'emp-9', ma: 'IT002', ten: 'Bùi Thu G', phongBan: 'IT', viTri: 'Trưởng phòng' },
  { id: 'emp-10', ma: 'MK002', ten: 'Đỗ Văn H', phongBan: 'Marketing', viTri: 'Chuyên viên' },
  { id: 'emp-11', ma: 'KT003', ten: 'Hồ Thị I', phongBan: 'Kế toán', viTri: 'Nhân viên' },
  { id: 'emp-12', ma: 'NS003', ten: 'Ngô Văn K', phongBan: 'Nhân sự', viTri: 'Nhân viên' },
  { id: 'emp-13', ma: 'KD003', ten: 'Dương Thu L', phongBan: 'Kinh doanh', viTri: 'Nhân viên' },
  { id: 'emp-14', ma: 'IT003', ten: 'Lý Văn M', phongBan: 'IT', viTri: 'Nhân viên' },
  { id: 'emp-15', ma: 'MK003', ten: 'Đào Thị N', phongBan: 'Marketing', viTri: 'Phó phòng' },
  { id: 'emp-16', ma: 'KT004', ten: 'Đoàn Văn O', phongBan: 'Kế toán', viTri: 'Chuyên viên' },
  { id: 'emp-17', ma: 'NS004', ten: 'Vương Thu P', phongBan: 'Nhân sự', viTri: 'Nhân viên' },
  { id: 'emp-18', ma: 'KD004', ten: 'Trịnh Văn Q', phongBan: 'Kinh doanh', viTri: 'Chuyên viên' },
  { id: 'emp-19', ma: 'IT004', ten: 'Đinh Thị R', phongBan: 'IT', viTri: 'Nhân viên' },
  { id: 'emp-20', ma: 'MK004', ten: 'Lâm Văn S', phongBan: 'Marketing', viTri: 'Nhân viên' },
];

export default function Employees() {
  const employees = useLiveQuery(() => db.nhanVien.toArray()) || [];
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EmployeeForm>();

  const filteredEmployees = employees.filter((e) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      e.ma.toLowerCase().includes(term) ||
      e.ten.toLowerCase().includes(term) ||
      e.phongBan.toLowerCase().includes(term) ||
      e.viTri.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    // Seed initial data if empty
    const checkAndSeed = async () => {
      const count = await db.nhanVien.count();
      if (count === 0) {
        await db.nhanVien.bulkAdd(MOCK_EMPLOYEES);
      }
    };
    checkAndSeed();
  }, []);

  const onSubmit = async (data: EmployeeForm) => {
    try {
      if (editingId) {
        await db.nhanVien.update(editingId, {
          ma: data.ma,
          ten: data.ten,
          phongBan: data.phongBan,
          viTri: data.viTri,
        });
        setEditingId(null);
      } else {
        await db.nhanVien.add({
          id: crypto.randomUUID(),
          ma: data.ma,
          ten: data.ten,
          phongBan: data.phongBan,
          viTri: data.viTri,
        });
      }
      reset({ ma: '', ten: '', phongBan: '', viTri: '' });
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu thông tin nhân viên.');
    }
  };

  const handleEdit = (employee: any) => {
    setEditingId(employee.id);
    reset({
      ma: employee.ma,
      ten: employee.ten,
      phongBan: employee.phongBan,
      viTri: employee.viTri
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    reset({ ma: '', ten: '', phongBan: '', viTri: '' });
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      await db.nhanVien.delete(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="card !p-0 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border bg-white flex items-center gap-3">
          <UserCircle className="text-primary" size={28} />
          <h1 className="text-2xl font-serif font-bold text-text-primary">Danh mục Nhân viên</h1>
        </div>

        <div className="p-4 sm:p-6 bg-white bg-opacity-50">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-bg-muted p-5 rounded-xl border border-border">
            <h3 className="text-sm font-bold text-text-primary mb-4 flex items-center gap-2">
              <Plus size={16} /> {editingId ? 'Chỉnh sửa nhân viên' : 'Thêm nhân viên mới'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Mã nhân viên</label>
                <input
                  {...register('ma', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: KT001"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Tên nhân viên</label>
                <input
                  {...register('ten', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Nguyễn Năng Hoàng"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Phòng - Ban</label>
                <input
                  {...register('phongBan', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Kế toán"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">Vị trí</label>
                <input
                  {...register('viTri', { required: 'Bắt buộc' })}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="VD: Trưởng phòng"
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
                placeholder="Tìm theo mã, tên, phòng ban, vị trí..." 
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
                <th className="py-3 px-4 text-left font-bold text-text-primary">Mã nhân viên</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Tên nhân viên</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Phòng - Ban</th>
                <th className="py-3 px-4 text-left font-bold text-text-primary">Vị trí</th>
                <th className="py-3 px-4 text-center font-bold text-text-primary w-24">Chỉnh sửa</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Không tìm thấy nhân viên nào.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-border hover:bg-bg-muted transition-colors">
                    <td className="py-4 px-4 font-medium text-black">{employee.ma}</td>
                    <td className="py-4 px-4 text-black font-semibold">{employee.ten}</td>
                    <td className="py-4 px-4 text-black">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium border border-gray-200">
                        {employee.phongBan}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-black">{employee.viTri}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => handleEdit(employee)}
                          className="text-text-secondary hover:text-primary transition-colors p-1"
                        >
                          <MoreVertical size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(employee.id)}
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
