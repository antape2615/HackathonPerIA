
export enum ViewState {
  LOGIN = 'LOGIN',
  EVALUATOR_DASHBOARD = 'EVALUATOR_DASHBOARD',
  CREATE_TEST = 'CREATE_TEST',
  CANDIDATES_LIST = 'CANDIDATES_LIST',
  TEST_RESULTS = 'TEST_RESULTS',
  CANDIDATE_LANDING = 'CANDIDATE_LANDING',
  CANDIDATE_EXAM = 'CANDIDATE_EXAM',
  CANDIDATE_FINISHED = 'CANDIDATE_FINISHED'
}

// Simulated Provider Enum for Environment Configuration
export enum AIProvider {
  GOOGLE_GEMINI = 'Google Gemini 2.5',
  OPENAI_GPT4 = 'OpenAI GPT-4o', 
  HYBRID = 'Hybrid Cluster'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'Multiple Choice',
  DRAG_DROP = 'Drag & Drop',
  CASE_STUDY = 'Case Study',
  HOT_AREA = 'Hot Area',
  HOTSPOT_CODE = 'Hotspot Code',
  REORDER_STEPS = 'Reorder Steps',
  BEST_ANSWER = 'Best Answer',
  YES_NO = 'Yes/No',
  REPEATED_ANSWERS = 'Repeated Answers',
  LAB_BASED = 'Lab-Based',
  FILL_BLANK = 'Fill-in-the-Blank',
  SCENARIO_MULTISTEP = 'Scenario Multi-step'
}

export enum Difficulty {
  JUNIOR = 'Junior',
  MID = 'Mid-Level',
  SENIOR = 'Senior',
  EXPERT = 'Principal/Expert'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctOptionIndex?: number;
  correctOptionIndices?: number[];
  correctOrder?: string[];
  starterCode?: string;
  blanks?: string[];
  topic?: string;
  snippet?: string;
}

export interface Assessment {
  id: string;
  serialCode?: string; // New field for Serial Code
  title: string;
  language: string;
  framework: string;
  topics: string[];
  difficulty: Difficulty;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
  isTemplate?: boolean;
  providerConfig?: AIProvider; // Mock field for provider tracking
}

export interface Submission {
  assessmentId: string;
  candidateName: string;
  candidateEmail: string;
  answers: Record<string, any>;
  timeSpentSeconds: number;
  warnings: number;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  role?: string;
  experienceLevel?: string;
  assignedAssessmentId?: string;
  linkedSerialCode?: string; // Code from external system to match official tests
  status: 'PENDING' | 'SENT' | 'IN_PROGRESS' | 'COMPLETED' | 'APPROVED' | 'REJECTED';
  uniqueLink?: string;
  submissionDate?: string;
  score?: number;
  submission?: Submission;
  isBotAssigned?: boolean; // Indicates if assigned to an automated bot
}

export interface AIAnalysis {
  score: number;
  summary: string;
  hiringRecommendation: 'Strong Hire' | 'Hire' | 'Weak Hire' | 'No Hire';
  codeQuality: number;
  problemSolving: number;
  theoreticalKnowledge: number;
  bestPractices: number;
  securityScore: number;
  performanceScore: number;
  strengths: string[];
  weaknesses: string[];
  detectedIssues: string[];
  levelEstimated: string;
  modelSignature?: string; // E.g., "gpt-4-turbo" or "gemini-2.5"
}