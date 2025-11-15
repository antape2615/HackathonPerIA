export type ProgrammingLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'java'
  | 'go'
  | 'csharp'
  | 'ruby'
  | 'php'
  | 'cpp';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type UserRole = 'EVALUATOR' | 'CANDIDATE' | 'ADMIN';

export type TestStatus = 'draft' | 'published' | 'archived';

export type SubmissionStatus = 'pending' | 'in_progress' | 'completed' | 'evaluated';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  code?: string;
  errors?: Record<string, string[]>;
}
