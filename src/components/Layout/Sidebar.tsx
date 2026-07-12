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
      { id: 'he-thong-tai-khoan', label: 'Hệ thống tài khoản', path: '/organization/accounts' },
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

const MenuItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;
  
  useEffect(() => {
    if (hasChildren) {
      const isChildActive = (children: NavItem[]): boolean => {
        return children.some(child => 
          (child.path && location.pathname.startsWith(child.path)) || 
          (child.children && isChildActive(child.children))
        );
      };
      if (isChildActive(item.children!)) {
        setIsOpen(true);
      }
    }
  }, [location.pathname, hasChildren, item.children]);

  if (hasChildren) {
    return (
      <div className="mb-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center py-2.5 pr-4 rounded-lg font-medium transition-colors text-text-primary hover:bg-bg-muted`}
          style={{ paddingLeft: `${level * 1.2 + 1}rem` }}
        >
          {item.icon && <item.icon size={20} className="mr-3 shrink-0" />}
          <span className={`flex-1 text-left font-sans ${level === 0 ? 'font-semibold' : 'text-sm'}`}>{item.label}</span>
          {isOpen ? <ChevronDown size={16} className="shrink-0" /> : <ChevronRight size={16} className="shrink-0" />}
        </button>
        {isOpen && (
          <div className="mt-1 flex flex-col gap-1">
            {item.children!.map((child) => (
              <MenuItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      className={({ isActive }) =>
        `flex items-center py-2.5 pr-4 mb-1 rounded-lg font-medium transition-colors ${
          isActive
            ? 'bg-primary text-white'
            : 'text-text-primary hover:bg-bg-muted'
        }`
      }
      style={{ paddingLeft: `${level * 1.2 + 1}rem` }}
    >
      {item.icon && <item.icon size={20} className="mr-3 shrink-0" />}
      <span className="flex-1 font-sans text-sm leading-tight">{item.label}</span>
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-72 bg-sidebar-bg flex flex-col border-r border-border shrink-0 font-serif h-screen sticky top-0">
      <div className="h-16 flex items-center px-4 border-b border-border">
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
