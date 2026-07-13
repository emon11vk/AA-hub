import { NavLink, useLocation } from 'react-router-dom';
import {
  Menu, Building2, Landmark, Wallet, BarChart2,
  ChevronRight, DollarSign, LayoutDashboard
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
      { id: 'ngan-hang', label: 'Ngân Hàng', path: '/organization/banks' },
      { id: 'he-thong-tai-khoan', label: 'Sổ chi tiết', path: '/organization/accounts' },
    ],
  },
  {
    id: 'nghiep-vu-tien',
    label: 'Nghiệp Vụ Tiền',
    icon: DollarSign,
    children: [
      { id: 'danh-sach-chung-tu', label: 'Danh sách chứng từ', path: '/vouchers' },
    ]
  },
  {
    id: 'bao-cao',
    label: 'Báo cáo',
    icon: BarChart2,
    children: [
      { id: 'so-nhat-ki-chung', label: 'Sổ nhật kí chung', path: '/reports/general-journal' },
      { id: 'bang-can-doi-so-phat-sinh', label: 'Bảng cân đối số phát sinh', path: '/reports/trial-balance' },
      { id: 'bang-can-doi-ke-toan', label: 'Báo cáo tình hình tài chính', path: '/reports/balance-sheet' },
      { id: 'bc-ket-qua-kd', label: 'Báo cáo kết quả hoạt động kinh doanh', path: '/reports/income-statement' },
    ]
  }
];

const MenuItem = ({ item, level = 0 }: { item: NavItem; level?: number }) => {
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

  useEffect(() => {
    if (isParentActive && hasChildren) {
      setIsOpen(true);
    }
  }, [isParentActive, hasChildren]);

  if (hasChildren) {
    return (
      <div className="mb-0.5">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center py-2 pr-4 font-sans transition-colors focus:outline-none ${isParentActive
              ? 'text-gray-900 font-semibold'
              : 'text-gray-700 hover:bg-gray-50 font-medium'
            }`}
          style={{ paddingLeft: `${level * 1.25 + 1.25}rem` }}
        >
          {item.icon && <item.icon size={18} className={`mr-2.5 shrink-0 ${isParentActive ? 'text-[#b91c1c]' : 'text-gray-400'}`} />}
          <span className="flex-1 text-left text-[14px]">{item.label}</span>
          <ChevronRight
            size={16}
            className={`text-gray-400 shrink-0 transition-transform duration-200 ease-in-out ${isOpen ? 'rotate-90' : ''}`}
          />
        </button>
        <div
          className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col pb-1">
              {item.children!.map((child) => (
                <MenuItem key={child.id} item={child} level={level + 1} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <NavLink
      to={item.path || '#'}
      end={item.path === '/'}
      className={({ isActive }) =>
        `flex items-center py-2 pr-4 mb-0.5 font-sans text-[14px] transition-colors focus:outline-none rounded-r-lg ${isActive
          ? 'text-[#b91c1c] font-semibold bg-red-50/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
        }`
      }
      style={{ paddingLeft: `${level * 1.25 + 1.25}rem` }}
    >
      {({ isActive }) => (
        <>
          {item.icon && <item.icon size={18} className={`mr-2.5 shrink-0 ${isActive ? 'text-[#b91c1c]' : 'text-gray-400'}`} />}
          <span className="flex-1 leading-tight">{item.label}</span>
        </>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  return (
    <aside className="w-[280px] bg-white flex flex-col border-r border-gray-200 shrink-0 h-screen sticky top-0 z-20 print:hidden">
      <div className="h-16 flex items-center px-5 border-b border-gray-200">
        <img src="/faasa-logo.png" alt="FAASA Logo" className="w-10 h-10 object-contain mr-3 shrink-0" />
        <h1 className="text-[14px] font-bold text-gray-900 flex-1 font-sans tracking-tight leading-tight">
          Accounting &<br />Auditing Hub
        </h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors shrink-0">
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-0">
        {navItems.map((item) => (
          <MenuItem key={item.id} item={item} />
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200 flex items-center justify-between font-sans">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#b91c1c] rounded-full"></div>
          <span className="text-gray-600 text-xs font-medium">Thực hành kế toán</span>
        </div>
        <div className="text-gray-400 text-xs">v1.0</div>
      </div>
    </aside>
  );
}
