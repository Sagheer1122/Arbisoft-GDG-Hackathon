import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Calendar, FileText, Upload, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

export const LeaveRequestPage: React.FC = () => {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [fromDate, setFromDate] = useState('2025-05-20');
  const [toDate, setToDate] = useState('2025-05-22');
  const [reason, setReason] = useState('');
  const [fileName, setFileName] = useState('');
  const [attachment, setAttachment] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAttachment(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveType || !fromDate || !toDate || !reason) {
      setError('Please fill in all required fields.');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('From Date cannot be later than To Date.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await api.createLeaveRequest({
        leaveType,
        fromDate,
        toDate,
        reason,
        attachment: attachment || null,
      });

      setSuccessMsg('Leave request submitted successfully! Redirecting to My Requests...');
      setTimeout(() => {
        navigate('/nurse/requests');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit leave request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      <button
        onClick={() => navigate('/nurse/dashboard')}
        className="inline-flex items-center gap-2 text-xs font-bold text-[#5142C5] hover:underline"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <Card className="p-6 md:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-[#16162A]">Submit Leave Request</h1>
          <p className="text-xs text-[#707080] font-medium mt-1">
            Apply for leave approval from Head Nurse and Admin
          </p>
        </div>

        {/* Leave Balance Alert Card */}
        <div className="p-4 bg-[#EDE9FE] border border-[#EDE9FE] rounded-2xl flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-[#5142C5] block">Available Leave Balance</span>
            <span className="text-[#707080]">Annual: 14 Days | Sick: 8 Days | Casual: 5 Days</span>
          </div>
          <span className="bg-[#5142C5] text-white px-3 py-1 rounded-full font-extrabold text-[11px]">
            14 Days Total
          </span>
        </div>

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
          <Select
            label="Leave Type"
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            options={[
              { value: 'Annual Leave', label: 'Annual Leave' },
              { value: 'Sick Leave', label: 'Sick Leave' },
              { value: 'Emergency Leave', label: 'Emergency Leave' },
              { value: 'Casual Leave', label: 'Casual Leave' },
            ]}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="From Date"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              required
            />
            <Input
              label="To Date"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider">
              Reason for Leave
            </label>
            <textarea
              className="w-full bg-white border border-[#E7E7F0] rounded-button p-3.5 text-xs text-[#16162A] focus:outline-none focus:border-[#5142C5] transition-all min-h-[100px]"
              placeholder="Provide context or medical details for the leave application..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {/* Attach File / Document */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider">
              Attach Medical / Supporting Document (Optional)
            </label>
            <div className="border-2 border-dashed border-[#E7E7F0] hover:border-[#5142C5] rounded-2xl p-6 text-center transition-colors relative cursor-pointer bg-[#F7F7FB]">
              <input
                type="file"
                onChange={handleFileUpload}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload size={28} className="mx-auto text-[#5142C5] mb-2" />
              <p className="text-xs font-bold text-[#16162A]">
                {fileName ? fileName : 'Click or Drag document to attach'}
              </p>
              <p className="text-[10px] text-[#707080] mt-1">Supports PDF, PNG, JPG (Max 5MB)</p>
            </div>
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
            <Button type="submit" isLoading={loading} className="w-full font-bold">
              Submit Leave Request
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
