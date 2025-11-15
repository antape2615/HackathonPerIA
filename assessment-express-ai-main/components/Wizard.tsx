
import React from 'react';
import { useAssessment } from '../hooks/useAssessment';
import { WizardStep } from '../types';
import LegalStep from './steps/LegalStep';
import WelcomeStep from './steps/WelcomeStep';
import ClientDataStep from './steps/ClientDataStep';
import FileUploadStep from './steps/FileUploadStep';
import ProblemStep from './steps/ProblemStep';
import AnalysisStep from './steps/AnalysisStep';
import ProposalsStep from './steps/ProposalsStep';
import ReportStep from './steps/ReportStep';

const Wizard: React.FC = () => {
  const { state } = useAssessment();
  const animationClass = state.direction === 'forward' 
    ? 'animate-slide-in-right' 
    : state.direction === 'backward' 
    ? 'animate-slide-in-left' 
    : 'animate-fade-in';

  const renderStep = () => {
    switch (state.step) {
      case WizardStep.Legal:
        return <LegalStep />;
      case WizardStep.Welcome:
        return <WelcomeStep />;
      case WizardStep.ClientData:
        return <ClientDataStep />;
      case WizardStep.FileUpload:
        return <FileUploadStep />;
      case WizardStep.ProblemDescription:
        return <ProblemStep />;
      case WizardStep.Analysis:
        return <AnalysisStep />;
      case WizardStep.Proposals:
        return <ProposalsStep />;
      case WizardStep.Report:
        return <ReportStep />;
      default:
        return <LegalStep />;
    }
  };

  return <div key={state.step} className={`w-full max-w-5xl mx-auto p-4 ${animationClass}`}>{renderStep()}</div>;
};

export default Wizard;