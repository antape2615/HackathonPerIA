
import React, { useEffect, useState } from 'react';
import { Submission, AIAnalysis, Assessment } from '../types';
import { gradeSubmissionWithAI } from '../services/geminiService';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Award, TrendingUp, AlertTriangle, CheckCircle2, ChevronLeft, ShieldAlert, Zap, Bug, FileCode, BrainCircuit, Bot } from 'lucide-react';

interface ResultAnalysisProps {
  submission: Submission;
  language: string;
  assessmentContext?: Assessment | null;
  onBack: () => void;
}

const ResultAnalysis: React.FC<ResultAnalysisProps> = ({ submission, language, assessmentContext, onBack }) => {
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>('Inicializando Agente Avalia...');

  useEffect(() => {
    const performGrading = async () => {
      // Simulation of "Thinking" steps for the Autonomous Agent
      const steps = [
        "Conectando con el núcleo de Avalia...",
        "Analizando sintaxis y estructura del código...",
        "Ejecutando escáner de vulnerabilidades (SAST)...",
        "Calculando complejidad Big O...",
        "Generando recomendación de contratación..."
      ];

      for (const step of steps) {
        setLoadingStep(step);
        await new Promise(r => setTimeout(r, 1000));
      }

      const result = await gradeSubmissionWithAI(submission.answers, language, assessmentContext);
      setAnalysis(result);
    };

    performGrading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-nord-0 space-y-6 p-8">
        <div className="relative">
            <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full animate-pulse"></div>
            <Bot size={64} className="text-brand-600 dark:text-nord-9 relative z-10 animate-bounce" />
        </div>
        <div className="text-center space-y-2">
             <h2 className="text-2xl font-bold text-slate-800 dark:text-nord-6">Agente Autónomo Avalia</h2>
             <p className="text-lg text-brand-600 dark:text-nord-9 font-mono animate-pulse">{loadingStep}</p>
             <p className="text-slate-400 dark:text-nord-4 text-sm max-w-md mx-auto mt-4">
                Evaluando evidencias de: {submission.candidateName}
             </p>
        </div>
      </div>
    );
  }

  const radarData = [
    { subject: 'Calidad', A: analysis.codeQuality, fullMark: 100 },
    { subject: 'Lógica', A: analysis.problemSolving, fullMark: 100 },
    { subject: 'Teoría', A: analysis.theoreticalKnowledge, fullMark: 100 },
    { subject: 'Best Practices', A: analysis.bestPractices, fullMark: 100 },
    { subject: 'Seguridad', A: analysis.securityScore, fullMark: 100 },
    { subject: 'Performance', A: analysis.performanceScore, fullMark: 100 },
  ];

  const getRecommendationColor = (rec: string) => {
      switch(rec) {
          case 'Strong Hire': return 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-200';
          case 'Hire': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
          case 'Weak Hire': return 'bg-orange-100 text-orange-800 border-orange-200';
          default: return 'bg-red-100 text-red-800 border-red-200';
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-nord-0 p-6 md:p-10 animate-in fade-in duration-700">
        <button onClick={onBack} className="mb-8 flex items-center text-slate-500 dark:text-nord-4 hover:text-brand-600 dark:hover:text-nord-9 transition-colors group font-medium">
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> Volver al Dashboard
        </button>

        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8">
            
            {/* Left Column: Main Report (8 cols) */}
            <div className="xl:col-span-8 space-y-8">
                
                {/* Header Card */}
                <div className="bg-white dark:bg-nord-1 rounded-3xl shadow-xl border border-slate-100 dark:border-nord-2 overflow-hidden relative">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 via-brand-500 to-emerald-600"></div>
                    <div className="p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <div className="flex items-center gap-2 text-sm font-mono text-brand-600 dark:text-nord-9 mb-1 uppercase tracking-wider font-bold">
                                    <Bot size={16} /> Reporte Oficial Avalia
                                </div>
                                <h1 className="text-4xl font-bold text-slate-900 dark:text-nord-6 tracking-tight">{submission.candidateName}</h1>
                                <p className="text-slate-500 dark:text-nord-4 mt-1 flex items-center gap-2">
                                    {language} • Nivel Detectado: <span className="font-bold text-slate-700 dark:text-nord-5 bg-slate-100 dark:bg-nord-2 px-2 py-0.5 rounded">{analysis.levelEstimated}</span>
                                </p>
                            </div>
                            <div className={`px-6 py-4 rounded-2xl text-center border-2 shadow-sm ${getRecommendationColor(analysis.hiringRecommendation)}`}>
                                <div className="text-xs uppercase font-bold opacity-80 mb-1">Decisión Avalia</div>
                                <div className="text-2xl font-black tracking-wide">{analysis.hiringRecommendation}</div>
                            </div>
                        </div>
                        
                        <div className="prose dark:prose-invert max-w-none bg-slate-50 dark:bg-nord-0 p-6 rounded-2xl border border-slate-100 dark:border-nord-2">
                            <h3 className="text-slate-900 dark:text-nord-6 font-bold text-lg mb-2 flex items-center gap-2">
                                <BrainCircuit className="text-brand-500 dark:text-nord-13"/> Resumen Ejecutivo
                            </h3>
                            <p className="leading-relaxed text-slate-600 dark:text-nord-4 text-lg">
                                {analysis.summary}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Technical Pillars Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Security Audit */}
                    <div className="bg-white dark:bg-nord-1 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-nord-2 relative overflow-hidden group">
                         <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
                         <h4 className="font-bold text-slate-800 dark:text-nord-6 mb-4 flex items-center gap-2 relative z-10">
                            <ShieldAlert className={analysis.securityScore > 80 ? "text-emerald-500" : "text-red-500"} size={22}/> 
                            Auditoría de Seguridad
                         </h4>
                         <div className="flex items-end gap-2 mb-4 relative z-10">
                            <span className="text-5xl font-black text-slate-900 dark:text-nord-6 tracking-tighter">{analysis.securityScore}</span>
                            <span className="text-sm text-slate-400 mb-2 font-medium">/100 Pts</span>
                         </div>
                         {analysis.detectedIssues.length > 0 ? (
                             <ul className="space-y-2 relative z-10">
                                {analysis.detectedIssues.slice(0, 3).map((issue, i) => (
                                    <li key={i} className="text-sm text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg flex items-start gap-2 border border-red-100 dark:border-red-900/30">
                                        <Bug size={16} className="mt-0.5 shrink-0"/> {issue}
                                    </li>
                                ))}
                             </ul>
                         ) : (
                             <div className="text-emerald-600 dark:text-emerald-400 text-sm bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg flex items-center gap-2 border border-emerald-100 dark:border-emerald-900/30">
                                 <CheckCircle2 size={16}/> Análisis limpio. No se detectaron vulnerabilidades críticas (OWASP Top 10).
                             </div>
                         )}
                    </div>

                    {/* Performance & Optimization */}
                    <div className="bg-white dark:bg-nord-1 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-nord-2 relative overflow-hidden group">
                         <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full z-0 group-hover:scale-110 transition-transform"></div>
                         <h4 className="font-bold text-slate-800 dark:text-nord-6 mb-4 flex items-center gap-2 relative z-10">
                            <Zap className="text-blue-500 dark:text-nord-9" size={22}/> 
                            Performance & Algoritmos
                         </h4>
                         <div className="flex items-end gap-2 mb-4 relative z-10">
                            <span className="text-5xl font-black text-slate-900 dark:text-nord-6 tracking-tighter">{analysis.performanceScore}</span>
                            <span className="text-sm text-slate-400 mb-2 font-medium">/100 Pts</span>
                         </div>
                         <p className="text-sm text-slate-600 dark:text-nord-4 relative z-10 leading-relaxed bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg">
                             {analysis.performanceScore > 80 
                                ? "Uso eficiente de recursos. Algoritmos con complejidad temporal óptima (O(n) o mejor)." 
                                : "Detectamos ineficiencias (posible O(n^2)). Se recomienda refactorizar bucles anidados."}
                         </p>
                    </div>
                </div>

                {/* Strengths & Weaknesses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                            <h4 className="font-bold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center gap-2">
                            <TrendingUp size={20}/> Puntos Fuertes
                            </h4>
                            <ul className="space-y-3">
                            {analysis.strengths.map((s, i) => (
                                <li key={i} className="flex items-start gap-3 text-emerald-700 dark:text-emerald-300 text-sm">
                                    <div className="bg-emerald-200 dark:bg-emerald-800 rounded-full p-0.5 mt-0.5 shrink-0">
                                        <CheckCircle2 size={12} className="text-emerald-700 dark:text-emerald-200"/>
                                    </div>
                                    {s}
                                </li>
                            ))}
                            </ul>
                    </div>
                    <div className="bg-orange-50/50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30">
                            <h4 className="font-bold text-orange-800 dark:text-orange-400 mb-4 flex items-center gap-2">
                            <AlertTriangle size={20}/> Áreas de Mejora
                            </h4>
                            <ul className="space-y-3">
                            {analysis.weaknesses.map((w, i) => (
                                <li key={i} className="flex items-start gap-3 text-orange-700 dark:text-orange-300 text-sm">
                                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0"></div> 
                                    {w}
                                </li>
                            ))}
                            </ul>
                    </div>
                </div>

                {/* Raw Answer Viewer - Providing Evidence */}
                <div className="bg-slate-900 dark:bg-nord-0 rounded-2xl shadow-lg overflow-hidden border border-slate-800 dark:border-nord-1">
                    <div className="bg-slate-800 dark:bg-nord-1 px-6 py-4 border-b border-slate-700 dark:border-nord-0 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-200 font-medium">
                            <FileCode size={18}/> Evidencia de Código (Raw Data)
                        </div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">Solo Lectura</span>
                    </div>
                    <div className="p-6 font-mono text-sm text-slate-300 dark:text-nord-4 overflow-x-auto max-h-96 overflow-y-auto custom-scrollbar">
                        <pre className="whitespace-pre-wrap">
                        {Object.entries(submission.answers).map(([key, val]) => {
                            // Find question text if context is available
                            const qText = assessmentContext?.questions.find(q => q.id === key)?.text || key;
                            const qType = assessmentContext?.questions.find(q => q.id === key)?.type || "Unknown";
                            return (
                                `/* --------------------------------------------------\n` +
                                ` * PREGUNTA (${qType}): ${qText}\n` +
                                ` * -------------------------------------------------- */\n` +
                                `>> RESPUESTA:\n${typeof val === 'object' ? JSON.stringify(val, null, 2) : val}\n\n`
                            );
                        }).join('')}
                        </pre>
                    </div>
                </div>

            </div>

            {/* Right Column: Metrics & Actions (4 cols) */}
            <div className="xl:col-span-4 space-y-6">
                {/* Score Card */}
                <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-sm border border-slate-100 dark:border-nord-2 p-6 text-center relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-50/50 dark:to-nord-0/30 pointer-events-none"></div>
                    <h3 className="text-slate-500 dark:text-nord-4 font-medium mb-2 uppercase tracking-widest text-xs">Puntaje Técnico</h3>
                    <div className="text-7xl font-black text-brand-600 dark:text-nord-9 mb-2 tracking-tighter">{analysis.score}</div>
                    <div className="w-full bg-slate-100 dark:bg-nord-0 h-3 rounded-full overflow-hidden mb-2">
                        <div className="h-full bg-brand-500 dark:bg-nord-9 rounded-full transition-all duration-1000" style={{width: `${analysis.score}%`}}></div>
                    </div>
                    <p className="text-xs text-slate-400">Percentil global calculado</p>
                </div>

                {/* Radar Chart */}
                <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-sm border border-slate-100 dark:border-nord-2 p-6">
                    <h3 className="font-bold text-slate-800 dark:text-nord-6 mb-4 flex items-center gap-2">
                        <Award size={18} className="text-brand-500"/> Mapa de Competencias
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                            <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar
                                name="Candidato"
                                dataKey="A"
                                stroke="#009846"
                                strokeWidth={3}
                                fill="#009846"
                                fillOpacity={0.25}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                itemStyle={{ color: '#009846', fontWeight: 'bold' }}
                            />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                 {/* Detailed Bars */}
                 <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-sm border border-slate-100 dark:border-nord-2 p-6">
                     <h3 className="font-bold text-slate-800 dark:text-nord-6 mb-6">Desglose por Área</h3>
                     <div className="space-y-6">
                        {[
                            { label: 'Calidad de Código', val: analysis.codeQuality },
                            { label: 'Resolución Problemas', val: analysis.problemSolving },
                            { label: 'Buenas Prácticas', val: analysis.bestPractices },
                            { label: 'Conocimiento Teórico', val: analysis.theoreticalKnowledge }
                        ].map((m, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1.5">
                                    <span className="text-slate-600 dark:text-nord-4 font-medium">{m.label}</span>
                                    <span className="font-bold text-slate-900 dark:text-nord-6">{m.val}%</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-nord-0 rounded-full h-2.5">
                                    <div 
                                        className={`h-2.5 rounded-full transition-all duration-1000 ${m.val > 75 ? 'bg-brand-500' : m.val > 50 ? 'bg-yellow-400' : 'bg-red-400'}`} 
                                        style={{width: `${m.val}%`}}
                                    ></div>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            </div>

        </div>
    </div>
  );
};

export default ResultAnalysis;
