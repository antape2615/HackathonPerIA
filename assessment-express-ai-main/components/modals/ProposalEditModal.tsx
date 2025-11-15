import React, { useState, useEffect, useRef } from 'react';
import { useAssessment } from '../../hooks/useAssessment';
import { editSingleInitiative } from '../../services/geminiService';
import { Initiative } from '../../types';
import Button from '../shared/Button';

const ProposalEditModal: React.FC = () => {
    const { state, dispatch } = useAssessment();
    const { diagnosis, proposals, editingPath, editingInitiativeIndex } = state;

    const [userInput, setUserInput] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [revisedInitiative, setRevisedInitiative] = useState<Initiative | null>(null);
    const [error, setError] = useState<string | null>(null);

    const modalContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => { 
            document.body.style.overflow = 'auto'; 
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);
    
    useEffect(() => {
        if(modalContentRef.current){
            modalContentRef.current.scrollTop = modalContentRef.current.scrollHeight;
        }
    }, [revisedInitiative, isEditing]);

    if (editingPath === undefined || editingInitiativeIndex === null || editingInitiativeIndex === undefined || !proposals || !diagnosis) return null;

    const currentInitiative = proposals[editingPath][editingInitiativeIndex];

    const handleEditSubmit = async () => {
        if (!userInput.trim()) return;
        setIsEditing(true);
        setError(null);
        setRevisedInitiative(null);
        try {
            const result = await editSingleInitiative(diagnosis, currentInitiative, userInput);
            setRevisedInitiative(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al editar la iniciativa.';
            setError(errorMessage);
        } finally {
            setIsEditing(false);
        }
    };

    const handleAcceptChanges = () => {
        if (!revisedInitiative) return;
        dispatch({ type: 'PROPOSAL_EDIT_SUCCESS', payload: { path: editingPath, index: editingInitiativeIndex, initiative: revisedInitiative } });
        dispatch({ type: 'END_PROPOSAL_EDIT' });
    };

    const handleClose = () => { dispatch({ type: 'END_PROPOSAL_EDIT' }); };

    const renderInitiative = (initiative: Initiative, title: string, titleColor: string) => (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <h4 className={`font-semibold mb-2 ${titleColor}`}>{title}</h4>
            <div className="text-sm p-3 bg-gray-800 rounded">
                <strong className="text-white block">{initiative.title}</strong>
                <p className="text-gray-400">{initiative.description}</p>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fade-in" onClick={handleClose}>
            <div 
                className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] flex flex-col animate-slide-in-right" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-white truncate pr-4">Editando: <span className="font-normal text-gray-300">{currentInitiative.title}</span></h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white transition text-2xl leading-none">&times;</button>
                </header>
                
                <div ref={modalContentRef} className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-grow">
                    {renderInitiative(currentInitiative, "Iniciativa Actual", "text-gray-300")}
                    
                    {isEditing && (
                         <div className="flex items-center justify-center space-x-2 text-cyan-400 p-4">
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            <span>La IA está refinando la iniciativa...</span>
                        </div>
                    )}

                    {revisedInitiative && (
                        <div className="animate-fade-in">
                            {renderInitiative(revisedInitiative, "Iniciativa Revisada por la IA", "text-green-400")}
                        </div>
                    )}
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>
                
                <footer className="p-4 border-t border-gray-700 space-y-3 flex-shrink-0 bg-gray-800/50">
                    <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3 w-full">
                        <textarea
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Ej: 'Sugiere 3 alternativas de bajo costo para Trello...'"
                            className="flex-grow bg-gray-700 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-cyan-500 transition w-full resize-none h-24"
                            disabled={isEditing}
                        />
                         <Button onClick={handleEditSubmit} isLoading={isEditing} disabled={!userInput.trim()} className="md:w-auto w-full flex-shrink-0">
                            Refinar con IA
                        </Button>
                    </div>
                     {revisedInitiative && (
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-2 animate-fade-in w-full">
                            <Button variant="secondary" onClick={handleClose} className="w-full sm:w-auto">Cancelar</Button>
                            <Button onClick={handleAcceptChanges} className="w-full sm:w-auto">Aceptar Cambios</Button>
                        </div>
                    )}
                </footer>
            </div>
        </div>
    );
};

export default ProposalEditModal;