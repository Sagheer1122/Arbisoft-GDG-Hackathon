import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  RotateCcw,
  HeartHandshake,
  MessageCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { CommunicationSession, CommunicationAnalysis } from '../types';

export const CommunicationResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<CommunicationSession | null>(null);
  const [analysis, setAnalysis] = useState<CommunicationAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchResults = async () => {
      try {
        setLoading(true);
        const data = await api.getCommunicationResults(id);
        setSession(data);
        setAnalysis(data.analysis || null);
      } catch (err) {
        console.error('Error loading results:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [id]);

  const parseArray = (jsonStr?: string) => {
    if (!jsonStr) return [];
    try {
      return JSON.parse(jsonStr);
    } catch {
      return [];
    }
  };

  const strengths = parseArray(analysis?.strengths);
  const improvementAreas = parseArray(analysis?.improvementAreas);
  const highlights = parseArray(analysis?.highlights);

  const skillsList = [
    { label: 'Empathy', score: analysis?.empathyScore || 85 },
    { label: 'Active Listening', score: analysis?.activeListeningScore || 78 },
    { label: 'Clarity', score: analysis?.clarityScore || 90 },
    { label: 'Professionalism', score: analysis?.professionalismScore || 94 },
    { label: 'Emotional Intelligence', score: analysis?.emotionalIntelligenceScore || 82 },
    { label: 'De-escalation', score: analysis?.deEscalationScore || 80 },
    { label: 'Patient Engagement', score: analysis?.patientEngagementScore || 84 },
    { label: 'Confidence', score: analysis?.confidenceScore || 88 },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white p-6 md:p-8 rounded-card shadow-nurse-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#EDE9FE] text-xs font-bold border border-white/20">
            <BrainCircuit size={16} className="text-[#FACC15]" /> Gemma 4 Performance Evaluation
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Communication Performance Report
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed font-medium">
            Scenario: <strong className="text-white">{session?.scenario?.title}</strong> • Role:{' '}
            <strong className="text-white">{session?.characterRole}</strong>
          </p>
        </div>

        {/* Overall Score Circle */}
        <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 text-center space-y-1 min-w-[170px] shadow-2xl">
          <span className="text-xs text-purple-200 font-extrabold uppercase tracking-wider block">
            Overall Score
          </span>
          <span className="text-4xl font-black text-[#FACC15]">
            {analysis?.overallScore || 87}
            <span className="text-xs font-bold text-white">/100</span>
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-3 py-0.5 rounded-full border border-emerald-400/30 inline-block">
            Mastery Level
          </span>
        </div>
      </div>

      {/* Competency Skill Gauges Grid */}
      <Card className="p-6 space-y-6 shadow-nurse-md">
        <h2 className="text-lg font-black text-[#16162A] border-b border-[#E7E7F0] pb-3">
          Communication Competency Breakdown
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skillsList.map((skill, idx) => (
            <div key={idx} className="bg-[#F7F7FB] border border-[#E7E7F0] rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#16162A]">
                <span>{skill.label}</span>
                <strong className="text-[#5142C5] font-extrabold">{skill.score}%</strong>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#5142C5] h-full rounded-full transition-all duration-500"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Strengths & Improvement Areas Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="p-6 space-y-4 shadow-nurse-sm border-t-4 border-t-emerald-500">
          <div className="flex items-center gap-2 text-emerald-700 font-black text-base">
            <CheckCircle2 size={20} />
            <h3>Key Strengths</h3>
          </div>
          <ul className="space-y-2 text-xs text-[#16162A]">
            {strengths.map((str: string, i: number) => (
              <li key={i} className="flex items-start gap-2 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                <span className="text-emerald-600 font-bold">•</span>
                <span className="font-medium">{str}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Improvement Areas */}
        <Card className="p-6 space-y-4 shadow-nurse-sm border-t-4 border-t-amber-500">
          <div className="flex items-center gap-2 text-amber-700 font-black text-base">
            <AlertTriangle size={20} />
            <h3>Areas for Growth</h3>
          </div>
          <ul className="space-y-2 text-xs text-[#16162A]">
            {improvementAreas.map((area: string, i: number) => (
              <li key={i} className="flex items-start gap-2 bg-amber-50/50 p-2.5 rounded-xl border border-amber-100">
                <span className="text-amber-600 font-bold">•</span>
                <span className="font-medium">{area}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Conversation Highlights Section */}
      {highlights.length > 0 && (
        <Card className="p-6 space-y-4 shadow-nurse-md">
          <h2 className="text-lg font-black text-[#16162A]">Conversation Highlights & Quotes</h2>
          <div className="space-y-3">
            {highlights.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border space-y-1.5 text-xs ${
                  item.type === 'GOOD'
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/40 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-full ${
                      item.type === 'GOOD'
                        ? 'bg-emerald-200 text-emerald-800'
                        : 'bg-amber-200 text-amber-800'
                    }`}
                  >
                    {item.type === 'GOOD' ? '👍 Effective Response' : '💡 Growth Opportunity'}
                  </span>
                </div>
                <p className="italic font-semibold text-xs text-[#16162A]">"{item.quote}"</p>
                <p className="text-[11px] text-[#707080] leading-relaxed">{item.feedback}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Gemma 4 AI Advice Summary */}
      <Card className="p-6 bg-[#EDE9FE]/30 border border-[#EDE9FE] space-y-3 shadow-nurse-sm">
        <div className="flex items-center gap-2 text-[#5142C5] font-black text-sm">
          <BrainCircuit size={18} />
          <h3>Gemma 4 AI Clinical Feedback</h3>
        </div>
        <p className="text-xs text-[#16162A] leading-relaxed font-medium">
          {analysis?.feedback}
        </p>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E7E7F0]">
        <Button
          variant="outline"
          onClick={() => navigate('/nurse/communication-simulator')}
          icon={<RotateCcw size={16} />}
          className="w-full sm:w-auto font-bold text-xs"
        >
          Practice Another Scenario
        </Button>
        <Button
          onClick={() => navigate('/nurse/dashboard')}
          icon={<ArrowRight size={16} />}
          className="w-full sm:w-auto font-black text-xs bg-[#5142C5] hover:bg-[#3D2DA8] text-white px-8"
        >
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};
