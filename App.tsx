import React, { useState, useEffect, useCallback } from 'react';
import { ViewState, Assessment, Submission, Difficulty, Candidate, QuestionType, AIProvider } from './types';
import EvaluatorDashboard from './components/EvaluatorDashboard';
import CreateTest from './components/CreateTest';
import CandidateView from './components/CandidateView';
import ResultAnalysis from './components/ResultAnalysis';
import CandidatesList from './components/CandidatesList';
import { Layout, LogOut, UserCircle, Code2, Terminal, Sun, Moon, UserCheck, ShieldCheck, Settings, Save, Key, X } from 'lucide-react';
import {
    selectAssessmentForCandidate,
    gradeSubmissionWithAI,
    adjudicateCandidateResult,
    analyzeCandidateProfile,
    generateAssessmentContent
} from './services/geminiService';

// --- COMPONENTS ---

interface LoginScreenProps {
    candidates: Candidate[];
    assessments: Assessment[];
    onEvaluatorLogin: () => void;
    onCandidateLogin: (candidateId: string) => void;
    darkMode: boolean;
    onToggleTheme: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = React.memo(({
    candidates,
    assessments,
    onEvaluatorLogin,
    onCandidateLogin,
    darkMode,
    onToggleTheme
}) => {
    // Filter active candidates who can actually log in (Assigned, Sent, In Progress)
    const activeCandidates = candidates.filter(c =>
        c.assignedAssessmentId &&
        (c.status === 'SENT' || c.status === 'IN_PROGRESS' || c.status === 'COMPLETED')
    );

    const [loginCandidateId, setLoginCandidateId] = useState('');
    const [showSettings, setShowSettings] = useState(false);

    // Settings State
    const [keys, setKeys] = useState({
        gemini: localStorage.getItem('TBL_GEMINI_KEY') || '',
        openai: localStorage.getItem('TBL_OPENAI_KEY') || ''
    });

    const saveKeys = () => {
        if (keys.gemini) localStorage.setItem('TBL_GEMINI_KEY', keys.gemini);
        else localStorage.removeItem('TBL_GEMINI_KEY');

        if (keys.openai) localStorage.setItem('TBL_OPENAI_KEY', keys.openai);
        else localStorage.removeItem('TBL_OPENAI_KEY');

        setShowSettings(false);
        alert("Configuración guardada. Los Agentes IA usarán las nuevas claves.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-nord-0 relative overflow-hidden transition-colors duration-300">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#88C0D0_1px,transparent_1px)] [background-size:20px_20px]"></div>

            <div className="bg-white dark:bg-nord-1 p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-nord-2 max-w-md w-full z-10 relative">
                <div className="flex justify-center mb-6">
                    <img
                        src="https://periferiaitgroup.com/wp-content/uploads/2024/10/logo-tb-2.png"
                        alt="Tech Battle Latam 2025"
                        className="h-28 w-auto object-contain filter drop-shadow-sm"
                    />
                </div>

                <p className="text-center text-slate-500 dark:text-nord-4 mb-8 font-light text-sm uppercase tracking-widest">Plataforma de Evaluación Técnica</p>

                <div className="space-y-8">
                    {/* Evaluator Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-nord-6 font-bold text-sm uppercase tracking-wide">
                            <ShieldCheck size={16} className="text-brand-600" />
                            <span>Acceso Evaluador</span>
                        </div>
                        <button
                            onClick={onEvaluatorLogin}
                            className="w-full bg-brand-600 dark:bg-nord-9 hover:bg-brand-700 dark:hover:bg-nord-10 text-white dark:text-nord-1 font-bold py-3 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-brand-500/20 dark:shadow-nord-9/20"
                        >
                            Ingresar al Dashboard
                        </button>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-nord-2 w-full"></div>

                    {/* Candidate Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-800 dark:text-nord-6 font-bold text-sm uppercase tracking-wide">
                            <UserCheck size={16} className="text-slate-500" />
                            <span>Acceso Candidato (Simulado)</span>
                        </div>

                        <div className="relative">
                            <select
                                className="w-full bg-slate-50 dark:bg-nord-0 border border-slate-200 dark:border-nord-3 text-slate-900 dark:text-nord-6 rounded-lg px-4 py-3 appearance-none outline-none focus:ring-2 focus:ring-brand-500"
                                value={loginCandidateId}
                                onChange={(e) => setLoginCandidateId(e.target.value)}
                            >
                                <option value="">-- Seleccionar Candidato con Prueba --</option>
                                {activeCandidates.map(c => {
                                    const test = assessments.find(a => a.id === c.assignedAssessmentId);
                                    return (
                                        <option key={c.id} value={c.id}>
                                            {c.name} — {test?.title || 'Prueba Desconocida'}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <button
                            onClick={() => onCandidateLogin(loginCandidateId)}
                            disabled={!loginCandidateId}
                            className="w-full bg-slate-800 dark:bg-nord-3 hover:bg-slate-900 dark:hover:bg-nord-2 text-white border border-transparent disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-xl transition-all"
                        >
                            Ingresar a la Prueba
                        </button>
                        {activeCandidates.length === 0 && (
                            <p className="text-xs text-center text-orange-500 mt-2">
                                No hay candidatos activos o con pruebas pendientes.
                            </p>
                        )}
                    </div>
                </div>

                <div className="mt-8 text-center text-xs text-slate-400 dark:text-nord-3 flex items-center justify-center gap-2">
                    <Terminal size={12} /> Potenciado por Inteligencia Artificial Avalia
                </div>
            </div>

            <div className="absolute top-6 right-6 flex gap-2">
                <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-slate-200 dark:bg-nord-3 text-slate-600 dark:text-nord-6 hover:bg-slate-300 dark:hover:bg-nord-2 transition-colors">
                    <Settings size={20} />
                </button>
                <button onClick={onToggleTheme} className="p-2 rounded-full bg-slate-200 dark:bg-nord-3 text-slate-600 dark:text-nord-6 hover:bg-slate-300 dark:hover:bg-nord-2 transition-colors">
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-nord-2 p-6 animate-in zoom-in-95">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-nord-6 flex items-center gap-2">
                                <Settings size={20} className="text-brand-600 dark:text-nord-9" /> Configuración AI
                            </h2>
                            <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 dark:text-nord-4 dark:hover:text-nord-6">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-nord-4 mb-6">
                            Configura tus API Keys para habilitar la generación y evaluación con IA. Se guardan localmente en tu navegador.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-nord-4 mb-1 uppercase">Google Gemini API Key</label>
                                <div className="relative">
                                    <Key size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-nord-3 bg-slate-50 dark:bg-nord-0 rounded-lg text-slate-900 dark:text-nord-6 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="AIza..."
                                        value={keys.gemini}
                                        onChange={e => setKeys({ ...keys, gemini: e.target.value })}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Requerido para modelo Gemini 2.5 Flash.</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 dark:text-nord-4 mb-1 uppercase">OpenAI API Key (Opcional)</label>
                                <div className="relative">
                                    <Key size={16} className="absolute left-3 top-3 text-slate-400" />
                                    <input
                                        type="password"
                                        className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-nord-3 bg-slate-50 dark:bg-nord-0 rounded-lg text-slate-900 dark:text-nord-6 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                                        placeholder="sk-..."
                                        value={keys.openai}
                                        onChange={e => setKeys({ ...keys, openai: e.target.value })}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Si se agrega, el sistema usará GPT-4o para evaluaciones complejas.</p>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={saveKeys}
                                className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 px-6 py-2 rounded-lg font-bold hover:bg-brand-700 dark:hover:bg-nord-10 flex items-center gap-2 transition-colors"
                            >
                                <Save size={16} /> Guardar Configuración
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

// --- MAIN APP ---

const App: React.FC = () => {
    // --- STATE ---
    const [view, setView] = useState<ViewState>(ViewState.LOGIN);
    const [darkMode, setDarkMode] = useState(false);

    // Data Persistence
    const [assessments, setAssessments] = useState<Assessment[]>(() => {
        const saved = localStorage.getItem('tbl_assessments');
        return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
    });

    const [candidates, setCandidates] = useState<Candidate[]>(() => {
        const saved = localStorage.getItem('tbl_candidates');
        return saved ? JSON.parse(saved) : INITIAL_CANDIDATES;
    });

    // Transient UI State
    const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
    const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
    const [currentSubmission, setCurrentSubmission] = useState<Submission | null>(null);
    const [assessmentToEdit, setAssessmentToEdit] = useState<Assessment | null>(null);

    // --- EFFECTS ---

    useEffect(() => {
        localStorage.setItem('tbl_assessments', JSON.stringify(assessments));
    }, [assessments]);

    useEffect(() => {
        localStorage.setItem('tbl_candidates', JSON.stringify(candidates));
    }, [candidates]);

    // Auto-link Candidates from External Sources based on Serial Code
    useEffect(() => {
        if (assessments.length === 0) return;

        setCandidates(prevCandidates => {
            let hasUpdates = false;
            const updated = prevCandidates.map(c => {
                // Logic: If candidate is "imported" (has linkedSerialCode) but NOT yet assigned a test ID
                if (c.linkedSerialCode && !c.assignedAssessmentId) {
                    const match = assessments.find(a => a.serialCode === c.linkedSerialCode);
                    if (match) {
                        console.log(`[System] Auto-linking candidate ${c.name} to official test: ${match.title} (${match.serialCode})`);
                        hasUpdates = true;
                        return {
                            ...c,
                            assignedAssessmentId: match.id,
                            // We keep status PENDING so the recruiter can verify before sending, 
                            // or we could set to SENT if we assume the external system handled invite. 
                            // Let's assume assigned but waiting for trigger.
                            status: 'PENDING' as const
                        };
                    }
                }
                return c;
            });
            return hasUpdates ? updated : prevCandidates;
        });
    }, [assessments]); // Run when assessments load/change

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    const toggleTheme = useCallback(() => setDarkMode(prev => !prev), []);

    // --- HANDLERS (Wrapped in useCallback for performance) ---

    const handleCreateTestSave = useCallback((assessment: Assessment) => {
        setAssessments(prev => {
            const exists = prev.find(a => a.id === assessment.id);
            if (exists) {
                return prev.map(a => a.id === assessment.id ? assessment : a);
            } else {
                return [assessment, ...prev];
            }
        });
        setAssessmentToEdit(null);
        setView(ViewState.EVALUATOR_DASHBOARD);
    }, []);

    const handleTriggerEditAssessment = useCallback((assessment: Assessment) => {
        setAssessmentToEdit(assessment);
        setView(ViewState.CREATE_TEST);
    }, []);

    const handleDeleteAssessment = useCallback((id: string) => {
        if (window.confirm("¿Estás seguro de eliminar esta prueba? Se desvinculará de los candidatos asignados.")) {
            setAssessments(prev => prev.filter(a => a.id !== id));
            setCandidates(prev => prev.map(c => c.assignedAssessmentId === id ? { ...c, assignedAssessmentId: undefined, status: 'PENDING', uniqueLink: undefined } : c));
        }
    }, []);

    const handleDeleteCandidate = useCallback((id: string) => {
        if (window.confirm("¿Eliminar este candidato?")) {
            setCandidates(prev => prev.filter(c => c.id !== id));
            // If we are currently viewing this candidate or logged in as them, reset view logic if needed
            if (activeCandidate?.id === id) {
                setActiveCandidate(null);
                setView(ViewState.LOGIN);
            }
        }
    }, [activeCandidate]);

    const handleUpdateCandidate = useCallback((updated: Candidate) => {
        setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
    }, []);

    const handleToggleBotAssignment = useCallback(async (candidateId: string) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        const isActivating = !candidate.isBotAssigned;

        // Update state immediately to reflect button toggle
        setCandidates(prev => prev.map(c =>
            c.id === candidateId ? { ...c, isBotAssigned: isActivating } : c
        ));

        // If Activating, initiate Orchestrator Workflow
        if (isActivating) {
            // 1. Check if already assigned
            if (candidate.assignedAssessmentId && candidate.status !== 'PENDING') {
                alert("Agente Orquestador: El candidato ya tiene una prueba activa. Monitorearé el resultado.");
                return;
            }

            // --- CRITICAL: Check if we need the Architect Agent immediately ---
            // If candidate has a specific serial code request but we don't have it, 
            // we MUST generate it. We do NOT want the Orchestrator to assign a generic test.
            const requiredSerialCode = candidate.linkedSerialCode;
            const hasMissingRequirement = requiredSerialCode && !assessments.find(a => a.serialCode === requiredSerialCode);

            let bestTestId: string | null = null;

            if (!hasMissingRequirement) {
                // Normal Flow: Ask AI to find best match or use existing
                alert("Agente Orquestador: Analizando biblioteca para buscar pruebas compatibles...");
                bestTestId = await selectAssessmentForCandidate(candidate, assessments);
            } else {
                console.log("Orchestrator: Missing required Serial Code. Skipping search, triggering Architect.");
            }

            if (bestTestId && !hasMissingRequirement) {
                const test = assessments.find(a => a.id === bestTestId);
                // 3. System generates link and sends email (Mock)
                const uniqueLink = `${window.location.origin}/assess/${Math.random().toString(36).substring(7)}`;

                setCandidates(prev => prev.map(c => {
                    if (c.id === candidateId) {
                        return {
                            ...c,
                            assignedAssessmentId: bestTestId,
                            status: 'SENT',
                            uniqueLink: uniqueLink
                        };
                    }
                    return c;
                }));

                alert(`Agente Orquestador: Encontré la prueba "${test?.title}".\n\n[SISTEMA]: Asignando y enviando correo a ${candidate.email}...`);
            } else {
                // Fallback OR Forced Requirement: ARCHITECT AGENT
                const reason = hasMissingRequirement
                    ? `El código serial requerido "${requiredSerialCode}" no existe.`
                    : "No encontré pruebas compatibles en la biblioteca.";

                alert(`Agente Orquestador: ${reason}\n\nACTIVANDO AGENTE ARQUITECTO 👷‍♂️...\n\nAnalizaré el perfil para construir una prueba a la medida y le asignaré el código correspondiente.`);

                try {
                    // A. Analyze Profile
                    const specs = await analyzeCandidateProfile(candidate);

                    // B. Generate Test Content
                    const content = await generateAssessmentContent(specs.language, specs.framework, specs.difficulty, specs.topics, 5);

                    // C. Map Questions to add IDs (important for rendering)
                    const questionsWithIds = content.questions.map((q: any, idx: number) => ({
                        ...q,
                        id: `auto-q-${Date.now()}-${idx}`
                    }));

                    // D. Create Assessment
                    // CRITICAL: If we are missing a required code, USE IT. Otherwise generate a new one.
                    const newSerialCode = requiredSerialCode || `AUTO-${Date.now().toString().slice(-6)}`;

                    const newAssessment: Assessment = {
                        id: `auto-gen-${Date.now()}`,
                        serialCode: newSerialCode,
                        title: `Prueba Generada: ${candidate.role || specs.language}`,
                        language: specs.language,
                        framework: specs.framework,
                        topics: specs.topics,
                        difficulty: specs.difficulty,
                        durationMinutes: 45, // Default for auto-generated
                        questions: questionsWithIds,
                        createdAt: new Date().toISOString(),
                        isTemplate: false // Custom generated
                    };

                    // E. Save Assessment & Assign
                    setAssessments(prev => [newAssessment, ...prev]);

                    const uniqueLink = `${window.location.origin}/assess/${Math.random().toString(36).substring(7)}`;

                    setCandidates(prev => prev.map(c => {
                        if (c.id === candidateId) {
                            return {
                                ...c,
                                assignedAssessmentId: newAssessment.id,
                                status: 'SENT',
                                uniqueLink: uniqueLink
                                // The candidate is now linked to this new test via ID. 
                                // The test has the serial code the candidate "brought".
                            };
                        }
                        return c;
                    }));

                    alert(`Agente Arquitecto: He diseñado una nueva prueba de ${specs.language} (${specs.difficulty}) y la he registrado con el código "${newSerialCode}".\n\n[SISTEMA]: Asignando y enviando correo...`);

                } catch (e) {
                    console.error(e);
                    alert("Error crítico: El Agente Arquitecto no pudo generar la prueba.");
                }
            }
        }
    }, [candidates, assessments]);

    const handleCreateCandidate = useCallback((candidate: Candidate) => {
        setCandidates(prev => [candidate, ...prev]);
    }, []);

    const handleLinkCandidateToAssessment = useCallback((candidateId: string, assessmentId: string) => {
        setCandidates(prev => prev.map(c => {
            if (c.id === candidateId) {
                return {
                    ...c,
                    assignedAssessmentId: assessmentId,
                    status: 'SENT',
                    uniqueLink: `${window.location.origin}/assess/${Math.random().toString(36).substring(7)}`
                };
            }
            return c;
        }));
    }, []);

    const handleResendInvite = useCallback((candidateId: string) => {
        setCandidates(currentCandidates => {
            const candidate = currentCandidates.find(c => c.id === candidateId);
            if (candidate && candidate.uniqueLink) {
                // Using setTimeout to avoid blocking render if alert is modal
                setTimeout(() => {
                    alert(`📨 ENVÍO DE CORREO SIMULADO:\n\nPara: ${candidate.email}\nAsunto: Invitación a Tech Battle Latam 2025\n\nHola ${candidate.name},\n\nHas sido invitado a realizar una prueba técnica.\nAccede aquí: ${candidate.uniqueLink}\n\n(Este link es único para el candidato)`);
                }, 100);
            } else {
                setTimeout(() => alert("No se encontró el link único. Por favor reasigna la prueba."), 100);
            }
            return currentCandidates;
        });
    }, []);

    const handleViewResult = useCallback((candidate: Candidate) => {
        if (candidate.submission) {
            setCurrentSubmission(candidate.submission);
            setView(ViewState.TEST_RESULTS);
        } else {
            alert("Este candidato aún no tiene resultados procesados o enviados.");
        }
    }, []);

    const handleCandidateLogin = useCallback((candidateId: string) => {
        const candidate = candidates.find(c => c.id === candidateId);
        if (!candidate) return;

        if (candidate.status === 'COMPLETED' || candidate.status === 'APPROVED' || candidate.status === 'REJECTED') {
            alert("Este candidato ya ha completado su proceso o el ticket está cerrado.");
            return;
        }

        const assessment = assessments.find(a => a.id === candidate.assignedAssessmentId);
        if (!assessment) {
            alert("Error: No se encontró la prueba asignada a este candidato. Por favor contacta al administrador.");
            return;
        }

        setActiveCandidate(candidate);
        setCurrentAssessment(assessment);

        if (candidate.status === 'SENT') {
            // Update directly in state to reflect 'IN_PROGRESS' immediately
            setCandidates(prev => prev.map(c => c.id === candidate.id ? { ...c, status: 'IN_PROGRESS' } : c));
        }

        setView(ViewState.CANDIDATE_LANDING);
    }, [candidates, assessments]);

    const handleCandidateSubmit = useCallback(async (submission: Submission) => {
        if (!activeCandidate || !currentAssessment) return;

        const updatedCandidate: Candidate = {
            ...activeCandidate,
            status: 'COMPLETED',
            submissionDate: new Date().toISOString(),
            submission: submission
        };

        // 1. Save initial submission state
        setCandidates(prev => prev.map(c => c.id === activeCandidate.id ? updatedCandidate : c));
        setView(ViewState.CANDIDATE_FINISHED);

        // 2. If Bot is assigned, trigger Orchestrator grading workflow
        if (activeCandidate.isBotAssigned) {
            // Wait a moment to simulate event propagation
            await new Promise(r => setTimeout(r, 2000));

            console.log("Orchestrator: Received completion event. Triggering Evaluator (Avalia)...");

            // A. Evaluator (Avalia) grades
            const analysis = await gradeSubmissionWithAI(
                submission.answers,
                currentAssessment.language,
                currentAssessment
            );

            console.log("Orchestrator: Received Analysis. Adjudicating final decision...");

            // B. Orchestrator decides final status
            const finalDecision = await adjudicateCandidateResult(analysis);

            // C. Update Ticket
            setCandidates(prev => prev.map(c => {
                if (c.id === activeCandidate.id) {
                    return {
                        ...c,
                        submission: submission, // ensure submission is there
                        score: analysis.score, // save score
                        status: finalDecision // APPROVED or REJECTED
                    };
                }
                return c;
            }));

            // D. Mock Notification
            const msg = finalDecision === 'APPROVED'
                ? `🎉 ORCHESTRATOR: Candidato ${activeCandidate.name} marcado como APROBADO (Score: ${analysis.score}).\n\nEstado actualizado a: 'PENDIENTE REVISIÓN' para validación manual del administrador.`
                : `🚫 ORCHESTRATOR: Candidato ${activeCandidate.name} RECHAZADO (Score: ${analysis.score}).\n\n[SISTEMA]: Enviando correo automático de feedback.`;

            alert(msg);
        }

    }, [activeCandidate, currentAssessment]);

    // --- VIEWS ---

    if (view === ViewState.LOGIN) {
        return (
            <LoginScreen
                candidates={candidates}
                assessments={assessments}
                onEvaluatorLogin={() => setView(ViewState.EVALUATOR_DASHBOARD)}
                onCandidateLogin={handleCandidateLogin}
                darkMode={darkMode}
                onToggleTheme={toggleTheme}
            />
        );
    }

    if (view === ViewState.CANDIDATE_LANDING) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-nord-0 flex items-center justify-center p-4 text-slate-900 dark:text-nord-6">
                <div className="bg-white dark:bg-nord-1 max-w-2xl w-full p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-nord-2 text-center animate-in zoom-in-95">
                    <div className="flex justify-center mb-6">
                        <img
                            src="https://periferiaitgroup.com/wp-content/uploads/2024/10/logo-tb-2.png"
                            alt="Tech Battle Latam 2025"
                            className="h-20 w-auto object-contain"
                        />
                    </div>
                    <div className="mb-6">
                        <span className="bg-brand-100 dark:bg-nord-9/20 text-brand-700 dark:text-nord-9 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            {currentAssessment?.language} • {currentAssessment?.difficulty}
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-nord-6">{currentAssessment?.title}</h1>
                    <p className="text-lg text-slate-500 dark:text-nord-4 mb-8">Hola, <span className="font-bold text-slate-800 dark:text-nord-5">{activeCandidate?.name}</span>.</p>

                    <div className="bg-slate-50 dark:bg-nord-0 p-6 rounded-xl text-left mb-8 border border-slate-100 dark:border-nord-2 text-sm space-y-3">
                        <p className="flex items-center gap-2 text-slate-600 dark:text-nord-4">
                            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                            Tendrás <strong>{currentAssessment?.durationMinutes} minutos</strong> para completar la prueba.
                        </p>
                        <p className="flex items-center gap-2 text-slate-600 dark:text-nord-4">
                            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                            El entorno está monitoreado. No cambies de pestaña.
                        </p>
                        <p className="flex items-center gap-2 text-slate-600 dark:text-nord-4">
                            <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                            Tus respuestas serán analizadas por el Agente Autónomo Avalia.
                        </p>
                    </div>

                    <button
                        onClick={() => setView(ViewState.CANDIDATE_EXAM)}
                        className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 font-bold px-8 py-4 rounded-xl hover:bg-brand-700 dark:hover:bg-nord-8 w-full transition-all shadow-lg shadow-brand-500/20"
                    >
                        Iniciar Prueba Ahora
                    </button>

                    <button onClick={() => { setActiveCandidate(null); setView(ViewState.LOGIN); }} className="mt-4 text-sm text-slate-400 hover:text-slate-600 dark:hover:text-nord-4">
                        No soy {activeCandidate?.name}, salir.
                    </button>
                </div>
            </div>
        );
    }

    if (view === ViewState.CANDIDATE_EXAM && currentAssessment) {
        return (
            <CandidateView
                assessment={currentAssessment}
                candidateName={activeCandidate?.name || "Candidato"}
                onSubmit={handleCandidateSubmit}
            />
        );
    }

    if (view === ViewState.CANDIDATE_FINISHED) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-nord-0 flex items-center justify-center text-center text-slate-900 dark:text-nord-6 p-6">
                <div className="bg-white dark:bg-nord-1 p-10 rounded-3xl shadow-2xl border border-slate-200 dark:border-nord-2 max-w-lg w-full animate-in fade-in-50">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-nord-6 mb-2">¡Envío Recibido!</h2>
                    <p className="text-slate-500 dark:text-nord-4 mb-8">Gracias {activeCandidate?.name}, hemos recibido tus respuestas correctamente. El agente autónomo Avalia está analizando tu código.</p>

                    <button
                        onClick={() => { setActiveCandidate(null); setView(ViewState.LOGIN); }}
                        className="w-full bg-slate-900 dark:bg-nord-3 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-nord-2 transition-colors"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-nord-0 flex font-sans text-slate-900 dark:text-nord-6 selection:bg-brand-200 dark:selection:bg-nord-9 transition-colors duration-300">
            <aside className="w-72 bg-white dark:bg-nord-1 border-r border-slate-200 dark:border-nord-2 flex-col hidden md:flex sticky top-0 h-screen">
                <div className="h-24 flex items-center justify-center px-6 border-b border-slate-200 dark:border-nord-2">
                    <img
                        src="https://periferiaitgroup.com/wp-content/uploads/2024/10/logo-tb-2.png"
                        alt="Tech Battle Latam"
                        className="h-16 w-auto object-contain"
                    />
                </div>
                <nav className="flex-1 p-6 space-y-3">
                    <button
                        onClick={() => { setView(ViewState.EVALUATOR_DASHBOARD); setAssessmentToEdit(null); }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${view === ViewState.EVALUATOR_DASHBOARD ? 'bg-slate-100 dark:bg-nord-3 text-slate-900 dark:text-nord-6 shadow-sm' : 'text-slate-500 dark:text-nord-4 hover:bg-slate-50 dark:hover:bg-nord-2 hover:text-slate-900 dark:hover:text-nord-6'}`}
                    >
                        <Layout size={20} />
                        Biblioteca de Pruebas
                    </button>
                    <button
                        onClick={() => { setView(ViewState.CREATE_TEST); setAssessmentToEdit(null); }}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${view === ViewState.CREATE_TEST ? 'bg-slate-100 dark:bg-nord-3 text-slate-900 dark:text-nord-6 shadow-sm' : 'text-slate-500 dark:text-nord-4 hover:bg-slate-50 dark:hover:bg-nord-2 hover:text-slate-900 dark:hover:text-nord-6'}`}
                    >
                        <Code2 size={20} />
                        Crear Nueva
                    </button>
                    <button
                        onClick={() => setView(ViewState.CANDIDATES_LIST)}
                        className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium ${view === ViewState.CANDIDATES_LIST ? 'bg-slate-100 dark:bg-nord-3 text-slate-900 dark:text-nord-6 shadow-sm' : 'text-slate-500 dark:text-nord-4 hover:bg-slate-50 dark:hover:bg-nord-2 hover:text-slate-900 dark:hover:text-nord-6'}`}
                    >
                        <UserCircle size={20} />
                        Candidatos
                    </button>
                </nav>

                <div className="p-6 border-t border-slate-200 dark:border-nord-2 space-y-4">
                    <button
                        onClick={toggleTheme}
                        className="flex items-center justify-center gap-3 w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-nord-3 text-slate-600 dark:text-nord-4 hover:bg-slate-50 dark:hover:bg-nord-2 transition-colors text-sm"
                    >
                        {darkMode ? <><Sun size={16} /> Modo Claro</> : <><Moon size={16} /> Modo Oscuro</>}
                    </button>

                    <button onClick={() => setView(ViewState.LOGIN)} className="flex items-center gap-3 text-red-500 dark:text-nord-11 hover:text-red-700 dark:hover:text-nord-11/80 w-full px-4 py-2 font-medium transition-colors">
                        <LogOut size={20} />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-nord-0">
                {view === ViewState.EVALUATOR_DASHBOARD && (
                    <EvaluatorDashboard
                        assessments={assessments}
                        candidates={candidates}
                        onDeleteAssessment={handleDeleteAssessment}
                        onEditAssessment={handleTriggerEditAssessment}
                        onUpdateAssessment={handleCreateTestSave}
                        onAssignAssessment={handleLinkCandidateToAssessment}
                        onAddCandidate={handleCreateCandidate}
                        onCreateNew={() => { setAssessmentToEdit(null); setView(ViewState.CREATE_TEST); }}
                    />
                )}

                {view === ViewState.CREATE_TEST && (
                    <CreateTest
                        initialData={assessmentToEdit || undefined}
                        onSave={handleCreateTestSave}
                        onCancel={() => setView(ViewState.EVALUATOR_DASHBOARD)}
                    />
                )}

                {view === ViewState.CANDIDATES_LIST && (
                    <CandidatesList
                        candidates={candidates}
                        assessments={assessments}
                        onDeleteCandidate={handleDeleteCandidate}
                        onUpdateCandidate={handleUpdateCandidate}
                        onAddCandidate={handleCreateCandidate}
                        onLinkCandidate={handleLinkCandidateToAssessment}
                        onResendInvite={handleResendInvite}
                        onViewResult={handleViewResult}
                        onToggleBot={handleToggleBotAssignment}
                    />
                )}

                {view === ViewState.TEST_RESULTS && currentSubmission && (
                    <ResultAnalysis
                        submission={currentSubmission}
                        language={assessments.find(a => a.id === currentSubmission.assessmentId)?.language || "Code"}
                        assessmentContext={assessments.find(a => a.id === currentSubmission.assessmentId)}
                        onBack={() => setView(ViewState.CANDIDATES_LIST)}
                    />
                )}
            </main>
        </div>
    );
};

// --- MOCK DATA ---

const INITIAL_ASSESSMENTS: Assessment[] = [
    {
        id: 'official-1',
        serialCode: 'PERI-2025-SPR1',
        title: 'Certificación Java Spring Boot Enterprise',
        language: 'Java',
        framework: 'Spring Boot',
        topics: ['Microservicios', 'Seguridad (OAuth2)', 'JPA/Hibernate'],
        difficulty: Difficulty.SENIOR,
        durationMinutes: 90,
        createdAt: new Date().toISOString(),
        isTemplate: true,
        providerConfig: AIProvider.HYBRID,
        questions: [
            {
                id: 'q_java_1',
                type: QuestionType.MULTIPLE_CHOICE,
                text: 'En una arquitectura de microservicios con Spring Cloud, ¿qué patrón se utiliza para prevenir fallos en cascada?',
                options: ['Circuit Breaker', 'Singleton', 'Factory Method', 'Observer'],
                correctOptionIndex: 0,
                topic: 'Microservicios'
            },
            {
                id: 'q_java_2',
                type: QuestionType.LAB_BASED,
                text: 'Implementa un Endpoint REST seguro que filtre usuarios por rol usando Spring Security.',
                starterCode: '@RestController\n@RequestMapping("/api/users")\npublic class UserController {\n    // Implementa la lógica aquí\n}',
                topic: 'Seguridad'
            }
        ]
    },
    {
        id: 'official-2',
        serialCode: 'PERI-2025-NET2',
        title: 'Evaluación Fullstack Angular + .NET Core',
        language: 'C#',
        framework: '.NET Core',
        topics: ['API Design', 'Dependency Injection', 'RxJS'],
        difficulty: Difficulty.MID,
        durationMinutes: 60,
        createdAt: new Date().toISOString(),
        isTemplate: true,
        providerConfig: AIProvider.GOOGLE_GEMINI,
        questions: [
            {
                id: 'q_net_1',
                type: QuestionType.HOTSPOT_CODE,
                text: 'Identifica la vulnerabilidad de inyección SQL en el siguiente código.',
                starterCode: 'var query = "SELECT * FROM Users WHERE Username = \'" + username + "\'";\nvar cmd = new SqlCommand(query, conn);',
                topic: 'Seguridad'
            }
        ]
    },
    {
        id: 'mock-1',
        serialCode: 'CUST-2025-REA1',
        title: 'Test Rápido React Hooks',
        language: 'JavaScript',
        framework: 'React',
        topics: ['Hooks', 'Rendimiento', 'Context'],
        difficulty: Difficulty.SENIOR,
        durationMinutes: 45,
        createdAt: new Date().toISOString(),
        isTemplate: false,
        providerConfig: AIProvider.GOOGLE_GEMINI,
        questions: [
            {
                id: 'q1',
                type: QuestionType.MULTIPLE_CHOICE,
                text: '¿Qué hook es mejor para cálculos costosos?',
                options: ['useEffect', 'useMemo', 'useCallback', 'useState'],
                correctOptionIndex: 1,
                topic: 'Hooks'
            },
            {
                id: 'q2',
                type: QuestionType.LAB_BASED,
                text: 'Implementa una función debounce',
                starterCode: 'function debounce(fn, delay) {\n  // Tu código aquí\n}',
                topic: 'Algoritmos'
            }
        ]
    }
];

const INITIAL_CANDIDATES: Candidate[] = [
    {
        id: 'c1',
        name: 'Alice Ingeniera (Manual)',
        email: 'alice@tech.com',
        role: 'Desarrollador Frontend',
        experienceLevel: 'Senior',
        assignedAssessmentId: 'mock-1',
        status: 'APPROVED',
        score: 88,
        submissionDate: '2023-10-01',
        isBotAssigned: true,
        submission: {
            assessmentId: 'mock-1',
            candidateName: 'Alice Ingeniera',
            candidateEmail: 'alice@tech.com',
            answers: {
                'q1': 1,
                'q2': 'function debounce(fn, delay) {\n  let timeoutID;\n  return function(...args) {\n    clearTimeout(timeoutID);\n    timeoutID = setTimeout(() => fn.apply(this, args), delay);\n  };\n}'
            },
            timeSpentSeconds: 1200,
            warnings: 0
        }
    },
    {
        id: 'c_ext_1',
        name: 'Carlos Externo (Importado)',
        email: 'carlos.ext@partners.com',
        role: 'Java Backend',
        experienceLevel: 'Senior',
        linkedSerialCode: 'PERI-2025-SPR1', // This links to 'official-1'
        status: 'PENDING',
        isBotAssigned: false
    }
];

export default App;
