import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Phone, ShieldCheck, Key, LogOut, CheckCircle, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');

  // Editable profile state
  const [phone, setPhone] = useState(user?.phone || '+1 (555) 234-5678');
  const [updating, setUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg('Password updated successfully!');
    setTimeout(() => {
      setShowPasswordModal(false);
      setPassMsg('');
      setCurrentPass('');
      setNewPass('');
    }, 1500);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Profile Header Banner */}
      <Card gradient className="p-8 text-center space-y-4">
        <div className="relative inline-block mx-auto">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200'}
            alt={user?.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl mx-auto"
          />
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white">
            <Stethoscope size={16} />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white">{user?.name || 'Sarah Johnson'}</h1>
          <p className="text-xs text-purple-200 font-semibold mt-0.5">
            {user?.role === 'ADMIN' ? 'Head Nurse / Admin' : 'Staff Nurse'} • {user?.department?.name || 'General Ward'}
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Badge variant="purple">Employee ID: {user?.employeeId || 'NUR-101'}</Badge>
        </div>
      </Card>

      {/* Details Card */}
      <Card className="p-6 space-y-4">
        <h3 className="text-xs font-bold text-[#707080] uppercase tracking-wider border-b border-[#E7E7F0] pb-2">
          Personal & Professional Credentials
        </h3>

        {updateMsg && (
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-semibold flex items-center gap-2">
            <CheckCircle size={16} />
            <span>{updateMsg}</span>
          </div>
        )}

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between py-2 border-b border-[#E7E7F0]">
            <span className="text-[#707080] flex items-center gap-2">
              <Mail size={16} className="text-[#5142C5]" /> Email Address:
            </span>
            <span className="font-bold text-[#16162A]">{user?.email}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#E7E7F0]">
            <span className="text-[#707080] flex items-center gap-2">
              <Phone size={16} className="text-[#5142C5]" /> Phone Number:
            </span>
            <span className="font-bold text-[#16162A]">{phone}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-[#E7E7F0]">
            <span className="text-[#707080] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#5142C5]" /> Assigned Department:
            </span>
            <span className="font-bold text-[#16162A]">{user?.department?.name || 'General Ward'}</span>
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-[#707080]">Joined Date:</span>
            <span className="font-bold text-[#16162A]">12 Jan 2023</span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 space-y-3">
          <Button
            variant="outline"
            className="w-full font-bold"
            icon={<Key size={16} />}
            onClick={() => setShowPasswordModal(true)}
          >
            Change Password
          </Button>

          <Button
            variant="danger"
            className="w-full font-bold"
            icon={<LogOut size={16} />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Card>

      {/* Change Password Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          {passMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{passMsg}</span>
            </div>
          )}

          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={currentPass}
            onChange={(e) => setCurrentPass(e.target.value)}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
          />

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" type="button" onClick={() => setShowPasswordModal(false)}>
              Cancel
            </Button>
            <Button type="submit">Update Password</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
