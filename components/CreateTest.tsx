
import React, { useState, useEffect } from 'react';
import { Difficulty, Question, Assessment, QuestionType } from '../types';
import { generateAssessmentContent, refineQuestionWithAI } from '../services/geminiService';
import { Sparkles, Check, Loader2, Code, Trash2, Wand2, Save, Edit3, List, Type as TypeIcon, CheckSquare, AlignJustify, ShieldCheck } from 'lucide-react';

interface CreateTestProps {
  initialData?: Assessment;
  onSave: (assessment: Assessment) => void;
  onCancel: () => void;
}

const LANGUAGES = [
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'C++'
];

const FRAMEWORKS: Record<string, string[]> = {
  'JavaScript': ['React', 'Vue', 'Angular', 'Node.js', 'Express', 'Next.js'],
  'TypeScript': ['React', 'Angular', 'NestJS', 'Next.js'],
  'Python': ['Django', 'Flask', 'FastAPI', 'Data Science (Pandas)', 'AI/ML (PyTorch)'],
  'Java': ['Spring Boot', 'Quarkus', 'Jakarta EE'],
  'C#': ['.NET Core', 'ASP.NET', 'Blazor', 'Unity'],
  'Go': ['Gin', 'Echo', 'Standard Lib'],
  'Rust': ['Actix', 'Rocket', 'Tokio'],
  'default': ['Standard Library', 'Web Development', 'Algorithms']
};

const TOPICS = [
  'Algorithms & Data Structures', 'System Design', 'Security', 'Performance Optimization', 
  'Database Design', 'API Design', 'Testing (TDD/BDD)', 'Cloud Native', 'DevOps/CI/CD'
];

