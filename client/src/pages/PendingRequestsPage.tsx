import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { FileText, Repeat, Check, X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { LeaveRequest, ShiftSwapRequest } from '../types';

export const PendingRequestsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'leave' | 'swap'>('leave');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const leaves = await api.getLeaveRequests();
      setLeaveRequests(leaves);

      const swaps = await api.getShiftSwaps();
      setSwapRequests(swaps);
    } catch (err) {
      console.error('Error fetching admin requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApproveLeave = async (id: string, nurseName: string) => {
    try {
      await api.approveLeaveRequest(id);
      setActionMsg(`Leave request for ${nurseName} approved! Real-time socket alert sent.`);
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRejectLeave = async (id: string, nurseName: string) => {
    try {
      await api.rejectLeaveRequest(id);
      setActionMsg(`Leave request for ${nurseName} rejected.`);
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleApproveSwap = async (id: string, nurseName: string) => {
    try {
      await api.approveShiftSwap(id);
      setActionMsg(`Shift swap for ${nurseName} approved! Real-time notification sent.`);
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleRejectSwap = async (id: string, nurseName: string) => {
    try {
      await api.rejectShiftSwap(id);
      setActionMsg(`Shift swap for ${nurseName} rejected.`);
      fetchRequests();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#16162A]">Pending Request Approvals</h1>
        <p className="text-xs text-[#707080] font-medium mt-0.5">
          Review and approve or reject nurse leave applications and shift swaps
        </p>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E7E7F0] pb-2">
        <button
          onClick={() => setActiveTab('leave')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'leave'
              ? 'bg-[#5142C5] text-white shadow-nurse-sm'
              : 'text-[#707080] hover:bg-[#EDE9FE]/50'
          }`}
        >
          <FileText size={16} />
          Leave Requests ({leaveRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('swap')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'swap'
              ? 'bg-[#5142C5] text-white shadow-nurse-sm'
              : 'text-[#707080] hover:bg-[#EDE9FE]/50'
          }`}
        >
          <Repeat size={16} />
          Shift Swaps ({swapRequests.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'leave' ? (
        <div className="grid md:grid-cols-2 gap-4">
          {leaveRequests.length === 0 ? (
            <Card className="col-span-2 p-8 text-center text-xs text-[#707080]">
              No pending leave requests at this time.
            </Card>
          ) : (
            leaveRequests.map((req) => (
              <Card key={req.id} className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.nurse?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                      alt={req.nurse?.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-[#16162A]">{req.nurse?.name}</h3>
                      <p className="text-[11px] text-[#707080]">{req.nurse?.employeeId}</p>
                    </div>
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

                <div className="space-y-1.5 text-xs text-[#707080]">
                  <p className="font-bold text-[#16162A]">Type: {req.leaveType}</p>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#5142C5]" />
                    <span className="font-semibold text-[#16162A]">
                      {req.fromDate} – {req.toDate}
                    </span>
                  </div>
                  <p className="pt-1">
                    <span className="font-bold text-[#16162A]">Reason:</span> {req.reason}
                  </p>
                </div>

                {req.status === 'PENDING' && (
                  <div className="pt-2 flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full font-bold"
                      icon={<X size={16} />}
                      onClick={() => handleRejectLeave(req.id, req.nurse?.name || 'Nurse')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full font-bold"
                      icon={<Check size={16} />}
                      onClick={() => handleApproveLeave(req.id, req.nurse?.name || 'Nurse')}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {swapRequests.length === 0 ? (
            <Card className="col-span-2 p-8 text-center text-xs text-[#707080]">
              No pending shift swap requests.
            </Card>
          ) : (
            swapRequests.map((swap) => (
              <Card key={swap.id} className="p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={swap.requester?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                      alt={swap.requester?.name}
                      className="w-9 h-9 rounded-full object-cover border"
                    />
                    <div>
                      <h3 className="font-extrabold text-sm text-[#16162A]">
                        {swap.requester?.name} ⇄ {swap.targetNurse?.name}
                      </h3>
                      <p className="text-[11px] text-[#707080]">Date: {swap.requestedDate}</p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      swap.status === 'APPROVED'
                        ? 'approved'
                        : swap.status === 'REJECTED'
                        ? 'rejected'
                        : 'pending'
                    }
                  >
                    {swap.status}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-[#707080]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#5142C5]" />
                    <span className="font-semibold text-[#16162A]">
                      Original Shift: {swap.originalShift?.name || 'Night Shift'}
                    </span>
                  </div>
                  <p className="pt-1">
                    <span className="font-bold text-[#16162A]">Reason:</span> {swap.reason}
                  </p>
                </div>

                {swap.status === 'PENDING' && (
                  <div className="pt-2 flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-full font-bold"
                      icon={<X size={16} />}
                      onClick={() => handleRejectSwap(swap.id, swap.requester?.name || 'Nurse')}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="success"
                      size="sm"
                      className="w-full font-bold"
                      icon={<Check size={16} />}
                      onClick={() => handleApproveSwap(swap.id, swap.requester?.name || 'Nurse')}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
