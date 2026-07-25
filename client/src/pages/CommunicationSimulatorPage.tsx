import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  HeartHandshake,
  Users,
  Sparkles,
  Play,
  TrendingUp,
  Award,
  BookOpen,
  ArrowRight,
  Zap,
  ShieldCheck,
  BrainCircuit,
  MessageCircle,
} from 'lucide-react';
import { api } from '../services/api';
import { CommunicationScenario, CommunicationSession } from '../types';

const FALLBACK_SCENARIOS: CommunicationScenario[] = [
  {
    id: 'scen-1',
    title: 'Anxious Patient',
    category: 'Patient',
    description: 'Practice communicating with a patient who is worried and afraid about their upcoming diagnostic test.',
    characterRole: 'Patient',
    personality: 'Anxious',
    difficulty: 'BEGINNER',
    objectives: JSON.stringify(['Empathy', 'Reassurance', 'Active listening', 'Clear explanation']),
  },
  {
    id: 'scen-2',
    title: 'Angry Family Member',
    category: 'Family Member',
    description: 'De-escalate an upset family member who feels their relative has been waiting too long without updates.',
    characterRole: 'Family Member',
    personality: 'Hostile',
    difficulty: 'INTERMEDIATE',
    objectives: JSON.stringify(['De-escalation', 'Calm tone', 'Professional boundaries', 'Active listening']),
  },
  {
    id: 'scen-3',
    title: 'Confused Elderly Patient',
    category: 'Elderly',
    description: 'Communicate with a disorientation-prone elderly patient who wants to leave the ward unassisted.',
    characterRole: 'Elderly Patient',
    personality: 'Confused',
    difficulty: 'BEGINNER',
    objectives: JSON.stringify(['Patient engagement', 'Validation', 'Patience', 'Safety orientation']),
  },
  {
    id: 'scen-4',
    title: 'Non-Cooperative Patient',
    category: 'De-escalation',
    description: 'Engage with a young adult patient refusing prescribed morning medication due to fear of side effects.',
    characterRole: 'Young Adult Patient',
    personality: 'Demanding',
    difficulty: 'INTERMEDIATE',
    objectives: JSON.stringify(['Relationship building', 'Setting expectations', 'Empathy', 'Education']),
  },
  {
    id: 'scen-5',
    title: 'Difficult Conversation',
    category: 'Patient',
    description: 'Support a worried parent whose child needs to remain hospitalized overnight for monitoring.',
    characterRole: 'Parent',
    personality: 'Frightened',
    difficulty: 'ADVANCED',
    objectives: JSON.stringify(['Delivering sensitive news', 'Active listening', 'Emotional support', 'Clarity']),
  },
  {
    id: 'scen-6',
    title: 'Emergency Communication',
    category: 'Emergency',
    description: 'Obtain critical medical history from a flustered caregiver during an acute triage intake.',
    characterRole: 'Caregiver',
    personality: 'Reluctant',
    difficulty: 'ADVANCED',
    objectives: JSON.stringify(['Clear instructions', 'Rapid assessment', 'Maintaining composure', 'Confidence']),
  },
];

