export interface Project {
  id: string;
  name: string;
  category: string;
  members: string[];
}

export type UserType = 'ALUMNO' | 'MAESTRO';

export interface Evaluation {
  id: string;
  projectId: string;
  userType: UserType;
  innovation: number; // 1-5
  design: number; // 1-5
  functionality: number; // 1-5
  wouldPay: boolean;
  comment: string;
  timestamp: number;
}

export interface AppState {
  currentView: 'HOME' | 'VOTE' | 'ADMIN_LOGIN' | 'ADMIN_DASHBOARD';
  selectedProjectId: string | null;
  isAdmin: boolean;
}

// Chart data types
export interface ProjectStats {
  id: string;
  name: string;
  totalVotes: number;
  avgInnovation: number;
  avgDesign: number;
  avgFunctionality: number;
  payYes: number;
  payNo: number;
}