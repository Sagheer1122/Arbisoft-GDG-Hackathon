import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  Send,
  Clock,
  Square,
  AlertTriangle,
  User,
  HeartHandshake,
  Sparkles,
  ArrowLeft,
  Smile,
  Frown,
  Meh,
  Flame,
} from 'lucide-react';
import { api } from '../services/api';
import { CommunicationSession, CommunicationMessage } from '../types';

export const CommunicationSessionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<CommunicationSession | null>(null);
  const [messages, setMessages] = useState<CommunicationMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentEmotion, setCurrentEmotion] = useState<string>('Worried');
  const [sending, setSending] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch session data
  useEffect(() => {
    if (!id) return;
    const fetchSession = async () => {
      try {
        const data = await api.getCommunicationSession(id);
        setSession(data);
        setMessages(data.messages || []);
        const lastPatientMsg = data.messages.filter((m) => m.role === 'PATIENT').pop();
        if (lastPatientMsg?.emotion) {
          setCurrentEmotion(lastPatientMsg.emotion);
        }
      } catch (err) {
        console.warn('Error fetching session, creating demo session view:', err);
        const demoSession: CommunicationSession = {
          id: id || 'demo-1',
          userId: 'sarah',
          scenarioId: 'scen-1',
          characterRole: 'Parent',
          difficulty: 'ADVANCED',
          startedAt: new Date().toISOString(),
          status: 'ACTIVE',
          scenario: {
            id: 'scen-1',
            title: 'Difficult Conversation',
            category: 'Patient',
            description: 'Support a worried parent whose child needs to remain hospitalized overnight for monitoring.',
            characterRole: 'Parent',
            personality: 'Frightened',
            difficulty: 'ADVANCED',
            objectives: JSON.stringify(['Delivering sensitive news', 'Active listening', 'Emotional support', 'Clarity']),
          },
          messages: [
            {
              id: 'm1',
              sessionId: id || 'demo-1',
              role: 'PATIENT',
              content: `I've been waiting for over an hour. Nobody is explaining anything to me! Why does my child need to stay overnight?`,
              emotion: 'Frustrated',
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: new Date().toISOString(),
        };
        setSession(demoSession);
        setMessages(demoSession.messages);
        setCurrentEmotion('Frustrated');
      }
    };
    fetchSession();
  }, [id]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !id || sending) return;

    const userText = inputMessage;
    setInputMessage('');
    setSending(true);

    try {
      const res = await api.sendCommunicationMessage(id, userText);
      setMessages((prev) => [...prev, res.nurseMsg, res.patientMsg]);
      setCurrentEmotion(res.emotion);
    } catch (err) {
      console.warn('Error sending roleplay message, using demo AI response:', err);
      const nurseMsg: CommunicationMessage = {
        id: `n-${Date.now()}`,
        sessionId: id,
        role: 'NURSE',
        content: userText,
        createdAt: new Date().toISOString(),
      };
      const patientMsg: CommunicationMessage = {
        id: `p-${Date.now()}`,
        sessionId: id,
        role: 'PATIENT',
        content: `Thank you for explaining that to me so calmly. That makes me feel much more reassured about what is happening.`,
        emotion: 'Calm',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, nurseMsg, patientMsg]);
      setCurrentEmotion('Calm');
    } finally {
      setSending(false);
    }
  };

  const handleEndAndAnalyze = async () => {
    if (!id) return;
    try {
      setAnalyzing(true);
      await api.endCommunicationSession(id);
      navigate(`/nurse/communication-simulator/session/${id}/results`);
    } catch (err) {
      console.error('Error ending simulation:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEmotionBadge = (emotion: string) => {
    switch (emotion) {
      case 'Reassured':
      case 'Calm':
        return { label: emotion, bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: Smile };
      case 'Worried':
      case 'Confused':
        return { label: emotion, bg: 'bg-amber-100 text-amber-800 border-amber-300', icon: Meh };
      case 'Frustrated':
      case 'Angry':
      case 'Hostile':
        return { label: emotion, bg: 'bg-rose-100 text-rose-800 border-rose-300', icon: Flame };
      default:
        return { label: emotion, bg: 'bg-purple-100 text-purple-800 border-purple-300', icon: Smile };
    }
  };

  const emotionInfo = getEmotionBadge(currentEmotion);
  const EmotionIcon = emotionInfo.icon;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Session Top Bar */}
      <div className="bg-white border border-[#E7E7F0] p-4 rounded-2xl shadow-nurse-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/nurse/communication-simulator')}
            className="p-2 rounded-xl bg-[#F7F7FB] text-[#707080] hover:text-[#5142C5] hover:bg-[#EDE9FE] transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="font-black text-lg text-[#16162A]">
              {session?.scenario?.title || 'Patient Communication Simulation'}
            </h1>
            <p className="text-xs text-[#707080] font-medium">
              Role: <strong className="text-[#16162A]">{session?.characterRole}</strong> • Difficulty:{' '}
              <strong className="text-[#5142C5]">{session?.difficulty}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Live Emotion Tracker Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-extrabold text-xs shadow-sm ${emotionInfo.bg}`}
          >
            <EmotionIcon size={14} />
            <span>Character State: {currentEmotion}</span>
          </div>

          {/* Session Timer */}
          <div className="flex items-center gap-1.5 bg-[#F7F7FB] px-3 py-1 rounded-full border border-[#E7E7F0] text-xs font-bold text-[#16162A]">
            <Clock size={14} className="text-[#5142C5]" />
            <span>{formatTimer(timerSeconds)}</span>
          </div>

          {/* End Simulation Button */}
          <Button
            variant="outline"
            onClick={() => setShowEndModal(true)}
            className="border-rose-200 text-rose-700 hover:bg-rose-50 font-bold"
          >
            <Square size={14} className="fill-current" /> End Simulation
          </Button>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <Card className="p-6 h-[500px] flex flex-col justify-between shadow-nurse-md relative">
        {/* Messages Scroll Area */}
        <div className="overflow-y-auto space-y-4 pr-2 flex-1">
          {messages.map((msg, idx) => {
            const isNurse = msg.role === 'NURSE';
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 ${isNurse ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                    isNurse
                      ? 'bg-[#5142C5] text-white'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {isNurse ? 'You' : 'AI'}
                </div>

                {/* Message Bubble */}
                <div
                  className={`max-w-[75%] space-y-1 ${
                    isNurse ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-[#707080] font-semibold justify-end">
                    <span>{isNurse ? 'Nurse (You)' : session?.characterRole || 'Patient'}</span>
                    {!isNurse && msg.emotion && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full font-bold">
                        {msg.emotion}
                      </span>
                    )}
                  </div>
                  <div
                    className={`p-4 rounded-2xl text-xs font-medium leading-relaxed shadow-sm ${
                      isNurse
                        ? 'bg-[#5142C5] text-white rounded-tr-none'
                        : 'bg-[#F7F7FB] text-[#16162A] border border-[#E7E7F0] rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="flex items-center gap-2 text-xs text-[#707080] italic pt-2">
              <span className="w-2 h-2 rounded-full bg-[#5142C5] animate-ping" />
              <span>Simulated patient is formulating a response...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="pt-4 border-t border-[#E7E7F0] flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your response to the patient..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={sending}
            className="flex-1 p-3.5 bg-[#F7F7FB] border border-[#E7E7F0] rounded-2xl text-xs font-medium text-[#16162A] placeholder-slate-400 focus:outline-none focus:border-[#5142C5] focus:ring-2 focus:ring-[#5142C5]/20"
          />
          <Button
            type="submit"
            disabled={sending || !inputMessage.trim()}
            icon={<Send size={16} />}
            className="bg-[#5142C5] hover:bg-[#3D2DA8] text-white font-bold py-3.5 px-5 rounded-2xl"
          >
            Send
          </Button>
        </form>
      </Card>

      {/* End Simulation Confirmation Modal */}
      <Modal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        title="End Simulation?"
      >
        <div className="space-y-4">
          <p className="text-xs text-[#707080] leading-relaxed">
            Are you sure you want to end this communication scenario? Gemma 4 AI will immediately evaluate your transcript across 8 key competencies.
          </p>

          <div className="flex gap-3 justify-end pt-2">
            <Button
              variant="outline"
              onClick={() => setShowEndModal(false)}
              className="font-bold text-xs"
            >
              Continue Simulation
            </Button>
            <Button
              onClick={handleEndAndAnalyze}
              isLoading={analyzing}
              className="bg-[#5142C5] hover:bg-[#3D2DA8] text-white font-bold text-xs px-5"
            >
              End & Analyze Results
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
