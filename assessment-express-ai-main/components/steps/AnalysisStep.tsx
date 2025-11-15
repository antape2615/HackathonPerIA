import React from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { generateProposals } from '../../services/geminiService';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';
import AnimatedLoader from '../shared/AnimatedLoader';

// Using a standard function component definition for better type compatibility in strict environments.
function InfoCard({ title, icon, children, className }: { title: string; icon: React.ReactElement; children: React.ReactNode; className?: string; }) {
    return (
        <div className={`bg-gray-800/50 p-6 rounded-lg border border-gray-700 animate-fade-in-up ${className}`}>
            <div className="flex items-center space-x-3 mb-3">
                {icon}
                <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            {children}
        </div>
    );
}

const AnalysisDisplay: React.FC = () => {
    const { state, dispatch } = useAssessment();
    const { diagnosis } = state;

    const handleGenerateProposals = async () => {
        if (!diagnosis) return;
        dispatch({ type: 'START_PROPOSALS' });
        try {
            const proposals = await generateProposals(diagnosis);
            dispatch({ type: 'PROPOSALS_SUCCESS', payload: proposals });
        } catch (err) {
            console.error(err);
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido al generar las propuestas.';
            dispatch({ type: 'API_ERROR', payload: errorMessage });
        }
    };

    if (!diagnosis) return <p className="text-center text-yellow-400">Los datos del análisis no están disponibles.</p>;

    const renderList = (items: string[]) => (
        <ul className="list-disc list-inside space-y-2 text-gray-300">
            {items.map((item, index) => <li key={index} className="leading-relaxed">{item}</li>)}
        </ul>
    );

    return (
        <div className="space-y-6">
            {/* Fix: The InfoCard component requires children. Added a paragraph to display the main pain point. */}
            <InfoCard 
                title="Punto de Dolor Principal"
                icon={<svg className="w-7 h-7 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
            >
                <p className="text-lg text-gray-200">{diagnosis.mainPainPoint}</p>
            </InfoCard>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Fix: The InfoCard component requires children. Added the list of secondary pain points. */}
                <InfoCard 
                    title="Puntos de Dolor Secundarios" 
                    icon={<svg className="w-7 h-7 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>}
                    className="stagger-1"
                >
                    {renderList(diagnosis.secondaryPainPoints)}
                </InfoCard>
                {/* Fix: The InfoCard component requires children. Added the list of key insights. */}
                <InfoCard 
                    title="Insights Clave" 
                    icon={<svg className="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>}
                    className="stagger-2"
                >
                    {renderList(diagnosis.insights)}
                </InfoCard>
            </div>
             {/* Fix: The InfoCard component requires children. Added the list of findings. */}
             <InfoCard 
                title="Hallazgos" 
                icon={<svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>}
                className="stagger-3"
             >
                {renderList(diagnosis.findings)}
            </InfoCard>

            <div className="flex justify-end pt-6 border-t border-gray-700 mt-6 animate-fade-in-up stagger-4">
                <Button onClick={handleGenerateProposals} isLoading={state.isLoading}>
                    Ver Soluciones Propuestas
                </Button>
            </div>
            {state.error && <p className="text-red-400 mt-4 text-center animate-fade-in-up stagger-5">Error: {state.error}</p>}
        </div>
    );
};


const AnalysisStep: React.FC = () => {
  const { state } = useAssessment();
  
  return (
    <StepContainer title="Diagnóstico por IA" subtitle="Aquí tienes un desglose de los problemas centrales identificados a partir de tu información.">
      {state.isLoading && !state.diagnosis ? <AnimatedLoader /> : <AnalysisDisplay />}
    </StepContainer>
  );
};

export default AnalysisStep;