export enum WizardStep {
  Legal,
  Welcome,
  ClientData,
  FileUpload,
  ProblemDescription,
  Analysis,
  Proposals,
  Report,
}

export type NavigationDirection = 'forward' | 'backward' | 'initial';

export interface ClientData {
  companyName: string;
  industry: string;
  companySize: string;
}

export interface FileData {
  name: string;
  content: string; // base64 encoded
  type: string;
}

export interface Diagnosis {
    mainPainPoint: string;
    secondaryPainPoints: string[];
    insights: string[];
    findings: string[];
}

export interface Initiative {
    title: string;
    description: string;
    benefit: string;
    kpis: string[];
    investment: string;
}

export interface Proposals {
    shortTerm: Initiative[];
    mediumTerm: Initiative[];
    longTerm: Initiative[];
}

// New detailed type for the final report to add real value
export interface DetailedInitiative {
    title: string;
    description: string;
    actionableSteps: string[];
    potentialRisks: string[];
    mitigationStrategies: string[];
    kpis: string[];
    requiredRoles: string[];
}

export interface FinalReport {
    executiveSummary: string;
    detailedRoadmap: DetailedInitiative[];
    commercialRecommendation: string;
}


export type ProposalPath = 'shortTerm' | 'mediumTerm' | 'longTerm';

export interface AssessmentState {
  step: WizardStep;
  clientData?: ClientData;
  fileData?: FileData;
  problemDescription?: string;
  diagnosis?: Diagnosis;
  proposals?: Proposals;
  selectedProposalPath?: ProposalPath;
  finalReport?: FinalReport;
  isLoading: boolean;
  isRefining: boolean; // Kept for modal's internal loading state
  error?: string;
  direction: NavigationDirection;
  isEditing: boolean;
  editingPath?: ProposalPath;
  editingInitiativeIndex?: number | null;
}

export type AssessmentAction =
  | { type: 'START_ASSESSMENT' }
  | { type: 'SET_CLIENT_DATA'; payload: ClientData }
  | { type: 'SET_FILE_DATA'; payload: FileData | undefined }
  | { type: 'SET_PROBLEM_DESCRIPTION'; payload: string }
  | { type: 'START_ANALYSIS' }
  | { type: 'ANALYSIS_SUCCESS'; payload: Diagnosis }
  | { type: 'START_PROPOSALS' }
  | { type: 'PROPOSALS_SUCCESS'; payload: Proposals }
  | { type: 'SELECT_PROPOSAL_PATH'; payload: ProposalPath }
  | { type: 'START_REPORT' }
  | { type: 'REPORT_SUCCESS'; payload: FinalReport }
  | { type: 'API_ERROR'; payload: string }
  | { type: 'GO_TO_STEP'; payload: WizardStep }
  | { type: 'RESET' }
  | { type: 'START_PROPOSAL_EDIT'; payload: { path: ProposalPath; index: number } }
  | { type: 'END_PROPOSAL_EDIT' }
  | { type: 'PROPOSAL_EDIT_SUCCESS'; payload: { path: ProposalPath; index: number; initiative: Initiative } };