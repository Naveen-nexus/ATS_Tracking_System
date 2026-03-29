import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Search, Sun, Moon, LogOut, User, Menu, X, BriefcaseBusiness, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar } from '../components/ui/Avatar';
import { notifications } from '../data/mockData';

export const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="relative h-20 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30 shadow-sm transition-colors duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400 transition-colors lg:hidden">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="hidden md:flex items-center gap-3 bg-gray-50 dark:bg-[#1f2937]/50 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl px-4 py-2.5 w-96 transition-all focus-within:bg-white dark:focus-within:bg-[#1f2937] focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/30">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input placeholder="Search jobs, candidates, or skills..." className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none w-full" />
        </div>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200/50 dark:border-gray-700/50 hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 transition-all">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white dark:ring-gray-900 shadow-sm">{unread}</span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Notifications</h3>
                <span className="text-xs font-medium text-blue-600 dark:text-blue-400 cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto scrollbar-hide">
                {notifications.map(n => (
                  <div key={n.id} className={`px-5 py-3.5 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-white/[0.02] cursor-pointer transition-colors ${!n.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{n.message}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="relative ml-2">
          <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-3 p-1.5 pr-3 rounded-2xl border border-transparent hover:border-gray-200/50 dark:hover:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
             <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm border border-white/10">
              {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
            </div>
            <div className="hidden md:flex flex-col items-start pr-1">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 leading-tight">{user?.name || 'User'}</span>
              <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 capitalize leading-tight mt-0.5">{user?.role || 'candidate'}</span>
            </div>
            <ChevronDown size={14} className="hidden md:block text-gray-400 ml-1" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl shadow-gray-200/20 dark:shadow-black/40 border border-gray-100 dark:border-gray-800 overflow-hidden z-50 p-1.5">
              <div className="px-4 py-3 mb-1 bg-gray-50 dark:bg-white/5 rounded-xl">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user?.email}</p>
              </div>
              <button onClick={() => { setProfileOpen(false); navigate(user?.role === 'recruiter' ? '/recruiter/settings' : '/candidate/profile'); }} className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                <User size={16} className="text-gray-400" /> Account Settings
              </button>
              <div className="h-px bg-gray-100 dark:bg-gray-800 my-1 mx-2" />
              <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -bottom-2.5 h-5 w-40 -translate-x-1/2 rounded-b-full bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
      />
    </nav>
  );
};
