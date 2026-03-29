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
    <nav className="h-24 px-6 md:px-10 flex items-center justify-between z-20 sticky top-0 bg-[#f3f4f6]/80 dark:bg-[#121212]/80 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button onClick={onToggleSidebar} className="p-2 -ml-2 text-gray-600 dark:text-gray-400 hover:bg-black/5 hover:dark:bg-white/5 rounded-xl lg:hidden transition-colors">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* User Info (Left side in Flux UI) */}
        <div className="hidden sm:flex items-center gap-3">
           <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm shrink-0">
             <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Lucas Bennett')}&background=c0aede&color=fff`} alt="User" className="w-full h-full object-cover" />
           </div>
           <div>
             <div className="flex items-center gap-1 cursor-pointer" onClick={() => setProfileOpen(!profileOpen)}>
               <h2 className="text-base font-bold text-gray-900 dark:text-white leading-none tracking-tight">{user?.name || 'Lucas Bennett'}</h2>
               <ChevronDown size={14} className="text-gray-500 mt-0.5" />
             </div>
             <p className="text-[13px] font-medium text-gray-500 dark:text-gray-400 mt-1">{user?.email || 'bennet02@gmail.com'}</p>
           </div>
           
           {/* Profile Dropdown */}
           {profileOpen && (
            <div className="absolute top-20 left-10 w-56 bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-800 overflow-hidden z-50 p-2">
              <button onClick={() => { setProfileOpen(false); navigate(user?.role === 'recruiter' ? '/recruiter/settings' : '/candidate/profile'); }} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors">
                <User size={16} className="text-gray-400" /> Account Settings
              </button>
              <button onClick={handleLogout} className="w-full px-4 py-2.5 flex items-center gap-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors mt-1">
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 bg-white dark:bg-[#1e1e1e] rounded-full px-4 py-2.5 w-64 shadow-sm border border-gray-100 dark:border-gray-800 transition-all focus-within:ring-2 focus-within:ring-[#ccff00]/50">
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input placeholder="Search..." className="bg-transparent text-sm font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none w-full" />
        </div>

        <div className="hidden lg:flex items-center gap-4 mr-2">
           <span className="text-[13px] font-semibold text-gray-400">12 July, 2024</span>
           <button className="bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-medium">
              Today <ChevronDown size={14} className="text-gray-400" />
           </button>
        </div>

        <button onClick={toggleTheme} className="hidden sm:block p-3 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="relative">
          <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative p-3 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
            <Bell size={18} />
            {unread > 0 && <span className="absolute top-1 right-1 w-3 h-3 bg-[#ccff00] border-[2.5px] border-white dark:border-[#1e1e1e] rounded-full"></span>}
          </button>
          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-xl shadow-black/10 border border-gray-100 dark:border-gray-800 overflow-hidden z-50">
              <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Notifications</h3>
                <span className="text-[13px] font-medium text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer transition-colors">Clear all</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto scrollbar-hide py-2">
                {notifications.map(n => (
                  <div key={n.id} className={`px-5 py-3 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors ${!n.read ? 'bg-[#ccff00]/5 dark:bg-[#ccff00]/10' : ''}`}>
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{n.message}</p>
                    <p className="text-[11px] font-semibold text-gray-400 mt-1">{n.time}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
