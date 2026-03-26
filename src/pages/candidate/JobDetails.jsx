import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, ArrowLeft, Bookmark, Share2, CheckCircle, XCircle, Building2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';

// This should ideally come from the user's profile context/service
const candidateSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS', 'Git']; 

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
        try {
            setLoading(true);
            const data = await jobService.getJobById(id);
            setJob(data);
            
            try {
                const myApps = await applicationService.getMyApplications();
                if (myApps && Array.isArray(myApps)) {
                   const isApplied = myApps.some(app => app.jobId && (app.jobId._id === id || app.jobId === id));
                   setApplied(isApplied);
                }
            } catch (appErr) {
                console.log('Failed to check application status');
            }

        } catch (err) {
            setError(err.message || 'Job not found');
        } finally {
            setLoading(false);
        }
    };
    fetchJob();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading job details...</div>;

  if (error || !job) return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Job not found</h2>
      <Link to="/candidate/jobs"><Button>Browse Jobs</Button></Link>
    </div>
  );

  const matchedSkills = (job.skillsRequired || []).filter(s => candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
  const missingSkills = (job.skillsRequired || []).filter(s => !candidateSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
  
  // Calculate a simple match score
  const totalSkills = (job.skillsRequired || []).length;
  const matchScore = totalSkills > 0 ? Math.round((matchedSkills.length / totalSkills) * 100) : 0;

  const handleApply = async () => {
    try {
        await applicationService.applyJob(job._id);
        setApplied(true);
        toast.success(`Successfully applied to ${job.title}!`);
    } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to apply');
    }
  };

  const handleSave = () => {
    // Placeholder for save functionality
    setSaved(!saved);
    toast.success(saved ? 'Removed from saved jobs' : 'Job saved!');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors">
        <ArrowLeft size={16} /> Back to Jobs
      </button>

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: '#3b82f6' }}>{job.companyLogo || job.companyName?.[0] || 'C'}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1"><Building2 size={15} />{job.companyName}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSave} className={`p-2 rounded-xl border transition-all ${saved ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600' : 'border-gray-200 dark:border-gray-700 text-gray-400 hover:text-yellow-500'}`}>
                  <Bookmark size={18} fill={saved ? 'currentColor' : 'none'} />
                </button>
                <button className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-400 hover:text-blue-500 transition-all">
                  <Share2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1.5"><MapPin size={14} />{job.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} />{job.experienceMin}-{job.experienceMax} years</span>
              <span className="flex items-center gap-1.5"><DollarSign size={14} />{formatSalary(job.salaryMin, job.salaryMax)}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{0} applicants</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />Posted {new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={job.jobType === 'Remote' ? 'green' : job.jobType === 'Hybrid' ? 'blue' : 'default'}>{job.jobType}</Badge>
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Match Score:</span>
            <div className="flex-1 w-32">
              <ProgressBar value={matchScore} color={matchScore >= 80 ? 'green' : matchScore >= 60 ? 'yellow' : 'red'} />
            </div>
            <span className={`text-sm font-bold ${matchScore >= 80 ? 'text-green-600' : matchScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{matchScore}%</span>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={handleSave}>{saved ? 'Saved ✓' : 'Save Job'}</Button>
            <Button disabled={applied} onClick={handleApply}>{applied ? 'Applied ✓' : 'Apply Now'}</Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Job Description</h2></CardHeader>
            <CardBody className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{job.description}</p>
            </CardBody>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Skill Match Breakdown</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Match Score</p>
                <ProgressBar value={matchScore} showValue color={matchScore >= 80 ? 'green' : matchScore >= 60 ? 'yellow' : 'red'} size="lg" />
              </div>
              {matchedSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5"><CheckCircle size={14} className="text-green-500" />Matched Skills ({matchedSkills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedSkills.map(s => <Tag key={s} variant="green">{s}</Tag>)}
                  </div>
                </div>
              )}
              {missingSkills.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5"><XCircle size={14} className="text-red-500" />Missing Skills ({missingSkills.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.map(s => <Tag key={s} variant="red">{s}</Tag>)}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
