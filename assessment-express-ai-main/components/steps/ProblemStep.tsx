
import React, { useState } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { generateDiagnosis } from '../../services/geminiService';
import StepContainer from '../shared/StepContainer';
import Button from '../shared/Button';
import { WizardStep } from '../../types';

const ProblemStep: React.FC = () => {
  const { state, dispatch } = useAssessment();
  const [description, setDescription] = useState(state.problemDescription || '');
  const maxChars = 500;

  const handleGenerate = async () => {
    if (!state.clientData || !description) return;
    dispatch({ type: 'SET_PROBLEM_DESCRIPTION', payload: description });
    dispatch({ type: 'START_ANALYSIS' });
    try {
      const diagnosis = await generateDiagnosis(state.clientData, description, state.fileData);
      dispatch({ type: 'ANALYSIS_SUCCESS', payload: diagnosis });
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido durante el análisis.';
      dispatch({ type: 'API_ERROR', payload: errorMessage });
    }
  };

  return (
    <StepContainer title="Describe tu Desafío Principal" subtitle="Este es el paso más importante. Sé lo más específico posible.">
      <div className="space-y-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={maxChars}
          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-4 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition text-lg min-h-[200px] resize-none"
          rows={8}
          placeholder="Ej: 'La rotación de clientes ha aumentado un 20% en el último trimestre y no sabemos por qué. Nuestro equipo de soporte está sobrecargado y nuestro ciclo de ventas se está alargando.'"
        />
        <div className="text-right text-sm text-gray-400">
          {description.length} / {maxChars}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-700 mt-6">
          <Button type="button" variant="secondary" onClick={() => dispatch({type: 'GO_TO_STEP', payload: WizardStep.FileUpload})}>Atrás</Button>
          <Button onClick={handleGenerate} disabled={description.length < 50} isLoading={state.isLoading}>
            Generar Análisis
          </Button>
        </div>
        {state.error && <p className="text-red-400 mt-4 text-center">Error: {state.error}</p>}
      </div>
    </StepContainer>
  );
};

export default ProblemStep;