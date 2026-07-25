import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modal } from '../components/ui/Modal';
import {
  Stethoscope,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Zap,
  ShieldCheck,
  User,
  CalendarDays,
  Repeat,
  Bell,
  Eye,
  EyeOff,
} from 'lucide-react';
import { api } from '../services/api';
import { HeartbeatGraphic } from '../components/ui/HeartbeatGraphic';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMsg, setResetMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      if (user.role === 'ADMIN' || user.role === 'HEAD_NURSE') {
        navigate('/admin/dashboard');
      } else {
        navigate('/nurse/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillNurseDemo = () => {
    setEmail('sarah.johnson@nurseflow.com');
    setPassword('password123');
    setError('');
  };

  const fillAdminDemo = () => {
    setEmail('clara.barton@nurseflow.com');
    setPassword('admin123');
    setError('');
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      const res = await api.resetPassword(resetEmail);
      setResetMsg(res.message);
    } catch (err: any) {
      setResetMsg(err.message || 'Error requesting password reset.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7FB] grid lg:grid-cols-12 font-sans selection:bg-[#EDE9FE] selection:text-[#5142C5]">
      {/* ========================================================= */}
      {/* LEFT COLUMN: DARK BRANDING PANEL (MATCHING REFERENCE IMAGE) */}
      {/* ========================================================= */}
      <div className="lg:col-span-5 bg-gradient-to-br from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white p-10 md:p-12 hidden lg:flex flex-col justify-between relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#EDE9FE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Logo */}
        <div className="flex items-center gap-3 z-10">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#EDE9FE] border border-white/20 shadow-nurse-sm">
            <Stethoscope size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">NurseFlow</h1>
            <p className="text-[10px] text-purple-200 uppercase tracking-widest font-extrabold">
              SMART ROSTER. BETTER CARE.
            </p>
          </div>
        </div>

        {/* Middle Headlines & Feature Highlights */}
        <div className="space-y-8 z-10 my-auto py-8">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Welcome Back! <br />
              Let's Continue Your{' '}
              <span className="text-[#FACC15] block">Shift Journey</span>
            </h2>
            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-md font-medium">
              Log in to your account and access real-time rosters, instant shift exchanges, leave management, and clinical team scheduling.
            </p>
          </div>

          {/* 3 Feature Highlights matching reference screenshot */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 text-[#EDE9FE] flex items-center justify-center shrink-0 mt-0.5">
                <CalendarDays size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Smart Roster Intelligence</h4>
                <p className="text-[11px] text-purple-200/80">Clash-free automated weekly shift scheduling</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 text-[#EDE9FE] flex items-center justify-center shrink-0 mt-0.5">
                <Repeat size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Instant Shift Exchange</h4>
                <p className="text-[11px] text-purple-200/80">Peer-to-peer 1-click swap validation</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-400/30 text-[#EDE9FE] flex items-center justify-center shrink-0 mt-0.5">
                <Bell size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Socket Push Alerts</h4>
                <p className="text-[11px] text-purple-200/80">Real-time emergency ward notifications</p>
              </div>
            </div>
          </div>

          {/* Female & Male Nurse Avatars Widget Box */}
          <div className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center -space-x-3">
              <img
                src="/images/hijab_nurse.png"
                alt="Female Nurse Amina"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
              <img
                src="/images/male_nurse.png"
                alt="Male Nurse Tariq"
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
              />
            </div>
            <div className="text-right">
              <span className="block text-[11px] font-extrabold text-white">Female & Male Staff</span>
              <span className="text-[10px] text-[#FACC15] font-bold">Verified Clinical Duty</span>
            </div>
          </div>
        </div>

        {/* Bottom Status Footer */}
        <div className="pt-6 border-t border-white/10 z-10 flex items-center justify-between text-xs text-purple-200">
          <span>© 2025 NurseFlow Inc.</span>
          <div className="flex items-center gap-2">
            <HeartbeatGraphic color="#A78BFA" className="w-20 h-4" />
            <span className="text-emerald-400 font-bold">● Active</span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* RIGHT COLUMN: WHITE FORM PANEL (MATCHING REFERENCE IMAGE) */}
      {/* ========================================================= */}
      <div className="lg:col-span-7 bg-white flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-y-auto">
        {/* Top Header Back Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-extrabold text-[#707080] hover:text-[#5142C5] uppercase tracking-wider transition-colors"
          >
            ← BACK TO WEBSITE
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#5142C5] text-white flex items-center justify-center font-bold">
              <Stethoscope size={18} />
            </div>
            <span className="font-black text-sm text-[#16162A]">NurseFlow</span>
          </div>
        </div>

        {/* Form Main Container */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-7">
          {/* Title Header */}
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-3xl font-black text-[#16162A] tracking-tight relative inline-block">
              Login to Your Account
              <span className="block h-1 w-16 bg-[#5142C5] rounded-full mt-1 sm:ml-0 mx-auto" />
            </h2>
            <p className="text-xs sm:text-sm text-[#707080] font-medium">
              Welcome back! Please enter your details to continue.
            </p>
          </div>

          {/* Quick Demo Fill Accounts Box */}
          <div className="p-4 bg-[#EDE9FE]/50 border border-[#EDE9FE] rounded-2xl space-y-2">
            <p className="text-[11px] font-black text-[#5142C5] text-center uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Zap size={14} /> Quick One-Click Demo Credentials
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={fillNurseDemo}
                className="px-3.5 py-2.5 bg-white hover:bg-[#5142C5] text-[#5142C5] hover:text-white rounded-xl text-xs font-extrabold border border-slate-200 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <User size={14} /> Nurse (Sarah)
              </button>
              <button
                type="button"
                onClick={fillAdminDemo}
                className="px-3.5 py-2.5 bg-white hover:bg-[#3D2DA8] text-[#3D2DA8] hover:text-white rounded-xl text-xs font-extrabold border border-slate-200 transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldCheck size={14} /> Admin (Clara)
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-[#707080] uppercase tracking-wider">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-medium text-[#16162A] placeholder-slate-400 focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20 transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-[#707080] uppercase tracking-wider">
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-extrabold text-[#5142C5] hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-medium text-[#16162A] placeholder-slate-400 focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Checkbox Row */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 rounded text-[#5142C5] focus:ring-[#5142C5] border-slate-300"
                />
                <span>Remember me</span>
              </label>
              <span className="text-[11px] text-slate-400 font-medium">Keep me signed in</span>
            </div>

            {/* Main Login Pill Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5142C5] hover:bg-[#3D2DA8] text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-nurse-md transition-all hover:scale-[1.01] active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Sign Up Link */}
          <div className="pt-4 text-center text-xs text-[#707080]">
            <span>Don't have an account? </span>
            <Link to="/register" className="text-[#5142C5] font-extrabold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-[11px] text-slate-400 font-medium pt-4">
          © 2025 NurseFlow Elite Medical Staffing. All rights reserved.
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setResetMsg('');
        }}
        title="Reset Password"
      >
        <form onSubmit={handleResetPassword} className="space-y-4">
          <p className="text-xs text-[#707080]">
            Enter your NurseFlow email address and we'll send you instructions to reset your password.
          </p>
          {resetMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-xl flex items-center gap-2">
              <CheckCircle size={16} />
              <span>{resetMsg}</span>
            </div>
          )}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">Email Address</label>
            <input
              type="email"
              placeholder="sarah.johnson@nurseflow.com"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              required
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-[#5142C5] text-white rounded-xl hover:bg-[#3D2DA8]"
            >
              Send Link
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
