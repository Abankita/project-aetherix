import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '@/components/navigation/PublicHeader';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F5] dark:bg-[#0B1118] text-[#191A1F] dark:text-[#F3F6F8] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-200 m-0 p-0 relative">
      <PublicHeader />
      <main className="flex-1 w-full m-0 p-0 relative">
        <Outlet />
      </main>
    </div>
  );
};
