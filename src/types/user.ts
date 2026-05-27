export type UserTrack = 'explorer' | 'program' | 'bridal';
export type ProgramStatus = 'inactive' | 'active' | 'completed' | 'maintenance';
export type SubscriptionTier = 'none' | 'meals' | 'program' | 'bridal';

export interface UserProfile {
  track: UserTrack;
  programStatus: ProgramStatus;
  currentCycle: number; // 0 = no iniciado, 1+ = ciclo activo
  startDate: string | null; // YYYY-MM-DD
  bridalDeadline: string | null;
  subscriptionPlan: SubscriptionTier;
  baseline?: {
    age?: number;
    height?: number;
    weight?: number;
    conditions?: string[];
  };
  createdAt: string;
  updatedAt: string;
}