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
        'fixed top-0 left-0 h-full w-72 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-r border-gray-100 dark:border-gray-800/50 z-40 transition-transform duration-300 flex flex-col shadow-2xl lg:shadow-none',
        open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100 dark:border-gray-800/50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
              <BriefcaseBusiness size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">TalentFlow</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 lg:hidden transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="mb-4 px-2">
            <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
              {user?.role === 'recruiter' ? 'Recruiter Menu' : 'Navigation'}
            </span>
          </div>
          <ul className="space-y-1">
            {navItems.map(item => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  className={({ isActive }) => cn(
                    'group flex items-center gap-3.5 px-3 py-3 rounded-2xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-blue-600 shadow-md shadow-blue-500/25 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon
                        size={20}
                        className={cn('transition-colors duration-200', isActive ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400')}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info + Logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800/50 m-2 rounded-3xl bg-gray-50 dark:bg-white/5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm border border-white/10">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize truncate">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 w-full transition-colors"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
