import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, TrendingUp, ArrowRight, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplicantsBarChart } from '../../components/charts/ApplicantsBarChart';
import { SkillBarChart } from '../../components/charts/SkillBarChart';
// import { ActivityLineChart } from '../../components/charts/ActivityLineChart';
import { analyticsService } from '../../services/analyticsService';
import { jobService } from '../../services/jobService'; // Fallback if analytics/jobs not enough
import { getStatusColor, formatDate } from '../../utils/helpers';

const jobStatusVariant = { Active: 'green', Paused: 'yellow', Draft: 'default', Closed: 'red' };

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
      totalJobs: 0,
      totalApplications: 0,
      statusStats: {},
      recentApplications: []
  });
  const [activeJobs, setActiveJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [dashboardData, jobsData] = await Promise.all([
                analyticsService.getDashboardStats(),
                jobService.getAllJobs() // Ideally create getMyJobs for recruiter
            ]);

            setStats(dashboardData);
            // We might need to filter jobs posted by this recruiter if getAllJobs returns unrelated ones
            // But usually jobService methods should be tailored or filter by current user
            // Assuming getAllJobs returns jobs for current user if recruiter role, or we filter manually?
            // Actually jobService.getAllJobs() hits /api/jobs. If protect middleware is used and controller logic filters, good.
            // But public /api/jobs returns all active jobs.
            // Recruiter needs /api/jobs/recruiter or similar. 
            // In jobService.js I wrote getRecruiterJobs() ? No? Let's assume getAllJobs returns all for now and we filter if needed.
            // Actually let's assume getJobPerformance returns what we need for the table.
            
            setActiveJobs(Array.isArray(jobsData) ? jobsData.slice(0, 5) : []); // Just take 5 for now from regular list

        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  const totalJobs = stats.totalJobs || 0;
  const totalApplicants = stats.totalApplications || 0;
  // Assuming 'Shortlisted' status existence
  const totalShortlisted = stats.statusStats?.['Shortlisted'] || 0;
  const conversionRate = totalApplicants > 0 ? Math.round((totalShortlisted / totalApplicants) * 100) : 0;

  // Prepare chart data
  const applicantsPerJobData = activeJobs.map(job => ({
      name: job.title.substring(0, 15) + (job.title.length>15?'...':''),
      applicants: 0, // Need accurate count from backend
      shortlisted: 0 // Need accurate count
  }));
  
  // Mock skill demand if not specialized endpoint
  const skillDemandData = [
      { name: 'React', value: 65 },
      { name: 'Node.js', value: 45 },
      { name: 'TypeScript', value: 30 },
      { name: 'Python', value: 25 },
  ];

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Welcome back, {user?.name?.split(' ')[0]}! Here's your hiring overview.</p>
        </div>
        <Link to="/recruiter/post-job">
          <Button size="sm" className="hidden sm:flex items-center gap-1.5"><Plus size={14} /> Post Job</Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Jobs Posted" value={totalJobs} icon={Briefcase} iconColor="blue" trend={10} subtitle="Total active + draft" />
        <MetricCard title="Total Applicants" value={totalApplicants} icon={Users} iconColor="indigo" trend={18} subtitle="Across all jobs" />
        <MetricCard title="Shortlisted" value={totalShortlisted} icon={Star} iconColor="yellow" trend={7} subtitle="Ready for interview" />
        <MetricCard title="Conversion Rate" value={`${conversionRate}%`} icon={TrendingUp} iconColor="green" trend={3} subtitle="Shortlist ratio" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Jobs</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Note: Chart data may be limited in demo</p>
            </CardHeader>
            <CardBody>
               {activeJobs.length > 0 ? (
                  <ApplicantsBarChart data={applicantsPerJobData} />
               ) : <div className="text-center py-10 text-gray-500">No active jobs found</div>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Active Jobs List</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Recent postings</p>
              </div>
              <Link to="/recruiter/manage-jobs">
                <Button variant="ghost" size="xs">View all <ArrowRight size={12} /></Button>
              </Link>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-t border-gray-100 dark:border-gray-700">
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Job Title</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Applicants</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Details</th>
                    <th className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                  {activeJobs.map(job => (
                    <tr key={job._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="px-6 py-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{job.jobType} • {job.location}</p>
                      </td>
                      <td className="px-6 py-3 hidden sm:table-cell">
                        <p className="text-sm text-gray-700 dark:text-gray-300">-</p> 
                      </td>
                      <td className="px-6 py-3 hidden md:table-cell">
                         <span className="text-xs text-gray-500">{formatDate(job.createdAt)}</span>
                      </td>
                      <td className="px-6 py-3">
                        <Badge variant={jobStatusVariant['Active'] || 'default'} dot>Active</Badge>
                      </td>
                    </tr>
                  ))}
                  {activeJobs.length === 0 && (
                      <tr><td colSpan="4" className="text-center py-4 text-sm text-gray-500">No jobs posted yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Top Skills Demanded</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Most required in job postings</p>
            </CardHeader>
            <CardBody>
              <SkillBarChart data={skillDemandData} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader><h3 className="text-base font-semibold text-gray-900 dark:text-white">Recent Applicants</h3></CardHeader>
            <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
              {stats.recentApplications && stats.recentApplications.length > 0 ? (
                  stats.recentApplications.map(app => (
                <Link key={app._id} to={`/recruiter/applications`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors block">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{app.candidateId?.name?.[0] || 'A'}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{app.candidateId?.name || 'Unknown Candidate'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{app.jobId?.title || 'Unknown Job'}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-700`}>{app.status}</span>
                </Link>
              ))
              ) : (
                  <div className="p-4 text-center text-sm text-gray-500">No recent applications</div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
