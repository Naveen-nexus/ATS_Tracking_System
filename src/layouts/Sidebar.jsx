import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Search, FileText, BookOpen, Bookmark, User, LogOut,
  BriefcaseBusiness, PlusSquare, Users, BarChart2, Settings, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

const candidateNav = [
  { to: '/candidate/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/candidate/jobs', icon: Search, label: 'Browse Jobs' },
  { to: '/candidate/applications', icon: FileText, label: 'Applications' },
  { to: '/candidate/resume', icon: BookOpen, label: 'Resume' },
  { to: '/candidate/saved', icon: Bookmark, label: 'Saved Jobs' },
  { to: '/candidate/profile', icon: User, label: 'Profile' },
];

const recruiterNav = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/post-job', icon: PlusSquare, label: 'Post Job' },
  { to: '/recruiter/jobs', icon: BriefcaseBusiness, label: 'Manage Jobs' },
  { to: '/recruiter/applicants', icon: Users, label: 'Applicants' },
  { to: '/recruiter/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/recruiter/settings', icon: Settings, label: 'Settings' },
];

export const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const navItems = user?.role === 'recruiter' ? recruiterNav : candidateNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
        {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <aside className={cn(
        'fixed top-0 left-0 h-full w-64 bg-[#18181b] z-40 transition-transform duration-300 flex flex-col',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 h-24 flex-shrink-0">
          <div className="w-8 h-8 bg-[#ccff00] rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm flex items-center justify-center shadow-lg shadow-[#ccff00]/20">
            <BriefcaseBusiness size={18} className="text-black" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">flux</span>
          <button
            onClick={onClose}
            className="ml-auto p-2 rounded-xl hover:bg-white/10 text-gray-400 lg:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto scrollbar-hide space-y-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => window.innerWidth < 1024 && onClose()}
              className={({ isActive }) => cn(
                'group flex items-center gap-4 px-4 py-3.5 rounded-[20px] text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-white text-black shadow-sm'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    size={20}
                    className={cn('transition-colors duration-200', isActive ? 'text-black' : 'text-gray-400 group-hover:text-white')}
                  />
                  {item.label}
                  {item.label === 'Dashboard' && (
                     <span className={cn(
                       "ml-auto w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                       isActive ? "bg-[#ccff00] text-black" : "bg-gray-800 text-gray-400 group-hover:text-white"
                     )}>3</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Upgrade Card / Logout */}
        <div className="px-4 pb-6 pt-4 flex flex-col gap-2">
          <div className="bg-[#ccff00] rounded-[24px] p-5 relative overflow-hidden flex flex-col items-center text-center shadow-lg shadow-[#ccff00]/10">
             <h4 className="text-black font-bold text-lg leading-tight mb-2">Upgrade to Pro</h4>
             <p className="text-black/80 text-xs font-medium mb-4">Upgrade your account for a fuller experience.</p>
             <button className="bg-black text-white w-full py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
               Upgrade Now
             </button>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 rounded-[20px] text-sm font-semibold text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-all mt-2"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
