import { useState } from 'react';
import { Save, Bell, Shield, User, Briefcase, Mail } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Toggle } from '../../components/ui/Toggle';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

export const RecruiterSettings = () => {
  const { user, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ name: user?.name || 'Demo Recruiter', email: user?.email || 'recruiter@demo.com', company: user?.company || 'Demo Corp', title: 'Senior Recruiter', phone: '+1 (555) 987-6543' });
  const [notifs, setNotifs] = useState({ newApplication: true, statusUpdate: true, weeklyReport: false, marketingEmails: false });

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    updateUser({ name: profile.name, email: profile.email, company: profile.company });
    setSaving(false);
    toast.success('Profile saved successfully!');
  };

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-[40px] font-bold text-black dark:text-white tracking-tight leading-none mb-2">Settings</h1>
        <p className="text-[15px] font-medium text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile Information */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-6 lg:p-8 flex flex-col shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
             <User size={18} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Profile Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-1.5">
               <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
               <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
               <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Company Name</label>
               <div className="relative">
                  <Briefcase size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
            </div>
             <div className="space-y-1.5">
               <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Job Title</label>
               <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={profile.title} onChange={e => setProfile(p => ({ ...p, title: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Phone Number</label>
               <div className="relative">
                  <Bell size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
            </div>
        </div>
        
        <div className="flex">
           <button 
             onClick={handleSave}
             disabled={saving}
             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-70 shadow-sm shadow-blue-600/30"
           >
              <Save size={18} /> {saving ? 'Saving...' : 'Save Profile'}
           </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-6 lg:p-8 flex flex-col shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800/50 pb-6">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
             <Bell size={18} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
        </div>
        
        <div className="space-y-6">
          {[
            { key: 'newApplication', label: 'New Applications', desc: 'Get notified when a candidate applies to your job' },
            { key: 'statusUpdate', label: 'Status Updates', desc: 'Alerts when candidate status changes' },
            { key: 'weeklyReport', label: 'Weekly Reports', desc: 'Receive weekly hiring analytics digest' },
            { key: 'marketingEmails', label: 'Marketing Emails', desc: 'Product updates and feature announcements' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between">
              <div>
                <p className="text-[15px] font-bold text-gray-900 dark:text-white">{n.label}</p>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{n.desc}</p>
              </div>
              <Toggle checked={notifs[n.key]} onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))} />
            </div>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-white dark:bg-[#1e1e1e] rounded-[32px] p-6 lg:p-8 flex flex-col shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
             <Shield size={18} />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Appearance & Security</h2>
        </div>
        
        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-800/50 mb-6">
            <div>
              <p className="text-[15px] font-bold text-gray-900 dark:text-white">Dark Mode</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Toggle dark/light theme across the app</p>
            </div>
            <Toggle checked={isDark} onChange={toggleTheme} label={isDark ? 'Dark' : 'Light'} />
        </div>

        <div className="space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <input type="password" placeholder="Current password" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
               </div>
               <div className="flex gap-4">
                  <input type="password" placeholder="New password" className="w-full px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-white/5 border-transparent focus:border-[#ccff00]/50 focus:bg-white dark:focus:bg-[#1e1e1e] focus:ring-2 focus:ring-[#ccff00]/20 font-medium text-gray-900 dark:text-white transition-all outline-none" />
                  <button onClick={() => toast.success('Password updated!')} className="px-6 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors whitespace-nowrap">
                     Update
                  </button>
               </div>
            </div>
        </div>
      </div>
    </div>
  );
};