const CreateTest: React.FC<CreateTestProps> = ({ initialData, onSave, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    language: 'JavaScript',
    framework: 'React',
    topics: [] as string[],
    difficulty: Difficulty.MID,
    duration: 60,
    questionCount: 5,
    isTemplate: false // New field
  });

  // Generation State
  const [generatedQuestions, setGeneratedQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());
  
  const [refiningId, setRefiningId] = useState<string | null>(null);
  const [refineInstruction, setRefineInstruction] = useState('');

  useEffect(() => {
    if (initialData) {
        setFormData({
            title: initialData.title,
            language: initialData.language,
            framework: initialData.framework,
            topics: initialData.topics,
            difficulty: initialData.difficulty,
            duration: initialData.durationMinutes,
            questionCount: initialData.questions.length,
            isTemplate: initialData.isTemplate || false
        });
        setGeneratedQuestions(initialData.questions);
        setSelectedQuestionIds(new Set(initialData.questions.map(q => q.id)));
    }
  }, [initialData]);

  const handleFrameworks = () => {
    return FRAMEWORKS[formData.language] || FRAMEWORKS['default'];
  };

  const toggleTopic = (topic: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.includes(topic) 
        ? prev.topics.filter(t => t !== topic)
        : [...prev.topics, topic]
    }));
  };

  const handleGenerate = async () => {
    if (initialData && !window.confirm("Advertencia: Generar nuevas preguntas reemplazará las actuales. ¿Continuar?")) {
        return;
    }

    setIsLoading(true);
    try {
      const result = await generateAssessmentContent(
        formData.language,
        formData.framework,
        formData.difficulty,
        formData.topics.length > 0 ? formData.topics : ['General Knowledge'],
        formData.questionCount
      );
      
      const questionsWithIds = result.questions.map((q: any, idx: number) => ({
        ...q,
        id: `q-${Date.now()}-${idx}`
      }));
      
      setGeneratedQuestions(questionsWithIds);
      setSelectedQuestionIds(new Set(questionsWithIds.map((q: any) => q.id)));
      setStep(2);
    } catch (e) {
      alert("Error al generar. Verifica tu API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefineQuestion = async (questionId: string) => {
    if (!refineInstruction.trim()) return;
    setRefiningId(questionId);
    
    const question = generatedQuestions.find(q => q.id === questionId);
    if (question) {
      const refinedQ = await refineQuestionWithAI(question, refineInstruction);
      setGeneratedQuestions(prev => prev.map(q => q.id === questionId ? refinedQ : q));
    }
    
    setRefiningId(null);
    setRefineInstruction('');
  };

  const toggleQuestionSelection = (id: string) => {
    const newSet = new Set(selectedQuestionIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedQuestionIds(newSet);
  };

  const generateSerialCode = (isOfficial: boolean) => {
      const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
      if (isOfficial) {
          return `PERI-2025-${randomSuffix}`;
      }
      return `CUST-${Date.now().toString().slice(-4)}-${randomSuffix}`;
  };

  const handleFinalSave = () => {
    const finalQuestions = generatedQuestions.filter(q => selectedQuestionIds.has(q.id));
    
    const assessment: Assessment = {
      id: initialData ? initialData.id : `test-${Date.now()}`,
      serialCode: initialData?.serialCode || generateSerialCode(formData.isTemplate),
      title: formData.title || `Evaluación ${formData.difficulty} de ${formData.language}`,
      language: formData.language,
      framework: formData.framework,
      topics: formData.topics,
      difficulty: formData.difficulty,
      durationMinutes: formData.duration,
      questions: finalQuestions,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      isTemplate: formData.isTemplate
    };
    onSave(assessment);
  };

  const renderQuestionPreview = (q: Question, index: number) => {
      return (
        <>
            <h3 className="text-lg font-medium text-slate-900 dark:text-nord-6 mb-3 flex items-start gap-2">
                <span className="text-brand-600 dark:text-nord-9 font-bold">P{index+1}.</span> 
                {q.text.split('{{__}}').map((part, i, arr) => (
                    <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && <span className="border-b-2 border-slate-400 w-12 inline-block mx-1"></span>}
                    </React.Fragment>
                ))}
            </h3>
            
            {/* Rendering based on new types */}
            {(q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.BEST_ANSWER) && (
                <ul className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-nord-2">
                {q.options?.map((opt, idx) => (
                    <li key={idx} className="text-sm text-slate-600 dark:text-nord-4 flex items-center gap-2">
                        <div className="w-4 h-4 border rounded-full border-slate-300"></div>
                        {opt}
                    </li>
                ))}
                </ul>
            )}

            {(q.type === QuestionType.DRAG_DROP || q.type === QuestionType.REORDER_STEPS) && (
                 <div className="bg-slate-50 dark:bg-nord-0 p-3 rounded border border-slate-200 dark:border-nord-2">
                    <p className="text-xs text-slate-500 uppercase font-bold mb-2">Items a Ordenar:</p>
                    <div className="flex flex-wrap gap-2">
                        {q.options?.map((opt, idx) => (
                            <span key={idx} className="px-3 py-1 bg-white dark:bg-nord-2 border rounded shadow-sm text-sm">
                                ↕ {opt}
                            </span>
                        ))}
                    </div>
                 </div>
            )}

            {q.type === QuestionType.YES_NO && (
                 <div className="flex gap-4 mt-2">
                     <span className="px-4 py-2 border rounded-lg text-sm text-slate-500">Sí</span>
                     <span className="px-4 py-2 border rounded-lg text-sm text-slate-500">No</span>
                 </div>
            )}

            {(q.type === QuestionType.LAB_BASED || q.type === QuestionType.HOTSPOT_CODE) && (
                <div className="bg-slate-900 dark:bg-nord-0 rounded-lg p-4 mt-3 border border-slate-800 dark:border-nord-0">
                    <div className="flex items-center gap-2 text-slate-400 dark:text-nord-3 text-xs mb-2 pb-2 border-b border-slate-700 dark:border-nord-2">
                        <Code size={12}/> {q.type === QuestionType.HOTSPOT_CODE ? 'Código para Analizar' : 'Código Inicial'}
                    </div>
                    <pre className="text-slate-300 dark:text-nord-4 font-mono text-sm overflow-x-auto">
                    {q.starterCode || "// Código no disponible"}
                    </pre>
                </div>
            )}
             
             {(q.type === QuestionType.CASE_STUDY || q.type === QuestionType.SCENARIO_MULTISTEP) && (
                 <div className="mt-2 bg-amber-50 dark:bg-nord-13/10 p-3 rounded border border-amber-100 dark:border-nord-13/20 text-sm text-amber-800 dark:text-nord-13">
                     Requiere respuesta de texto largo / análisis.
                 </div>
             )}
        </>
      );
  };

  if (step === 1) {
    return (
      <div className="max-w-4xl mx-auto p-8 animate-in fade-in duration-500">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-nord-6 mb-2">
            {initialData ? 'Editar Prueba' : 'Diseñar Prueba'}
        </h2>
        <p className="text-slate-500 dark:text-nord-4 mb-8">Configura los parámetros y deja que la IA Arquitecto estructure el reto.</p>

        <div className="bg-white dark:bg-nord-1 p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-nord-2 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-2">Título</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-2 text-slate-900 dark:text-nord-6 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  placeholder="Ej. Evaluación Backend Senior 2025"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              
              <div>
                 <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-2">Lenguaje</label>
                 <div className="grid grid-cols-3 gap-2">
                    {LANGUAGES.slice(0, 9).map(lang => (
                        <button
                          key={lang}
                          onClick={() => setFormData({...formData, language: lang, framework: FRAMEWORKS[lang]?.[0] || ''})}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-all border ${
                            formData.language === lang 
                            ? 'bg-brand-600 text-white border-brand-600 dark:bg-nord-9 dark:text-nord-0' 
                            : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-400 dark:bg-nord-0 dark:text-nord-4 dark:border-nord-2'
                          }`}
                        >
                          {lang}
                        </button>
                    ))}
                 </div>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-2">Framework / Ecosistema</label>
                <select 
                  className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-2 text-slate-900 dark:text-nord-6 rounded-lg px-4 py-3 outline-none"
                  value={formData.framework}
                  onChange={(e) => setFormData({...formData, framework: e.target.value})}
                >
                  {handleFrameworks().map(fw => <option key={fw} value={fw}>{fw}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-2">Dificultad</label>
                   <select 
                    className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-2 text-slate-900 dark:text-nord-6 rounded-lg px-4 py-3 outline-none"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({...formData, difficulty: e.target.value as Difficulty})}
                   >
                     {Object.values(Difficulty).map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-2">Preguntas</label>
                   <input 
                    type="number" 
                    min={3} max={20}
                    className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-2 text-slate-900 dark:text-nord-6 rounded-lg px-4 py-3 outline-none"
                    value={formData.questionCount}
                    onChange={(e) => setFormData({...formData, questionCount: parseInt(e.target.value)})}
                   />
                </div>
              </div>

              {/* Official Template Toggle */}
              <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-slate-200 dark:border-nord-2 hover:bg-slate-50 dark:hover:bg-nord-0 transition-colors">
                      <div className={`w-10 h-6 rounded-full flex items-center p-1 transition-colors ${formData.isTemplate ? 'bg-brand-600 dark:bg-nord-9' : 'bg-slate-300 dark:bg-nord-3'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isTemplate ? 'translate-x-4' : ''}`}></div>
                      </div>
                      <input 
                          type="checkbox" 
                          className="hidden"
                          checked={formData.isTemplate}
                          onChange={(e) => setFormData({...formData, isTemplate: e.target.checked})}
                      />
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-nord-6">
                          <ShieldCheck size={16} className="text-brand-600 dark:text-nord-9"/>
                          Marcar como Prueba Oficial Corporativa
                      </div>
                  </label>
              </div>

            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-nord-4 mb-3">Temas de Enfoque</label>
            <div className="flex flex-wrap gap-3">
              {TOPICS.map(topic => (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all border ${
                    formData.topics.includes(topic) 
                    ? 'bg-brand-100 text-brand-800 border-brand-300 dark:bg-nord-14 dark:text-nord-1' 
                    : 'bg-slate-50 text-slate-500 border-slate-200 dark:bg-nord-0 dark:text-nord-4 dark:border-nord-2'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex justify-between border-t border-slate-200 dark:border-nord-2">
            <button onClick={onCancel} className="px-6 py-3 text-slate-500 dark:text-nord-4 hover:text-slate-900 dark:hover:text-nord-6 font-medium">Cancelar</button>
            
            <div className="flex gap-4">
                {initialData && (
                    <button 
                        onClick={() => setStep(2)}
                        className="bg-slate-100 dark:bg-nord-3 hover:bg-slate-200 text-slate-700 dark:text-nord-6 px-6 py-3 rounded-lg flex items-center gap-2 font-bold transition-colors"
                    >
                        <Edit3 size={18} />
                        Ir al Editor (Saltar IA)
                    </button>
                )}

                <button 
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="bg-brand-600 dark:bg-nord-9 hover:bg-brand-700 text-white dark:text-nord-1 px-8 py-3 rounded-lg flex items-center gap-2 font-bold shadow-lg disabled:opacity-50 transition-all hover:scale-[1.02]"
                >
                    {isLoading ? <Loader2 className="animate-spin" size={20}/> : <Sparkles size={20} />}
                    {initialData ? 'Regenerar con IA' : 'Generar Prueba'}
                </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="bg-brand-50 border border-brand-200 dark:bg-nord-14/10 dark:border-nord-14/30 p-4 rounded-lg flex items-center justify-between text-brand-800 dark:text-nord-14">
           <div className="flex items-center gap-3">
             <Sparkles size={20} />
             <p className="font-medium">
                 {initialData && generatedQuestions === initialData.questions 
                  ? `Editando ${generatedQuestions.length} preguntas existentes.`
                  : `La IA ha diseñado ${generatedQuestions.length} desafíos variados (Drag&Drop, Casos, Código, etc.).`}
             </p>
           </div>
           <span className="text-sm font-bold bg-brand-100 dark:bg-nord-14/20 px-3 py-1 rounded-full">
             {selectedQuestionIds.size} Seleccionadas
           </span>
        </div>

        <div className="grid gap-6">
          {generatedQuestions.map((q, i) => (
            <div 
              key={q.id} 
              className={`bg-white dark:bg-nord-1 rounded-xl border transition-all ${
                selectedQuestionIds.has(q.id) 
                ? 'border-brand-500 dark:border-nord-9 shadow-md' 
                : 'border-slate-200 dark:border-nord-2 opacity-60'
              }`}
            >
              <div className="p-4 border-b border-slate-100 dark:border-nord-2 flex justify-between items-center bg-slate-50 dark:bg-nord-0/30 rounded-t-xl">
                 <div className="flex items-center gap-3">
                    <input 
                      type="checkbox"
                      checked={selectedQuestionIds.has(q.id)}
                      onChange={() => toggleQuestionSelection(q.id)}
                      className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="bg-slate-200 dark:bg-nord-3 text-slate-700 dark:text-nord-6 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider flex items-center gap-1">
                        {getIconForType(q.type)} {q.type}
                    </span>
                    {q.topic && <span className="text-slate-400 text-xs italic">• {q.topic}</span>}
                 </div>
                 <button onClick={() => toggleQuestionSelection(q.id)} className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 size={16} />
                 </button>
              </div>

              <div className="p-6">
                {refiningId === q.id ? (
                   <div className="flex items-center justify-center py-8">
                      <Loader2 className="animate-spin text-brand-600" size={32} />
                   </div>
                ) : (
                   renderQuestionPreview(q, i)
                )}

                {selectedQuestionIds.has(q.id) && (
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-nord-2 flex gap-2">
                     <input 
                        type="text"
                        placeholder="Instrucción para la IA (ej. 'Hazla más difícil', 'Cambia a Python')"
                        className="flex-1 bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-2 text-slate-900 dark:text-nord-6 text-sm rounded-md px-3 py-2 outline-none focus:border-brand-500"
                        value={refiningId === q.id ? 'Refinando...' : (refiningId === null ? refineInstruction : '')}
                        disabled={refiningId !== null}
                        onChange={(e) => {
                           if(refiningId === null) setRefineInstruction(e.target.value);
                        }}
                     />
                     <button 
                        onClick={() => handleRefineQuestion(q.id)}
                        disabled={!refineInstruction || refiningId !== null}
                        className="bg-slate-200 dark:bg-nord-3 hover:bg-slate-300 text-slate-700 dark:text-nord-6 px-3 py-2 rounded-md flex items-center gap-2 text-sm transition-colors"
                     >
                        <Wand2 size={14} /> Refinar
                     </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="fixed bottom-6 right-6 flex gap-4 z-10">
           <button onClick={() => setStep(1)} className="bg-white dark:bg-nord-0 text-slate-600 dark:text-nord-4 hover:text-slate-900 dark:hover:text-nord-6 px-6 py-3 rounded-full shadow-lg border border-slate-200 dark:border-nord-2 font-medium">
              Atrás
           </button>
           <button 
            onClick={handleFinalSave}
            disabled={selectedQuestionIds.size === 0}
            className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 hover:bg-brand-700 px-8 py-3 rounded-full shadow-xl flex items-center gap-2 font-bold transition-transform hover:scale-105"
          >
            Guardar {initialData ? 'Cambios' : 'en Biblioteca'}
            <Save size={20} />
          </button>
        </div>
      </div>
    );
  }

  return null;
};

const getIconForType = (type: QuestionType) => {
    switch(type) {
        case QuestionType.LAB_BASED: return <Code size={12}/>;
        case QuestionType.DRAG_DROP: return <List size={12}/>;
        case QuestionType.FILL_BLANK: return <TypeIcon size={12}/>;
        case QuestionType.MULTIPLE_CHOICE: return <CheckSquare size={12}/>;
        case QuestionType.CASE_STUDY: return <AlignJustify size={12}/>;
        default: return <Sparkles size={12}/>;
    }
}

export default CreateTest;
