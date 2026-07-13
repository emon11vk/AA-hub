import { Send, Palette, User, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-20 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-white shadow-sm border border-gray-100">
          <img src="/ftu-logo.png" alt="FTU Logo" className="w-full h-full object-contain p-0.5" />
        </div>
        <div className="font-serif">
          <div className="text-primary font-bold text-lg tracking-wide uppercase">TRƯỜNG ĐẠI HỌC NGOẠI THƯƠNG</div>
          <div className="text-text-secondary text-sm tracking-widest uppercase">Foreign Trade University</div>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
          <Send size={16} />
          Nộp bài
        </button>
        
        <div className="flex items-center gap-4 text-text-primary border-l border-border pl-6">
          <button className="flex items-center gap-2 font-medium hover:text-primary transition-colors">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px]">★</div>
            Vn
          </button>
          
          <button className="p-2 hover:bg-bg-muted rounded-full transition-colors text-text-secondary">
            <Palette size={20} />
          </button>
          
          <button className="flex items-center gap-2 hover:bg-bg-muted p-1 pr-2 rounded-full transition-colors">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
              <User size={16} />
            </div>
            <ChevronDown size={16} className="text-text-secondary" />
          </button>
        </div>
      </div>
    </header>
  );
}
