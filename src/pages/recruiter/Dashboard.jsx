import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Star, TrendingUp, ArrowRight, MoreVertical, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MetricCard } from '../../components/ui/MetricCard';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ApplicantsBarChart } from '../../components/charts/ApplicantsBarChart';
import { SkillBarChart } from '../../components/charts/SkillBarChart';
import { analyticsService } from '../../services/analyticsService';
import { jobService } from '../../services/jobService';
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
                jobService.getAllJobs()
            ]);

            setStats(dashboardData);
            setActiveJobs(Array.isArray(jobsData) ? jobsData.slice(0, 5) : []);

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
  const totalShortlisted = stats.statusStats?.['Shortlisted'] || 0;
  const conversionRate = totalApplicants > 0 ? Math.round((totalShortlisted / totalApplicants) * 100) : 0;

  // Prepare chart data
  const applicantsPerJobData = activeJobs.map(job => ({
      name: job.title.substring(0, 15) + (job.title.length>15?'...':''),
      applicants: 0,
      shortlisted: 0
  }));
  
  const skillDemandData = [
      { name: 'React', value: 65 },
      { name: 'Node.js', value: 45 },
      { name: 'TypeScript', value: 30 },
      { name: 'Python', value: 25 },
  ];

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center">
       <div className="w-8 h-8 border-4 border-[#ccff00] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-[40px] font-bold text-black tracking-tight leading-none mb-2">Recruiter Overview</h1>
        <p className="text-[15px] font-medium text-gray-500">Take control of your hiring today!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main large widget - Applicants Overview (Matches "Energy Used" card map) */}
        <div className="bg-white rounded-[32px] p-6 sm:p-8 flex flex-col relative overflow-hidden shadow-sm">
           <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                 <Users size={20} className="text-gray-400" />
                 <span className="font-semibold text-gray-800">Total Pipeline</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <MoreVertical size={20} />
              </button>
           </div>
           
           <div className="flex items-baseline gap-3 mb-10">
              <span className="text-[44px] font-bold text-black tracking-tight leading-none">{totalApplicants}</span>
              <span className="bg-[#ccff00] text-black text-xs font-bold px-2 py-0.5 rounded-full">+12%</span>
           </div>
           
           <div className="relative flex-1 min-h-[220px] flex items-center justify-center mb-6">
             {/* Decorative overlapping circles simulating the Flux design */}
             <div className="absolute w-[180px] h-[180px] rounded-full bg-[#c0aede] opacity-80 left-0 top-10 flex flex-col items-center justify-center">
                 <span className="text-[32px] font-bold text-black leading-none">{totalApplicants}</span>
                 <span className="text-xs font-semibold text-black/60">Total</span>
             </div>
             <div className="absolute w-[140px] h-[140px] rounded-full bg-black right-0 top-0 flex flex-col items-center justify-center z-10 shadow-xl">
                 <span className="text-[28px] font-bold text-white leading-none">{totalShortlisted}</span>
                 <span className="text-xs font-medium text-white/50">Shortlisted</span>
             </div>
             <div className="absolute w-[90px] h-[90px] rounded-full bg-[#ccff00] right-[30%] bottom-0 flex flex-col items-center justify-center z-20 shadow-lg">
                 <span className="text-xl font-bold text-black leading-none">{totalJobs}</span>
                 <span className="text-[10px] font-bold text-black/70">Jobs</span>
             </div>
           </div>

           <div className="space-y-4">
              <div>
                 <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-500">Pipeline Status</span>
                    <span className="text-black">45%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-[#c0aede] h-3 rounded-full" style={{width: '45%'}}></div>
                 </div>
              </div>
              <div>
                 <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-gray-500">Screening</span>
                    <span className="text-black">30%</span>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-black h-3 rounded-full" style={{width: '30%'}}></div>
                 </div>
              </div>
           </div>
        </div>

        {/* Right side upper cards */}
        <div className="flex flex-col gap-6">
           <div className="bg-white rounded-[32px] p-6 lg:p-8 flex-1 flex flex-col shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <TrendingUp size={20} className="text-gray-400" />
                    <span className="font-semibold text-gray-800">Conversion Rate</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={20} />
                </button>
               </div>
               
               <div className="flex-1 flex flex-col justify-end">
                   <div className="flex items-end justify-between w-full">
                       <span className="text-[44px] font-bold text-black tracking-tight leading-none">{conversionRate}<span className="text-2xl">%</span></span>
                       <div className="text-right">
                           <p className="text-xs font-bold text-gray-400">Avg</p>
                           <p className="text-sm font-bold text-gray-700">18% Rate</p>
                       </div>
                   </div>
               </div>
           </div>

           <div className="bg-white rounded-[32px] p-6 lg:p-8 flex-1 flex flex-col shadow-sm relative overflow-hidden">
               <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-2">
                    <Activity size={20} className="text-gray-400" />
                    <span className="font-semibold text-gray-800">Jobs Posted</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreVertical size={20} />
                </button>
               </div>
               
               <div className="flex-1 flex flex-col justify-end">
                   <div className="flex items-end justify-between w-full">
                       <span className="text-[44px] font-bold text-black tracking-tight leading-none">{totalJobs}</span>
                       <div className="text-right">
                           <p className="text-xs font-bold text-gray-400">Active</p>
                           <p className="text-sm font-bold text-gray-700">3 Jobs</p>
                       </div>
                   </div>
               </div>
           </div>
        </div>

        {/* Right side third column - Top Skills (Like index dot chart) */}
        <div className="bg-white rounded-[32px] p-6 lg:p-8 flex flex-col shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
               <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-400 font-serif text-lg leading-none">%</span>
                  <span className="font-semibold text-gray-800">Skills Demand</span>
               </div>
               <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <MoreVertical size={20} />
               </button>
            </div>
            
            <div className="flex items-center gap-3 mb-6">
               <span className="text-[44px] font-bold text-black tracking-tight leading-none">65<span className="text-2xl">%</span></span>
               <span className="bg-[#ccff00] text-black text-xs font-bold px-2 py-0.5 rounded-full">+10%</span>
            </div>
            
            <div className="flex-1 -mx-4 -mb-4">
               <SkillBarChart data={skillDemandData} />
            </div>
        </div>
      </div>

      {/* Bottom Dark Card - Active Jobs / App Analysis */}
      <div className="bg-[#1e1e1e] rounded-[32px] p-6 lg:p-8 flex flex-col md:flex-row shadow-xl">
         <div className="md:w-1/3 flex flex-col pr-8 border-b md:border-b-0 md:border-r border-gray-700/50 mb-6 md:mb-0 pb-6 md:pb-0">
             <div className="flex items-center gap-2 mb-8">
                 <Briefcase size={20} className="text-gray-400" />
                 <span className="font-semibold text-white">Active Jobs List</span>
             </div>
             
             <div className="flex items-center gap-6 mb-8">
                 <div>
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-6 bg-[#ccff00] rounded-sm"></div>
                        <span className="text-[32px] font-bold text-white leading-none">{totalJobs}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 ml-2.5">Total Active</p>
                 </div>
                 <div>
                    <div className="flex items-center gap-1 mb-1">
                        <div className="w-1.5 h-6 bg-[#c0aede] rounded-sm"></div>
                        <span className="text-[32px] font-bold text-white leading-none">{totalApplicants}</span>
                    </div>
                    <p className="text-xs font-medium text-gray-400 ml-2.5">Total Apps</p>
                 </div>
             </div>
             
             <Link to="/recruiter/manage-jobs">
                 <button className="bg-white/10 hover:bg-white/20 text-white w-full py-3 rounded-xl text-sm font-semibold transition-colors mt-auto">
                    View All Jobs
                 </button>
             </Link>
         </div>
         
         <div className="md:w-2/3 md:pl-8 flex flex-col">
            <div className="flex justify-end mb-6">
                <div className="bg-white/10 rounded-full px-4 py-2 flex items-center gap-2 cursor-pointer hover:bg-white/20 transition-colors">
                   <span className="text-sm font-medium text-white">Monthly</span>
                   <ChevronDown size={16} className="text-gray-400" />
                </div>
            </div>
            
            <div className="flex-1 w-full overflow-x-auto scrollbar-hide -mx-2 px-2">
                <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr>
                        <th className="text-xs font-semibold text-gray-400 pb-4">JOB TITLE</th>
                        <th className="text-xs font-semibold text-gray-400 pb-4">CANDIDATES</th>
                        <th className="text-xs font-semibold text-gray-400 pb-4">POSTED</th>
                        <th className="text-xs font-semibold text-gray-400 pb-4">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {activeJobs.map(job => (
                        <tr key={job._id} className="border-t border-gray-700/50 group">
                          <td className="py-4 font-semibold text-white group-hover:text-[#ccff00] transition-colors">{job.title}</td>
                          <td className="py-4 text-gray-300">-</td>
                          <td className="py-4 text-gray-400">{formatDate(job.createdAt)}</td>
                          <td className="py-4">
                             <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-[#ccff00]/20 text-[#ccff00] text-xs font-bold">
                                Active
                             </div>
                          </td>
                        </tr>
                      ))}
                      {activeJobs.length === 0 && (
                          <tr><td colSpan="4" className="text-center py-8 text-sm text-gray-500">No jobs posted yet</td></tr>
                      )}
                    </tbody>
                </table>
            </div>
         </div>
      </div>
    </div>
  );
};
