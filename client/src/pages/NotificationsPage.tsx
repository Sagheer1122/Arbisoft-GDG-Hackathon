import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Bell, CheckCheck, Clock, AlertTriangle, Calendar, FileText, Repeat } from 'lucide-react';
import { api } from '../services/api';
import { Notification } from '../types';
import { useSocket } from '../context/SocketContext';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadCount } = useSocket();

  const fetchNotifs = async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      setNotifications(data);
      const unread = data.filter((n: any) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifs();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'ALERT':
        return <AlertTriangle size={20} className="text-rose-600" />;
      case 'SHIFTS':
        return <Clock size={20} className="text-[#5142C5]" />;
      case 'ROSTER':
        return <Calendar size={20} className="text-[#5142C5]" />;
      case 'LEAVE':
        return <FileText size={20} className="text-emerald-600" />;
      case 'SWAP':
        return <Repeat size={20} className="text-blue-600" />;
      default:
        return <Bell size={20} className="text-[#5142C5]" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">Notification Feed</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Real-time shift alerts, approval updates, and emergency broadcasts
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllRead}
          icon={<CheckCheck size={16} />}
          className="font-bold"
        >
          Mark All as Read
        </Button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-8 text-center text-xs text-[#707080]">
            No notifications in your feed.
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.id}
              className={`p-4 transition-all flex items-start justify-between gap-4 ${
                !notif.isRead ? 'border-l-4 border-l-[#5142C5] bg-[#EDE9FE]/10' : 'opacity-85'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-3 rounded-2xl bg-[#EDE9FE] shrink-0 mt-0.5">
                  {getIconForType(notif.type)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-[#16162A]">{notif.title}</h3>
                    {!notif.isRead && (
                      <span className="w-2 h-2 rounded-full bg-[#5142C5] inline-block" />
                    )}
                  </div>
                  <p className="text-xs text-[#707080] leading-relaxed">{notif.message}</p>
                  <p className="text-[10px] text-[#9E9EAE] font-semibold">
                    {new Date(notif.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              {!notif.isRead && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="text-xs font-bold text-[#5142C5] hover:underline shrink-0"
                >
                  Mark Read
                </button>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
