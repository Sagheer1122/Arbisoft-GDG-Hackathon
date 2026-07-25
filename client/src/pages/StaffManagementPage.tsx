import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { Users, Search, PlusCircle, Mail, Phone, Stethoscope, CheckCircle } from 'lucide-react';
import { api } from '../services/api';
import { User, Department } from '../types';

export const StaffManagementPage: React.FC = () => {
  const [nurses, setNurses] = useState<User[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');

  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newEmpId, setNewEmpId] = useState('');
  const [newDeptId, setNewDeptId] = useState('');
  const [addMsg, setAddMsg] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const users = await api.getUsers({ role: 'NURSE' });
        setNurses(users);

        const depts = await api.getDepartments();
        setDepartments(depts);
        if (depts.length > 0) setNewDeptId(depts[0].id);
      } catch (err) {
        console.error('Error fetching staff list:', err);
      }
    };
    fetchData();
  }, []);

  const filteredNurses = nurses.filter((n) => {
    const matchesSearch =
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'ALL' || n.departmentId === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleAddNurse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !newEmpId) return;

    try {
      const res = await api.register({
        name: newName,
        email: newEmail,
        password: 'password123',
        role: 'NURSE',
        employeeId: newEmpId,
        departmentId: newDeptId,
      });

      setAddMsg(`Nurse ${newName} registered successfully!`);
      const updated = await api.getUsers({ role: 'NURSE' });
      setNurses(updated);

      setTimeout(() => {
        setShowAddModal(false);
        setAddMsg('');
        setNewName('');
        setNewEmail('');
        setNewEmpId('');
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
          <h1 className="text-2xl font-black text-[#16162A]">Staff Directory & Management</h1>
          <p className="text-xs text-[#707080] font-medium mt-0.5">
            Manage hospital nurses, department assignments, and credentials
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          icon={<PlusCircle size={18} />}
          className="font-bold"
        >
          Add New Nurse
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:flex-1">
          <Input
            placeholder="Search nurse by name or employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={18} />}
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full bg-[#F7F7FB] border border-[#E7E7F0] rounded-button px-3.5 py-2.5 text-xs font-semibold text-[#16162A] focus:outline-none"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Staff Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNurses.map((n) => (
          <Card key={n.id} className="p-5 space-y-4">
            <div className="flex items-center gap-3 border-b border-[#E7E7F0] pb-3">
              <img
                src={n.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100'}
                alt={n.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#EDE9FE]"
              />
              <div>
                <h3 className="font-extrabold text-sm text-[#16162A]">{n.name}</h3>
                <p className="text-[11px] text-[#707080] font-semibold">{n.employeeId}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-[#707080]">
              <div className="flex items-center justify-between">
                <span>Department:</span>
                <Badge variant="purple">{n.department?.name || 'General Ward'}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="text-[#5142C5]" /> Email:
                </span>
                <span className="font-semibold text-[#16162A] truncate max-w-[160px]">
                  {n.email}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Nurse Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Nurse to Hospital Roster"
      >
        <form onSubmit={handleAddNurse} className="space-y-4">
          {addMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{addMsg}</span>
            </div>
          )}

          <Input
            label="Full Name"
            placeholder="Jessica Taylor"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="jessica.taylor@nurseflow.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />

          <Input
            label="Employee ID"
            placeholder="NUR-105"
            value={newEmpId}
            onChange={(e) => setNewEmpId(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#707080] uppercase tracking-wider">
              Department
            </label>
            <select
              value={newDeptId}
              onChange={(e) => setNewDeptId(e.target.value)}
              className="w-full bg-white border border-[#E7E7F0] rounded-button px-3.5 py-2.5 text-xs text-[#16162A] focus:outline-none"
            >
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setShowAddModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Register Nurse</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
