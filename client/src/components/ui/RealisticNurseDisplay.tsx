import React from 'react';
import { HeartbeatGraphic } from './HeartbeatGraphic';
import { ShieldCheck, UserCheck, Stethoscope } from 'lucide-react';

interface RealisticNurseDisplayProps {
  className?: string;
}

export const RealisticNurseDisplay: React.FC<RealisticNurseDisplayProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center space-y-6 ${className}`}>
      {/* Side-by-Side Dual Nurse Avatar Showcase (Female Nurse with Hijab & Male Nurse) */}
      <div className="flex items-center justify-center -space-x-8 sm:-space-x-12 relative">
        {/* Female Nurse in Hijab Card */}
        <div className="relative group z-10 hover:z-30 transition-all duration-300">
          <div className="absolute inset-0 bg-[#EDE9FE] rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-white/40 p-1 shadow-2xl bg-white/10 backdrop-blur-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/hijab_nurse.png"
              alt="Staff Nurse Amina K. (Hijab)"
              className="w-full h-full rounded-full object-cover shadow-inner"
            />
          </div>
          {/* Badge */}
          <div className="absolute -bottom-2 left-2 bg-white/95 backdrop-blur-md shadow-xl border border-purple-100 rounded-2xl px-3 py-1.5 text-left z-20 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0">
              <ShieldCheck size={12} />
            </div>
            <div>
              <span className="block text-[8px] text-slate-400 font-semibold uppercase leading-none">Verified RN</span>
              <span className="text-[10px] font-extrabold text-[#5142C5]">Amina K.</span>
            </div>
          </div>
        </div>

        {/* Male Nurse Card */}
        <div className="relative group z-20 hover:z-30 transition-all duration-300">
          <div className="absolute inset-0 bg-amber-300/30 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
          <div className="relative w-44 h-44 sm:w-56 sm:h-56 rounded-full border-4 border-white/40 p-1 shadow-2xl bg-white/10 backdrop-blur-md overflow-hidden group-hover:scale-105 transition-transform duration-300">
            <img
              src="/images/male_nurse.png"
              alt="Staff Nurse Tariq M."
              className="w-full h-full rounded-full object-cover shadow-inner"
            />
          </div>
          {/* Badge */}
          <div className="absolute -bottom-2 right-2 bg-white/95 backdrop-blur-md shadow-xl border border-amber-100 rounded-2xl px-3 py-1.5 text-left z-20 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0">
              <UserCheck size={12} />
            </div>
            <div>
              <span className="block text-[8px] text-slate-400 font-semibold uppercase leading-none">Verified BSN</span>
              <span className="text-[10px] font-extrabold text-[#0C162D]">Tariq M.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Label Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-100 text-[11px] font-extrabold shadow-sm">
        <Stethoscope size={14} className="text-[#FACC15]" /> Female & Male Clinical Nursing Staff
      </div>

      {/* ECG Pulse Accent */}
      <div className="pt-1">
        <HeartbeatGraphic color="#FFFFFF" className="w-56 h-8" />
      </div>
    </div>
  );
};
