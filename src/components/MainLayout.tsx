import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Footer } from './Footer';

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background-main text-text-primary flex flex-col font-sans">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area offset by desktop sidebar width (250px) */}
      <div className="md:pl-[250px] flex-1 flex flex-col min-h-screen">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 w-full max-w-[1300px] mx-auto p-4 md:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};
