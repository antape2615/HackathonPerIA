
import React, { useState } from 'react';
import { Assessment, Candidate } from '../types';
import { FileText, PlusCircle, Trash2, UserPlus, Code2, Pencil, ShieldCheck, Briefcase, Hash } from 'lucide-react';

interface EvaluatorDashboardProps {
  assessments: Assessment[];
  candidates: Candidate[];
  onDeleteAssessment: (id: string) => void;
  onUpdateAssessment: (assessment: Assessment) => void;
  onEditAssessment: (assessment: Assessment) => void;
  onAssignAssessment: (candidateId: string, assessmentId: string) => void;
  onAddCandidate: (candidate: Candidate) => void;
  onCreateNew: () => void;
}

const EvaluatorDashboard: React.FC<EvaluatorDashboardProps> = ({ 
  assessments, 
  candidates,
  onDeleteAssessment, 
  onEditAssessment,
  onAssignAssessment,
  onCreateNew 
}) => {
  const [assigningAssessmentId, setAssigningAssessmentId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");

  const handleAssignSubmit = () => {
    if (assigningAssessmentId && selectedCandidateId) {
        onAssignAssessment(selectedCandidateId, assigningAssessmentId);
        alert("Asignación enviada correctamente.");
    }
    resetAssignmentModal();
  };

  const resetAssignmentModal = () => {
    setAssigningAssessmentId(null);
    setSelectedCandidateId("");
  };

  // Split assessments
  const officialTests = assessments.filter(a => a.isTemplate);
  const customTests = assessments.filter(a => !a.isTemplate);

  const renderCard = (test: Assessment, isOfficial: boolean) => (
    <div key={test.id} className={`rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow flex flex-col group relative ${isOfficial ? 'bg-brand-50/50 border-brand-100 dark:bg-nord-1 dark:border-nord-9/30' : 'bg-white border-slate-200 dark:bg-nord-1 dark:border-nord-2'}`}>
        <div className="p-5 flex-1">
            <div className="flex items-start justify-between mb-3">
                <div className="flex gap-2">
                     <span className="px-2.5 py-1 rounded text-xs font-bold bg-slate-100 text-slate-700 dark:bg-nord-3 dark:text-nord-9 border border-slate-200 dark:border-nord-3">
                        {test.language}
                    </span>
                    {isOfficial && (
                        <span className="px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 dark:bg-nord-13/20 dark:text-nord-13 flex items-center gap-1">
                            <ShieldCheck size={12}/> Oficial
                        </span>
                    )}
                </div>
                <div className="flex gap-1">
                    <button 
                        onClick={() => onEditAssessment(test)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 dark:text-nord-3 dark:hover:text-nord-9 rounded hover:bg-slate-50 dark:hover:bg-nord-2 transition-colors"
                        title="Editar Prueba Completa"
                    >
                        <Pencil size={14} />
                    </button>
                    <span className="text-xs text-slate-400 dark:text-nord-4 flex items-center gap-1 px-2">
                        <Code2 size={12} /> {test.questions.length} Pts
                    </span>
                </div>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-nord-6 mb-1 leading-tight">{test.title}</h3>
            <p className="text-sm text-slate-500 dark:text-nord-4 mb-2">{test.difficulty} • {test.framework}</p>
            
            {/* Serial Code Display */}
            <div className="mb-3 flex items-center gap-1 text-xs text-slate-400 dark:text-nord-3 font-mono bg-slate-50 dark:bg-nord-2 px-2 py-1 rounded w-fit">
                <Hash size={10} /> {test.serialCode || 'S/N'}
            </div>
            
            <div className="mt-4 flex flex-wrap gap-1">
                {test.topics.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-50 dark:bg-nord-0 dark:text-nord-4 px-2 py-1 rounded">
                        {t}
                    </span>
                ))}
            </div>
        </div>

        <div className="bg-slate-50/50 dark:bg-nord-0 p-4 border-t border-slate-100 dark:border-nord-2 flex justify-between items-center">
            <button 
                onClick={() => onDeleteAssessment(test.id)}
                className="text-slate-400 hover:text-red-600 dark:text-nord-3 dark:hover:text-nord-11 p-2 transition-colors"
                title={isOfficial ? "Las pruebas oficiales no deberían eliminarse" : "Eliminar Prueba"}
                disabled={isOfficial}
            >
                <Trash2 size={18} className={isOfficial ? "opacity-20 cursor-not-allowed" : ""} />
            </button>
            <button 
                onClick={() => setAssigningAssessmentId(test.id)}
                className={`border px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:shadow-sm ${isOfficial ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 dark:bg-nord-9 dark:text-nord-1 dark:border-nord-9' : 'bg-white text-brand-700 border-slate-200 hover:border-brand-500 dark:bg-nord-2 dark:text-nord-9 dark:border-nord-3'}`}
            >
                <UserPlus size={16} /> Asignar
            </button>
        </div>
    </div>
  );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-nord-6 tracking-tight">Biblioteca de Pruebas</h1>
          <p className="text-slate-500 dark:text-nord-4 mt-1">Gestiona y distribuye tus evaluaciones técnicas</p>
        </div>
        <button 
          onClick={onCreateNew}
          className="bg-brand-600 dark:bg-nord-9 hover:bg-brand-700 dark:hover:bg-nord-10 text-white dark:text-nord-1 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-brand-500/20 dark:shadow-nord-9/20 hover:scale-[1.02]"
        >
          <PlusCircle size={20} />
          Crear Nueva Prueba
        </button>
      </div>

      {/* Official Tests Section */}
      <div className="space-y-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-nord-6 font-bold text-lg uppercase tracking-wide border-b border-slate-200 dark:border-nord-2 pb-2">
             <ShieldCheck size={24} className="text-amber-500" /> 
             <span>Pruebas Oficiales Periferia</span>
          </div>
          {officialTests.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-slate-100 rounded-lg text-center text-slate-400 text-sm">
                  No hay templates oficiales cargados.
              </div>
          ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                  {officialTests.map(t => renderCard(t, true))}
              </div>
          )}
      </div>

      {/* Custom Tests Section */}
      <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-slate-800 dark:text-nord-6 font-bold text-lg uppercase tracking-wide border-b border-slate-200 dark:border-nord-2 pb-2">
             <Briefcase size={24} className="text-brand-600 dark:text-nord-9" /> 
             <span>Mis Pruebas Personalizadas</span>
          </div>
          
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {customTests.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white dark:bg-nord-1 rounded-2xl border-2 border-dashed border-slate-200 dark:border-nord-3">
                    <FileText size={48} className="mx-auto text-slate-300 dark:text-nord-3 mb-4" />
                    <p className="text-slate-500 dark:text-nord-4 text-lg">Tu biblioteca personal está vacía.</p>
                    <button onClick={onCreateNew} className="text-brand-600 dark:text-nord-9 font-bold mt-2 hover:underline">Crear primera prueba</button>
                </div>
            ) : (
                customTests.map(t => renderCard(t, false))
            )}
          </div>
      </div>

      {/* Assignment Modal */}
      {assigningAssessmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 border border-slate-200 dark:border-nord-2">
                <h2 className="text-xl font-bold text-slate-900 dark:text-nord-6 mb-1">Asignar Prueba</h2>
                <p className="text-sm text-slate-500 dark:text-nord-4 mb-6">Selecciona un candidato de la lista para enviarle esta prueba.</p>

                <div className="mb-6">
                    <select 
                        className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-3 rounded-lg px-4 py-3 text-slate-900 dark:text-nord-6 outline-none focus:ring-2 focus:ring-brand-500"
                        value={selectedCandidateId}
                        onChange={(e) => setSelectedCandidateId(e.target.value)}
                    >
                        <option value="">-- Seleccionar Candidato --</option>
                        {candidates.map(c => (
                            <option key={c.id} value={c.id} disabled={!!c.assignedAssessmentId} className={c.assignedAssessmentId ? "text-slate-400" : ""}>
                                {c.name} {c.role ? `(${c.role})` : ''} {c.assignedAssessmentId ? '(Ya asignado)' : ''}
                            </option>
                        ))}
                    </select>
                    {candidates.length === 0 && (
                        <p className="text-xs text-orange-500 mt-2">No hay candidatos. Ve a la pestaña "Candidatos" para crear uno.</p>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button 
                        onClick={resetAssignmentModal}
                        className="px-4 py-2 text-slate-600 dark:text-nord-4 hover:bg-slate-100 dark:hover:bg-nord-2 rounded-lg font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleAssignSubmit}
                        disabled={!selectedCandidateId}
                        className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 px-6 py-2 rounded-lg font-bold hover:bg-brand-700 dark:hover:bg-nord-10 disabled:opacity-50 transition-colors"
                    >
                        Asignar y Enviar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default EvaluatorDashboard;
