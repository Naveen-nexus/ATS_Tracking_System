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

  if (loading) return <div className="p-8 text-center">Loading applicants...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{candidates.length} total candidates across all jobs</p>
        </div>
        <Button variant="secondary" size="sm" className="flex items-center gap-1.5"><Download size={14} /> Export CSV</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search candidates or skills..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative">
          <select value={selectedJob} onChange={e => setSelectedJob(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]">
            {jobTitles.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="matchScore">Highest Match</option>
            <option value="date">Newest First</option>
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-xl px-4 py-3">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{selected.length} selected</span>
          <Button size="xs" variant="success" onClick={() => bulkUpdateStatus('Shortlisted')} className="ml-2">
            <Star size={12} /> Shortlist
          </Button>
          <Button size="xs" variant="danger" onClick={() => bulkUpdateStatus('Rejected')}>
            <XSquare size={12} /> Reject
          </Button>
          <button onClick={clearSelect} className="ml-auto text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Clear</button>
        </div>
      )}

      {/* Candidates */}
      {filtered.length === 0 ? (
        <EmptyState type="users" title="No candidates found" description="No candidates match your current filters." />
      ) : (
        <>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button onClick={selectAll} className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
              <CheckSquare size={15} /> Select all ({filtered.length})
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((c, idx) => (
              <Card key={c.id} className={`p-5 transition-all ${selected.includes(c.id) ? 'ring-2 ring-blue-500 border-blue-300 dark:border-blue-700' : ''}`}>
                <div className="flex items-start gap-3">
                  <input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleSelect(c.id)} className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500 w-4 h-4 flex-shrink-0" />
                  <Avatar initials={c.avatar} color={colorPalette[idx % colorPalette.length]} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{c.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{c.email} • {c.experience || 'Exp N/A'}</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 font-medium">{c.jobTitle}</p>
                      </div>
                      <Badge variant={statusVariants[c.status] || 'default'}>{c.status}</Badge>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Match Score</span>
                                <span className={`text-xs font-bold ${c.matchScore >= 80 ? 'text-green-600' : c.matchScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{c.matchScore}%</span>
                            </div>
                            <ProgressBar value={c.matchScore} color={c.matchScore >= 80 ? 'green' : c.matchScore >= 60 ? 'yellow' : 'red'} size="sm" />
                        </div>
                        <div className="flex gap-2">
                             <Link to={`/recruiter/analysis/${c._id}`}>
                                <Button size="xs" variant="secondary" className="h-full">Details</Button>
                             </Link>
                             <select 
                                value={c.status} 
                                onChange={(e) => updateStatus(c._id, e.target.value)}
                                className="text-xs border rounded px-2 py-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                             >
                                {Object.keys(statusVariants).map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                        </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${c.matchScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : c.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{c.matchScore}% Match</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <ProgressBar value={c.matchScore} color={c.matchScore >= 80 ? 'green' : c.matchScore >= 60 ? 'yellow' : 'red'} size="sm" />
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {c.skills.slice(0, 3).map(s => <Tag key={s} variant="blue">{s}</Tag>)}
                      {c.skills.length > 3 && <Tag variant="gray">+{c.skills.length - 3}</Tag>}
                    </div>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="relative flex-1">
                        <select value={c.status} onChange={e => updateStatus(c.id, e.target.value)} className="w-full appearance-none text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500">
                          {['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'].map(s => <option key={s}>{s}</option>)}
                        </select>
                      </div>
                      <Badge variant={statusVariants[c.status] || 'default'} dot>{c.status}</Badge>
                      <Link to={`/recruiter/applicants/${c.id}`}>
                        <Button size="xs" variant="secondary">View Resume</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
