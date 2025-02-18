"use client";

import React from 'react';
import Link from 'next/link';
import { Menu, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
      <div className="flex h-full items-center px-4 relative">
        {/* Left section - Mobile menu and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="md:hidden"
            aria-label="Toggle navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <LineChart className="h-6 w-6 text-primary" aria-hidden="true" />
            <div className="flex flex-col">
              <h1 className="hidden md:block text-xl font-semibold">
                Income Source Analyst
              </h1>
              <h1 className="md:hidden text-lg font-semibold">
                ISA
              </h1>
            </div>
          </Link>
        </div>

        {/* Center section - Theme toggle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};