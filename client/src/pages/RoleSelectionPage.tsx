import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stethoscope,
  ShieldCheck,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Users,
  Building2,
  UserCheck,
} from 'lucide-react';
import { HeartbeatGraphic } from '../components/ui/HeartbeatGraphic';
import { useAuth } from '../context/AuthContext';
import { setAuthToken } from '../services/api';

export const RoleSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser } = useAuth();

  // Quick Demo Auto-Fill Handlers for effortless testing
  const handleQuickNurseDemo = () => {
    // Nurse Sarah Johnson session demo token simulation
    navigate('/login');
  };

  const handleQuickAdminDemo = () => {
    // Admin Clara Barton session demo token simulation
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white flex flex-col justify-between p-4 md:p-8 relative overflow-hidden selection:bg-[#EDE9FE] selection:text-[#5142C5]">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="max-w-5xl mx-auto w-full flex items-center justify-between z-20 pb-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-xs font-bold text-purple-200 hover:text-white transition-colors bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20"
        >
          <ArrowLeft size={16} /> Back to Public Page
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-[#EDE9FE] border border-white/20">
            <Stethoscope size={20} />
          </div>
          <span className="font-black text-lg text-white tracking-tight">NurseFlow</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl w-full mx-auto my-auto space-y-10 z-10 py-6">
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-[11px] font-extrabold uppercase tracking-wider">
            <Sparkles size={14} className="text-[#FACC15]" /> WORKPLACE PORTAL ACCESS
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Choose Your Role
          </h1>

          <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed font-medium">
            Select your clinical position to access your personalized roster intelligence, shift management, and department workflows.
          </p>
        </div>

        {/* 2 Glassmorphic Cards Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Staff Nurse */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-purple-300/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative">
            <div className="space-y-6">
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] text-[#5142C5] flex items-center justify-center font-bold shadow-lg group-hover:scale-110 transition-transform">
                  <HeartPulse size={30} />
                </div>
                <span className="text-[10px] font-extrabold bg-purple-500/30 text-purple-200 px-3 py-1 rounded-full border border-purple-400/20">
                  STAFF & DUTY ACCESS
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-[#EDE9FE] transition-colors">
                  I'm a Staff Nurse
                </h2>
                <p className="text-xs text-purple-100/80 mt-1.5 leading-relaxed">
                  For registered nurses, nurse practitioners, and floor duty healthcare staff.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>View daily shift schedules & weekly rosters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Request 1-click shift swaps with qualified colleagues</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Submit leave requests with document uploads</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>Receive real-time push alerts & shift updates</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#EDE9FE] hover:bg-white text-[#5142C5] font-black text-sm py-3.5 px-6 rounded-2xl transition-all shadow-nurse-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Access Nurse Portal <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Card 2: Admin / Head Nurse */}
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 hover:border-amber-300/60 rounded-3xl p-6 md:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 hover:scale-[1.02] group relative">
            <div className="space-y-6">
              {/* Card Header & Icon */}
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-[#FACC15] flex items-center justify-center font-bold shadow-lg border border-amber-400/30 group-hover:scale-110 transition-transform">
                  <UserCheck size={30} />
                </div>
                <span className="text-[10px] font-extrabold bg-amber-500/30 text-amber-200 px-3 py-1 rounded-full border border-amber-400/20">
                  MANAGEMENT & GOVERNANCE
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white group-hover:text-amber-200 transition-colors">
                  I'm an Admin / Head Nurse
                </h2>
                <p className="text-xs text-purple-100/80 mt-1.5 leading-relaxed">
                  For head nurses, hospital managers, and duty scheduling administrators.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-2.5 text-xs text-slate-200 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#FACC15] shrink-0" />
                  <span>Create & publish master department rosters</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#FACC15] shrink-0" />
                  <span>Approve leave applications & shift exchange requests</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#FACC15] shrink-0" />
                  <span>Broadcast real-time emergency ward notifications</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-[#FACC15] shrink-0" />
                  <span>Export duty hour reports to PDF & CSV spreadsheets</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#FACC15] hover:bg-[#FDE047] text-[#0C162D] font-black text-sm py-3.5 px-6 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                Access Admin Portal <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Demo Credentials Helper Box */}
        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 text-center space-y-3">
          <p className="text-xs text-purple-200 font-semibold">
            Already registered or testing the platform demo?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-2 rounded-xl border border-white/20 transition-all"
            >
              Sign In with Existing Credentials
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-[#EDE9FE] hover:bg-white text-[#5142C5] font-bold text-xs px-5 py-2 rounded-xl transition-all"
            >
              Create New Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer Status Bar */}
      <footer className="max-w-5xl mx-auto w-full text-center text-[11px] text-purple-200/70 pt-4 z-10 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2025 NurseFlow Inc. All rights reserved.</span>
        <div className="flex items-center gap-2">
          <HeartbeatGraphic color="#A78BFA" className="w-24 h-5 inline-block" />
          <span className="text-emerald-400 font-bold">● Operational</span>
        </div>
      </footer>
    </div>
  );
};
