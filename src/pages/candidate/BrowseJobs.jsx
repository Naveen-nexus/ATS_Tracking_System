import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, SlidersHorizontal, Bookmark, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockJobs } from '../../data/mockData';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

const JOBS_PER_PAGE = 4;

export const BrowseJobs = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [jobType, setJobType] = useState('All');
  const [experienceLevel, setExperienceLevel] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [savedJobs, setSavedJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);

  const toggleSave = (jobId) => {
    setSavedJobs(prev => prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]);
    toast.success(savedJobs.includes(jobId) ? 'Job removed from saved' : 'Job saved!');
  };

  const handleApply = (job) => {
    if (!appliedJobs.includes(job.id)) {
      setAppliedJobs(prev => [...prev, job.id]);
      toast.success(`Applied to ${job.title} at ${job.company}!`);
    }
  };

  const filtered = useMemo(() => {
    let jobs = [...mockJobs];
    if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search.toLowerCase()) || j.company.toLowerCase().includes(search.toLowerCase()) || j.skills.some(s => s.toLowerCase().includes(search.toLowerCase())));
    if (location) jobs = jobs.filter(j => j.location.toLowerCase().includes(location.toLowerCase()));
    if (jobType !== 'All') jobs = jobs.filter(j => j.type === jobType);
    if (sortBy === 'salary') jobs.sort((a, b) => b.salary.max - a.salary.max);
    else if (sortBy === 'match') jobs.sort((a, b) => b.matchScore - a.matchScore);
    return jobs;
  }, [search, location, jobType, sortBy]);

  const totalPages = Math.ceil(filtered.length / JOBS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * JOBS_PER_PAGE, page * JOBS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Browse Jobs</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{filtered.length} jobs found matching your profile</p>
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
      {paginated.length === 0 ? (
        <EmptyState type="search" title="No jobs found" description="Try adjusting your search or filters to find more opportunities." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paginated.map(job => (
            <Card key={job.id} hover className="p-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: job.companyColor }}>{job.companyLogo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full flex-shrink-0 ${job.matchScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : job.matchScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>{job.matchScore}% Match</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><MapPin size={12} />{job.location}</span>
                <Badge variant={job.type === 'Remote' ? 'green' : job.type === 'Hybrid' ? 'blue' : 'default'}>{job.type}</Badge>
                <span className="font-medium text-gray-700 dark:text-gray-300">{formatSalary(job.salary.min, job.salary.max)}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.slice(0, 4).map(skill => <Tag key={skill} variant="gray">{skill}</Tag>)}
                {job.skills.length > 4 && <Tag variant="gray">+{job.skills.length - 4}</Tag>}
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-700">
                <Link to={`/candidate/jobs/${job.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full" disabled={appliedJobs.includes(job.id)}>
                    {appliedJobs.includes(job.id) ? 'Applied ✓' : 'Apply Now'}
                  </Button>
                </Link>
                <button onClick={() => toggleSave(job.id)} className={`p-2 rounded-lg border transition-all ${savedJobs.includes(job.id) ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:border-blue-300 hover:text-blue-600'}`}>
                  <Bookmark size={16} fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'} />
                </button>
                <Link to={`/candidate/jobs/${job.id}`}>
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
