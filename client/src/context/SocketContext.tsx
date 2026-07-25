import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'alert';
}

interface SocketContextType {
  socket: Socket | null;
  toasts: Toast[];
  removeToast: (id: string) => void;
  unreadCount: number;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const addToast = (title: string, message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 6000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (!user) {
      if (socket) socket.disconnect();
      return;
    }

    const socketInstance = io(window.location.origin, {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('[Socket] Connected to server');
      socketInstance.emit('join', { userId: user.id, role: user.role });
    });

    socketInstance.on('notification:new', (data: any) => {
      addToast(data.title || 'New Notification', data.message || '', 'info');
      setUnreadCount((prev) => prev + 1);
    });

    socketInstance.on('leave:approved', (data: any) => {
      addToast('Leave Approved! 🎉', `Your leave request for ${data.fromDate} has been approved.`, 'success');
      setUnreadCount((prev) => prev + 1);
    });

    socketInstance.on('leave:rejected', (data: any) => {
      addToast('Leave Request Update', `Your leave request for ${data.fromDate} was not approved.`, 'warning');
      setUnreadCount((prev) => prev + 1);
    });

    socketInstance.on('shift-swap:updated', (data: any) => {
      addToast('Shift Swap Update', `Status: ${data.status} for shift on ${data.requestedDate}.`, 'info');
      setUnreadCount((prev) => prev + 1);
    });

    socketInstance.on('emergency:alert', (data: any) => {
      addToast(`🚨 ${data.title}`, data.message, 'alert');
      setUnreadCount((prev) => prev + 1);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        toasts,
        removeToast,
        unreadCount,
        setUnreadCount,
      }}
    >
      {children}
      {/* Real-time Toast Overlay Container */}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start justify-between gap-3 animate-in slide-in-from-right transition-all duration-300 ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-700'
                : toast.type === 'alert'
                ? 'bg-rose-600 text-white border-rose-700'
                : toast.type === 'warning'
                ? 'bg-amber-500 text-white border-amber-600'
                : 'bg-[#5142C5] text-white border-[#3D2DA8]'
            }`}
          >
            <div>
              <h4 className="font-bold text-sm">{toast.title}</h4>
              <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white opacity-70 hover:opacity-100 text-xs font-bold px-1.5 py-0.5 rounded"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
