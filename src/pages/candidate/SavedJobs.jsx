import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, X, ArrowRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { EmptyState } from '../../components/ui/EmptyState';
import { jobService } from '../../services/jobService';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

// Helper to get consistent color based on string
const getCompanyColor = (name) => {
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  let hash = 0;
  for (let i = 0; i < (name?.length || 0); i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
        try {
            setLoading(true);
            const res = await jobService.getSavedJobs();
            setSavedJobs(res || []);
        } catch(err) {
            console.error(err);
            toast.error('Failed to load saved jobs');
        } finally {
            setLoading(false);
        }
    };
    fetchSaved();
  }, []);

  const removeSaved = async (jobId) => {
    try {
        await jobService.unsaveJob(jobId);
        setSavedJobs(prev => prev.filter(j => j._id !== jobId));
        toast.success('Job removed from saved');
    } catch(err) {
        toast.error('Failed to remove job');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading saved jobs...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Jobs</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{savedJobs.length} saved jobs</p>
        </div>
        <Link to="/candidate/jobs"><Button variant="secondary" size="sm" className="flex items-center gap-1.5"><ArrowRight size={14} /> Browse More</Button></Link>
      </div>

      {savedJobs.length === 0 ? (
        <EmptyState type="jobs" title="No saved jobs" description="Browse jobs and click the bookmark icon to save them here for later." action={<Link to="/candidate/jobs"><Button>Browse Jobs</Button></Link>} />
      ) : (
        <div className="space-y-4">
          {savedJobs.map(job => (
            <Card key={job._id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ backgroundColor: getCompanyColor(job.companyName || 'C') }}>
                    {job.companyLogo ? (
                        job.companyLogo.startsWith('http') ? <img src={job.companyLogo} alt="" className="w-full h-full object-cover rounded-xl" /> : job.companyLogo
                    ) : (job.companyName?.[0] || 'C')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{job.companyName}</p>
                      <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{formatSalary(job.salaryMin, job.salaryMax)}</span>
                        <Badge variant={job.jobType === 'Remote' ? 'green' : 'blue'}>{job.jobType}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(job.skillsRequired || []).slice(0, 4).map(skill => (
                          <Tag key={skill} variant="gray" size="sm">{skill}</Tag>
                        ))}
                        {(job.skillsRequired || []).length > 4 && (
                          <Tag variant="gray" size="sm">+{job.skillsRequired.length - 4}</Tag>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Link to={`/candidate/job/${job._id}`}>
                        <Button size="sm">Apply Now</Button>
                      </Link>
                      <button onClick={() => removeSaved(job._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Remove">
                        <X size={18} />
                      </button>
                    </div>
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