export const CommunicationSimulatorPage: React.FC = () => {
  const navigate = useNavigate();

  const [scenarios, setScenarios] = useState<CommunicationScenario[]>(FALLBACK_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<CommunicationScenario>(FALLBACK_SCENARIOS[0]);
  const [selectedCharacter, setSelectedCharacter] = useState<string>('Patient');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER');
  const [progressHistory, setProgressHistory] = useState<CommunicationSession[]>([]);

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [scenariosList, historyList] = await Promise.all([
          api.getCommunicationScenarios().catch(() => FALLBACK_SCENARIOS),
          api.getCommunicationProgress().catch(() => []),
        ]);

        const finalScenarios = scenariosList && scenariosList.length > 0 ? scenariosList : FALLBACK_SCENARIOS;
        setScenarios(finalScenarios);
        setSelectedScenario(finalScenarios[0]);
        setSelectedCharacter(finalScenarios[0].characterRole || 'Patient');
        setSelectedDifficulty((finalScenarios[0].difficulty as any) || 'BEGINNER');
        setProgressHistory(historyList || []);
      } catch (err) {
        console.error('Error loading simulator data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartSimulation = async () => {
    if (!selectedScenario) return;
    try {
      setStarting(true);
      const session = await api.startCommunicationSession({
        scenarioId: selectedScenario.id,
        characterRole: selectedCharacter,
        difficulty: selectedDifficulty,
      });
      navigate(`/nurse/communication-simulator/session/${session.id}`);
    } catch (err) {
      console.warn('Backend start error, creating fallback session:', err);
      // Fallback session navigation if server error
      const mockSessionId = `session-${Date.now()}`;
      navigate(`/nurse/communication-simulator/session/${mockSessionId}`);
    } finally {
      setStarting(false);
    }
  };

  const charactersList = [
    { id: 'Patient', label: 'Patient' },
    { id: 'Family Member', label: 'Family Member' },
    { id: 'Elderly Patient', label: 'Elderly Patient' },
    { id: 'Young Adult Patient', label: 'Young Adult Patient' },
    { id: 'Parent', label: 'Parent' },
    { id: 'Caregiver', label: 'Caregiver' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#5142C5] via-[#3D2DA8] to-[#16162A] text-white p-6 md:p-8 rounded-card shadow-nurse-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-3 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 text-[#EDE9FE] text-xs font-bold border border-white/20">
            <BrainCircuit size={16} className="text-[#FACC15]" /> Gemma 4 AI Training Module
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            AI Patient Communication Simulator
          </h1>
          <p className="text-xs md:text-sm text-purple-100/90 leading-relaxed">
            Practice healthcare communication in realistic roleplay scenarios. Receive personalized AI feedback on empathy, active listening, de-escalation, and clarity.
          </p>
        </div>

        <div className="z-10 shrink-0 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center space-y-1 min-w-[160px]">
          <span className="text-xs text-purple-200 font-bold uppercase tracking-wider block">Average Score</span>
          <span className="text-3xl font-black text-[#FACC15]">
            {progressHistory.length > 0
              ? Math.round(
                  progressHistory.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / progressHistory.length
                )
              : 86}
            <span className="text-xs font-bold text-white">/100</span>
          </span>
          <span className="text-[10px] text-purple-200 block font-semibold">
            {progressHistory.length} Sessions Completed
          </span>
        </div>
      </div>

      {/* Main Grid: Scenario Selector & Configuration */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Select Scenario */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-[#16162A]">Select Training Scenario</h2>
            <span className="text-xs text-[#707080] font-semibold">{scenarios.length} Scenarios Available</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {scenarios.map((scen) => {
              const isSelected = selectedScenario?.id === scen.id;
              const parseObjectives = (jsonStr: string) => {
                try {
                  return JSON.parse(jsonStr);
                } catch {
                  return ['Empathy', 'Communication'];
                }
              };
              const objectives = parseObjectives(scen.objectives);

              return (
                <Card
                  key={scen.id}
                  className={`p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'border-[#5142C5] ring-2 ring-[#5142C5]/30 bg-[#EDE9FE]/20 shadow-nurse-md'
                      : 'hover:border-[#5142C5] hover:shadow-nurse-sm'
                  }`}
                  onClick={() => {
                    setSelectedScenario(scen);
                    setSelectedCharacter(scen.characterRole);
                    setSelectedDifficulty(scen.difficulty as any);
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#5142C5]">
                        {scen.category}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                          scen.difficulty === 'BEGINNER'
                            ? 'bg-emerald-100 text-emerald-800'
                            : scen.difficulty === 'INTERMEDIATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {scen.difficulty}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-base text-[#16162A]">{scen.title}</h3>
                      <p className="text-xs text-[#707080] mt-1 leading-relaxed">{scen.description}</p>
                    </div>
                  </div>

                  {/* Objectives badges */}
                  <div className="pt-3 border-t border-[#E7E7F0] flex flex-wrap gap-1.5">
                    {objectives.slice(0, 3).map((obj: string, i: number) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                        ✓ {obj}
                      </span>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Right Column: Character & Difficulty Selector */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 space-y-6 shadow-nurse-md sticky top-6">
            <h3 className="font-extrabold text-lg text-[#16162A] border-b border-[#E7E7F0] pb-3">
              Configure Simulation
            </h3>

            {/* Selected Scenario Preview */}
            {selectedScenario && (
              <div className="p-3.5 bg-[#F7F7FB] border border-[#E7E7F0] rounded-2xl space-y-1">
                <span className="text-[10px] text-[#707080] font-bold uppercase">Selected Target Scenario</span>
                <p className="font-extrabold text-sm text-[#5142C5]">{selectedScenario.title}</p>
              </div>
            )}

            {/* Character Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#707080] uppercase tracking-wider">
                Simulated Character Role
              </label>
              <select
                value={selectedCharacter}
                onChange={(e) => setSelectedCharacter(e.target.value)}
                className="w-full p-3 bg-white border border-[#E7E7F0] rounded-2xl text-xs font-bold text-[#16162A] focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20"
              >
                {charactersList.map((char) => (
                  <option key={char.id} value={char.id}>
                    {char.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-[#707080] uppercase tracking-wider">
                Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const).map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`py-2 rounded-xl text-[10px] font-extrabold transition-all ${
                      selectedDifficulty === diff
                        ? diff === 'BEGINNER'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : diff === 'INTERMEDIATE'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-rose-600 text-white shadow-sm'
                        : 'bg-[#F7F7FB] text-[#707080] hover:text-[#16162A] border border-[#E7E7F0]'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <Button
              onClick={handleStartSimulation}
              isLoading={starting}
              icon={<Play size={18} />}
              className="w-full py-3.5 text-sm font-black shadow-nurse-md bg-[#5142C5] hover:bg-[#3D2DA8] text-white"
            >
              Start Roleplay Simulation
            </Button>
          </Card>

          {/* Personal Score Trends Widget */}
          {progressHistory.length > 0 && (
            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-2 text-xs font-extrabold text-[#16162A]">
                <TrendingUp size={16} className="text-[#5142C5]" />
                <span>Recent Simulation Performance</span>
              </div>
              <div className="space-y-2">
                {progressHistory.slice(-3).map((sess) => (
                  <div
                    key={sess.id}
                    onClick={() => navigate(`/nurse/communication-simulator/session/${sess.id}/results`)}
                    className="p-3 rounded-xl bg-[#F7F7FB] border border-[#E7E7F0] flex items-center justify-between cursor-pointer hover:border-[#5142C5] transition-all text-xs"
                  >
                    <div>
                      <span className="font-bold text-[#16162A] block">{sess.scenario?.title}</span>
                      <span className="text-[10px] text-[#707080]">
                        {new Date(sess.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="approved">{sess.overallScore}/100</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
