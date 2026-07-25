import {
  User,
  Department,
  Shift,
  Roster,
  LeaveRequest,
  ShiftSwapRequest,
  Notification,
  CommunicationScenario,
  CommunicationSession,
  CommunicationMessage,
  CommunicationAnalysis,
  NurseGameScore,
} from '../types';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('nurseflow_token');
};

export const setAuthToken = (token: string) => {
  localStorage.setItem('nurseflow_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('nurseflow_token');
};

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'An error occurred while communicating with NurseFlow server');
  }

  return data as T;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (payload: any) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getMe: () => request<any>('/auth/me'),
  resetPassword: (email: string) =>
    request<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  // Users
  getUsers: (params?: { role?: string; departmentId?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/users${query ? `?${query}` : ''}`);
  },
  getUser: (id: string) => request<any>(`/users/${id}`),
  updateProfile: (payload: any) =>
    request<any>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Departments & Shifts
  getDepartments: () => request<any[]>('/departments'),
  getShifts: () => request<any[]>('/shifts'),

  // Rosters
  getRosters: (params?: { nurseId?: string; departmentId?: string; startDate?: string; endDate?: string; date?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/rosters${query ? `?${query}` : ''}`);
  },
  getRoster: (id: string) => request<any>(`/rosters/${id}`),
  createRoster: (payload: any) =>
    request<any>('/rosters', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  updateRoster: (id: string, payload: any) =>
    request<any>(`/rosters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  // Leave Requests
  getLeaveRequests: (params?: { nurseId?: string; status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/leave-requests${query ? `?${query}` : ''}`);
  },
  createLeaveRequest: (payload: any) =>
    request<any>('/leave-requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  approveLeaveRequest: (id: string) =>
    request<any>(`/leave-requests/${id}/approve`, {
      method: 'PATCH',
    }),
  rejectLeaveRequest: (id: string) =>
    request<any>(`/leave-requests/${id}/reject`, {
      method: 'PATCH',
    }),

  // Shift Swap Requests
  getShiftSwaps: (params?: { status?: string }) => {
    const query = new URLSearchParams(params as any).toString();
    return request<any[]>(`/shift-swaps${query ? `?${query}` : ''}`);
  },
  createShiftSwap: (payload: any) =>
    request<any>('/shift-swaps', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  approveShiftSwap: (id: string) =>
    request<any>(`/shift-swaps/${id}/approve`, {
      method: 'PATCH',
    }),
  rejectShiftSwap: (id: string) =>
    request<any>(`/shift-swaps/${id}/reject`, {
      method: 'PATCH',
    }),

  // Notifications
  getNotifications: () => request<any[]>('/notifications'),
  markNotificationRead: (id: string) =>
    request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    }),
  markAllNotificationsRead: () =>
    request<any>('/notifications/read-all', {
      method: 'PATCH',
    }),
  sendEmergencyAlert: (title: string, message: string) =>
    request<any>('/notifications/send-alert', {
      method: 'POST',
      body: JSON.stringify({ title, message }),
    }),

  // Reports
  getReports: () => request<any>('/reports'),

  // AI Patient Communication Simulator (Gemma 4 Integration)
  getCommunicationScenarios: () => request<CommunicationScenario[]>('/communication-simulator/scenarios'),
  startCommunicationSession: (payload: { scenarioId: string; characterRole?: string; difficulty?: string }) =>
    request<CommunicationSession>('/communication-simulator/sessions', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getCommunicationSession: (id: string) => request<CommunicationSession>(`/communication-simulator/sessions/${id}`),
  sendCommunicationMessage: (id: string, content: string) =>
    request<{ nurseMsg: CommunicationMessage; patientMsg: CommunicationMessage; emotion: string }>(
      `/communication-simulator/sessions/${id}/messages`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    ),
  endCommunicationSession: (id: string) =>
    request<{ message: string; analysis: CommunicationAnalysis }>(`/communication-simulator/sessions/${id}/end`, {
      method: 'POST',
    }),
  getCommunicationResults: (id: string) => request<CommunicationSession>(`/communication-simulator/sessions/${id}/results`),
  getCommunicationProgress: () => request<CommunicationSession[]>('/communication-simulator/progress'),

  // AI Tick & Cross (Tic-Tac-Toe) Break Game (Gemma 4 Integration)
  getTicTacToeAIMove: (payload: { board: (string | null)[]; aiSymbol?: string; userSymbol?: string; difficulty?: string }) =>
    request<{ aiMoveIndex: number; updatedBoard: (string | null)[]; winner: string | null }>('/games/tic-tac-toe/move', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  saveTicTacToeScore: (outcome: 'NURSE_WIN' | 'AI_WIN' | 'DRAW') =>
    request<NurseGameScore>('/games/tic-tac-toe/score', {
      method: 'POST',
      body: JSON.stringify({ outcome }),
    }),
  getTicTacToeScore: () => request<NurseGameScore>('/games/tic-tac-toe/score'),
};
