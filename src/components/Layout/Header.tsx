import { useState, useRef, useEffect } from 'react';
import { Send, User, ChevronDown, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const user = useAuthStore((state) => state.user);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [userClass, setUserClass] = useState(user?.class || '');

  useEffect(() => {
    if (isProfileOpen) {
      setFullName(user?.fullName || '');
      setUserClass(user?.class || '');
    }
  }, [isProfileOpen, user]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUpdate = () => {
    updateProfile({ fullName, class: userClass });
    setIsProfileOpen(false);
  };

  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-end px-6 shrink-0 print:hidden relative z-50">
      {/* Giữa (Logo) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-4 whitespace-nowrap pointer-events-none">
        <div className="w-[76px] h-[76px] flex items-center justify-center shrink-0 pointer-events-auto">
          <img src="/ftu-logo-white.png" alt="FTU Logo" className="w-full h-full object-contain" />
        </div>
        <div className="font-serif pointer-events-auto">
          <div className="text-primary font-bold text-lg tracking-wide uppercase">TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG</div>
          <div className="text-text-secondary text-sm tracking-widest uppercase">Foreign Trade University</div>
        </div>
      </div>
      
      {/* Phải (Công cụ) */}
      <div className="flex items-center gap-4 text-text-primary pl-6">
        <button className="flex items-center gap-2 font-medium hover:text-primary transition-colors">
          <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px]">★</div>
          Vn
        </button>
        
        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-2 hover:bg-bg-muted p-1 pr-2 rounded-full transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <ChevronDown size={16} className={`text-text-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full mt-2 w-[500px] bg-white rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] border border-gray-100 p-6 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-gray-800">Hồ sơ cá nhân</h3>
                  <p className="text-sm text-gray-500">Cập nhật thông tin tài khoản của bạn</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 mb-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Họ và tên học sinh</label>
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Nguyễn Văn A" 
                    className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 w-full text-gray-800 placeholder:text-gray-400 transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-gray-700">Lớp</label>
                  <input 
                    type="text" 
                    value={userClass}
                    onChange={(e) => setUserClass(e.target.value)}
                    placeholder="VD: Lớp 10A1" 
                    className="px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 w-full text-gray-800 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="px-5 py-2.5 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={handleUpdate}
                  className="px-5 py-2.5 rounded-lg font-medium bg-primary text-white hover:bg-primary/90 shadow-sm transition-colors flex items-center gap-2"
                >
                  Cập nhật hồ sơ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
