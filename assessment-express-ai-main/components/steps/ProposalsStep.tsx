import React, { useState, useCallback } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { generateFinalReport } from '../../services/geminiService';
import { Initiative, WizardStep, ProposalPath } from '../../types';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';
import AnimatedLoader from '../shared/AnimatedLoader';
import ProposalEditModal from '../modals/ProposalEditModal';

const InitiativeDetail: React.FC<{ initiative: Initiative; onEdit: () => void }> = React.memo(({ initiative, onEdit }) => (
    <div className="p-4 bg-gray-900/50 border border-gray-700 rounded-lg flex justify-between items-center">
        <div>
            <h4 className="font-semibold text-white">{initiative.title}</h4>
            <p className="text-sm text-gray-400">{initiative.description}</p>
        </div>
        <Button variant="secondary" onClick={onEdit} className="text-xs !py-1 !px-3 flex-shrink-0">
            Editar con IA
        </Button>
    </div>
));


const PathSelectionCard: React.FC<{
    path: ProposalPath;
    title: string;
    description: string;
    initiatives: Initiative[];
    isSelected: boolean;
    onSelect: () => void;
}> = React.memo(({ path, title, description, initiatives, isSelected, onSelect }) => {
    const { dispatch } = useAssessment();

    const handleEdit = useCallback((index: number) => {
        dispatch({ type: 'START_PROPOSAL_EDIT', payload: { path, index } });
    }, [dispatch, path]);

    return (
        <div 
            onClick={onSelect}
            className={`p-6 rounded-xl border-2 transition-all duration-300 group relative cursor-pointer hover:bg-gray-800/60 ${isSelected ? 'border-cyan-500 bg-gray-800/80 shadow-lg shadow-cyan-500/20' : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'}`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-2xl font-bold text-white">{title}</h3>
                    <p className="text-gray-400 mt-1">{description}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-gray-500'}`}>
                    {isSelected && <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                </div>
            </div>
            {isSelected && (
                 <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3 animate-fade-in">
                    {initiatives.map((init, index) => (
                        <InitiativeDetail key={index} initiative={init} onEdit={() => handleEdit(index)} />
                    ))}
                </div>
            )}
        </div>
    );
});


const ProposalsStep: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const { proposals, diagnosis, selectedProposalPath, isEditing } = state;

  if (state.isLoading && !proposals) {
      return (
        <StepContainer title="Generando Hoja de Ruta Estratégica" subtitle="Nuestra IA está diseñando un conjunto de soluciones a tu medida.">
            <AnimatedLoader />
        </StepContainer>
      );
  }

  if (!proposals || !diagnosis) {
    return <p className="text-center text-yellow-400">Los datos de las propuestas no están disponibles.</p>;
  }

  const handleGenerateReport = async () => {
    if (!selectedProposalPath) return;
    dispatch({ type: 'START_REPORT' });
    try {
        const report = await generateFinalReport(diagnosis, proposals, selectedProposalPath);
        dispatch({ type: 'REPORT_SUCCESS', payload: report });
    } catch(err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido al generar el informe.';
        dispatch({ type: 'API_ERROR', payload: errorMessage });
    }
  }
  
  const pathData = [
      { id: 'shortTerm', title: 'Corto Plazo', description: 'Victorias rápidas para un impacto inmediato.', initiatives: proposals.shortTerm },
      { id: 'mediumTerm', title: 'Mediano Plazo', description: 'Mejoras estructurales para un crecimiento sostenido.', initiatives: proposals.mediumTerm },
      { id: 'longTerm', title: 'Largo Plazo', description: 'Metas de transformación para liderar el futuro.', initiatives: proposals.longTerm },
  ];
  
  return (
    <>
    {isEditing && <ProposalEditModal />}
    <StepContainer title="Elige y Edita tu Hoja de Ruta" subtitle="Selecciona una estrategia, expande sus detalles y modifica cada iniciativa conversando con la IA.">
      <div className="space-y-6">
        {pathData.map(path => (
            <PathSelectionCard
                key={path.id}
                path={path.id as ProposalPath}
                title={path.title}
                description={path.description}
                initiatives={path.initiatives}
                isSelected={selectedProposalPath === path.id}
                onSelect={() => dispatch({ type: 'SELECT_PROPOSAL_PATH', payload: path.id as ProposalPath })}
            />
        ))}
      </div>

       <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-700">
            <Button variant="secondary" onClick={() => dispatch({type: 'GO_TO_STEP', payload: WizardStep.Analysis})}>Volver al Diagnóstico</Button>
            <Button onClick={handleGenerateReport} isLoading={state.isLoading} disabled={!selectedProposalPath}>
                Ver Informe Final
            </Button>
        </div>
        {state.error && <p className="text-red-400 mt-4 text-center">Error: {state.error}</p>}
    </StepContainer>
    </>
  );
};

export default ProposalsStep;