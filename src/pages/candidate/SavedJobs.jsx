import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, MapPin, X, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockJobs } from '../../data/mockData';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const SavedJobs = () => {
  const [saved, setSaved] = useState(mockJobs.slice(0, 3).map(j => j.id));

  const removeSaved = (jobId) => {
    setSaved(prev => prev.filter(id => id !== jobId));
    toast.success('Job removed from saved');
  };

  const savedJobsList = mockJobs.filter(j => saved.includes(j.id));

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{savedJobsList.length} saved jobs</p>
        </div>
        <Link to="/candidate/jobs"><Button variant="secondary" size="sm" className="flex items-center gap-1.5"><ArrowRight size={14} /> Browse More</Button></Link>
      </div>

      {savedJobsList.length === 0 ? (
        <EmptyState type="jobs" title="No saved jobs" description="Browse jobs and click the bookmark icon to save them here for later." action={<Link to="/candidate/jobs"><Button>Browse Jobs</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {savedJobsList.map(job => (
            <Card key={job.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: job.companyColor }}>{job.companyLogo}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.company}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{formatSalary(job.salary.min, job.salary.max)}</span>
                        <Badge variant={job.type === 'Remote' ? 'green' : 'blue'}>{job.type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${job.matchScore >= 80 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{job.matchScore}%</span>
                      <button onClick={() => removeSaved(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.skills.slice(0, 4).map(s => <Tag key={s} variant="gray">{s}</Tag>)}
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <Link to={`/candidate/jobs/${job.id}`} className="flex-1">
                      <Button size="sm" className="w-full">Apply Now</Button>
                    </Link>
                    <Link to={`/candidate/jobs/${job.id}`}>
                      <Button size="sm" variant="secondary">View Details</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
