
import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { WizardStep } from '../../types';

const steps = [
  { step: WizardStep.ClientData, label: 'Cliente' },
  { step: WizardStep.FileUpload, label: 'Contexto' },
  { step: WizardStep.ProblemDescription, label: 'Problema' },
  { step: WizardStep.Analysis, label: 'Diagnóstico' },
  { step: WizardStep.Proposals, label: 'Soluciones' },
  { step: WizardStep.Report, label: 'Reporte' },
];

const ProgressStepper: React.FC = () => {
    const { state } = useAssessment();
    const currentStepIndex = steps.findIndex(s => s.step === state.step);

    if (state.step === WizardStep.Welcome || state.step === WizardStep.Legal) {
        return null; // Don't show stepper on welcome or legal screen
    }

    return (
        <div className="w-full max-w-2xl mx-auto my-4 mb-8 px-4">
            <div className="flex items-center justify-between">
                {steps.map((item, index) => {
                    const isActive = state.step === item.step;
                    const isCompleted = currentStepIndex > index;
                    
                    return (
                        <React.Fragment key={item.step}>
                            <div className="flex flex-col items-center text-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                    isActive ? 'bg-cyan-500 scale-110 ring-2 ring-cyan-400 ring-offset-2 ring-offset-gray-900' : 
                                    isCompleted ? 'bg-cyan-600' : 'bg-gray-700'
                                }`}>
                                    {isCompleted ? (
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                                    ) : (
                                        <span className={`font-bold ${isActive ? 'text-white' : 'text-gray-400'}`}>{index + 1}</span>
                                    )}
                                </div>
                                <p className={`mt-2 text-xs font-semibold ${isActive ? 'text-cyan-400' : 'text-gray-500'}`}>{item.label}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-auto h-1 transition-colors duration-500 ${isCompleted ? 'bg-cyan-500' : 'bg-gray-700'}`}></div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressStepper;