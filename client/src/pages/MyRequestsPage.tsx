import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { FileText, Repeat, Calendar, Clock, PlusCircle } from 'lucide-react';
import { api } from '../services/api';
import { LeaveRequest, ShiftSwapRequest } from '../types';
import { useNavigate } from 'react-router-dom';

export const MyRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'leave' | 'swap'>('leave');
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [swapRequests, setSwapRequests] = useState<ShiftSwapRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const leaves = await api.getLeaveRequests();
        setLeaveRequests(leaves);

        const swaps = await api.getShiftSwaps();
        setSwapRequests(swaps);
      } catch (err) {
        console.error('Error fetching requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">My Submitted Requests</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Track leave status and shift swap applications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={() => navigate(activeTab === 'leave' ? '/nurse/leave-request' : '/nurse/shift-swap')}
            icon={<PlusCircle size={16} />}
            className="font-bold"
          >
            New {activeTab === 'leave' ? 'Leave Request' : 'Swap Request'}
          </Button>
        </div>
      </div>

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
          Shift Swap Requests ({swapRequests.length})
        </button>
      </div>

      {/* Requests List Grid */}
      {activeTab === 'leave' ? (
        <div className="grid md:grid-cols-2 gap-4">
          {leaveRequests.length === 0 ? (
            <Card className="col-span-2 p-8 text-center text-xs text-[#707080]">
              No leave requests submitted yet.
            </Card>
          ) : (
            leaveRequests.map((req) => (
              <Card key={req.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#16162A]">{req.leaveType}</h3>
                    <p className="text-[11px] text-[#707080] mt-0.5">
                      Submitted on {new Date(req.createdAt).toLocaleDateString()}
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

                <div className="space-y-1.5 text-xs text-[#707080]">
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

                {req.reviewedBy && (
                  <div className="p-2.5 bg-[#F7F7FB] rounded-xl text-[11px] text-[#707080]">
                    Reviewed by Head Nurse / Admin on {new Date(req.reviewedAt || Date.now()).toLocaleDateString()}
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
              No shift swap requests submitted yet.
            </Card>
          ) : (
            swapRequests.map((swap) => (
              <Card key={swap.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-3">
                  <div>
                    <h3 className="font-extrabold text-sm text-[#16162A]">
                      Shift Swap with {swap.targetNurse?.name || 'Teammate'}
                    </h3>
                    <p className="text-[11px] text-[#707080] mt-0.5">Date: {swap.requestedDate}</p>
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
                      Original Shift: {swap.originalShift?.name || 'Night Shift'} ({swap.originalShift?.startTime})
                    </span>
                  </div>
                  <p className="pt-1">
                    <span className="font-bold text-[#16162A]">Reason:</span> {swap.reason}
                  </p>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
