import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Star, XCircle, Calendar, ArrowRight, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplicationPieChart } from '../../components/charts/ApplicationPieChart';
import { ActivityLineChart } from '../../components/charts/ActivityLineChart';
import { mockApplications, mockJobs, applicationStatusChart, monthlyApplicationsData } from '../../data/mockData';
import { getStatusColor, formatDate, formatSalary } from '../../utils/helpers';

const statusBadgeVariant = (status) => {
  const map = { 'Applied': 'blue', 'Under Review': 'yellow', 'Shortlisted': 'purple', 'Interview Scheduled': 'indigo', 'Selected': 'green', 'Rejected': 'red' };
  return map[status] || 'default';
};

export const CandidateDashboard = () => {
  const { user } = useAuth();
  const total = mockApplications.length;
  const shortlisted = mockApplications.filter(a => a.status === 'Shortlisted').length;
  const rejected = mockApplications.filter(a => a.status === 'Rejected').length;
  const interviews = mockApplications.filter(a => a.status === 'Interview Scheduled').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Here's your job search overview</p>
        </div>
        <Link to="/candidate/jobs">
          <Button size="sm" className="hidden sm:flex">
            Browse Jobs <ArrowRight size={14} />
          </Button>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Applications" value={total} icon={FileText} iconColor="blue" trend={12} subtitle="All applied jobs" />
        <MetricCard title="Shortlisted" value={shortlisted} icon={Star} iconColor="purple" trend={5} subtitle="Review stage" />
        <MetricCard title="Rejected" value={rejected} icon={XCircle} iconColor="red" trend={-2} subtitle="Not selected" />
        <MetricCard title="Interviews" value={interviews} icon={Calendar} iconColor="green" trend={8} subtitle="Upcoming" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Monthly Application Activity</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Last 6 months</p>
            </CardHeader>
            <CardBody>
              <ActivityLineChart data={monthlyApplicationsData} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Applications</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Your latest job applications</p>
              </div>
              <Link to="/candidate/applications">
                <Button variant="ghost" size="xs">View all <ArrowRight size={12} /></Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Company</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Role</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Match</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {mockApplications.slice(0, 4).map(app => (
                    <tr key={app.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: app.companyColor }}>{app.companyLogo}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{app.company}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 sm:hidden">{app.jobTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{app.jobTitle}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(app.appliedDate)}</p>
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                        <span className={`text-sm font-semibold ${app.matchScore >= 80 ? 'text-green-600' : app.matchScore >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>{app.matchScore}%</span>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={statusBadgeVariant(app.status)} dot>{app.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Application Status</h3>
            </CardHeader>
            <CardBody>
              <ApplicationPieChart data={applicationStatusChart} />
            </CardBody>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Recommended Jobs</h3>
              <Link to="/candidate/jobs"><Button variant="ghost" size="xs">See all</Button></Link>
            </CardHeader>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {mockJobs.slice(0, 3).map(job => (
                <Link key={job.id} to={`/candidate/jobs/${job.id}`} className="flex items-start gap-3 px-5 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: job.companyColor }}>{job.companyLogo}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{job.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin size={11} />{job.location.split(',')[0]}</span>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">{job.matchScore}%</span>
                    </div>
                  </div>
                  <Badge variant="blue" className="text-xs">{job.type}</Badge>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
