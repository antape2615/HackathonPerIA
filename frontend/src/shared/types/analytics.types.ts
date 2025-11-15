import { Difficulty, ProgrammingLanguage } from './common.types';

export interface AnalyticsData {
  totalTests: number;
  totalCandidates: number;
  totalSubmissions: number;
  averageScore: number;
  passRate: number;
  languageDistribution: LanguageStats[];
  difficultyBreakdown: DifficultyStats[];
  recentActivity: ActivityLog[];
  performanceTrend: PerformanceDataPoint[];
}

export interface LanguageStats {
  language: ProgrammingLanguage;
  count: number;
  averageScore: number;
  passRate: number;
}

export interface DifficultyStats {
  difficulty: Difficulty;
  count: number;
  averageScore: number;
  passRate: number;
  averageTime: number; // minutes
}

export interface ActivityLog {
  id: string;
  type: 'test_created' | 'test_completed' | 'candidate_registered';
  description: string;
  timestamp: Date;
  userId: string;
  userName: string;
}

export interface PerformanceDataPoint {
  date: string;
  averageScore: number;
  completions: number;
  passRate: number;
}

export interface TopPerformer {
  candidateId: string;
  candidateName: string;
  averageScore: number;
  testsCompleted: number;
  successRate: number;
}

export interface AnalyticsFilters {
  startDate?: Date;
  endDate?: Date;
  language?: ProgrammingLanguage;
  difficulty?: Difficulty;
}
