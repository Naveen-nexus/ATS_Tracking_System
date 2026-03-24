import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Pause, Trash2, Users, Eye, Play, Search, ChevronDown } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { EmptyState } from '../../components/ui/EmptyState';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const statusVariant = { Active: 'green', Paused: 'yellow', Draft: 'default', Closed: 'red' };

export const ManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
        setLoading(true);
        const [jobsData, appsData] = await Promise.all([
            jobService.getMyPostedJobs(),
            applicationService.getRecruiterApplications()
        ]);
        setJobs(jobsData);
        setApplications(appsData);
    } catch (err) {
        toast.error('Failed to load jobs');
    } finally {
        setLoading(false);
    }
  };

  const getApplicantCount = (jobId) => {
      if (!applications) return 0;
      return applications.filter(a => a.jobId && (a.jobId._id === jobId || a.jobId === jobId)).length;
  };

  const toggleStatus = async (id, current) => {
    const next = current === 'Active' ? 'Paused' : 'Active';
    try {
        await jobService.updateJob(id, { status: next });
        setJobs(prev => prev.map(j => j._id === id ? { ...j, status: next } : j));
        toast.success(`Job ${next === 'Active' ? 'activated' : 'paused'}`);
    } catch(err) {
        toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
        await jobService.deleteJob(id);
        setJobs(prev => prev.filter(j => j._id !== id));
        toast.success('Job deleted');
    } catch(err) {
        toast.error('Failed to delete job');
    }
  };

  const filtered = jobs.filter(j => {
    const matchSearch = j.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || j.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="p-10 text-center">Loading jobs...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{jobs.length} total job postings</p>
        </div>
        <Link to="/recruiter/post-job">
          <Button className="flex items-center gap-1.5"><Plus size={14} /> Post New Job</Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-48 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search jobs..." 
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          />
        </div>
        <div className="relative">
             <select 
               value={statusFilter} 
               onChange={e => setStatusFilter(e.target.value)}
               className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
             >
                 {['All', 'Active', 'Paused', 'Closed', 'Draft'].map(s => <option key={s} value={s}>{s}</option>)}
             </select>
             <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState 
           title="No jobs found" 
           description={search ? "Try adjusting your search filters" : "You haven't posted any jobs yet."} 
           action={!search ? <Link to="/recruiter/post-job"><Button>Post Job</Button></Link> : null}
        />
      ) : (
        <div className="grid gap-4">
          {filtered.map(job => (
            <Card key={job._id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{job.title}</h3>
                  <Badge variant={statusVariant[job.status]}>{job.status}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Posted {formatDate(job.createdAt)}</span>
                  <span>•</span>
                  <span>{job.location}</span>
                  <span>•</span>
                  <span>{job.jobType}</span>
                </div>
                <div className="flex items-center gap-6 mt-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Users size={16} className="text-gray-400" />
                    {getApplicantCount(job._id)} Applicants
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Eye size={16} className="text-gray-400" />
                    {/* Mock views for now */}
                    {Math.floor(Math.random() * 50) + 10} Views 
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 border-t md:border-t-0 md:border-l border-gray-100 dark:border-gray-800 pt-4 md:pt-0 md:pl-4 mt-2 md:mt-0">
                 <Link to={`/candidate/job/${job._id}`}>
                    <Button variant="ghost" size="sm" title="View Public Page"><Eye size={16} /></Button>
                 </Link>
                 <Button variant="ghost" size="sm" title="Edit Job"><Edit size={16} /></Button>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleStatus(job._id, job.status)}
                    title={job.status === 'Active' ? 'Pause Job' : 'Activate Job'}
                    className={job.status === 'Active' ? 'text-yellow-600 hover:text-yellow-700' : 'text-green-600 hover:text-green-700'}
                 >
                    {job.status === 'Active' ? <Pause size={16} /> : <Play size={16} />}
                 </Button>
                 <Button variant="ghost" size="sm" onClick={() => handleDelete(job._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={16} /></Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {['All', 'Active', 'Paused', 'Draft', 'Closed'].map(s => <option key={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState type="jobs" title="No jobs found" description="Try adjusting your search or create a new job posting." action={<Link to="/recruiter/post-job"><Button>Post a Job</Button></Link>} />
      ) : (
        <div className="space-y-3">
          {filtered.map(job => (
            <Card key={job.id} className="p-5">
              <div className="flex items-start gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <Badge variant={statusVariant[job.status] || 'default'} dot>{job.status}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                    <span>{job.location}</span>
                    <span>{job.type}</span>
                    <span>Posted {formatDate(job.posted)}</span>
                    <span>Deadline {formatDate(job.deadline)}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-gray-700 dark:text-gray-300"><strong>{job.applicants}</strong> <span className="text-gray-500 dark:text-gray-400">applicants</span></span>
                    <span className="text-sm text-purple-600 dark:text-purple-400"><strong>{job.shortlisted}</strong> <span className="text-gray-500 dark:text-gray-400">shortlisted</span></span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link to="/recruiter/applicants">
                    <Button size="sm" variant="secondary" className="flex items-center gap-1.5"><Users size={13} /> Applicants</Button>
                  </Link>
                  {job.status !== 'Closed' && (
                    <button onClick={() => toggleStatus(job.id, job.status)} className={`p-2 rounded-lg border text-xs transition-colors ${job.status === 'Active' ? 'border-yellow-200 dark:border-yellow-800 text-yellow-600 hover:bg-yellow-50' : 'border-green-200 dark:border-green-800 text-green-600 hover:bg-green-50'}`}>
                      {job.status === 'Active' ? <Pause size={14} /> : <Play size={14} />}
                    </button>
                  )}
                  <button onClick={() => deleteJob(job.id)} className="p-2 rounded-lg border border-red-200 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
