import { ProgrammingLanguage, Difficulty } from '@/shared/types';

export const PROGRAMMING_LANGUAGES: { value: ProgrammingLanguage; label: string }[] = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'cpp', label: 'C++' },
];

export const FRAMEWORKS: Record<ProgrammingLanguage, string[]> = {
  javascript: ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js', 'Vanilla'],
  typescript: ['React', 'Vue', 'Angular', 'Node.js', 'NestJS', 'Next.js'],
  python: ['Django', 'Flask', 'FastAPI', 'Pandas', 'NumPy', 'Vanilla'],
  java: ['Spring Boot', 'Jakarta EE', 'Hibernate', 'Vanilla'],
  go: ['Gin', 'Echo', 'Fiber', 'Vanilla'],
  csharp: ['.NET Core', 'ASP.NET', 'Entity Framework', 'Vanilla'],
  ruby: ['Rails', 'Sinatra', 'Vanilla'],
  php: ['Laravel', 'Symfony', 'CodeIgniter', 'Vanilla'],
  cpp: ['Qt', 'Boost', 'STL', 'Vanilla'],
};

export const DIFFICULTIES: { value: Difficulty; label: string; color: string }[] = [
  { value: 'easy', label: 'Easy', color: 'success' },
  { value: 'medium', label: 'Medium', color: 'warning' },
  { value: 'hard', label: 'Hard', color: 'danger' },
];

export const TEST_DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 45, label: '45 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' },
  { value: 120, label: '2 hours' },
];

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Evaluator routes
  EVALUATOR_DASHBOARD: '/evaluator',
  CREATE_TEST: '/evaluator/tests/create',
  EDIT_TEST: '/evaluator/tests/:id/edit',
  TEST_LIST: '/evaluator/tests',
  TEST_RESULTS: '/evaluator/tests/:id/results',

  // Candidate routes
  CANDIDATE_DASHBOARD: '/candidate',
  AVAILABLE_TESTS: '/candidate/tests',
  TAKE_TEST: '/candidate/tests/:id/take',
  MY_RESULTS: '/candidate/results',
  RESULT_DETAIL: '/candidate/results/:id',

  // Analytics
  ANALYTICS: '/analytics',
} as const;

export const API_ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',

    // Tests
    TESTS: '/tests',
    TEST_BY_ID: (id: string) => `/tests/${id}`,
    CREATE_TEST: '/tests',
    UPDATE_TEST: (id: string) => `/tests/${id}`,
    DELETE_TEST: (id: string) => `/tests/${id}`,
    PUBLISH_TEST: (id: string) => `/tests/${id}/publish`,

    // Evaluations (Sessions)
    START_TEST: (testId: string) => `/evaluations/start/${testId}`,
    GET_SESSION: (sessionId: string) => `/evaluations/session/${sessionId}`,
    SUBMIT_ANSWER: '/evaluations/submit-answer',
    FINISH_TEST: (sessionId: string) => `/evaluations/finish/${sessionId}`,
    SESSION_RESULTS: (sessionId: string) => `/evaluations/results/${sessionId}`,
    MY_SESSIONS: '/evaluations/my-sessions',

    // AI Evaluation
    EVALUATE_CODE: '/ai/evaluate',
    GENERATE_QUESTION: '/ai/generate-question',

    // Analytics
    ANALYTICS: '/analytics',
    EVALUATOR_STATS: '/analytics/evaluator',
    CANDIDATE_STATS: '/analytics/candidate',
    TEST_ANALYTICS: (testId: string) => `/analytics/test/${testId}`,
} as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'auth_user',
  THEME: 'theme',
  DRAFT_TEST: 'draft_test',
} as const;

export const QUERY_KEYS = {
  TESTS: 'tests',
  TEST: 'test',
  SUBMISSIONS: 'submissions',
  SUBMISSION: 'submission',
  EVALUATIONS: 'evaluations',
  EVALUATION: 'evaluation',
  ANALYTICS: 'analytics',
  USER: 'user',
} as const;
