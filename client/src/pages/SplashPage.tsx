import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RealisticNurseDisplay } from '../components/ui/RealisticNurseDisplay';
import { HeartbeatGraphic } from '../components/ui/HeartbeatGraphic';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Stethoscope,
  ShieldCheck,
  Clock,
  MapPin,
  PhoneCall,
  Mail,
  Activity,
  Users,
  CheckCircle,
  ArrowRight,
  Hospital,
  Sparkles,
  CalendarDays,
  Repeat,
  Bell,
  BarChart3,
  ChevronDown,
  Star,
  HelpCircle,
} from 'lucide-react';

export const SplashPage: React.FC = () => {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const wards = [
    { name: 'General Ward', status: 'Operational', staffOnDuty: 8, capacity: '92% Occupied' },
    { name: 'Intensive Care Unit (ICU)', status: 'High Priority', staffOnDuty: 6, capacity: '88% Occupied' },
    { name: 'Emergency Room (ER)', status: 'Active 24/7', staffOnDuty: 7, capacity: 'Rapid Flow' },
    { name: 'Pediatrics Department', status: 'Operational', staffOnDuty: 4, capacity: '75% Occupied' },
  ];

  const features = [
    {
      icon: CalendarDays,
      title: 'Automated Smart Rostering',
      description: 'Generate clash-free weekly and monthly shift schedules for all hospital departments in minutes.',
      color: 'bg-[#EDE9FE] text-[#5142C5]',
    },
    {
      icon: Repeat,
      title: 'Instant Shift Swaps',
      description: 'Nurses can request shift exchanges with qualified colleagues with automated conflict validation.',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      icon: Bell,
      title: 'Real-Time Socket Alerts',
      description: 'Instant WebSocket notifications dispatch emergency alerts, leave approvals, and schedule changes.',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      icon: BarChart3,
      title: 'Duty & Overtime Analytics',
      description: 'Comprehensive duty reports with department hour breakdowns and 1-click CSV/PDF export options.',
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      icon: ShieldCheck,
      title: 'Role-Based Permissions',
      description: 'Strict security separation between Staff Nurses, Head Nurses, and Hospital Administrators.',
      color: 'bg-indigo-100 text-indigo-700',
    },
    {
      icon: Activity,
      title: '24/7 Live Ward Tracking',
      description: 'Monitor live nurse-to-patient ratios, active floor duty shifts, and on-call availability.',
      color: 'bg-[#EDE9FE] text-[#3D2DA8]',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Admin Defines Shift Parameters',
      desc: 'Head nurses configure ward capacity, required shift coverage (Morning, Evening, Night), and department rosters.',
    },
    {
      step: '02',
      title: 'Roster Published to Staff',
      desc: 'Schedules are published instantly. Nurses receive automated mobile and email alerts with shift details.',
    },
    {
      step: '03',
      title: 'Seamless Leave & Swap Requests',
      desc: 'Nurses submit leave applications or swap shifts directly from their personal dashboard.',
    },
    {
      step: '04',
      title: 'Instant Real-Time Sync',
      desc: 'Approved requests immediately reflect across the master roster and trigger live notifications.',
    },
  ];

  const testimonials = [
    {
      name: 'Clara Barton, RN',
      role: 'Chief Nursing Officer • General Hospital',
      quote: 'NurseFlow cut our weekly rostering time from 8 hours down to 15 minutes while eliminating double bookings completely!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    },
    {
      name: 'Dr. Robert Chen',
      role: 'Head of Emergency Services',
      quote: 'The instant emergency alert feature allows us to assemble extra triage teams during crisis influxes in under 60 seconds.',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    },
    {
      name: 'Sarah Johnson, BSN',
      role: 'Senior Staff Nurse',
      quote: 'Swapping shifts used to involve endless phone calls. With NurseFlow, I can request a swap and get approval in minutes.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150',
    },
  ];

  const faqs = [
    {
      q: 'How does NurseFlow prevent double booking nurses across shifts?',
      a: 'NurseFlow includes automated constraint validation engine that checks for overlapping shift hours, rest periods, and duplicate entries before publishing any roster assignment.',
    },
    {
      q: 'Can nurses swap shifts with colleagues directly?',
      a: 'Yes! Nurses can initiate shift swap requests with available team members. Once requested, the target nurse accepts and the Admin receives an instant notification for final 1-click approval.',
    },
    {
      q: 'How are emergency alerts delivered to on-duty staff?',
      a: 'Emergency broadcasts utilize WebSocket connections to trigger real-time toast alerts on desktop, tablet, and mobile screens instantly.',
    },
    {
      q: 'Can duty reports be exported for payroll and compliance audits?',
      a: 'Absolutely. NurseFlow supports 1-click export to CSV spreadsheet and formatted PDF documents covering duty hours, overtime, and department allocations.',
    },
    {
      q: 'Is NurseFlow responsive across all mobile and desktop devices?',
      a: 'Yes, NurseFlow features an adaptive UI with fixed sidebars for desktop, collapsible drawers for tablets, and a native mobile bottom navigation bar.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F7F7FB] text-[#16162A] flex flex-col justify-between selection:bg-[#EDE9FE] selection:text-[#5142C5]">
      {/* ========================================================= */}
      {/* 1. ORIGINAL PURPLE HERO SECTION (#5142C5 & #3D2DA8) */}
      {/* ========================================================= */}
      <div className="bg-gradient-to-br from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white p-6 md:p-12 relative overflow-hidden">
        {/* Background Decorative Glow Circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#EDE9FE]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Row */}
        <div className="flex items-center justify-between z-10 max-w-6xl mx-auto w-full mb-8">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-nurse-sm">
              <Stethoscope size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">NurseFlow</h1>
              <p className="text-xs text-purple-200 font-medium">Hospital Rostering Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-white/15 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white font-bold text-xs px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-6xl mx-auto w-full my-auto grid md:grid-cols-2 gap-12 items-center z-10 py-6">
          <div className="space-y-6 text-center md:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-purple-200 text-xs font-semibold">
              <HeartbeatGraphic color="#A78BFA" className="w-16 h-5 inline-block" />
              Next-Gen Workforce Management
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
              NurseFlow
            </h1>

            <p className="text-xl md:text-2xl font-semibold text-purple-200">
              Smart Roster. Better Care.
            </p>

            <p className="text-sm md:text-base text-purple-100/80 leading-relaxed max-w-lg">
              Streamline hospital rosters, shift assignments, leave applications, and real-time shift swaps for modern healthcare teams.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={() => navigate('/select-role')}
                icon={<ArrowRight size={20} />}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white border-2 border-white/50 font-black shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl px-8 py-3.5"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-2 border-white/40 bg-white/10 text-white hover:bg-white/20 font-bold text-sm px-8 py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Access
              </Button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 max-w-md">
              <div>
                <p className="text-2xl font-extrabold text-white">99.9%</p>
                <p className="text-xs text-purple-200">Uptime SLA</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">12k+</p>
                <p className="text-xs text-purple-200">Active Nurses</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">&lt; 1 min</p>
                <p className="text-xs text-purple-200">Swap Time</p>
              </div>
            </div>
          </div>

          {/* Photorealistic Nurse Showcase (Female Nurse in Hijab & Male Nurse) */}
          <div className="flex flex-col items-center justify-center relative">
            <RealisticNurseDisplay />
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LIVE HOSPITAL WARDS OPERATIONS STATUS */}
      {/* ========================================================= */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 py-16 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E7E7F0] pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#5142C5] uppercase tracking-wider mb-1">
              <Activity size={16} /> Live Hospital Status
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#16162A]">Current Ward Operations</h2>
          </div>
          <Badge variant="approved">24/7 Operations Online</Badge>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {wards.map((ward, idx) => (
            <Card key={idx} className="p-5 space-y-3 hover:border-[#5142C5] transition-all">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#5142C5] flex items-center justify-center font-bold">
                  <Hospital size={20} />
                </div>
                <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  ● {ward.status}
                </span>
              </div>
              <div>
                <h3 className="font-extrabold text-base text-[#16162A]">{ward.name}</h3>
                <p className="text-xs text-[#707080] mt-0.5">{ward.capacity}</p>
              </div>
              <div className="pt-2 border-t border-[#E7E7F0] flex items-center justify-between text-xs">
                <span className="text-[#707080]">On-Duty Staff:</span>
                <strong className="text-[#5142C5] font-extrabold">{ward.staffOnDuty} Nurses</strong>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. PLATFORM FEATURES (6 CARDS WITH #EDE9FE & #5142C5) */}
      {/* ========================================================= */}
      <section className="bg-white py-16 px-6 md:px-12 border-y border-[#E7E7F0]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#5142C5] uppercase tracking-wider">
              Comprehensive Feature Set
            </span>
            <h2 className="text-3xl font-black text-[#16162A]">Built for Modern Healthcare Teams</h2>
            <p className="text-xs md:text-sm text-[#707080]">
              NurseFlow bridges hospital administrators and nursing staff with real-time roster intelligence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <Card key={idx} className="p-6 space-y-3 hover:shadow-nurse-md transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${feat.color}`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-extrabold text-[#16162A]">{feat.title}</h3>
                  <p className="text-xs text-[#707080] leading-relaxed">{feat.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. WORKFLOW TIMELINE */}
      {/* ========================================================= */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 py-16 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#5142C5] uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl font-black text-[#16162A]">How NurseFlow Works</h2>
          <p className="text-xs md:text-sm text-[#707080]">
            From shift planning to real-time notification dispatch in 4 seamless steps.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step, idx) => (
            <Card key={idx} className="p-6 relative space-y-3 border-t-4 border-t-[#5142C5]">
              <span className="text-3xl font-black text-[#5142C5]/30 block">{step.step}</span>
              <h3 className="font-extrabold text-base text-[#16162A]">{step.title}</h3>
              <p className="text-xs text-[#707080] leading-relaxed">{step.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. TESTIMONIALS & REVIEWS */}
      {/* ========================================================= */}
      <section className="bg-[#EDE9FE]/40 py-16 px-6 md:px-12 border-y border-[#E7E7F0]">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-[#5142C5] uppercase tracking-wider">
              Trusted by Hospitals & Staff
            </span>
            <h2 className="text-3xl font-black text-[#16162A]">What Healthcare Leaders Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="p-6 space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-[#16162A] italic leading-relaxed">"{t.quote}"</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[#E7E7F0]">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#EDE9FE]"
                  />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#16162A]">{t.name}</h4>
                    <p className="text-[10px] text-[#707080] font-medium">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. FAQ ACCORDION */}
      {/* ========================================================= */}
      <section className="max-w-4xl w-full mx-auto px-6 md:px-12 py-16 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#5142C5] uppercase tracking-wider">
            <HelpCircle size={16} /> FAQ
          </div>
          <h2 className="text-3xl font-black text-[#16162A]">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <Card
              key={idx}
              className="p-5 cursor-pointer transition-all border border-[#E7E7F0] hover:border-[#5142C5]"
              onClick={() => toggleFaq(idx)}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-[#16162A]">{faq.q}</h3>
                <ChevronDown
                  size={18}
                  className={`text-[#5142C5] transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''
                    }`}
                />
              </div>
              {openFaq === idx && (
                <p className="text-xs text-[#707080] mt-3 pt-3 border-t border-[#E7E7F0] leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </p>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 7. EMERGENCY CALLOUT BANNER (GRADIENT PURPLE #5142C5) */}
      {/* ========================================================= */}
      <section className="max-w-6xl w-full mx-auto px-6 md:px-12 pb-16">
        <Card gradient className="p-8 md:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-white flex items-center justify-center mx-auto">
            <Stethoscope size={36} />
          </div>

          <div className="max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-black text-white">Ready to Experience NurseFlow?</h2>
            <p className="text-xs md:text-sm text-purple-100">
              Join thousands of healthcare personnel utilizing modern smart rostering today.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Button
              size="lg"
              onClick={() => navigate('/select-role')}
              icon={<ArrowRight size={18} />}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-lg text-white border-2 border-white/50 font-black shadow-[0_8px_32px_0_rgba(0,0,0,0.25)] hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl px-8 py-3.5"
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/login')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold hover:scale-105 active:scale-95 transition-all duration-300 rounded-2xl px-8 py-3.5"
            >
              Staff Login
            </Button>
          </div>
        </Card>
      </section>

      {/* ========================================================= */}
      {/* 8. ATTRACTIVE HIGH-END PREMIUM FOOTER */}
      {/* ========================================================= */}
      <footer className="bg-gradient-to-br from-[#0C162D] via-[#16162A] to-[#080E21] text-white border-t border-purple-500/20 relative overflow-hidden pt-16 pb-8 px-6 md:px-12">
        {/* Ambient Glow Orbs */}
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          {/* Top Newsletter Card Banner */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
                Stay Updated with Medical Staffing Insights
              </h3>
              <p className="text-xs md:text-sm text-purple-200/80">
                Join over 12,000+ healthcare managers receiving monthly roster optimization tips.
              </p>
            </div>
            <div className="flex w-full md:w-auto items-center gap-2">
              <input
                type="email"
                placeholder="Enter your hospital email..."
                className="bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-[#EDE9FE] w-full md:w-64"
              />
              <button
                type="button"
                className="bg-[#EDE9FE] hover:bg-white text-[#5142C5] font-black text-xs px-6 py-3 rounded-2xl transition-all shadow-nurse-sm shrink-0 hover:scale-105 active:scale-95"
              >
                Subscribe
              </button>
            </div>
          </div>

          {/* Main Footer Link Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#EDE9FE]">
                  <Stethoscope size={22} />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white tracking-tight">NurseFlow</h4>
                  <p className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">
                    Smart Roster. Better Care.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
                The world's first smart administrative platform designed by nurses, for nurses. Bringing prestige, transparency, and AI efficiency to healthcare staffing.
              </p>

              {/* Contact Info */}
              <div className="space-y-2 text-slate-300 text-xs pt-1">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-purple-400 shrink-0" />
                  <span>1200 Healthcare Plaza, Suite 400, Chicago, IL</span>
                </div>
                <div className="flex items-center gap-2">
                  <PhoneCall size={14} className="text-purple-400 shrink-0" />
                  <span>+1 (555) 000-FLOW</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-purple-400 shrink-0" />
                  <span>support@nurseflow.com</span>
                </div>
              </div>

              {/* Social Media Glass Icons */}
              <div className="flex items-center gap-2 pt-2">
                {['LinkedIn', 'Twitter', 'Instagram', 'YouTube'].map((social, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center font-bold text-[10px] cursor-pointer transition-all hover:scale-110"
                  >
                    {social[0]}
                  </span>
                ))}
              </div>
            </div>

            {/* Product Column */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider text-purple-300">
                Product
              </h5>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#features" className="hover:text-white transition-colors">Care Roster</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Shift Swapping</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Socket Alerts</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Duty Analytics</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Role Access</a></li>
              </ul>
            </div>

            {/* Solutions Column */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider text-purple-300">
                Solutions
              </h5>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">General Wards</a></li>
                <li><a href="#" className="hover:text-white transition-colors">ICU Staffing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency Rooms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pediatrics Care</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Outpatient Clinics</a></li>
              </ul>
            </div>

            {/* Company & Compliance Column */}
            <div className="space-y-3">
              <h5 className="font-extrabold text-white text-xs uppercase tracking-wider text-purple-300">
                Company & Legal
              </h5>
              <ul className="space-y-2 text-slate-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li className="flex items-center gap-2">
                  <a href="#" className="hover:text-white transition-colors">Careers</a>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Hiring
                  </span>
                </li>
                <li><a href="#" className="hover:text-white transition-colors">HIPAA Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Copyright & Systems Live Indicator */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400 font-medium">
            <p>© 2025 NurseFlow Inc. All rights reserved. Built for healthcare excellence.</p>
            <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.99% Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

