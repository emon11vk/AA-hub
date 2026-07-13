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
      { id: 'nhan-vien', label: 'Nhân viên', path: '/organization/employees' },
      { id: 'nha-cung-cap', label: 'Nhà Cung cấp', path: '/organization/suppliers' },
      { id: 'khach-hang', label: 'Khách Hàng', path: '/organization/customers' },
      { id: 'ngan-hang', label: 'Ngân Hàng', path: '/organization/banks' },
      { id: 'he-thong-tai-khoan', label: 'Sổ chi tiết', path: '/organization/accounts' },
    ],
  },
  {
    id: 'nghiep-vu-tien',
    label: 'Nghiệp vụ',
    icon: DollarSign,
    children: [
      { id: 'danh-sach-chung-tu', label: 'Tiền', path: '/vouchers' },
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

const MenuItem = ({ 
  item, 
  level = 0, 
  isCollapsed, 
  onExpand,
  isOpen,
  onToggle
}: { 
  item: NavItem; 
  level?: number; 
  isCollapsed?: boolean; 
  onExpand?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
}) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const location = useLocation();

  const hasChildren = item.children && item.children.length > 0;

  const isChildActive = (children: NavItem[]): boolean => {
    return children.some(child =>
      (child.path && location.pathname.startsWith(child.path)) ||
      (child.children && isChildActive(child.children))
    );
  };

  const isParentActive = (item.path && location.pathname.startsWith(item.path)) || (hasChildren && isChildActive(item.children!));

  const actualIsOpen = isOpen !== undefined ? isOpen : localIsOpen;

  useEffect(() => {
    if (isCollapsed) {
      if (isOpen === undefined) setLocalIsOpen(false);
    } else if (isParentActive && hasChildren && isOpen === undefined) {
      setLocalIsOpen(true);
    }
  }, [isParentActive, hasChildren, isCollapsed, isOpen]);

  const handleToggle = () => {
    if (isCollapsed && onExpand) {
      onExpand();
      if (onToggle) {
        if (!actualIsOpen) onToggle(); // only toggle if it's not open, since we're expanding the sidebar
      } else {
        setLocalIsOpen(true);
      }
      return;
    }
    if (onToggle) {
      onToggle();
    } else {
      setLocalIsOpen(!actualIsOpen);
    }
  };

  if (hasChildren) {
    return (
      <div className="mb-0.5">
        <button
          onClick={handleToggle}
          className={`w-full flex items-center py-2 font-sans transition-colors focus:outline-none ${isParentActive
              ? 'text-gray-900 font-semibold'
              : 'text-gray-700 hover:bg-gray-50 font-medium'
            } ${isCollapsed ? 'justify-center pr-0' : 'pr-4'}`}
          style={{ paddingLeft: isCollapsed ? '0' : `${level * 1.25 + 1.25}rem` }}
          title={isCollapsed ? item.label : undefined}
        >
          {item.icon && <item.icon size={18} className={`shrink-0 ${isParentActive ? 'text-[#b91c1c]' : 'text-gray-400'} ${isCollapsed ? 'm-0' : 'mr-2.5'}`} />}
          {!isCollapsed && (
            <>
              <span className="flex-1 text-left text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>
              <ChevronRight
                size={16}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ease-in-out ${actualIsOpen ? 'rotate-90' : ''}`}
              />
            </>
          )}
        </button>
        <div
          className={`grid transition-all duration-200 ease-in-out ${actualIsOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col pb-1">
              {item.children!.map((child) => (
                <MenuItem key={child.id} item={child} level={level + 1} isCollapsed={isCollapsed} onExpand={onExpand} />
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
        `flex items-center py-2 mb-0.5 font-sans text-[14px] transition-colors focus:outline-none ${isActive
          ? 'text-[#b91c1c] font-semibold bg-red-50/50'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium'
        } ${isCollapsed ? 'justify-center pr-0 mx-2 rounded-lg' : 'pr-4 rounded-r-lg'}`
      }
      style={{ paddingLeft: isCollapsed ? '0' : `${level * 1.25 + 1.25}rem` }}
      title={isCollapsed ? item.label : undefined}
    >
      {({ isActive }) => (
        <>
          {item.icon && <item.icon size={18} className={`shrink-0 ${isActive ? 'text-[#b91c1c]' : 'text-gray-400'} ${isCollapsed ? 'm-0' : 'mr-2.5'}`} />}
          {isCollapsed && !item.icon && <div className={`w-2 h-2 rounded-full shrink-0 m-0 ${isActive ? 'bg-[#b91c1c]' : 'bg-gray-300'}`} />} 
          {!isCollapsed && <span className="flex-1 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{item.label}</span>}
        </>
      )}
    </NavLink>
  );
};

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const [expandedId, setExpandedId] = useState<string | null>(() => {
    const active = navItems.find(item => {
       const checkActive = (children: NavItem[]): boolean => children.some(c => (c.path && location.pathname.startsWith(c.path)) || (c.children && checkActive(c.children)));
       return (item.path && location.pathname.startsWith(item.path)) || (item.children && checkActive(item.children));
    });
    return active ? active.id : null;
  });

  useEffect(() => {
    const active = navItems.find(item => {
       const checkActive = (children: NavItem[]): boolean => children.some(c => (c.path && location.pathname.startsWith(c.path)) || (c.children && checkActive(c.children)));
       return (item.path && location.pathname.startsWith(item.path)) || (item.children && checkActive(item.children));
    });
    if (active) {
      setExpandedId(active.id);
    }
  }, [location.pathname]);

  return (
    <aside className={`bg-white flex flex-col border-r border-gray-200 shrink-0 h-screen sticky top-0 z-20 print:hidden transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[72px]' : 'w-[280px]'}`}>
      <div className={`h-20 flex items-center border-b border-gray-200 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-5'}`}>
        {!isCollapsed && <img src="/faasa-logo-white.png" alt="FAASA Logo" className="w-10 h-10 object-contain mr-3 shrink-0" />}
        {!isCollapsed && (
          <h1 className="text-[14px] font-bold text-gray-900 flex-1 font-sans tracking-tight leading-tight whitespace-nowrap overflow-hidden">
            Accounting &<br />Auditing Hub
          </h1>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 transition-colors shrink-0"
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
        >
          <Menu size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-0 overflow-x-hidden">
        {navItems.map((item) => (
          <MenuItem 
            key={item.id} 
            item={item} 
            isCollapsed={isCollapsed} 
            onExpand={() => setIsCollapsed(false)} 
            isOpen={expandedId === item.id}
            onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
          />
        ))}
      </nav>

      <div className={`p-4 border-t border-gray-200 flex items-center font-sans transition-all duration-300 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-2'}`}>
          <div className="w-2 h-2 bg-[#b91c1c] rounded-full shrink-0" title="Thực hành kế toán"></div>
          {!isCollapsed && <span className="text-gray-600 text-xs font-medium whitespace-nowrap">Thực hành kế toán</span>}
        </div>
        {!isCollapsed && <div className="text-gray-400 text-xs whitespace-nowrap">v1.0</div>}
      </div>
    </aside>
  );
}
