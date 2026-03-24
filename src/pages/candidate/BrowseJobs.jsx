import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Bookmark, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { EmptyState } from '../../components/ui/EmptyState';
// Remove mockJobs import
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { jobService } from '../../services/jobService'; // Import jobService
import { applicationService } from '../../services/applicationService'; // Import applicationService

const JOBS_PER_PAGE = 10;

export const BrowseJobs = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  // Removed experienceLevel state as backend doesn't support it yet
  const [sortBy, setSortBy] = useState('newest');
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch jobs on mount and when filters change
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const filters = { search, location, jobType, page };
        const data = await jobService.getAllJobs(filters);
        
        // Backend returns: { jobs: [...], page: 1, limit: 10, totalPages: X } or potentially just array depending on controller
        // Let's assume standard pagination struct or simply array if simple find()
        // Checking jobController again: It returns `res.json(jobs);` directly.
        // It does NOT return totalPages in current implementation.
        // So handling pagination client-side for now or modifying backend.
        // For simplicity, let's just set jobs = data if it's array.
        
        if (Array.isArray(data)) {
            setJobs(data);
             // Since backend `getJobs` returns just `jobs`, we can't get totalPages easily.
             // Assume simplified pagination (next/prev only if data available)
             setTotalPages(Math.ceil(data.length / JOBS_PER_PAGE) || 1); // Only for client-side pagination if fetched all
        } else if (data.jobs) {
             setJobs(data.jobs);
             setTotalPages(data.totalPages || 1);
        }

      } catch (error) {
        console.error('Failed to fetch jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [search, location, jobType, page, sortBy]);


  const toggleSave = (jobId) => {
    // Ideally call API to save job
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    toast.success(savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved!');
  };
  
  // Note: Actual application is done in JobDetails usually, but quick apply here could call API
  // Let's keep navigation for now.

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{jobs.length} jobs found matching your profile</p>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 flex-wrap">
        <div className="flex-1 min-w-64 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Job title, company, or skills..." className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <div className="relative min-w-48">
          <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={location} onChange={e => { setLocation(e.target.value); setPage(1); }} placeholder="Location" className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <Button variant="secondary" onClick={() => setFiltersOpen(!filtersOpen)} className="flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </Button>
        <div className="relative">
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="newest">Newest</option>
            <option value="salary">Highest Salary</option>
            <option value="match">Best Match</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {filtersOpen && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Filter Jobs</h3>
            <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">Job Type</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Remote', 'Hybrid', 'Onsite'].map(type => (
                  <button key={type} onClick={() => { setJobType(type); setPage(1); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${jobType === type ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>{type}</button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Job Cards */}
      {jobs.length === 0 && !loading ? (
        <EmptyState type="search" title="No jobs found" description="Try adjusting your search or filters to find more opportunities." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {jobs.map(job => (
            <Card key={job._id || job.id} hover className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}>{job.companyLogo || (job.companyName ? job.companyName[0] : 'C')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName}</p>
                    </div>
                    {/* Match Score - Placeholder if not available */}
                    {job.matchScore !== undefined && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${job.matchScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-gray-100 text-gray-600'}`}>{job.matchScore}% Match</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                <Badge variant={job.jobType === 'Remote' ? 'green' : 'default'}>{job.jobType}</Badge>
                <span className="font-medium text-gray-700 dark:text-gray-300">{formatSalary(job.salaryMin, job.salaryMax)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {(job.skillsRequired || []).slice(0, 4).map(skill => <Tag key={skill} variant="gray">{skill}</Tag>)}
                {(job.skillsRequired || []).length > 4 && <Tag variant="gray">+{job.skillsRequired.length - 4}</Tag>}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                <Link to={`/candidate/jobs/${job._id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full" disabled={appliedJobs.includes(job._id)}>
                    {appliedJobs.includes(job._id) ? 'Applied ✓' : 'Apply Now'}
                  </Button>
                </Link>
                <button onClick={() => toggleSave(job._id)} className={`p-2 rounded-lg border transition-all ${savedJobs.includes(job._id) ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-300 hover:text-blue-600'}`}>
                  <Bookmark size={16} fill={savedJobs.includes(job._id) ? 'currentColor' : 'none'} />
                </button>
                <Link to={`/candidate/jobs/${job._id}`}>
                  <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-300 hover:text-blue-600 transition-all"><ExternalLink size={16} /></button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"><ChevronLeft size={16} /></button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-blue-600 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"><ChevronRight size={16} /></button>
        </div>
      )}
    </div>
  );
};
