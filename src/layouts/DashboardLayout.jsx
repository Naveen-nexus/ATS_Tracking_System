import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="h-screen w-screen bg-[#18181b] flex p-3 md:p-4 text-gray-900 overflow-hidden font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64 bg-[#f3f4f6] dark:bg-[#121212] rounded-[32px] overflow-hidden transition-all duration-300 shadow-2xl relative">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
        <main className="flex-1 px-6 pb-6 md:px-10 md:pb-10 overflow-auto scrollbar-hide">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
