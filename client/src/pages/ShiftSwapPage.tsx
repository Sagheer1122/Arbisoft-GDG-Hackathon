import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Clock, MapPin, Repeat, ArrowLeft, CheckCircle, AlertCircle, Search } from 'lucide-react';
import { api } from '../services/api';
import { User, Shift } from '../types';
import { useAuth } from '../context/AuthContext';

export const ShiftSwapPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [nurses, setNurses] = useState<User[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [targetNurseId, setTargetNurseId] = useState('');
  const [originalShiftId, setOriginalShiftId] = useState('');
  const [requestedDate, setRequestedDate] = useState('2025-05-15');
  const [reason, setReason] = useState('');
  const [searchNurseQuery, setSearchNurseQuery] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const users = await api.getUsers({ role: 'NURSE' });
        // Filter out current user
        setNurses(users.filter((u: any) => u.id !== user?.id));

        const shiftList = await api.getShifts();
        setShifts(shiftList);
        if (shiftList.length > 0) {
          setOriginalShiftId(shiftList[0].id);
        }
      } catch (err) {
        console.error('Error loading swap options:', err);
      }
    };
    loadFormData();
  }, [user?.id]);

  const filteredNurses = nurses.filter((n) =>
    n.name.toLowerCase().includes(searchNurseQuery.toLowerCase()) ||
    n.employeeId.toLowerCase().includes(searchNurseQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNurseId || !originalShiftId || !requestedDate || !reason) {
      setError('Please select a nurse, date, shift, and reason.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await api.createShiftSwap({
        targetNurseId,
        originalShiftId,
        requestedDate,
        reason,
      });

      setSuccessMsg('Shift swap request sent successfully! Redirecting...');
      setTimeout(() => {
        navigate('/nurse/requests');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit shift swap request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/nurse/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5142C5] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#16162A]">Shift Swap Request</h1>
        <p className="text-xs text-[#707080] font-medium mt-1">
          Request to exchange assigned shift with a qualified colleague
        </p>
      </div>

      {/* Current Shift Banner */}
      <Card gradient className="p-6">
        <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 text-white px-3 py-1 rounded-full backdrop-blur-md">
          Current Assigned Shift to Swap
        </span>
        <div className="mt-3 space-y-2">
          <h2 className="text-2xl font-black text-white">Night Shift</h2>
          <div className="flex flex-wrap items-center gap-4 text-purple-100 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <Clock size={16} />
              <span>11:00 PM – 7:00 AM (15 May 2025)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={16} />
              <span>General Ward</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Form Card */}
      <Card className="p-6 md:p-8 space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Search Nurse Field */}
          <div className="space-y-2">
            <Input
              label="Search Target Nurse"
              placeholder="Search nurse name or ID (e.g. Emily, NUR-102)..."
              value={searchNurseQuery}
              onChange={(e) => setSearchNurseQuery(e.target.value)}
              icon={<Search size={18} />}
            />

            {/* Nurse Selection Grid */}
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider mt-2">
              Select Nurse to Swap With
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
              {filteredNurses.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setTargetNurseId(n.id)}
                  className={`p-3 rounded-2xl border flex items-center gap-3 cursor-pointer transition-all ${
                    targetNurseId === n.id
                      ? 'border-[#5142C5] bg-[#EDE9FE] ring-2 ring-[#5142C5]/30'
                      : 'border-[#E7E7F0] bg-white hover:border-[#5142C5]'
                  }`}
                >
                  <img
                    src={n.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                    alt={n.name}
                    className="w-8 h-8 rounded-full object-cover border"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#16162A]">{n.name}</h4>
                    <p className="text-[10px] text-[#707080]">{n.employeeId}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shift Date"
              type="date"
              value={requestedDate}
              onChange={(e) => setRequestedDate(e.target.value)}
              required
            />

            <Select
              label="Shift Type"
              value={originalShiftId}
              onChange={(e) => setOriginalShiftId(e.target.value)}
              options={
                shifts.map((s) => ({ value: s.id, label: `${s.name} (${s.startTime})` }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider">
              Reason for Shift Swap
            </label>
            <textarea
              className="w-full bg-white border border-[#E7E7F0] rounded-button p-3.5 text-xs text-[#16162A] focus:outline-none focus:border-[#5142C5] transition-all min-h-[90px]"
              placeholder="State reason for swap (e.g., conflicting medical training or personal schedule)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <Button
              variant="outline"
              type="button"
              className="w-full font-bold"
              onClick={() => navigate('/nurse/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} icon={<Repeat size={18} />} className="w-full font-bold">
              Send Swap Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
