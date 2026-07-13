import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const login = useAuthStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      login({
        id: 'u1',
        fullName: 'Nguyễn Văn A',
        class: 'Lớp 10A1',
      });
      setIsLoading(false);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans">
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 relative z-10">

        {/* Logo/Brand Area */}
        <div className="mb-12">
          <div className="flex items-center gap-3">
            <img src="/faasa-logo.png" alt="FAASA Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 tracking-tight leading-tight">Accounting & Auditing</span>
              <span className="text-sm font-medium text-[#990000]">Practice Hub</span>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Đăng nhập</h1>
          <p className="text-gray-500 mb-8 text-sm">Hệ thống thực hành Kế toán - Kiểm toán dành cho sinh viên FTU.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email sinh viên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] transition-colors"
                  placeholder="masv@ftu.edu.vn"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                <a href="#" className="text-sm font-medium text-[#990000] hover:text-[#7a0000] transition-colors">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#990000]/20 focus:border-[#990000] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#990000] focus:ring-[#990000] border-gray-300 rounded cursor-pointer accent-[#990000]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#990000] hover:bg-[#800000] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#990000] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="ml-2 -mr-1 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Cần hỗ trợ? Liên hệ <a href="mailto:ftulab@ftu.edu.vn" className="font-medium text-[#990000] hover:underline">ftulab@ftu.edu.vn</a>
          </div>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:block lg:w-1/2 relative bg-gray-50 overflow-hidden">
        {/* Placeholder gradient / logo combo if image fails to load */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#990000] to-[#5a0000] flex flex-col items-center justify-center text-white p-12">
          <img src="/ftu-logo-white.png" alt="FTU Logo" className="w-32 h-auto mb-8 opacity-80" />
          <h2 className="text-3xl font-bold mb-4 tracking-tight text-center">KHOA KẾ TOÁN - KIỂM TOÁN</h2>
          <p className="text-white/80 text-lg mb-6 max-w-lg text-center">
            Trường Đại học Ngoại thương
          </p>
        </div>

        {/* Real background image wrapper: User's image should be named bg-login.jpg in public folder */}
        <img
          src="/bg-login.jpg"
          alt="FTU Accounting Background"
          className="absolute inset-0 h-full w-full object-cover object-center z-10"
          onError={(e) => {
            // Hide if missing so the fallback gradient shows
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Overlay gradient on top of the image for better text legibility if we want to add text over the user's image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent mix-blend-multiply z-20 pointer-events-none" />

        <div className="absolute bottom-0 left-0 right-0 p-12 text-white z-30 pointer-events-none">
          <h2 className="text-3xl font-bold mb-3 tracking-tight drop-shadow-md">KHOA KẾ TOÁN - KIỂM TOÁN</h2>
          <p className="text-gray-200 text-lg mb-6 max-w-lg drop-shadow-md">
            Trường Đại học Ngoại thương
          </p>
          <div className="h-1 w-20 bg-[#990000] rounded-full shadow-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
