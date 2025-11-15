import React, { createContext, useReducer, Dispatch, ReactNode } from 'react';
import { AssessmentState, AssessmentAction, WizardStep, Proposals, Initiative } from '../types';

const initialState: AssessmentState = {
  step: WizardStep.Legal,
  isLoading: false,
  isRefining: false,
  direction: 'initial',
  isEditing: false,
  editingInitiativeIndex: null,
};

const AssessmentContext = createContext<{
  state: AssessmentState;
  dispatch: Dispatch<AssessmentAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

const assessmentReducer = (state: AssessmentState, action: AssessmentAction): AssessmentState => {
  switch (action.type) {
    case 'START_ASSESSMENT':
      return { ...state, step: WizardStep.ClientData, direction: 'forward' };
    case 'SET_CLIENT_DATA':
      return { ...state, clientData: action.payload, step: WizardStep.FileUpload, direction: 'forward' };
    case 'SET_FILE_DATA':
        return { ...state, fileData: action.payload, step: WizardStep.ProblemDescription, direction: 'forward' };
    case 'SET_PROBLEM_DESCRIPTION':
        return { ...state, problemDescription: action.payload };
    case 'START_ANALYSIS':
        return { ...state, isLoading: true, error: undefined, step: WizardStep.Analysis, direction: 'forward' };
    case 'ANALYSIS_SUCCESS':
        return { ...state, isLoading: false, diagnosis: action.payload };
    case 'START_PROPOSALS':
        return { ...state, isLoading: true, error: undefined, step: WizardStep.Proposals, direction: 'forward' };
    case 'PROPOSALS_SUCCESS':
        return { ...state, isLoading: false, proposals: action.payload };
    case 'SELECT_PROPOSAL_PATH':
        return { ...state, selectedProposalPath: action.payload };
    case 'START_REPORT':
        return { ...state, isLoading: true, error: undefined, step: WizardStep.Report, direction: 'forward' };
    case 'REPORT_SUCCESS':
        return { ...state, isLoading: false, finalReport: action.payload };
    case 'API_ERROR':
        return { ...state, isLoading: false, isRefining: false, error: action.payload };
    case 'GO_TO_STEP': {
        const direction = action.payload > state.step ? 'forward' : 'backward';
        return { ...state, step: action.payload, direction };
    }
    case 'RESET':
        return { ...initialState, step: WizardStep.Legal, direction: 'initial' };
    
    case 'START_PROPOSAL_EDIT':
      return { ...state, isEditing: true, editingPath: action.payload.path, editingInitiativeIndex: action.payload.index };
    case 'END_PROPOSAL_EDIT':
      return { ...state, isEditing: false, editingPath: undefined, editingInitiativeIndex: null };
    case 'PROPOSAL_EDIT_SUCCESS': {
      const { path, index, initiative } = action.payload;
      if (!state.proposals) return state;

      // Deeply immutable update of a single initiative
      const updatedPathInitiatives = [
        ...state.proposals[path].slice(0, index),
        initiative,
        ...state.proposals[path].slice(index + 1),
      ];
      
      const newProposals: Proposals = {
        ...state.proposals,
        [path]: updatedPathInitiatives,
      };

      return {
        ...state,
        proposals: newProposals,
      };
    }
    default:
      return state;
  }
};

const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(assessmentReducer, initialState);

  return (
    <AssessmentContext.Provider value={{ state, dispatch }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export { AssessmentContext, AssessmentProvider };