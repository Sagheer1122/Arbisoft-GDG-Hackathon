export type UserRole = 'NURSE' | 'ADMIN' | 'HEAD_NURSE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  employeeId: string;
  departmentId?: string;
  department?: Department;
  avatar?: string;
  createdAt?: string;
}

export interface Department {
  id: string;
  name: string;
  description?: string;
}

export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT' | 'OFF';

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  type: ShiftType;
  color: string;
}

export interface Roster {
  id: string;
  nurseId: string;
  nurse: User;
  shiftId: string;
  shift: Shift;
  departmentId: string;
  department: Department;
  date: string;
  status: 'ON_DUTY' | 'SCHEDULED' | 'OFF' | 'COMPLETED';
  notes?: string;
  createdBy?: string;
  createdAt?: string;
}

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveRequest {
  id: string;
  nurseId: string;
  nurse: User;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  attachment?: string;
  status: LeaveStatus;
  reviewedBy?: string;
  reviewer?: User;
  reviewedAt?: string;
  createdAt: string;
}

export type SwapStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ShiftSwapRequest {
  id: string;
  requesterId: string;
  requester: User;
  targetNurseId: string;
  targetNurse: User;
  originalShiftId: string;
  originalShift: Shift;
  requestedDate: string;
  reason: string;
  status: SwapStatus;
  reviewedBy?: string;
  reviewer?: User;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'SHIFTS' | 'LEAVE' | 'SWAP' | 'ROSTER' | 'ALERT' | 'INFO';
  isRead: boolean;
  createdAt: string;
}

// AI PATIENT COMMUNICATION SIMULATOR TYPES
export interface CommunicationScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  characterRole: string;
  personality: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  objectives: string; // JSON string
  createdAt?: string;
}

export interface CommunicationMessage {
  id: string;
  sessionId: string;
  role: 'NURSE' | 'PATIENT';
  content: string;
  emotion?: string;
  createdAt: string;
}

export interface CommunicationAnalysis {
  id: string;
  sessionId: string;
  overallScore: number;
  empathyScore: number;
  activeListeningScore: number;
  clarityScore: number;
  professionalismScore: number;
  emotionalIntelligenceScore: number;
  deEscalationScore: number;
  patientEngagementScore: number;
  confidenceScore: number;
  strengths: string; // JSON string
  improvementAreas: string; // JSON string
  feedback: string;
  highlights?: string; // JSON string
  createdAt: string;
}

export interface CommunicationSession {
  id: string;
  userId: string;
  scenarioId: string;
  characterRole: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  startedAt: string;
  endedAt?: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ABANDONED';
  overallScore?: number;
  scenario: CommunicationScenario;
  messages: CommunicationMessage[];
  analysis?: CommunicationAnalysis;
  createdAt: string;
}

export interface NurseGameScore {
  id?: string;
  userId: string;
  gameType: string;
  nurseWins: number;
  aiWins: number;
  draws: number;
  pointsEarned: number;
}
