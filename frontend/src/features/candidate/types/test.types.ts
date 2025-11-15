export interface Test {
    id: string;
    title: string;
    description: string;
    language: string;
    framework: string;
    difficulty: string;
    duration: number;
    isActive: boolean;
    createdAt: string;
    createdBy: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    _count: {
        questions: number;
    };
}

export interface TestCase {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
    order: number;
}

export interface Question {
    id: string;
    title: string;
    description: string;
    starterCode: string;
    points: number;
    order: number;
    testCases: TestCase[];
}

export interface TestDetail extends Test {
    questions: Question[];
}

export interface Answer {
    id: string;
    sessionId: string;
    questionId: string;
    code: string;
    createdAt: string;
    updatedAt: string;
}

export interface TestSession {
    id: string;
    testId: string;
    candidateId: string;
    status: 'IN_PROGRESS' | 'COMPLETED' | 'EXPIRED';
    expiresAt: string;
    createdAt: string;
    test: TestDetail;
    answers?: Answer[];  // ← AGREGAR ESTO
}

export interface SubmitAnswerData {
    sessionId: string;
    questionId: string;
    code: string;
}

export interface Evaluation {
    id: string;
    sessionId: string;
    score: number;
    feedback: string;
    aiEvaluation: any;
    createdAt: string;
    updatedAt: string;
}

export interface SessionResults {
    id: string;
    testId: string;
    candidateId: string;
    status: string;
    expiresAt: string;
    createdAt: string;
    test: TestDetail;
    answers: Answer[];
    evaluation?: Evaluation;
}