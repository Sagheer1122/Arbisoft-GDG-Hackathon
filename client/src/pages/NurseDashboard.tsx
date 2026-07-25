import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { HeartbeatGraphic } from '../components/ui/HeartbeatGraphic';
import {
  CalendarDays,
  Clock,
  MapPin,
  FileText,
  Repeat,
  User,
  Bell,
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Roster, LeaveRequest, Notification } from '../types';

export const NurseDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [todayShift, setTodayShift] = useState<Roster | null>(null);
  const [upcomingRequests, setUpcomingRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const todayStr = new Date().toISOString().split('T')[0];

        // Fetch today's shift
        const rosters = await api.getRosters({ date: todayStr, nurseId: user?.id });
        if (rosters && rosters.length > 0) {
          setTodayShift(rosters[0]);
        }

        // Fetch requests
        const requests = await api.getLeaveRequests({ nurseId: user?.id });
        setUpcomingRequests(requests.slice(0, 3));

        // Fetch notifications
        const notifs = await api.getNotifications();
        setNotifications(notifs.slice(0, 3));
      } catch (err) {
        console.error('Error fetching nurse dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Greeting Header & Date Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">
            Hello, {user?.name.split(' ')[0] || 'Sarah'} 👋
          </h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Here's your schedule overview for today
          </p>
        </div>

        {/* Date Selector Pill */}
        <div className="flex items-center gap-3 bg-white border border-[#E7E7F0] rounded-button px-4 py-2 shadow-nurse-sm">
          <button className="text-[#707080] hover:text-[#5142C5]">
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-bold text-[#16162A]">12 – 18 May 2025</span>
          <button className="text-[#707080] hover:text-[#5142C5]">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Shift Card + Leave Balance + Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Shift Card (Gradient Purple Card from Design System) */}
          <Card gradient className="relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-8 -bottom-8 opacity-20 pointer-events-none">
              <HeartbeatGraphic color="#FFFFFF" className="w-64 h-32" />
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md">
                  Today's Shift
                </span>
                <Badge variant="approved">
                  {todayShift?.status === 'ON_DUTY' ? 'On Duty' : 'Scheduled'}
                </Badge>
              </div>

              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {todayShift?.shift?.name || 'Night Shift'}
                </h2>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-purple-100 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} />
                    <span>{todayShift?.shift?.startTime || '7:00 PM'} – {todayShift?.shift?.endTime || '7:00 AM'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={16} />
                    <span>{todayShift?.department?.name || 'General Ward'}</span>
                  </div>
                </div>
              </div>

              {todayShift?.notes && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 text-xs text-purple-100 border border-white/20">
                  <span className="font-bold text-white block mb-0.5">Shift Note:</span>
                  {todayShift.notes}
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate(todayShift ? `/nurse/shifts/${todayShift.id}` : '/nurse/roster')}
                  className="bg-white hover:bg-purple-50 text-[#5142C5] font-extrabold px-4 py-2.5 rounded-xl shadow-nurse-md transition-all duration-200 flex items-center gap-2 text-xs group cursor-pointer"
                >
                  <span>View Shift Details & Notes</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </Card>

          {/* Quick Actions Grid */}
          <div>
            <h3 className="text-sm font-bold text-[#16162A] uppercase tracking-wider mb-3">
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                onClick={() => navigate('/nurse/roster')}
                className="bg-white border border-[#E7E7F0] hover:border-[#5142C5] p-4 rounded-card flex flex-col items-center justify-center gap-2 shadow-nurse-sm hover:shadow-nurse-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#5142C5] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CalendarDays size={24} />
                </div>
                <span className="text-xs font-bold text-[#16162A] group-hover:text-[#5142C5]">
                  My Roster
                </span>
              </button>

              <button
                onClick={() => navigate('/nurse/leave-request')}
                className="bg-white border border-[#E7E7F0] hover:border-[#5142C5] p-4 rounded-card flex flex-col items-center justify-center gap-2 shadow-nurse-sm hover:shadow-nurse-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-bold text-[#16162A] group-hover:text-[#5142C5]">
                  Leave Request
                </span>
              </button>

              <button
                onClick={() => navigate('/nurse/shift-swap')}
                className="bg-white border border-[#E7E7F0] hover:border-[#5142C5] p-4 rounded-card flex flex-col items-center justify-center gap-2 shadow-nurse-sm hover:shadow-nurse-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Repeat size={24} />
                </div>
                <span className="text-xs font-bold text-[#16162A] group-hover:text-[#5142C5]">
                  Shift Swap
                </span>
              </button>

              <button
                onClick={() => navigate('/nurse/profile')}
                className="bg-white border border-[#E7E7F0] hover:border-[#5142C5] p-4 rounded-card flex flex-col items-center justify-center gap-2 shadow-nurse-sm hover:shadow-nurse-md transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User size={24} />
                </div>
                <span className="text-xs font-bold text-[#16162A] group-hover:text-[#5142C5]">
                  My Profile
                </span>
              </button>
            </div>
          </div>

          {/* Leave Balance Overview */}
          <Card className="p-5">
            <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider mb-4">
              Leave Balance Summary
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3.5 rounded-2xl bg-[#F7F7FB] border border-[#E7E7F0]">
                <p className="text-[11px] font-semibold text-[#707080]">Annual Leave</p>
                <p className="text-xl font-black text-[#5142C5] mt-1">14 Days</p>
                <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Available</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F7FB] border border-[#E7E7F0]">
                <p className="text-[11px] font-semibold text-[#707080]">Sick Leave</p>
                <p className="text-xl font-black text-amber-600 mt-1">8 Days</p>
                <p className="text-[10px] text-[#707080] font-semibold mt-0.5">Available</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-[#F7F7FB] border border-[#E7E7F0]">
                <p className="text-[11px] font-semibold text-[#707080]">Casual Leave</p>
                <p className="text-xl font-black text-[#16162A] mt-1">5 Days</p>
                <p className="text-[10px] text-[#707080] font-semibold mt-0.5">Available</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Col: Next Shift, Upcoming Requests & Notifications */}
        <div className="space-y-6">
          {/* Next Shift Card */}
          <Card className="p-5 border-l-4 border-l-[#5142C5]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
                Next Upcoming Shift
              </h3>
              <Badge variant="morning">Tomorrow</Badge>
            </div>
            <h4 className="text-lg font-bold text-[#16162A]">Morning Shift</h4>
            <div className="mt-2 space-y-1.5 text-xs text-[#707080]">
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-[#5142C5]" />
                <span>7:00 AM – 3:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-[#5142C5]" />
                <span>General Ward</span>
              </div>
            </div>
          </Card>

          {/* Upcoming Requests */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
                Recent Requests
              </h3>
              <button
                onClick={() => navigate('/nurse/requests')}
                className="text-xs font-bold text-[#5142C5] hover:underline"
              >
                View All
              </button>
            </div>

            {upcomingRequests.length === 0 ? (
              <p className="text-xs text-[#707080] text-center py-4">No recent requests submitted</p>
            ) : (
              <div className="space-y-3">
                {upcomingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-2xl bg-[#F7F7FB] border border-[#E7E7F0] flex items-center justify-between text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#16162A]">{req.leaveType}</h4>
                      <p className="text-[#707080] text-[11px]">
                        {req.fromDate} – {req.toDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        req.status === 'APPROVED'
                          ? 'approved'
                          : req.status === 'REJECTED'
                          ? 'rejected'
                          : 'pending'
                      }
                    >
                      {req.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Notifications Brief */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
                Notifications
              </h3>
              <button
                onClick={() => navigate('/nurse/notifications')}
                className="text-xs font-bold text-[#5142C5] hover:underline"
              >
                See Feed
              </button>
            </div>

            <div className="space-y-3">
              {notifications.map((notif) => (
                <div key={notif.id} className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-[#EDE9FE] text-[#5142C5] flex items-center justify-center shrink-0 mt-0.5">
                    <Bell size={16} />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#16162A]">{notif.title}</h5>
                    <p className="text-[#707080] text-[11px] line-clamp-2">{notif.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
