import { SubmissionStatus } from './common.types';

export interface TestSubmission {
  id: string;
  testId: string;
  candidateId: string;
  status: SubmissionStatus;
  answers: QuestionAnswer[];
  startedAt: Date;
  submittedAt?: Date;
  timeSpent: number; // seconds
}

export interface QuestionAnswer {
  questionId: string;
  code: string;
  language: string;
  submittedAt: Date;
}

export interface EvaluationResult {
  id: string;
  submissionId: string;
  testId: string;
  candidateId: string;
  score: number;
  totalPoints: number;
  passedTestCases: number;
  totalTestCases: number;
  aiAnalysis: AIAnalysis;
  questionResults: QuestionResult[];
  completedAt: Date;
  passed: boolean;
}

export interface AIAnalysis {
  overallScore: number;
  codeQuality: number;
  bestPractices: number;
  efficiency: number;
  readability: number;
  feedback: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface QuestionResult {
  questionId: string;
  code: string;
  score: number;
  maxScore: number;
  testCaseResults: TestCaseResult[];
  executionTime: number; // milliseconds
  aiAnalysis: QuestionAIAnalysis;
}

export interface TestCaseResult {
  testCaseId: string;
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  executionTime: number;
  error?: string;
}

export interface QuestionAIAnalysis {
  score: number;
  feedback: string;
  suggestions: string[];
  codeSmells: string[];
  complexity: 'low' | 'medium' | 'high';
}

export interface EvaluateSubmissionDTO {
  submissionId: string;
  answers: QuestionAnswer[];
}
