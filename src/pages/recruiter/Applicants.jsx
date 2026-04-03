import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Download, CheckSquare, XSquare, Star, ChevronDown, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import { Avatar } from '../../components/ui/Avatar';
import { formatDate } from '../../utils/helpers';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';

const statusVariants = { Applied: 'blue', 'Under Review': 'yellow', Shortlisted: 'purple', 'Interview Scheduled': 'indigo', Selected: 'green', Rejected: 'red' };
const colorPalette = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#ec4899'];

export const Applicants = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('matchScore');
  const [selectedJob, setSelectedJob] = useState('All');
  const [selected, setSelected] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const data = await applicationService.getRecruiterApplications();
            // Map API response to component state shape
            const formatted = data.map(app => ({
                id: app._id,
                name: app.candidateId?.name || 'Unknown',
                email: app.candidateId?.email || '',
                skills: [], // Not returned by API yet
                experience: 'Unknown', // Not returned by API yet
                matchScore: app.matchScore || 0,
                status: app.status,
                appliedDate: app.createdAt,
                jobTitle: app.jobId?.title || 'Unknown Job',
                jobId: app.jobId?._id,
                avatar: (app.candidateId?.name || 'U').split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase()
            }));
            setCandidates(formatted);
        } catch (err) {
            console.error(err);
            toast.error('Failed to load applicants');
        } finally {
            setLoading(false);
        }
    };
    fetchApplicants();
  }, []);

  const filtered = candidates
    .filter(c => {
      const matchSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchJob = selectedJob === 'All' || c.jobTitle === selectedJob;
      return matchSearch && matchStatus && matchJob;
    })
    .sort((a, b) => sortBy === 'matchScore' ? b.matchScore - a.matchScore : new Date(b.appliedDate) - new Date(a.appliedDate));

  // Get unique job titles for filter
  const jobTitles = ['All', ...new Set(candidates.map(c => c.jobTitle))];

  const toggleSelect = (id) => setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const selectAll = () => setSelected(filtered.map(c => c.id));
  const clearSelect = () => setSelected([]);

  const bulkUpdateStatus = async (newStatus) => {
    try {
        await Promise.all(selected.map(id => applicationService.updateStatus(id, newStatus)));
        setCandidates(prev => prev.map(c => selected.includes(c.id) ? { ...c, status: newStatus } : c));
        toast.success(`Updated ${selected.length} candidates to ${newStatus}`);
        clearSelect();
    } catch (err) {
        toast.error('Failed to update status');
    }
  };

  const updateStatus = async (id, status) => {
    try {
        await applicationService.updateStatus(id, status);
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
        toast.success('Status updated');
    } catch (err) {
        toast.error('Failed to update status');
    }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-[40px] font-bold text-black dark:text-white tracking-tight leading-none mb-2">Applicants</h1>
          <p className="text-[15px] font-medium text-gray-500">{candidates.length} total candidates across all jobs</p>
        </div>
        <button className="bg-white dark:bg-[#1e1e1e] hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm flex items-center gap-2 transition-all">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Filters (Flux inspired pill design) */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-[#1e1e1e] p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search candidates or skills..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white placeholder-gray-400 text-sm transition-all outline-none" 
          />
        </div>
        
        <div className="flex gap-2 shrink-0">
            <div className="relative">
              <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-colors cursor-pointer min-w-[120px] max-w-[200px]">
                {jobTitles.map(s => <option key={s} value={s}>{s === 'All' ? 'All Roles' : s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative hidden sm:block">
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-colors cursor-pointer min-w-[120px]">
                {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-4 pr-10 py-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-transparent text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ccff00] transition-colors cursor-pointer min-w-[140px]">
                <option value="matchScore">Highest Match</option>
                <option value="date">Newest First</option>
              </select>
              <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-2xl px-6 py-4 animate-in fade-in slide-in-from-top-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
             <div className="w-6 h-6 rounded-full bg-[#ccff00] text-black flex items-center justify-center text-xs">{selected.length}</div>
             Candidates Selected
          </span>
          <div className="flex items-center gap-3">
             <button onClick={() => bulkUpdateStatus('Shortlisted')} className="bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
               <Star size={16} /> Shortlist
             </button>
             <button onClick={() => bulkUpdateStatus('Rejected')} className="bg-red-500/10 text-red-600 hover:bg-red-500/20 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
               <XSquare size={16} /> Reject
             </button>
             <button onClick={clearSelect} className="text-sm font-semibold text-gray-500 hover:text-gray-900 border border-transparent hover:border-gray-200 px-3 py-2 rounded-xl transition-all">Clear</button>
          </div>
        </div>
      )}

      {/* Candidates Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-12 text-center border border-gray-100 dark:border-gray-800 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users size={24} className="text-gray-400" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No candidates found</h3>
           <p className="text-gray-500 text-sm">Adjust your search or filters to find what you're looking for.</p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm px-2">
            <button onClick={selectAll} className="flex items-center gap-2 font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selected.length === filtered.length ? 'bg-[#ccff00] border-[#ccff00] text-black' : 'border-gray-300 dark:border-gray-600'}`}>
                 {selected.length === filtered.length && <CheckSquare size={14} />}
              </div>
              Select All
            </button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            {filtered.map((c, idx) => (
              <div key={c.id} className={`bg-white dark:bg-[#1e1e1e] rounded-[24px] p-6 border shadow-sm transition-all duration-200 group ${selected.includes(c.id) ? 'border-[#ccff00] ring-2 ring-[#ccff00]/20' : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'}`}>
                <div className="flex items-start gap-4">
                  <div className="pt-1">
                     <button onClick={() => toggleSelect(c.id)} className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${selected.includes(c.id) ? 'bg-[#ccff00] border-[#ccff00] text-black' : 'border-gray-300 dark:border-gray-600 group-hover:border-gray-400'}`}>
                        {selected.includes(c.id) && <CheckSquare size={16} />}
                     </button>
                  </div>
                  
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-white font-bold shadow-sm shrink-0" style={{ backgroundImage: `linear-gradient(135deg, ${colorPalette[idx % colorPalette.length]}, ${colorPalette[(idx+1) % colorPalette.length]})` }}>
                     {c.avatar}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">{c.name}</h3>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-0.5">{c.jobTitle}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${c.status === 'Shortlisted' ? 'bg-purple-100 text-purple-700' : c.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300'}`}>
                        {c.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div className="bg-gray-50 dark:bg-[#18181b] rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">ATS Match</p>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-gray-900 dark:text-white leading-none">{c.matchScore}</span>
                                <span className="text-sm font-bold text-gray-400">%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-1.5 mt-3 overflow-hidden">
                               <div className={`h-full rounded-full ${c.matchScore >= 80 ? 'bg-[#ccff00]' : c.matchScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{width: `${c.matchScore}%`}}></div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col justify-end gap-2">
                            <select 
                               value={c.status} 
                               onChange={(e) => updateStatus(c.id, e.target.value)}
                               className="w-full appearance-none bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 text-sm font-semibold rounded-xl px-4 py-3 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#ccff00] focus:border-transparent transition-all cursor-pointer"
                            >
                               {Object.keys(statusVariants).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            
                            <Link to={`/recruiter/analysis/${c.id}`} className="block">
                               <button className="w-full bg-black dark:bg-white text-white dark:text-black hover:bg-[#ccff00] hover:text-black dark:hover:bg-[#ccff00] dark:hover:text-black py-3 rounded-xl text-sm font-bold transition-colors">
                                  View Details
                               </button>
                            </Link>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
