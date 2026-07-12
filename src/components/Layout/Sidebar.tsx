import { NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, Building2, Landmark, Wallet, BarChart2, 
  ChevronDown, ChevronRight, DollarSign
} from 'lucide-react';
import { useState, useEffect } from 'react';

type NavItem = {
  id: string;
  label: string;
  path?: string;
  icon?: any;
  children?: NavItem[];
};

const navItems: NavItem[] = [
  {
    id: 'thong-tin-to-chuc',
    label: 'Thông Tin Tổ Chức',
    icon: Building2,
    children: [
      { id: 'thong-tin-doanh-nghiep', label: 'Thông tin Doanh Nghiệp', path: '/organization/info' },
      { id: 'nha-cung-cap', label: 'Nhà Cung cấp', path: '/organization/suppliers' },
      { id: 'khach-hang', label: 'Khách Hàng', path: '/organization/customers' },
      { id: 'he-thong-tai-khoan', label: 'Số dư tài khoản', path: '/organization/accounts' },
    ],
  },
  {
    id: 'nghiep-vu-tien',
    label: 'Nghiệp Vụ Tiền',
    icon: DollarSign,
    children: [
      {
        id: 'quy-tien-mat',
        label: 'Qũy Tiền Mặt',
        icon: Wallet,
        children: [
          { id: 'tm-danh-sach', label: 'Danh sách chứng từ', path: '/vouchers/cash' },
          { id: 'tm-thu-tien', label: 'Thu tiền', path: '/vouchers/form/PHIEU_THU' },
          { id: 'tm-thu-tien-kh', label: 'Thu tiền Khách hàng', path: '/vouchers/form/PHIEU_THU_KH' },
          { id: 'tm-chi-tien', label: 'Chi tiền', path: '/vouchers/form/PHIEU_CHI' },
          { id: 'tm-chi-tien-ncc', label: 'Chi tiền Nhà cung cấp', path: '/vouchers/form/PHIEU_CHI_NCC' },
        ],
      },
      {
        id: 'tien-gui-ngan-hang',
        label: 'Tiền Gửi Ngân Hàng',
        icon: Landmark,
        children: [
          { id: 'nh-danh-sach', label: 'Danh sách chứng từ', path: '/vouchers/bank' },
          { id: 'nh-thu-tien', label: 'Thu tiền', path: '/vouchers/form/THU_TIEN_GUI' },
          { id: 'nh-thu-tien-kh', label: 'Thu tiền Khách hàng', path: '/vouchers/form/THU_TIEN_GUI_KH' },
          { id: 'nh-chi-tien', label: 'Chi tiền', path: '/vouchers/form/UY_NHIEM_CHI' },
          { id: 'nh-chi-tien-ncc', label: 'Chi tiền Nhà cung cấp', path: '/vouchers/form/UY_NHIEM_CHI_NCC' },
        ],
      },
    ]
  },
  {
    id: 'bao-cao',
    label: 'Báo cáo',
    icon: BarChart2,
    children: [
      { id: 'so-nhat-ki-chung', label: 'Sổ nhật kí chung', path: '/reports/general-journal' },
      { id: 'bang-can-doi-so-phat-sinh', label: 'Bảng cân đối số phát sinh', path: '/reports/trial-balance' },
      { id: 'bang-can-doi-ke-toan', label: 'Bảng cân đối kế toán', path: '/reports/balance-sheet' },
      { id: 'bc-ket-qua-kd', label: 'Báo cáo kết quả hoạt động kinh doanh', path: '/reports/income-statement' },
    ]
  }
];

const MenuItem = ({ item, level = 0, isInsideActiveBlock = false }: { item: NavItem; level?: number; isInsideActiveBlock?: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;
  
  const isChildActive = (children: NavItem[]): boolean => {
    return children.some(child => 
      (child.path && location.pathname.startsWith(child.path)) || 
      (child.children && isChildActive(child.children))
    );
  };

  const isParentActive = (item.path && location.pathname.startsWith(item.path)) || (hasChildren && isChildActive(item.children!));
  
  const isActiveBlock = level === 0 ? isParentActive : isInsideActiveBlock;

  useEffect(() => {
    if (isParentActive && hasChildren) {
      setIsOpen(true);
    }
  }, [isParentActive, hasChildren]);

  if (hasChildren) {
    return (
      <div className={`mb-1 transition-colors ${level === 0 && isParentActive ? 'bg-[#b91c1c] text-white' : ''}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center py-3 pr-4 font-serif font-bold transition-colors ${
            isActiveBlock 
              ? 'bg-[#991b1b] border-y border-black/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]' 
              : 'hover:bg-gray-50'
          }`}
          style={{ paddingLeft: `${level * 1.2 + 1.5}rem` }}
        >
          {item.icon && <item.icon size={18} className="mr-3 shrink-0" />}
          <span className="flex-1 text-left text-[15px] tracking-wide">{item.label}</span>
          {isOpen ? (
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 shadow-sm ${isActiveBlock ? 'bg-white' : 'bg-gray-200'}`}>
              <ChevronDown size={14} className={isActiveBlock ? 'text-[#b91c1c]' : 'text-gray-600'} />
            </div>
          ) : (
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isActiveBlock ? 'bg-white' : 'bg-gray-100'}`}>
              <ChevronRight size={14} className={isActiveBlock ? 'text-[#b91c1c]' : 'text-gray-400'} />
            </div>
          )}
        </button>
        {isOpen && (
          <div className="flex flex-col pb-2">
            {item.children!.map((child) => (
              <MenuItem key={child.id} item={child} level={level + 1} isInsideActiveBlock={isActiveBlock} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive: isPathActive }) =>
        `flex items-center py-2.5 pr-4 mb-1 font-serif text-[14px] transition-colors ${
          level > 0 ? 'font-medium' : 'font-bold text-[15px] tracking-wide py-3'
        } ${
          isPathActive
            ? (level > 0 ? (isActiveBlock ? 'text-white font-bold bg-white/20' : 'text-[#b91c1c] font-bold bg-gray-50') : 'bg-[#b91c1c] text-white')
            : (isActiveBlock ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
        }`
      }
      style={{ paddingLeft: `${level * 1.2 + 1.5}rem` }}
    >
      {item.icon && <item.icon size={18} className="mr-3 shrink-0" />}
      <span className="flex-1 leading-tight">{item.label}</span>
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-72 bg-white flex flex-col border-r border-border shrink-0 font-serif h-screen sticky top-0 shadow-[2px_0_8px_-4px_rgba(0,0,0,0.1)] z-20">
      <div className="h-20 flex items-center px-6 border-b border-border">
        <h1 className="text-xl font-bold text-text-primary flex-1">Thực hành kế toán</h1>
        <button className="p-2 hover:bg-bg-muted rounded-lg text-text-primary">
          <Menu size={24} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-border flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-1 font-sans text-primary font-bold">
          <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-[8px]">★</div>
          MAKE IN VIET NAM
        </div>
        <div className="font-sans font-bold text-green-600">QES</div>
      </div>
    </aside>
  );
}
