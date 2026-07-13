import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ChungTu, LoaiChungTu } from '../../db/db';
import { generateVoucherNumber } from '../../utils/voucherHelpers';
import { Save, ArrowLeft, Plus, Trash2, Calculator } from 'lucide-react';

interface VoucherFormData {
  doiTuongId: string;
  tenDoiTuong: string;
  diaChi: string;
  lyDo: string;
  tkNganHang: string;
  ngayHachToan: string;
  ngayChungTu: string;
  soChungTu: string;
  butToan: {
    dienGiai: string;
    tkNo: string;
    tkCo: string;
    soTien: number;
    tkThueGTGT?: string;
    soTienThue?: number;
    thueSuat?: number;
  }[];
}

export default function VoucherForm() {
  const { type, id } = useParams<{ type: string; id: string }>();
  const navigate = useNavigate();
  const loaiChungTu = type as LoaiChungTu;
  
  const isBank = loaiChungTu?.includes('TIEN_GUI') || loaiChungTu?.includes('UY_NHIEM');
  const isReceipt = loaiChungTu?.includes('THU') || loaiChungTu === 'GIAY_BAO';

  const [activeTab, setActiveTab] = useState<'HACH_TOAN' | 'THUE'>('HACH_TOAN');

  // Load existing data if edit mode
  const existingVoucher = useLiveQuery(() => id ? db.chungTu.get(id) : undefined, [id]);
  
  const khachHangs = useLiveQuery(() => db.khachHang.toArray()) || [];
  const nhaCungCaps = useLiveQuery(() => db.nhaCungCap.toArray()) || [];
  
  const accountsList = useLiveQuery(() => db.taiKhoanKeToan.toArray()) || [];

  const { register, control, handleSubmit, reset, setValue, watch } = useForm<VoucherFormData>({
    defaultValues: {
      butToan: [{ dienGiai: '', tkNo: '', tkCo: '', soTien: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "butToan"
  });

  const lyDo = watch('lyDo');

  useEffect(() => {
    if (existingVoucher) {
      reset(existingVoucher as any);
    } else {
      // Init new voucher
      const today = new Date().toISOString().split('T')[0];
      generateVoucherNumber(loaiChungTu).then(soChungTu => {
        reset({
          ngayHachToan: today,
          ngayChungTu: today,
          soChungTu,
          lyDo: isReceipt ? 'Thu tiền' : 'Chi tiền',
          butToan: [{ dienGiai: isReceipt ? 'Thu tiền' : 'Chi tiền', tkNo: '', tkCo: '', soTien: 0 }]
        });
        applyAutoFillAccounts(0);
      });
    }
  }, [existingVoucher, loaiChungTu, reset]);

  // Auto copy reason to lines
  useEffect(() => {
    if (!existingVoucher && lyDo) {
      const currentLines = watch('butToan');
      currentLines.forEach((_, idx) => {
        setValue(`butToan.${idx}.dienGiai`, lyDo);
      });
    }
  }, [lyDo]);

  const applyAutoFillAccounts = (index: number) => {
    // Auto-fill logic
    if (loaiChungTu === 'PHIEU_THU' || loaiChungTu === 'PHIEU_THU_KH') {
      setValue(`butToan.${index}.tkNo`, '111');
    } else if (loaiChungTu === 'THU_TIEN_GUI' || loaiChungTu === 'THU_TIEN_GUI_KH') {
      setValue(`butToan.${index}.tkNo`, '112');
    } else if (loaiChungTu === 'PHIEU_CHI' || loaiChungTu === 'PHIEU_CHI_NCC') {
      setValue(`butToan.${index}.tkCo`, '111');
    } else if (loaiChungTu === 'UY_NHIEM_CHI' || loaiChungTu === 'UY_NHIEM_CHI_NCC') {
      setValue(`butToan.${index}.tkCo`, '112');
    }
  };

  const handleObjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setValue('doiTuongId', val);
    
    // Find in both arrays
    const kh = khachHangs.find(k => k.id === val);
    const ncc = nhaCungCaps.find(n => n.id === val);
    const target = kh || ncc;
    
    if (target) {
      setValue('tenDoiTuong', target.ten);
      setValue('diaChi', target.diaChi);
    }
  };

  const handleTaxChange = (index: number, rate: number) => {
    const lines = watch('butToan');
    const soTien = lines[index].soTien || 0;
    const taxAmount = soTien * (rate / 100);
    setValue(`butToan.${index}.soTienThue`, taxAmount);
    if (rate > 0) {
      // Usually output tax (33311) for sales/receipt, input tax (1331) for purchases/payment
      setValue(`butToan.${index}.tkThueGTGT`, isReceipt ? '33311' : '1331');
    } else {
      setValue(`butToan.${index}.tkThueGTGT`, '');
    }
  };

  const onSubmit = async (data: VoucherFormData) => {
    try {
      // Tự động sinh bút toán Thuế GTGT
      const finalButToan: any[] = [];
      for (const row of data.butToan) {
        // Thêm bút toán chính (loại bỏ thông tin thuế để Sổ nhật ký không bị lặp, nhưng vẫn có thể giữ lại để view)
        finalButToan.push({
          dienGiai: row.dienGiai,
          tkNo: row.tkNo,
          tkCo: row.tkCo,
          soTien: row.soTien,
          tkThueGTGT: row.tkThueGTGT,
          soTienThue: row.soTienThue,
          thueSuat: row.thueSuat
        });
        
        // Sinh bút toán thuế nếu có
        if (row.soTienThue && row.tkThueGTGT && row.soTienThue > 0) {
          finalButToan.push({
            dienGiai: `Thuế GTGT (${row.thueSuat || 0}%) - ${row.dienGiai}`,
            tkNo: isReceipt ? row.tkNo : row.tkThueGTGT,
            tkCo: isReceipt ? row.tkThueGTGT : row.tkCo,
            soTien: row.soTienThue
          });
        }
      }

      const voucherData: ChungTu = {
        id: id || crypto.randomUUID(),
        ...data,
        butToan: finalButToan,
        loaiChungTu,
        loaiTien: 'VND',
        tyGia: 1,
        daKhoa: false,
        createdAt: new Date().toISOString()
      };

      if (id) {
        await db.chungTu.put(voucherData);
      } else {
        await db.chungTu.add(voucherData);
      }
      
      alert('Lưu chứng từ thành công!');
      navigate('/vouchers');
    } catch (error) {
      console.error(error);
      alert('Có lỗi xảy ra khi lưu.');
    }
  };

  const getTitle = () => {
    switch(loaiChungTu) {
      case 'PHIEU_THU': return 'Phiếu thu';
      case 'PHIEU_THU_KH': return 'Phiếu thu tiền khách hàng';
      case 'PHIEU_CHI': return 'Phiếu chi';
      case 'PHIEU_CHI_NCC': return 'Phiếu chi trả nhà cung cấp';
      case 'THU_TIEN_GUI': return 'Thu tiền gửi';
      case 'THU_TIEN_GUI_KH': return 'Thu tiền gửi khách hàng';
      case 'UY_NHIEM_CHI': return 'Ủy nhiệm chi';
      case 'UY_NHIEM_CHI_NCC': return 'Ủy nhiệm chi trả nhà cung cấp';
      default: return 'Chứng từ';
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-7xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-4">
        <button 
          type="button" 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-serif font-bold text-text-primary uppercase flex-1">{getTitle()}</h1>
        <button 
          type="submit"
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Save size={18} /> Lưu chứng từ
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Phần 1: Thông tin chung (Master) */}
        <div className="lg:col-span-2 card !p-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-gray-50">
            <h2 className="font-bold text-text-primary">Thông tin chung</h2>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">Đối tượng</label>
              <div className="flex gap-2">
                <select 
                  className="w-1/3 px-3 py-2 text-sm border border-border rounded-lg"
                  onChange={handleObjectChange}
                >
                  <option value="">-- Chọn đối tượng --</option>
                  <optgroup label="Khách hàng">
                    {khachHangs.map(k => <option key={k.id} value={k.id}>{k.ma} - {k.ten}</option>)}
                  </optgroup>
                  <optgroup label="Nhà cung cấp">
                    {nhaCungCaps.map(n => <option key={n.id} value={n.id}>{n.ma} - {n.ten}</option>)}
                  </optgroup>
                </select>
                <input
                  {...register('tenDoiTuong')}
                  className="flex-1 px-3 py-2 text-sm border border-border rounded-lg"
                  placeholder="Tên đối tượng tự động điền hoặc nhập tay"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">Địa chỉ</label>
              <input
                {...register('diaChi')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
                placeholder="Địa chỉ tự động điền hoặc nhập tay"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">
                {isReceipt ? 'Lý do thu' : 'Lý do chi'}
              </label>
              <input
                {...register('lyDo')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>

            {isBank && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-text-secondary">
                  Tài khoản {isReceipt ? 'nộp vào' : 'chi'}
                </label>
                <input
                  {...register('tkNganHang')}
                  className="w-full px-3 py-2 text-sm border border-border rounded-lg"
                  placeholder="Nhập số tài khoản ngân hàng"
                />
              </div>
            )}
          </div>
        </div>

        {/* Phần 2: Chứng từ (Metadata) */}
        <div className="card !p-0 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border bg-gray-50">
            <h2 className="font-bold text-text-primary">Chứng từ</h2>
          </div>
          <div className="p-6 space-y-4 bg-white">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">Ngày hạch toán</label>
              <input
                type="date"
                {...register('ngayHachToan')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">Ngày chứng từ</label>
              <input
                type="date"
                {...register('ngayChungTu')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-text-secondary">Số chứng từ</label>
              <input
                {...register('soChungTu')}
                className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-gray-50 font-bold"
                readOnly
              />
            </div>
          </div>
        </div>
      </div>

      {/* Phần 3: Bảng hạch toán */}
      <div className="card !p-0 overflow-hidden shadow-sm mt-6">
        <div className="flex border-b border-border">
          <button
            type="button"
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'HACH_TOAN' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
            onClick={() => setActiveTab('HACH_TOAN')}
          >
            1. Hạch toán
          </button>
          <button
            type="button"
            className={`px-6 py-3 font-medium text-sm transition-colors ${activeTab === 'THUE' ? 'bg-primary text-white' : 'bg-gray-100 text-text-secondary hover:bg-gray-200'}`}
            onClick={() => setActiveTab('THUE')}
          >
            2. Thuế
          </button>
        </div>

        <div className="p-0 overflow-x-auto bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#E2E8F0]">
              <tr>
                <th className="py-2 px-3 text-left font-bold w-12">#</th>
                <th className="py-2 px-3 text-left font-bold min-w-[200px]">Diễn giải</th>
                {activeTab === 'HACH_TOAN' && (
                  <>
                    <th className="py-2 px-3 text-center font-bold w-32">TK Nợ</th>
                    <th className="py-2 px-3 text-center font-bold w-32">TK Có</th>
                    <th className="py-2 px-3 text-right font-bold w-40">Số tiền</th>
                  </>
                )}
                {activeTab === 'THUE' && (
                  <>
                    <th className="py-2 px-3 text-center font-bold w-32">% Thuế GTGT</th>
                    <th className="py-2 px-3 text-right font-bold w-40">Tiền thuế GTGT</th>
                    <th className="py-2 px-3 text-center font-bold w-32">TK Thuế GTGT</th>
                  </>
                )}
                <th className="py-2 px-3 text-center font-bold w-12">Xóa</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                  <td className="py-2 px-3 text-center text-text-secondary">{index + 1}</td>
                  <td className="py-2 px-3">
                    <input
                      {...register(`butToan.${index}.dienGiai`)}
                      className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white"
                    />
                  </td>
                  
                  {activeTab === 'HACH_TOAN' && (
                    <>
                      <td className="py-2 px-3">
                        <input
                          {...register(`butToan.${index}.tkNo`)}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-center font-mono"
                          placeholder="VD: 111"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          {...register(`butToan.${index}.tkCo`)}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-center font-mono"
                          placeholder="VD: 131"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          {...register(`butToan.${index}.soTien`, { valueAsNumber: true })}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-right tabular-nums font-bold text-black"
                        />
                      </td>
                    </>
                  )}
                  
                  {activeTab === 'THUE' && (
                    <>
                      <td className="py-2 px-3">
                        <select
                          {...register(`butToan.${index}.thueSuat`)}
                          onChange={(e) => handleTaxChange(index, Number(e.target.value))}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-center"
                        >
                          <option value="0">0%</option>
                          <option value="5">5%</option>
                          <option value="8">8%</option>
                          <option value="10">10%</option>
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          {...register(`butToan.${index}.soTienThue`, { valueAsNumber: true })}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-right tabular-nums font-bold text-black"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          {...register(`butToan.${index}.tkThueGTGT`)}
                          className="w-full px-2 py-1.5 text-sm border border-transparent hover:border-gray-300 focus:border-primary rounded bg-transparent focus:bg-white text-center font-mono"
                          placeholder="VD: 33311"
                        />
                      </td>
                    </>
                  )}

                  <td className="py-2 px-3 text-center">
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="text-red-400 hover:text-red-600 p-1"
                      disabled={fields.length === 1}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-3 bg-gray-50 flex items-center justify-between border-t border-border">
          <button
            type="button"
            onClick={() => {
              append({ dienGiai: lyDo || '', tkNo: '', tkCo: '', soTien: 0 });
              applyAutoFillAccounts(fields.length);
            }}
            className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1 bg-white px-3 py-1.5 rounded border border-gray-200 shadow-sm"
          >
            <Plus size={16} /> Thêm dòng
          </button>
        </div>
      </div>
    </form>
  );
}
