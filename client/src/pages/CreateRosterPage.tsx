import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { CalendarDays, PlusCircle, CheckCircle, AlertCircle, ArrowLeft, Send } from 'lucide-react';
import { api } from '../services/api';
import { Department, Shift, User } from '../types';

export const CreateRosterPage: React.FC = () => {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [nurses, setNurses] = useState<User[]>([]);

  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [rosterDate, setRosterDate] = useState('2025-05-15');

  // Matrix assignments: { nurseId: { shiftId, notes } }
  const [assignments, setAssignments] = useState<{ [nurseId: string]: { shiftId: string; notes: string } }>({});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const initData = async () => {
      try {
        const depts = await api.getDepartments();
        setDepartments(depts);
        if (depts.length > 0) setSelectedDeptId(depts[0].id);

        const shiftList = await api.getShifts();
        setShifts(shiftList);

        const nurseList = await api.getUsers({ role: 'NURSE' });
        setNurses(nurseList);

        // Pre-fill default sample matrix
        const initialMap: any = {};
        nurseList.forEach((n, idx) => {
          const shiftObj = shiftList[idx % shiftList.length] || shiftList[0];
          initialMap[n.id] = {
            shiftId: shiftObj.id,
            notes: '',
          };
        });
        setAssignments(initialMap);
      } catch (err) {
        console.error('Failed to load roster creation data:', err);
      }
    };

    initData();
  }, []);

  const handleShiftChange = (nurseId: string, shiftId: string) => {
    setAssignments((prev) => ({
      ...prev,
      [nurseId]: {
        ...prev[nurseId],
        shiftId,
      },
    }));
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setConflicts([]);

    const payloadAssignments = Object.keys(assignments).map((nurseId) => ({
      nurseId,
      shiftId: assignments[nurseId].shiftId,
      notes: assignments[nurseId].notes || null,
      date: rosterDate,
      departmentId: selectedDeptId,
    }));

    try {
      setLoading(true);
      const res = await api.createRoster({
        assignments: payloadAssignments,
        departmentId: selectedDeptId,
        date: rosterDate,
      });

      if (res.conflicts && res.conflicts.length > 0) {
        setConflicts(res.conflicts);
      }

      setSuccessMsg('Roster published & real-time alerts emitted to nurses!');
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Error publishing roster');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5142C5] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Admin Dashboard
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#16162A]">Create & Publish Roster</h1>
        <p className="text-xs text-[#707080] font-medium mt-1">
          Assign hospital shifts, set ward departments, and prevent double bookings
        </p>
      </div>

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

        {conflicts.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl text-xs space-y-1">
            <span className="font-bold block">Schedule Conflicts Detected:</span>
            {conflicts.map((c, i) => (
              <p key={i}>• {c}</p>
            ))}
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-6">
          {/* Top Controls */}
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              value={selectedDeptId}
              onChange={(e) => setSelectedDeptId(e.target.value)}
              options={departments.map((d) => ({ value: d.id, label: d.name }))}
            />

            <Input
              label="Roster Date"
              type="date"
              value={rosterDate}
              onChange={(e) => setRosterDate(e.target.value)}
              required
            />
          </div>

          {/* Nurse Assignment Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
              Shift Assignment Matrix
            </h3>

            <div className="border border-[#E7E7F0] rounded-2xl overflow-hidden divide-y divide-[#E7E7F0]">
              {nurses.map((nurse) => {
                const currentShiftId = assignments[nurse.id]?.shiftId || '';
                return (
                  <div
                    key={nurse.id}
                    className="p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F7F7FB] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={nurse.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                        alt={nurse.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#EDE9FE]"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-[#16162A]">{nurse.name}</h4>
                        <p className="text-xs text-[#707080]">{nurse.employeeId} • Staff Nurse</p>
                      </div>
                    </div>

                    <div className="w-full sm:w-64">
                      <Select
                        value={currentShiftId}
                        onChange={(e) => handleShiftChange(nurse.id, e.target.value)}
                        options={shifts.map((s) => ({
                          value: s.id,
                          label: `${s.name} (${s.startTime})`,
                        }))}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              variant="outline"
              type="button"
              className="w-full font-bold"
              onClick={() => navigate('/admin/dashboard')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={loading} icon={<Send size={18} />} className="w-full font-bold">
              Publish Master Roster
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
