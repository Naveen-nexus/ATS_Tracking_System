import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Users, ArrowLeft, Bookmark, Share2, CheckCircle, XCircle, Building2, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Tag } from '../../components/ui/Tag';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { mockJobs } from '../../data/mockData';
import { formatSalary, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

const candidateSkills = ['React', 'TypeScript', 'Node.js', 'JavaScript', 'CSS', 'Git'];

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const job = mockJobs.find(j => j.id === parseInt(id));
  const [saved, setSaved] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return (
    <div className="max-w-4xl mx-auto text-center py-16">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Job not found</h2>
      <Link to="/candidate/jobs"><Button>Browse Jobs</Button></Link>
    </div>
  );

  const matchedSkills = job.skills.filter(s => candidateSkills.includes(s));
  const missingSkills = job.skills.filter(s => !candidateSkills.includes(s));

  const handleApply = () => {
    setApplied(true);
    toast.success(`Successfully applied to ${job.title}!`);
  };

  const handleSave = () => {
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
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0" style={{ backgroundColor: job.companyColor }}>{job.companyLogo}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1"><Building2 size={15} />{job.company}</p>
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
              <span className="flex items-center gap-1.5"><Clock size={14} />{job.experience}</span>
              <span className="flex items-center gap-1.5"><DollarSign size={14} />{formatSalary(job.salary.min, job.salary.max)}</span>
              <span className="flex items-center gap-1.5"><Users size={14} />{job.applicants} applicants</span>
              <span className="flex items-center gap-1.5"><Calendar size={14} />Deadline {formatDate(job.deadline)}</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant={job.type === 'Remote' ? 'green' : job.type === 'Hybrid' ? 'blue' : 'default'}>{job.type}</Badge>
              {job.featured && <Badge variant="yellow">Featured</Badge>}
            </div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">Match Score:</span>
            <div className="flex-1 w-32">
              <ProgressBar value={job.matchScore} color={job.matchScore >= 80 ? 'green' : job.matchScore >= 60 ? 'yellow' : 'red'} />
            </div>
            <span className={`text-sm font-bold ${job.matchScore >= 80 ? 'text-green-600' : job.matchScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{job.matchScore}%</span>
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
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{job.description}</p>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Responsibilities</h3>
              <ul className="space-y-2 mb-4">
                {job.responsibilities.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={14} className="text-green-500 mt-0.5 flex-shrink-0" />{r}</li>)}
              </ul>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((r, i) => <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />{r}</li>)}
              </ul>
            </CardBody>
          </Card>
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Benefits</h2></CardHeader>
            <CardBody>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((b, i) => <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"><CheckCircle size={14} className="text-green-500 flex-shrink-0" />{b}</div>)}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Skill Match Breakdown</h2></CardHeader>
            <CardBody className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Match Score</p>
                <ProgressBar value={job.matchScore} showValue color={job.matchScore >= 80 ? 'green' : job.matchScore >= 60 ? 'yellow' : 'red'} size="lg" />
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
          <Card>
            <CardHeader><h2 className="text-base font-semibold text-gray-900 dark:text-white">Similar Jobs</h2></CardHeader>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {mockJobs.filter(j => j.id !== job.id).slice(0, 3).map(j => (
                <Link key={j.id} to={`/candidate/jobs/${j.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors block">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: j.companyColor }}>{j.companyLogo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{j.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{j.company} • {j.matchScore}% match</p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
