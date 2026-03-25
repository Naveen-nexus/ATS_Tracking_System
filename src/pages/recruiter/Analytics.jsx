import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { MetricCard } from '../../components/ui/MetricCard';
import { ApplicantsBarChart } from '../../components/charts/ApplicantsBarChart';
import { SkillBarChart } from '../../components/charts/SkillBarChart';
import { ActivityLineChart } from '../../components/charts/ActivityLineChart';
import { ApplicationPieChart } from '../../components/charts/ApplicationPieChart';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Briefcase, Users, TrendingUp, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { jobService } from '../../services/jobService';
import { applicationService } from '../../services/applicationService';
import toast from 'react-hot-toast';

export const Analytics = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const [j, a] = await Promise.all([
                jobService.getMyPostedJobs(),
                applicationService.getRecruiterApplications()
            ]);
            setJobs(j);
            setApplications(a);
        } catch(err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading analytics...</div>;

  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const activeJobs = jobs.filter(j => j.status === 'Active').length;
  
  // Status Distribution
  const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
  }, {});

  const statusDistribution = [
      { name: 'Applied', value: statusCounts['Applied'] || 0, color: '#3b82f6' },
      { name: 'Under Review', value: statusCounts['Under Review'] || 0, color: '#f59e0b' },
      { name: 'Shortlisted', value: statusCounts['Shortlisted'] || 0, color: '#8b5cf6' },
      { name: 'Interview Scheduled', value: statusCounts['Interview Scheduled'] || 0, color: '#6366f1' },
      { name: 'Selected', value: statusCounts['Selected'] || 0, color: '#10b981' },
      { name: 'Rejected', value: statusCounts['Rejected'] || 0, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // Hiring Funnel (Simplified)
  const funnelData = [
      { stage: 'Total Applicants', value: totalApplicants, pct: 100, color: 'blue' },
      { stage: 'Under Review', value: (statusCounts['Under Review'] || 0) + (statusCounts['Shortlisted'] || 0) + (statusCounts['Interview Scheduled'] || 0) + (statusCounts['Selected'] || 0), pct: 0, color: 'yellow' },
      { stage: 'Shortlisted', value: (statusCounts['Shortlisted'] || 0) + (statusCounts['Interview Scheduled'] || 0) + (statusCounts['Selected'] || 0), pct: 0, color: 'purple' },
      { stage: 'Interviewed', value: (statusCounts['Interview Scheduled'] || 0) + (statusCounts['Selected'] || 0), pct: 0, color: 'indigo' },
      { stage: 'Hired', value: statusCounts['Selected'] || 0, pct: 0, color: 'green' },
  ];
  
  // Recalculate percentages relative to Total Applicants
  funnelData.forEach(d => {
      d.pct = totalApplicants > 0 ? Math.round((d.value / totalApplicants) * 100) : 0;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hiring Analytics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Insights and metrics for your recruitment process</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Jobs Posted" value={totalJobs} icon={Briefcase} iconColor="blue" trend={10} />
        <MetricCard title="Total Applicants" value={totalApplicants} icon={Users} iconColor="indigo" trend={18} />
        <MetricCard title="Active Jobs" value={activeJobs} icon={CheckCircle2} iconColor="green" trend={5} />
        <MetricCard title="Interviews" value={statusCounts['Interview Scheduled'] || 0} icon={TrendingUp} iconColor="purple" trend={12} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application Status</h3>
                </CardHeader>
                <CardBody>
                     {/* Using the PieChart with dynamic data */}
                     <div className="h-64 flex justify-center">
                        <ApplicationPieChart data={statusDistribution} />
                     </div>
                </CardBody>
            </Card>
            
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Hiring Funnel</h3>
                    <p className="text-xs text-gray-500">Conversion rates</p>
                </CardHeader>
                <CardBody>
                     <div className="space-y-4">
                        {funnelData.map((stage) => (
                             <div key={stage.stage}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{stage.stage}</span>
                                    <span className="text-gray-500">{stage.value} ({stage.pct}%)</span>
                                </div>
                                <ProgressBar value={stage.pct} color={stage.color} size="md" />
                             </div>
                        ))}
                     </div>
                </CardBody>
            </Card>
        </div>
        
        <div className="space-y-6">
              {/* Could put skills chart here if I extracted skills from applications */}
              <Card>
                  <CardHeader><h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3></CardHeader>
                  <CardBody>
                      <div className="text-center py-8 text-gray-400">
                          Activity tracking coming soon...
                      </div>
                  </CardBody>
              </Card>
        </div>
      </div>
    </div>
  );
};
