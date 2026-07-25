import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, FileText, Bell, User, HeartHandshake, Gamepad2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';

export const MobileBottomNav: React.FC = () => {
  const { isAdmin } = useAuth();
  const { unreadCount } = useSocket();

  const nurseTabs = [
    { label: 'Dashboard', path: '/nurse/dashboard', icon: LayoutDashboard },
    { label: 'Roster', path: '/nurse/roster', icon: CalendarDays },
    { label: 'Simulator', path: '/nurse/communication-simulator', icon: HeartHandshake },
    { label: 'Game', path: '/nurse/break-games/tic-tac-toe', icon: Gamepad2 },
    { label: 'Requests', path: '/nurse/requests', icon: FileText },
    { label: 'Alerts', path: '/nurse/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/nurse/profile', icon: User },
  ];

  const adminTabs = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Create', path: '/admin/roster/create', icon: CalendarDays },
    { label: 'Requests', path: '/admin/requests', icon: FileText },
    { label: 'Alerts', path: '/notifications', icon: Bell, badge: unreadCount },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const tabs = isAdmin ? adminTabs : nurseTabs;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E7E7F0] z-40 px-2 py-1.5 flex items-center justify-around shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center py-1 px-3 rounded-xl transition-all relative ${
                isActive ? 'text-[#5142C5] font-bold scale-105' : 'text-[#707080] font-medium'
              }`
            }
          >
            <div className="relative">
              <Icon size={20} />
              {tab.badge && tab.badge > 0 ? (
                <span className="absolute -top-1 -right-2 bg-[#EF5350] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {tab.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1">{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};
