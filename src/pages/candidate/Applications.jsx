import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Star, Calendar, XCircle, AlertCircle, Eye, ChevronDown, ChevronUp, Building2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { mockApplications } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const STAGES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected'];

const stageIcons = {
  'Applied': AlertCircle,
  'Under Review': Clock,
  'Shortlisted': Star,
  'Interview Scheduled': Calendar,
  'Selected': CheckCircle,
  'Rejected': XCircle,
};

const stageColors = {
  'Applied': 'bg-blue-500',
  'Under Review': 'bg-yellow-500',
  'Shortlisted': 'bg-purple-500',
  'Interview Scheduled': 'bg-indigo-500',
  'Selected': 'bg-green-500',
  'Rejected': 'bg-red-500',
};

const badgeVariants = {
  'Applied': 'blue', 'Under Review': 'yellow', 'Shortlisted': 'purple',
  'Interview Scheduled': 'indigo', 'Selected': 'green', 'Rejected': 'red',
};

const Timeline = ({ currentStatus }) => {
  const isRejected = currentStatus === 'Rejected';
  const currentIdx = isRejected ? STAGES.length - 1 : STAGES.indexOf(currentStatus);
  return (
    <div className="flex items-center gap-0 mt-4">
      {STAGES.map((stage, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = stage === currentStatus;
        const Icon = stageIcons[stage];
        return (
          <div key={stage} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isCompleted || isCurrent ? stageColors[isCurrent ? currentStatus : stage] : 'bg-gray-200 dark:bg-gray-600'}`}>
                <Icon size={12} className="text-white" />
              </div>
              <span className={`text-xs whitespace-nowrap hidden sm:block ${isCurrent ? 'font-semibold text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}`}>{stage.split(' ')[0]}</span>
            </div>
            {idx < STAGES.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 ${idx < currentIdx ? 'bg-blue-400' : 'bg-gray-200 dark:bg-gray-600'}`} />
            )}
          </div>
        );
      })}
      {isRejected && (
        <div className="ml-2 flex flex-col items-center gap-1">
          <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center">
            <XCircle size={12} className="text-white" />
          </div>
          <span className="text-xs text-red-500 font-semibold hidden sm:block">Rejected</span>
        </div>
      )}
    </div>
  );
};

const ApplicationCard = ({ app }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ backgroundColor: app.companyColor }}>{app.companyLogo}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{app.jobTitle}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-0.5">
                <Building2 size={13} />{app.company}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${app.matchScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300'}`}>{app.matchScore}% Match</span>
              <Badge variant={badgeVariants[app.status]} dot>{app.status}</Badge>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            <span>Applied {formatDate(app.appliedDate)}</span>
            <span>•</span>
            <span>Updated {formatDate(app.lastUpdated)}</span>
          </div>
          {!expanded && <Timeline currentStatus={app.status} />}
        </div>
        <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors flex-shrink-0">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4">
          <Timeline currentStatus={app.status} />
          {app.notes && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{app.notes}</p>
            </div>
          )}
          {app.interviewDate && (
            <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg p-3 text-sm text-indigo-700 dark:text-indigo-300">
              <Calendar size={14} />
              <span>Interview scheduled: <strong>{app.interviewDate}</strong></span>
            </div>
          )}
          <div className="flex gap-2">
            <Link to={`/candidate/jobs/${app.jobId}`}>
              <button className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                <Eye size={14} /> View Job
              </button>
            </Link>
          </div>
        </div>
      )}
    </Card>
  );
};

export const Applications = () => {
  const [filter, setFilter] = useState('All');
  const statuses = ['All', 'Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'];
  const filtered = filter === 'All' ? mockApplications : mockApplications.filter(a => a.status === filter);

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Applications</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{mockApplications.length} total applications</p>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-blue-300'}`}>
            {s} {s !== 'All' && `(${mockApplications.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState type="inbox" title="No applications found" description="Applications matching this filter will appear here." />
      ) : (
        <div className="space-y-4">
          {filtered.map(app => <ApplicationCard key={app.id} app={app} />)}
        </div>
      )}
    </div>
  );
};
