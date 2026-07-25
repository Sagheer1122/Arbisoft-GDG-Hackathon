import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import { api } from '../services/api';
import { Roster } from '../types';
import { useAuth } from '../context/AuthContext';

export const NurseRoster: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 4, 15)); // May 15, 2025 reference
  const [rosters, setRosters] = useState<Roster[]>([]);
  const [selectedShift, setSelectedShift] = useState<Roster | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRosterData = async () => {
      try {
        setLoading(true);
        const data = await api.getRosters();
        setRosters(data);
      } catch (err) {
        console.error('Failed to fetch roster calendar:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRosterData();
  }, []);

  // Generate Week Days (7 days centered around currentDate)
  const getWeekDays = () => {
    const days = [];
    const curr = new Date(currentDate);
    const first = curr.getDate() - curr.getDay(); // Sunday

    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(curr.setDate(first + i));
      days.push(nextDay);
    }
    return days;
  };

  const weekDays = getWeekDays();
  const todayStr = new Date().toISOString().split('T')[0];

  const handlePrev = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') next.setDate(next.getDate() - 7);
    else next.setMonth(next.getMonth() - 1);
    setCurrentDate(next);
  };

  const handleNext = () => {
    const next = new Date(currentDate);
    if (viewMode === 'week') next.setDate(next.getDate() + 7);
    else next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  // Helper to find shift on date for nurse
  const getShiftForDate = (dateObj: Date) => {
    const dateStr = dateObj.toISOString().split('T')[0];
    return rosters.find((r) => r.date === dateStr);
  };

  // Get shift details helper
  const getShiftDetails = (type: string) => {
    switch (type) {
      case 'MORNING':
        return { name: 'Morning Shift', time: '7:00 AM – 3:00 PM', badge: 'morning', bg: 'bg-emerald-50/70 border-emerald-200/80 hover:border-emerald-500' };
      case 'EVENING':
        return { name: 'Evening Shift', time: '3:00 PM – 11:00 PM', badge: 'evening', bg: 'bg-amber-50/70 border-amber-200/80 hover:border-amber-500' };
      case 'NIGHT':
        return { name: 'Night Shift', time: '11:00 PM – 7:00 AM', badge: 'night', bg: 'bg-[#EDE9FE]/50 border-purple-200/80 hover:border-[#5142C5]' };
      default:
        return { name: 'Off Duty', time: 'No Shift Assigned', badge: 'off', bg: 'bg-slate-50 border-slate-200 hover:border-slate-400' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#5142C5] uppercase tracking-wider mb-0.5">
            <CalendarDays size={16} /> Clinical Duty Schedule
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#16162A]">Weekly Roster Calendar</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            View and manage your scheduled hospital duties and shifts
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Toggle */}
          <div className="bg-white border border-[#E7E7F0] p-1 rounded-2xl flex items-center shadow-nurse-sm">
            <button
              onClick={() => setViewMode('week')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'week' ? 'bg-[#5142C5] text-white shadow-nurse-sm' : 'text-[#707080] hover:text-[#16162A]'
              }`}
            >
              Week View
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'month' ? 'bg-[#5142C5] text-white shadow-nurse-sm' : 'text-[#707080] hover:text-[#16162A]'
              }`}
            >
              Month View
            </button>
          </div>

          {/* Date Navigator */}
          <div className="flex items-center gap-2 bg-white border border-[#E7E7F0] rounded-2xl px-3 py-1.5 shadow-nurse-sm">
            <button onClick={handlePrev} className="p-1 text-[#707080] hover:text-[#5142C5] transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="text-xs font-bold text-[#16162A] px-2 min-w-[100px] text-center">
              {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
            <button onClick={handleNext} className="p-1 text-[#707080] hover:text-[#5142C5] transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Shift Color Legend */}
      <div className="flex flex-wrap items-center gap-6 bg-white border border-[#E7E7F0] rounded-card p-4 shadow-nurse-sm text-xs font-semibold">
        <span className="text-[#707080] font-bold uppercase tracking-wider text-[11px]">
          Shift Color Legend:
        </span>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 inline-block shadow-sm" />
          <span className="text-[#16162A]">Morning Shift (7:00 AM – 3:00 PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-amber-500 inline-block shadow-sm" />
          <span className="text-[#16162A]">Evening Shift (3:00 PM – 11:00 PM)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-[#5142C5] inline-block shadow-sm" />
          <span className="text-[#16162A]">Night Shift (11:00 PM – 7:00 AM)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-400 inline-block shadow-sm" />
          <span className="text-[#707080]">Off Duty</span>
        </div>
      </div>

      {/* Weekly Roster Grid */}
      <Card className="p-6 overflow-x-auto shadow-nurse-md">
        <div className="min-w-[850px] grid grid-cols-7 gap-4">
          {weekDays.map((day, idx) => {
            const dateStr = day.toISOString().split('T')[0];
            const isToday = dateStr === todayStr;
            const shiftItem = getShiftForDate(day);
            const shiftType = shiftItem?.shift?.type || (idx % 3 === 0 ? 'NIGHT' : idx % 2 === 0 ? 'MORNING' : 'EVENING');
            const shiftInfo = getShiftDetails(shiftType);

            return (
              <div
                key={dateStr}
                className={`rounded-2xl p-4 border transition-all duration-300 min-h-[185px] flex flex-col justify-between cursor-pointer group ${
                  shiftInfo.bg
                } ${
                  isToday
                    ? 'ring-2 ring-[#5142C5] shadow-nurse-md border-[#5142C5]'
                    : 'shadow-sm'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <span className="text-xs font-black uppercase text-[#707080]">
                    {day.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span
                    className={`text-xs font-extrabold w-7 h-7 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isToday
                        ? 'bg-[#5142C5] text-white shadow-nurse-sm'
                        : 'bg-white text-[#16162A] border border-slate-200'
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Shift Details Badge & Hours */}
                <div className="my-auto py-2 space-y-1.5 text-left">
                  <div className="inline-block">
                    <Badge variant={shiftInfo.badge as any}>
                      {shiftItem?.shift?.name || shiftInfo.name}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#16162A] font-extrabold flex items-center gap-1">
                    <Clock size={12} className="text-[#5142C5] shrink-0" />
                    <span>{shiftItem?.shift?.startTime ? `${shiftItem.shift.startTime} – ${shiftItem.shift.endTime}` : shiftInfo.time}</span>
                  </p>
                  <p className="text-[10px] text-[#5142C5] font-extrabold">
                    📍 {shiftItem?.department?.name || 'General Ward'}
                  </p>
                </div>

                {/* Full-Width View Details Button */}
                <div className="pt-2 border-t border-slate-200/60 mt-1">
                  <button
                    type="button"
                    onClick={() => {
                      if (shiftItem) {
                        navigate(`/nurse/shifts/${shiftItem.id}`);
                      } else {
                        setSelectedShift({
                          id: `demo-${dateStr}`,
                          nurseId: user?.id || 'sarah',
                          nurse: user as any,
                          shiftId: shiftType.toLowerCase(),
                          shift: {
                            id: shiftType.toLowerCase(),
                            name: shiftInfo.name,
                            startTime: shiftInfo.time.split(' – ')[0] || '7:00 AM',
                            endTime: shiftInfo.time.split(' – ')[1] || '3:00 PM',
                            type: shiftType as any,
                            color: 'purple',
                          },
                          departmentId: 'dept-1',
                          department: { id: 'dept-1', name: 'General Ward' },
                          date: dateStr,
                          status: 'SCHEDULED',
                          notes: 'Ensure patient rounds are logged every 2 hours.',
                        });
                      }
                    }}
                    className="w-full bg-[#5142C5] hover:bg-[#3D2DA8] text-white text-[11px] font-extrabold py-2 px-3 rounded-xl shadow-nurse-sm transition-all duration-200 flex items-center justify-center gap-1.5 group cursor-pointer"
                  >
                    <span>View Details</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Shift Quick Preview Modal */}
      <Modal
        isOpen={!!selectedShift}
        onClose={() => setSelectedShift(null)}
        title="Shift Summary & Handover"
      >
        {selectedShift && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant={selectedShift.shift?.type === 'NIGHT' ? 'night' : selectedShift.shift?.type === 'EVENING' ? 'evening' : 'morning'}>
                {selectedShift.shift?.name}
              </Badge>
              <span className="text-xs font-extrabold text-[#707080]">{selectedShift.date}</span>
            </div>

            <div className="space-y-2 text-xs text-[#16162A] bg-[#F7F7FB] p-3 rounded-2xl border border-[#E7E7F0]">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#5142C5]" />
                <span className="font-bold">
                  {selectedShift.shift?.startTime} – {selectedShift.shift?.endTime}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#5142C5]" />
                <span className="font-bold">{selectedShift.department?.name}</span>
              </div>
            </div>

            {selectedShift.notes && (
              <div className="p-3 bg-[#EDE9FE]/40 border border-[#EDE9FE] rounded-2xl text-xs text-[#16162A]">
                <span className="font-extrabold text-[#5142C5] block mb-0.5">Handover Notes:</span>
                {selectedShift.notes}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="w-full font-bold"
                onClick={() => {
                  setSelectedShift(null);
                  navigate('/nurse/shift-swap');
                }}
              >
                Swap Shift
              </Button>
              <Button
                className="w-full font-bold"
                onClick={() => {
                  const id = selectedShift.id;
                  setSelectedShift(null);
                  navigate(`/nurse/shifts/${id}`);
                }}
              >
                Full Details
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
