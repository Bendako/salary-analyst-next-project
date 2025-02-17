// app/components/layout/MainLayout.tsx
"use client";

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const handleToggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={handleToggleSidebar} />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={cn(
          "flex-1 overflow-y-auto p-4 transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-20"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;