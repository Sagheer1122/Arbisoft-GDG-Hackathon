import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  FileText,
  Bell,
  BarChart3,
  User,
  Users,
  PlusCircle,
  LogOut,
  Stethoscope,
  HeartHandshake,
  Gamepad2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed = false }) => {
  const { user, isAdmin, logout } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();

  const nurseLinks = [
    { label: 'Dashboard', path: '/nurse/dashboard', icon: LayoutDashboard },
    { label: 'My Roster', path: '/nurse/roster', icon: CalendarDays },
    { label: 'Requests', path: '/nurse/requests', icon: FileText },
    { label: 'Notifications', path: '/nurse/notifications', icon: Bell, badge: unreadCount },
    { label: 'Communication Simulator', path: '/nurse/communication-simulator', icon: HeartHandshake },
    { label: 'Tick & Cross Game', path: '/nurse/break-games/tic-tac-toe', icon: Gamepad2 },
    { label: 'Profile', path: '/nurse/profile', icon: User },
  ];

  const adminLinks = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Create Roster', path: '/admin/roster/create', icon: PlusCircle },
    { label: 'Pending Requests', path: '/admin/requests', icon: FileText },
    { label: 'Staff Directory', path: '/admin/staff', icon: Users },
    { label: 'Duty Reports', path: '/admin/reports', icon: BarChart3 },
    { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Communication Simulator', path: '/nurse/communication-simulator', icon: HeartHandshake },
    { label: 'Tick & Cross Game', path: '/nurse/break-games/tic-tac-toe', icon: Gamepad2 },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const links = isAdmin ? adminLinks : nurseLinks;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden md:flex flex-col bg-white border-r border-[#E7E7F0] h-screen sticky top-0 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#E7E7F0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5142C5] to-[#3D2DA8] flex items-center justify-center text-white shadow-nurse-sm">
            <Stethoscope size={22} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-extrabold text-lg text-[#5142C5] tracking-tight">NurseFlow</h1>
              <p className="text-[10px] text-[#707080] font-medium uppercase tracking-wider">
                Smart Roster
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5142C5] text-white shadow-nurse-sm'
                    : 'text-[#707080] hover:bg-[#EDE9FE]/50 hover:text-[#5142C5]'
                }`
              }
            >
              <Icon size={20} />
              {!collapsed && <span>{link.label}</span>}
              {!collapsed && link.badge && link.badge > 0 ? (
                <span className="ml-auto bg-[#EF5350] text-white text-xs px-2 py-0.5 rounded-full font-bold">
                  {link.badge}
                </span>
              ) : null}
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Profile / Logout Footer */}
      <div className="p-3 border-t border-[#E7E7F0]">
        {user && !collapsed && (
          <div className="mb-2 p-2.5 rounded-xl bg-[#F7F7FB] flex items-center gap-3">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-[#EDE9FE]"
            />
            <div className="overflow-hidden">
              <h4 className="text-xs font-bold text-[#16162A] truncate">{user.name}</h4>
              <p className="text-[10px] text-[#707080] capitalize font-medium">{user.role}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#EF5350] hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};
