import { Difficulty, ProgrammingLanguage, TestStatus } from './common.types';

export interface Test {
  id: string;
  title: string;
  description: string;
  language: ProgrammingLanguage;
  framework: string;
  difficulty: Difficulty;
  duration: number; // minutes
  questions: Question[];
  status: TestStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
}

export interface Question {
  id: string;
  title: string;
  description: string;
  starterCode: string;
  testCases: TestCase[];
  points: number;
  hints?: string[];
}

export interface TestCase {
  id: string;
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface CreateTestDTO {
  title: string;
  description: string;
  language: ProgrammingLanguage;
  framework: string;
  difficulty: Difficulty;
  duration: number;
  questions: CreateQuestionDTO[];
  tags?: string[];
}

export interface CreateQuestionDTO {
  title: string;
  description: string;
  starterCode: string;
  testCases: CreateTestCaseDTO[];
  points: number;
  hints?: string[];
}

export interface CreateTestCaseDTO {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
  description?: string;
}

export interface UpdateTestDTO extends Partial<CreateTestDTO> {
  status?: TestStatus;
}

export interface TestFilters {
  language?: ProgrammingLanguage;
  difficulty?: Difficulty;
  status?: TestStatus;
  search?: string;
}
