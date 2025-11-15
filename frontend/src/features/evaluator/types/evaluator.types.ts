export interface EvaluatorStats {
  totalTests: number;
  publishedTests: number;
  draftTests: number;
  totalCandidates: number;
  averageScore: number;
  recentSubmissions: number;
}

export interface TestFormStep {
  id: number;
  title: string;
  isComplete: boolean;
}
