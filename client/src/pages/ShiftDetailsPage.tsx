import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Clock, MapPin, Calendar, UserCheck, FileEdit, Save, ArrowLeft, CheckCircle, Repeat } from 'lucide-react';
import { api } from '../services/api';
import { Roster } from '../types';

export const ShiftDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [roster, setRoster] = useState<Roster | null>(null);
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (!id || id.startsWith('demo-')) {
          // Fallback mock shift for demo route
          const mock: Roster = {
            id: id || 'demo-15',
            nurseId: 'sarah-1',
            nurse: { id: 'sarah-1', name: 'Sarah Johnson', email: 'sarah@nurseflow.com', employeeId: 'NUR-101', role: 'NURSE' },
            shiftId: 'shift-night',
            shift: {
              id: 'shift-night',
              name: 'Night Shift',
              startTime: '11:00 PM',
              endTime: '7:00 AM',
              type: 'NIGHT',
              color: 'purple',
            },
            departmentId: 'dept-general',
            department: { id: 'dept-general', name: 'General Ward', description: 'Inpatient medical ward' },
            date: '15 May 2025',
            status: 'ON_DUTY',
            notes: 'Ensure vitals are checked every 2 hours.',
            createdBy: 'Head Nurse Clara Barton',
          };
          setRoster(mock);
          setNotes(mock.notes || '');
          return;
        }

        const data = await api.getRoster(id);
        setRoster(data);
        setNotes(data.notes || '');
      } catch (err) {
        console.error('Error fetching roster details:', err);
      }
    };

    fetchDetails();
  }, [id]);

  const handleSaveNotes = async () => {
    try {
      setSaving(true);
      if (id && !id.startsWith('demo-')) {
        await api.updateRoster(id, { notes });
      }
      if (roster) {
        setRoster({ ...roster, notes });
      }
      setIsEditing(false);
      setSavedMsg('Notes updated and saved to shift logs!');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (!roster) {
    return <div className="p-8 text-center text-xs text-[#707080]">Loading shift details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Back navigation */}
      <button
        onClick={() => navigate('/nurse/roster')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5142C5] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Weekly Roster
      </button>

      {/* Main Shift Header Banner Card */}
      <Card gradient className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant="approved">Shift # {roster.id.substring(0, 8)}</Badge>
          <span className="text-xs bg-white/20 text-white font-bold px-3 py-1 rounded-full">
            {roster.date}
          </span>
        </div>

        <div>
          <h1 className="text-3xl font-black text-white">{roster.shift?.name || 'Night Shift'}</h1>
          <div className="flex flex-wrap items-center gap-6 text-purple-100 text-xs font-semibold mt-2">
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>{roster.shift?.startTime} – {roster.shift?.endTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{roster.department?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              <span>{roster.date}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Grid: Shift Metadata & Notes Editor */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Shift Metadata */}
        <Card className="p-6 space-y-4">
          <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider border-b border-[#E7E7F0] pb-2">
            Shift Specifications
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-[#E7E7F0]">
              <span className="text-[#707080]">Department:</span>
              <span className="font-bold text-[#16162A]">{roster.department?.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E7E7F0]">
              <span className="text-[#707080]">Shift Type:</span>
              <Badge variant={roster.shift?.type === 'NIGHT' ? 'night' : 'morning'}>
                {roster.shift?.type}
              </Badge>
            </div>
            <div className="flex justify-between py-2 border-b border-[#E7E7F0]">
              <span className="text-[#707080]">Assigned By:</span>
              <span className="font-bold text-[#16162A]">{roster.createdBy || 'Head Nurse Clara Barton'}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-[#707080]">Current Duty Status:</span>
              <span className="font-bold text-emerald-600">● On Duty</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="outline"
              className="w-full font-bold"
              icon={<Repeat size={18} />}
              onClick={() => navigate('/nurse/shift-swap')}
            >
              Request Shift Swap
            </Button>
          </div>
        </Card>

        {/* Right: Notes & Handover Log */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E7F0] pb-2">
            <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider">
              Shift Notes & Instructions
            </h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="text-xs font-bold text-[#5142C5] flex items-center gap-1 hover:underline"
              >
                <FileEdit size={14} /> Edit Notes
              </button>
            )}
          </div>

          {savedMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{savedMsg}</span>
            </div>
          )}

          {isEditing ? (
            <div className="space-y-3">
              <textarea
                className="w-full bg-[#F7F7FB] border border-[#5142C5] rounded-2xl p-3 text-xs text-[#16162A] focus:outline-none min-h-[140px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add shift handovers, patient vitals logs, or specific ward notes..."
              />
              <div className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button size="sm" isLoading={saving} onClick={handleSaveNotes} icon={<Save size={14} />}>
                  Save Notes
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-[#F7F7FB] border border-[#E7E7F0] rounded-2xl min-h-[140px] text-xs text-[#16162A] leading-relaxed">
              {notes ? notes : <span className="text-[#707080] italic">No shift notes added yet. Click edit to record handover notes.</span>}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
