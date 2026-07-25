import React, { useState } from 'react';
import { Bell, Search, Menu, Stethoscope, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { useNavigate } from 'react-router-dom';

interface TopbarProps {
  title?: string;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ title = 'NurseFlow Dashboard', onToggleSidebar }) => {
  const { user, isAdmin } = useAuth();
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const notificationsPath = isAdmin ? '/notifications' : '/nurse/notifications';
  const profilePath = isAdmin ? '/profile' : '/nurse/profile';

  return (
    <header className="bg-white border-b border-[#E7E7F0] px-4 md:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-[#707080] hover:bg-[#F7F7FB] hover:text-[#5142C5] hidden md:block"
        >
          <Menu size={20} />
        </button>
        <div className="md:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#5142C5] flex items-center justify-center text-white">
            <Stethoscope size={18} />
          </div>
          <span className="font-extrabold text-[#5142C5] text-base">NurseFlow</span>
        </div>
        <h2 className="hidden md:block text-xl font-bold text-[#16162A] tracking-tight">{title}</h2>
      </div>

      {/* Center Search Bar */}
      <div className="hidden lg:flex items-center relative w-72">
        <Search size={18} className="absolute left-3 text-[#707080]" />
        <input
          type="text"
          placeholder="Search nurse, shift, roster..."
          className="w-full bg-[#F7F7FB] border border-[#E7E7F0] rounded-button pl-9 pr-4 py-2 text-xs text-[#16162A] focus:outline-none focus:border-[#5142C5] transition-all"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Icon */}
        <button
          onClick={() => navigate(notificationsPath)}
          className="relative p-2.5 rounded-xl text-[#707080] hover:bg-[#EDE9FE]/50 hover:text-[#5142C5] transition-all"
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EF5350] text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Summary */}
        {user && (
          <div
            onClick={() => navigate(profilePath)}
            className="flex items-center gap-3 cursor-pointer p-1.5 rounded-xl hover:bg-[#F7F7FB] transition-colors"
          >
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border-2 border-[#EDE9FE]"
            />
            <div className="hidden sm:block text-left">
              <h4 className="text-xs font-bold text-[#16162A]">{user.name}</h4>
              <p className="text-[10px] text-[#707080] font-medium">{user.role}</p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
