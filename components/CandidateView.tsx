
import React, { useState, useEffect } from 'react';
import { Assessment, Submission, QuestionType } from '../types';
import { Clock, CheckCircle, AlertCircle, Send, Terminal, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';

interface CandidateViewProps {
  assessment: Assessment;
  candidateName: string;
  onSubmit: (submission: Submission) => void;
}

const CandidateView: React.FC<CandidateViewProps> = ({ assessment, candidateName, onSubmit }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(assessment.durationMinutes * 60);
  
  // Unified Answers Store
  // We store everything in a Record<string, any>. 
  // - Multiple Choice: number[] (indices)
  // - Single Choice: number (index)
  // - Text/Code: string
  // - DragDrop: string[] (ordered items)
  // - Boolean: boolean
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [warnings, setWarnings] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(prev => prev + 1);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Init
  useEffect(() => {
    const initialAnswers: Record<string, any> = {};
    if (assessment.questions) {
      assessment.questions.forEach(q => {
        if (q.starterCode) initialAnswers[q.id] = q.starterCode;
        if (q.type === QuestionType.DRAG_DROP || q.type === QuestionType.REORDER_STEPS) {
            initialAnswers[q.id] = q.options ? [...q.options] : []; // Start with default order
        }
      });
    }
    setAnswers(initialAnswers);
  }, [assessment]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleSubmit = () => {
    const submission: Submission = {
      assessmentId: assessment.id,
      candidateName,
      candidateEmail: 'candidate@example.com',
      answers: answers,
      timeSpentSeconds: (assessment.durationMinutes * 60) - timeLeft,
      warnings: warnings
    };
    onSubmit(submission);
  };

  if (!assessment.questions || assessment.questions.length === 0) return <div>Error: Sin preguntas.</div>;

  const currentQuestion = assessment.questions[currentQIndex];

  // --- INPUT HANDLERS ---

  const handleOptionToggle = (qId: string, index: number, isMulti: boolean) => {
      if (isMulti) {
          const current = (answers[qId] as number[]) || [];
          const updated = current.includes(index) 
            ? current.filter(i => i !== index) 
            : [...current, index];
          setAnswers({...answers, [qId]: updated});
      } else {
          setAnswers({...answers, [qId]: index});
      }
  };

  const handleMoveItem = (qId: string, fromIdx: number, direction: 'up' | 'down') => {
      const items = [...(answers[qId] as string[])];
      const toIdx = direction === 'up' ? fromIdx - 1 : fromIdx + 1;
      if (toIdx < 0 || toIdx >= items.length) return;
      
      const temp = items[fromIdx];
      items[fromIdx] = items[toIdx];
      items[toIdx] = temp;
      setAnswers({...answers, [qId]: items});
  };

  const handleFillBlank = (qId: string, val: string, index: number) => {
      // Store blanks as an object or array. Let's use object key "index"
      const currentObj = (answers[qId] as Record<string, string>) || {};
      setAnswers({
          ...answers, 
          [qId]: { ...currentObj, [index]: val }
      });
  };

  // --- RENDERERS ---

  const renderQuestionContent = () => {
      const q = currentQuestion;
      
      switch (q.type) {
        case QuestionType.MULTIPLE_CHOICE:
        case QuestionType.BEST_ANSWER:
            const isMulti = q.type === QuestionType.MULTIPLE_CHOICE; // Simplified assumption for now, or check metadata
            const selected = answers[q.id]; // number or number[]
            return (
                <div className="space-y-3">
                    {q.options?.map((opt, idx) => {
                        const isSelected = Array.isArray(selected) ? selected.includes(idx) : selected === idx;
                        return (
                            <label key={idx} className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? 'border-brand-500 bg-brand-50 dark:bg-nord-9/20 dark:border-nord-9' : 'border-slate-200 dark:border-nord-2 hover:border-brand-300'}`}>
                                <input 
                                    type={isMulti ? "checkbox" : "radio"}
                                    name={`q-${q.id}`}
                                    className="w-4 h-4 text-brand-600"
                                    checked={isSelected}
                                    onChange={() => handleOptionToggle(q.id, idx, isMulti)}
                                />
                                <span className="text-slate-700 dark:text-nord-6">{opt}</span>
                            </label>
                        );
                    })}
                </div>
            );

        case QuestionType.DRAG_DROP:
        case QuestionType.REORDER_STEPS:
            const items = (answers[q.id] as string[]) || q.options || [];
            return (
                <div className="space-y-2">
                    <p className="text-sm text-slate-500 dark:text-nord-4 mb-2">Ordena los elementos (Usa las flechas):</p>
                    {items.map((item, idx) => (
                        <div key={item} className="flex items-center justify-between p-3 bg-white dark:bg-nord-1 border border-slate-200 dark:border-nord-2 rounded shadow-sm">
                             <span className="text-slate-800 dark:text-nord-6">{idx + 1}. {item}</span>
                             <div className="flex gap-1">
                                 <button onClick={() => handleMoveItem(q.id, idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-slate-100 dark:hover:bg-nord-2 rounded disabled:opacity-30"><ArrowUp size={16}/></button>
                                 <button onClick={() => handleMoveItem(q.id, idx, 'down')} disabled={idx === items.length - 1} className="p-1 hover:bg-slate-100 dark:hover:bg-nord-2 rounded disabled:opacity-30"><ArrowDown size={16}/></button>
                             </div>
                        </div>
                    ))}
                </div>
            );

        case QuestionType.YES_NO:
            return (
                <div className="flex gap-4">
                    {['Sí', 'No'].map((opt) => (
                        <button
                            key={opt}
                            onClick={() => setAnswers({...answers, [q.id]: opt})}
                            className={`px-6 py-3 rounded-lg border font-medium transition-all ${answers[q.id] === opt ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-nord-1 text-slate-600 dark:text-nord-4 border-slate-200 dark:border-nord-2'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            );

        case QuestionType.FILL_BLANK:
            const parts = q.text.split('{{__}}');
            return (
                <div className="text-lg leading-loose text-slate-800 dark:text-nord-6">
                    {parts.map((part, i) => (
                        <React.Fragment key={i}>
                            {part}
                            {i < parts.length - 1 && (
                                <input 
                                    type="text"
                                    className="mx-2 border-b-2 border-slate-300 dark:border-nord-3 bg-transparent focus:border-brand-500 outline-none text-center w-32 font-bold text-brand-700 dark:text-nord-9"
                                    placeholder="___"
                                    value={((answers[q.id] as any) || {})[i] || ''}
                                    onChange={(e) => handleFillBlank(q.id, e.target.value, i)}
                                />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            );
        
        default:
            return (
                <div className="text-slate-500 italic dark:text-nord-4">
                   Utiliza el área de código/texto de la derecha para responder.
                </div>
            );
      }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-nord-0 transition-colors duration-300">
      <header className="bg-white dark:bg-nord-1 border-b border-slate-200 dark:border-nord-2 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="font-bold text-slate-800 dark:text-nord-6 text-lg">TechBattle<span className="text-brand-600 dark:text-nord-9">Eval</span></div>
          <div className="h-6 w-px bg-slate-200 dark:bg-nord-2"></div>
          <h1 className="text-sm font-medium text-slate-600 dark:text-nord-4">{assessment.title}</h1>
        </div>
        {warnings > 0 && (
            <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                <EyeOff size={14} /> Alerta de Foco: {warnings}
            </div>
        )}
        <div className="flex items-center gap-4">
          <div className="bg-slate-100 dark:bg-nord-2 px-3 py-1 rounded-full flex items-center gap-2 text-slate-700 dark:text-nord-5 font-mono font-medium">
            <Clock size={16} className="text-brand-600 dark:text-nord-9" />
            {formatTime(timeLeft)}
          </div>
          <button onClick={handleSubmit} className="bg-black dark:bg-nord-3 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-nord-2 transition-colors">
            Finalizar
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 bg-white dark:bg-nord-1 border-r border-slate-200 dark:border-nord-2 p-4 overflow-y-auto hidden md:block">
          <h3 className="text-xs font-bold text-slate-400 dark:text-nord-4 uppercase tracking-wider mb-4">Progreso</h3>
          <div className="space-y-2">
            {assessment.questions.map((q, idx) => {
              const isActive = idx === currentQIndex;
              const hasAnswer = answers[q.id] !== undefined && answers[q.id] !== ''; 
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${isActive ? 'bg-brand-50 dark:bg-nord-3 text-brand-700 dark:text-nord-9 ring-1 ring-brand-200 dark:ring-nord-3' : 'hover:bg-slate-50 dark:hover:bg-nord-2 text-slate-600 dark:text-nord-4'}`}
                >
                  <span className="truncate max-w-[120px]">P{idx+1}. {q.type}</span>
                  {hasAnswer && <CheckCircle size={14} className="text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </aside>

        <main className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto border-r border-slate-200 dark:border-nord-2 bg-white dark:bg-nord-1 max-w-2xl">
            <div className="mb-4">
               <span className="bg-slate-100 dark:bg-nord-2 text-slate-600 dark:text-nord-5 text-xs font-bold px-2 py-1 rounded uppercase">{currentQuestion.type}</span>
            </div>
            {currentQuestion.type !== QuestionType.FILL_BLANK && (
                <h2 className="text-xl font-bold text-slate-900 dark:text-nord-6 mb-6 leading-relaxed">
                {currentQuestion.text}
                </h2>
            )}
            
            {renderQuestionContent()}

            <div className="mt-8 text-slate-400 dark:text-nord-3 text-xs border-t border-slate-100 dark:border-nord-2 pt-4">
                ID: {currentQuestion.id} • Tema: {currentQuestion.topic}
            </div>
          </div>

          {/* Right Pane: Editor for Code/Text heavy questions */}
          {(currentQuestion.type === QuestionType.LAB_BASED || 
            currentQuestion.type === QuestionType.HOTSPOT_CODE || 
            currentQuestion.type === QuestionType.CASE_STUDY ||
            currentQuestion.type === QuestionType.SCENARIO_MULTISTEP) && (
            <div className="flex-1 flex flex-col bg-slate-900 dark:bg-nord-0">
              <div className="bg-slate-800 dark:bg-nord-1 px-4 py-2 flex items-center justify-between border-b border-slate-700 dark:border-nord-0">
                <div className="flex items-center gap-2 text-slate-300 dark:text-nord-4 text-xs font-mono">
                  <Terminal size={14} />
                  Editor de Respuesta
                </div>
              </div>
              <textarea 
                className="flex-1 bg-slate-900 dark:bg-nord-0 text-slate-200 dark:text-nord-5 font-mono p-4 text-sm resize-none focus:outline-none"
                spellCheck={false}
                value={answers[currentQuestion.id] || ''}
                onChange={(e) => setAnswers({...answers, [currentQuestion.id]: e.target.value})}
                placeholder="// Escribe tu código o respuesta aquí..."
              />
            </div>
          )}
        </main>
      </div>

      <footer className="bg-white dark:bg-nord-1 border-t border-slate-200 dark:border-nord-2 p-4 flex justify-between items-center z-20">
        <button 
          onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
          disabled={currentQIndex === 0}
          className="text-slate-600 dark:text-nord-4 hover:text-slate-900 dark:hover:text-nord-6 px-4 py-2 disabled:opacity-50"
        >
          Anterior
        </button>
        {currentQIndex === assessment.questions.length - 1 ? (
            <button onClick={handleSubmit} className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                Enviar Todo <Send size={16}/>
            </button>
        ) : (
            <button onClick={() => setCurrentQIndex(prev => prev + 1)} className="bg-slate-900 dark:bg-nord-3 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                Siguiente
            </button>
        )}
      </footer>
    </div>
  );
};

export default CandidateView;
