import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '@/components/navigation/PublicHeader';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1118] text-[#18191D] dark:text-[#F3F6F8] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200 m-0 p-0">
      <PublicHeader />
      <main className="flex-1 w-full bg-white dark:bg-[#0B1118] m-0 p-0">
        <Outlet />
      </main>
    </div>
  );
};
