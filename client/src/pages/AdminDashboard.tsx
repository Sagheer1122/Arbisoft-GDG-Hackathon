import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import {
  Users,
  UserCheck,
  UserX,
  FileText,
  Repeat,
  PlusCircle,
  AlertTriangle,
  BarChart3,
  ArrowRight,
  Send,
  CheckCircle,
} from 'lucide-react';
import { api } from '../services/api';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalNurses: 25,
    onDuty: 18,
    onLeave: 4,
    offDuty: 3,
    pendingLeaves: 3,
    pendingSwaps: 2,
  });

  const [recentRosters, setRecentRosters] = useState<any[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSentMsg, setAlertSentMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const todayStr = new Date().toISOString().split('T')[0];
        const rosters = await api.getRosters({ date: todayStr });
        setRecentRosters(rosters);

        const leaves = await api.getLeaveRequests({ status: 'PENDING' });
        const swaps = await api.getShiftSwaps({ status: 'PENDING' });

        setStats((prev) => ({
          ...prev,
          pendingLeaves: leaves.length,
          pendingSwaps: swaps.length,
        }));
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      }
    };

    fetchData();
  }, []);

  const handleSendAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertTitle || !alertMessage) return;
    try {
      await api.sendEmergencyAlert(alertTitle, alertMessage);
      setAlertSentMsg('Emergency alert dispatched to all staff in real time!');
      setTimeout(() => {
        setShowAlertModal(false);
        setAlertSentMsg('');
        setAlertTitle('');
        setAlertMessage('');
      }, 1500);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">Admin Dashboard</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Hospital Workforce Overview & Real-Time Roster Control
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => navigate('/admin/roster/create')}
            icon={<PlusCircle size={18} />}
            className="font-bold"
          >
            Create Roster
          </Button>
          <Button
            variant="danger"
            onClick={() => setShowAlertModal(true)}
            icon={<AlertTriangle size={18} />}
            className="font-bold"
          >
            Send Alert
          </Button>
        </div>
      </div>

      {/* Summary Metric Cards (4 Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Nurses"
          value={stats.totalNurses}
          description="Registered Staff"
          icon={<Users size={24} />}
          color="purple"
        />
        <StatCard
          title="Today on Duty"
          value={stats.onDuty}
          description="Active Shifts"
          icon={<UserCheck size={24} />}
          color="green"
        />
        <StatCard
          title="On Leave"
          value={stats.onLeave}
          description="Approved Absence"
          icon={<UserX size={24} />}
          color="amber"
        />
        <StatCard
          title="Off Duty"
          value={stats.offDuty}
          description="Scheduled Rest"
          icon={<Users size={24} />}
          color="blue"
        />
      </div>

      {/* Quick Actions & Pending Requests Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions Column */}
        <div className="space-y-6">
          <Card className="p-5 space-y-4">
            <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
              Quick Management Actions
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/admin/roster/create')}
                className="p-4 rounded-2xl bg-[#EDE9FE] text-[#5142C5] hover:bg-[#5142C5] hover:text-white transition-all flex flex-col items-center gap-2 text-center group"
              >
                <PlusCircle size={24} />
                <span className="text-xs font-bold">Create Roster</span>
              </button>
              <button
                onClick={() => setShowAlertModal(true)}
                className="p-4 rounded-2xl bg-rose-100 text-rose-700 hover:bg-rose-600 hover:text-white transition-all flex flex-col items-center gap-2 text-center group"
              >
                <AlertTriangle size={24} />
                <span className="text-xs font-bold">Send Alert</span>
              </button>
              <button
                onClick={() => navigate('/admin/reports')}
                className="p-4 rounded-2xl bg-emerald-100 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-all flex flex-col items-center gap-2 text-center group"
              >
                <BarChart3 size={24} />
                <span className="text-xs font-bold">Duty Report</span>
              </button>
              <button
                onClick={() => navigate('/admin/staff')}
                className="p-4 rounded-2xl bg-blue-100 text-blue-800 hover:bg-blue-600 hover:text-white transition-all flex flex-col items-center gap-2 text-center group"
              >
                <Users size={24} />
                <span className="text-xs font-bold">Manage Staff</span>
              </button>
            </div>
          </Card>

          {/* Pending Approval Badge Box */}
          <Card className="p-5 space-y-4 bg-gradient-to-br from-[#5142C5] to-[#3D2DA8] text-white">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-purple-200">
                Action Required
              </h3>
              <span className="text-xs bg-amber-400 text-black px-2.5 py-0.5 rounded-full font-extrabold">
                {stats.pendingLeaves + stats.pendingSwaps} Pending
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <FileText size={18} className="text-amber-300" />
                  <span>Leave Requests</span>
                </div>
                <span className="text-sm font-extrabold">{stats.pendingLeaves}</span>
              </div>
              <div className="flex items-center justify-between bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Repeat size={18} className="text-blue-300" />
                  <span>Shift Swap Requests</span>
                </div>
                <span className="text-sm font-extrabold">{stats.pendingSwaps}</span>
              </div>
            </div>

            <Button
              className="w-full bg-white text-[#5142C5] hover:bg-purple-50 font-bold"
              onClick={() => navigate('/admin/requests')}
              icon={<ArrowRight size={18} />}
            >
              Review Pending Requests
            </Button>
          </Card>
        </div>

        {/* Today's Active Hospital Roster Grid */}
        <div className="lg:col-span-2">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-4">
              <div>
                <h3 className="text-base font-extrabold text-[#16162A]">Today's Active Roster</h3>
                <p className="text-xs text-[#707080]">Real-time shift assignments across all departments</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/staff')}
              >
                View Staff Matrix
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E7E7F0] text-[#707080] font-bold uppercase tracking-wider">
                    <th className="py-3 px-2">Nurse</th>
                    <th className="py-3 px-2">Department</th>
                    <th className="py-3 px-2">Shift</th>
                    <th className="py-3 px-2">Time</th>
                    <th className="py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E7F0]">
                  {recentRosters.map((item) => (
                    <tr key={item.id} className="hover:bg-[#F7F7FB]">
                      <td className="py-3.5 px-2 flex items-center gap-2.5">
                        <img
                          src={item.nurse?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                          alt={item.nurse?.name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <span className="font-bold text-[#16162A] block">{item.nurse?.name}</span>
                          <span className="text-[10px] text-[#707080]">{item.nurse?.employeeId}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-medium text-[#707080]">
                        {item.department?.name}
                      </td>
                      <td className="py-3.5 px-2">
                        <Badge
                          variant={
                            item.shift?.type === 'MORNING'
                              ? 'morning'
                              : item.shift?.type === 'EVENING'
                              ? 'evening'
                              : item.shift?.type === 'NIGHT'
                              ? 'night'
                              : 'off'
                          }
                        >
                          {item.shift?.name}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-2 text-[#707080] font-medium">
                        {item.shift?.startTime} - {item.shift?.endTime}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                          ● On Duty
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Emergency Alert Modal */}
      <Modal
        isOpen={showAlertModal}
        onClose={() => setShowAlertModal(false)}
        title="Send Hospital Emergency Alert"
      >
        <form onSubmit={handleSendAlert} className="space-y-4">
          <p className="text-xs text-[#707080]">
            This alert will trigger immediate real-time notifications to all on-duty and off-duty nurses across departments.
          </p>

          {alertSentMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{alertSentMsg}</span>
            </div>
          )}

          <Input
            label="Alert Title"
            placeholder="Emergency Meeting / Staff Callout"
            value={alertTitle}
            onChange={(e) => setAlertTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider">
              Alert Message
            </label>
            <textarea
              className="w-full bg-white border border-[#E7E7F0] rounded-button p-3 text-xs text-[#16162A] focus:outline-none focus:border-[#5142C5] transition-all min-h-[90px]"
              placeholder="All available general ward nurses please report to ER floor 2 immediately..."
              value={alertMessage}
              onChange={(e) => setAlertMessage(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAlertModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="danger" icon={<Send size={16} />}>
              Broadcast Alert
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
