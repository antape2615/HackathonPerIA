
import React, { useState } from 'react';
import { Assessment, Candidate } from '../types';
import { 
  Search, 
  UserPlus, 
  Link as LinkIcon, 
  Mail, 
  Award, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Plus, 
  Pencil, 
  Send,
  Bot,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  FileSearch,
  Globe,
  Hash,
  AlertCircle,
  Link2
} from 'lucide-react';

interface CandidatesListProps {
  candidates: Candidate[];
  assessments: Assessment[];
  onDeleteCandidate: (id: string) => void;
  onUpdateCandidate: (candidate: Candidate) => void;
  onAddCandidate: (candidate: Candidate) => void;
  onLinkCandidate: (candidateId: string, assessmentId: string) => void;
  onResendInvite: (candidateId: string) => void;
  onViewResult: (candidate: Candidate) => void;
  onToggleBot: (candidateId: string) => void;
}

const CandidatesList: React.FC<CandidatesListProps> = ({ 
  candidates, 
  assessments, 
  onDeleteCandidate, 
  onUpdateCandidate,
  onAddCandidate,
  onLinkCandidate,
  onResendInvite,
  onViewResult,
  onToggleBot
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    role: '', 
    experienceLevel: '' 
  });

  const [showLinkModal, setShowLinkModal] = useState<string | null>(null); 
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', role: '', experienceLevel: '' });
    setShowModal(true);
  };

  const openEditModal = (c: Candidate) => {
    setEditingId(c.id);
    setFormData({ 
      name: c.name, 
      email: c.email, 
      role: c.role || '', 
      experienceLevel: c.experienceLevel || '' 
    });
    setShowModal(true);
  };

  const handleFormSubmit = () => {
    if (!formData.name || !formData.email) return;

    if (editingId) {
      const existing = candidates.find(c => c.id === editingId);
      if (existing) {
        onUpdateCandidate({
          ...existing,
          name: formData.name,
          email: formData.email,
          role: formData.role,
          experienceLevel: formData.experienceLevel
        });
      }
    } else {
      // Manual candidates are created WITHOUT a linkedSerialCode
      const newCandidate: Candidate = {
        id: `cand-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        role: formData.role,
        experienceLevel: formData.experienceLevel,
        status: 'PENDING'
      };
      onAddCandidate(newCandidate);
    }

    setShowModal(false);
  };

  const handleLinkSubmit = () => {
      if (showLinkModal && selectedAssessmentId) {
          onLinkCandidate(showLinkModal, selectedAssessmentId);
          setShowLinkModal(null);
          setSelectedAssessmentId('');
      }
  };

  const copyLink = (link?: string) => {
    if (link) {
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };

  const renderStatusBadge = (candidate: Candidate) => {
      switch(candidate.status) {
          case 'APPROVED':
              return (
                <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border border-amber-200 dark:border-amber-900/50">
                    <FileSearch size={14} /> Aprobado - Pendiente Revisión
                </span>
              );
          case 'REJECTED':
              return (
                <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-2.5 py-1 rounded-full font-bold text-[10px] uppercase border border-red-200 dark:border-red-900/50">
                    <ThumbsDown size={14} /> Rechazado
                </span>
              );
          case 'COMPLETED':
              return (
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-nord-14 font-medium text-sm">
                    <CheckCircle2 size={16} /> Completed
                </span>
              );
          case 'IN_PROGRESS':
              return (
                <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-nord-13 font-medium text-sm">
                    <Clock size={16} /> In Progress
                </span>
              );
          case 'SENT':
              return (
                <span className="inline-flex items-center gap-1.5 text-blue-600 dark:text-nord-9 font-medium text-sm">
                    <Mail size={16} /> Invite Sent
                </span>
              );
          default:
              return (
                <span className="inline-flex items-center gap-1.5 text-slate-400 dark:text-nord-4 font-medium text-sm">
                    Pending
                </span>
              );
      }
  }

  return (
    <div className="p-8 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-nord-6">Candidate Directory</h1>
          <p className="text-slate-500 dark:text-nord-4">Manage profiles and track evaluation status.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 font-medium px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-brand-700 dark:hover:bg-nord-8 transition-colors"
        >
          <Plus size={18} />
          Add New Candidate
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-nord-4" size={20} />
        <input 
          type="text" 
          placeholder="Search candidates by name or email..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-nord-2 bg-white dark:bg-nord-1 text-slate-900 dark:text-nord-6 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none transition-shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-nord-1 rounded-xl shadow-sm border border-slate-200 dark:border-nord-2 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-nord-0 border-b border-slate-200 dark:border-nord-2 text-slate-500 dark:text-nord-4 uppercase text-xs font-semibold">
            <tr>
              <th className="px-6 py-4">Profile</th>
              <th className="px-6 py-4">Role / Level</th>
              <th className="px-6 py-4">Assigned Test</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-nord-2">
            {filteredCandidates.length === 0 ? (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-nord-3">
                        No candidates found matching your search.
                    </td>
                </tr>
            ) : (
                filteredCandidates.map((candidate) => {
                  const assessment = assessments.find(a => a.id === candidate.assignedAssessmentId);
                  // Can resend only if not in a final state
                  const canResend = candidate.status !== 'COMPLETED' && candidate.status !== 'APPROVED' && candidate.status !== 'REJECTED' && candidate.assignedAssessmentId;
                  const isClosed = candidate.status === 'APPROVED' || candidate.status === 'REJECTED';

                  // Determine Serial Code Status
                  const hasSerial = !!candidate.linkedSerialCode;
                  const isSerialMatch = hasSerial && assessment?.serialCode === candidate.linkedSerialCode;

                  return (
                    <tr key={candidate.id} className="hover:bg-slate-50 dark:hover:bg-nord-2 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-nord-3 flex items-center justify-center text-brand-700 dark:text-nord-8 font-bold text-lg shrink-0">
                            {candidate.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-slate-900 dark:text-nord-6">{candidate.name}</p>
                                {hasSerial && (
                                    <span className="bg-slate-100 text-slate-500 dark:bg-nord-3 dark:text-nord-4 text-[9px] px-1.5 py-0.5 rounded border border-slate-200 dark:border-nord-4 flex items-center gap-1" title={`Source: External System`}>
                                        <Globe size={10}/> API Import
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-nord-4 mb-1">{candidate.email}</p>
                            
                            {/* Bot Toggle Button */}
                            {!isClosed && (
                                <button
                                onClick={() => onToggleBot(candidate.id)}
                                className={`
                                    flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] uppercase font-bold tracking-wide transition-all mt-1
                                    ${candidate.isBotAssigned
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                        : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300 hover:bg-slate-100 dark:bg-nord-3 dark:text-nord-4 dark:border-nord-4 dark:hover:bg-nord-2'
                                    }
                                `}
                                title={candidate.isBotAssigned ? "Click to unassign bot" : "Click to assign automated agent"}
                            >
                                <Bot size={10} />
                                {candidate.isBotAssigned ? 'AGENTE ASIGNADO' : 'ASIGNAR A UN AGENTE'}
                            </button>
                            )}
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4">
                        {candidate.role ? (
                           <div>
                             <p className="text-sm font-medium text-slate-700 dark:text-nord-5">{candidate.role}</p>
                             <p className="text-xs text-slate-400 dark:text-nord-4">{candidate.experienceLevel}</p>
                           </div>
                        ) : (
                           <span className="text-xs text-slate-400 italic">Not specified</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {assessment ? (
                          <div className="flex flex-col gap-1">
                             <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-700 dark:bg-nord-3 dark:text-nord-6 border border-slate-200 dark:border-nord-4 w-fit">
                                {assessment.title}
                             </span>
                             {/* SHOW MATCH SUCCESS */}
                             {isSerialMatch && (
                                 <span className="text-[10px] text-emerald-600 dark:text-nord-14 flex items-center gap-1 font-bold">
                                     <Link2 size={10}/> Linked: {candidate.linkedSerialCode}
                                 </span>
                             )}
                          </div>
                        ) : hasSerial ? (
                            // SHOW ORPHAN WARNING
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-red-500 flex items-center gap-1 font-bold bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded border border-red-100 dark:border-red-900/50 w-fit">
                                    <AlertCircle size={12}/> Unknown Code
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono">
                                    {candidate.linkedSerialCode}
                                </span>
                                <button 
                                    onClick={() => setShowLinkModal(candidate.id)}
                                    className="text-brand-600 dark:text-nord-9 text-[10px] font-bold hover:underline mt-1 text-left w-fit"
                                >
                                    Fix: Assign Manually
                                </button>
                            </div>
                        ) : (
                          <button 
                            onClick={() => setShowLinkModal(candidate.id)}
                            disabled={isClosed}
                            className={`text-brand-600 dark:text-nord-9 text-xs font-bold hover:underline flex items-center gap-1 ${isClosed ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <UserPlus size={12} /> Assign Test
                          </button>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {renderStatusBadge(candidate)}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                           {canResend && (
                               <button 
                                onClick={() => onResendInvite(candidate.id)}
                                className="text-blue-500 dark:text-nord-9 hover:bg-blue-50 dark:hover:bg-nord-3 px-2 py-1.5 rounded transition-colors"
                                title="Reenviar Invitación por Correo"
                               >
                                   <Send size={18} />
                               </button>
                           )}

                           <button 
                             onClick={() => openEditModal(candidate)}
                             className="text-slate-400 dark:text-nord-3 hover:text-brand-600 dark:hover:text-nord-9 p-1 transition-colors"
                             title="Edit Candidate"
                           >
                             <Pencil size={16} />
                           </button>

                           {(candidate.status === 'COMPLETED' || isClosed) && (
                             <button 
                               onClick={() => onViewResult(candidate)}
                               className="text-brand-600 dark:text-nord-9 hover:bg-brand-50 dark:hover:bg-nord-3 px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1 transition-colors uppercase tracking-wide"
                             >
                               <Award size={14} /> Results
                             </button>
                           )}
                           
                           {candidate.uniqueLink && !isClosed && (
                             <button 
                               onClick={() => copyLink(candidate.uniqueLink)}
                               className="text-slate-500 dark:text-nord-4 hover:text-brand-600 dark:hover:text-nord-9 px-2 transition-colors"
                               title="Copy Assessment Link"
                             >
                               <LinkIcon size={18} />
                             </button>
                           )}

                           <button 
                            onClick={() => onDeleteCandidate(candidate.id)}
                            className="text-slate-300 dark:text-nord-3 hover:text-red-500 dark:hover:text-nord-11 px-2 transition-colors"
                            title="Remove Candidate"
                           >
                               <Trash2 size={18} />
                           </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-nord-2 p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 dark:text-nord-6 mb-1">
               {editingId ? 'Edit Candidate Profile' : 'Add New Candidate'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-nord-4 mb-6">Enter candidate details for evaluation tracking.</p>
            
            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-600 dark:text-nord-4 mb-1">Full Name</label>
                    <input 
                        type="text"
                        className="w-full border border-slate-300 dark:border-nord-3 bg-white dark:bg-nord-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none text-slate-900 dark:text-nord-6"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-600 dark:text-nord-4 mb-1">Email Address</label>
                    <input 
                        type="email"
                        className="w-full border border-slate-300 dark:border-nord-3 bg-white dark:bg-nord-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none text-slate-900 dark:text-nord-6"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-nord-4 mb-1">Role (Optional)</label>
                    <input 
                        type="text"
                        placeholder="e.g. Frontend Dev"
                        className="w-full border border-slate-300 dark:border-nord-3 bg-white dark:bg-nord-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none text-slate-900 dark:text-nord-6"
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 dark:text-nord-4 mb-1">Level (Optional)</label>
                    <select 
                        className="w-full border border-slate-300 dark:border-nord-3 bg-white dark:bg-nord-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none text-slate-900 dark:text-nord-6"
                        value={formData.experienceLevel}
                        onChange={e => setFormData({...formData, experienceLevel: e.target.value})}
                    >
                        <option value="">Select Level</option>
                        <option value="Junior">Junior</option>
                        <option value="Mid-Level">Mid-Level</option>
                        <option value="Senior">Senior</option>
                        <option value="Principal">Principal</option>
                    </select>
                  </div>
               </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
               <button 
                 onClick={() => setShowModal(false)}
                 className="px-4 py-2 text-slate-600 dark:text-nord-4 hover:bg-slate-100 dark:hover:bg-nord-2 rounded-lg font-medium"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleFormSubmit}
                 disabled={!formData.name || !formData.email}
                 className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 px-6 py-2 rounded-lg font-bold hover:bg-brand-700 dark:hover:bg-nord-10 disabled:opacity-50 transition-colors"
               >
                 {editingId ? 'Save Changes' : 'Add Profile'}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Assessment Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-nord-1 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-nord-2 p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-bold text-slate-900 dark:text-nord-6 mb-4">Assign Assessment</h2>
            
            <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-slate-600 dark:text-nord-4 mb-1">Select Test from Library</label>
                 <select 
                    className="w-full border border-slate-300 dark:border-nord-3 bg-white dark:bg-nord-0 rounded-lg px-3 py-2 focus:ring-2 focus:ring-brand-500 dark:focus:ring-nord-9 outline-none text-slate-900 dark:text-nord-6"
                    value={selectedAssessmentId}
                    onChange={e => setSelectedAssessmentId(e.target.value)}
                 >
                    <option value="">-- Choose a test --</option>
                    {assessments.map(a => (
                      <option key={a.id} value={a.id}>{a.title} ({a.language})</option>
                    ))}
                 </select>
               </div>
            </div>

            <div className="flex justify-end gap-3 mt-8">
               <button 
                 onClick={() => setShowLinkModal(null)}
                 className="px-4 py-2 text-slate-600 dark:text-nord-4 hover:bg-slate-100 dark:hover:bg-nord-2 rounded-lg font-medium"
               >
                 Cancel
               </button>
               <button 
                 onClick={handleLinkSubmit}
                 disabled={!selectedAssessmentId}
                 className="bg-brand-600 dark:bg-nord-9 text-white dark:text-nord-1 px-6 py-2 rounded-lg font-bold hover:bg-brand-700 dark:hover:bg-nord-10 disabled:opacity-50 transition-colors"
               >
                 Assign & Send
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesList;
