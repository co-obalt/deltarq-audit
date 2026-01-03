import React from 'react';
import { cn } from '@/lib/utils';
import StepIndicator from './StepIndicator';
import logo from '../logo.png';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  currentStep?: number;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, className, currentStep, headerLeft, headerRight }) => {
  return (
    <div className={cn("min-h-screen flex flex-col bg-[#0A0A0A]", className)}>
      {/* 1. TRUST HEADER (TOP NOTIFICATION BAR) */}
      <div className="fixed top-0 w-full z-[110] bg-[#0A0A0A] border-b border-white/5 h-10 flex items-center justify-center">
        <p className="text-[13px] font-medium text-emerald-400 tracking-wide">
          Join 142+ founders closing enterprise deals faster with DeltaRQ.
        </p>
      </div>

      {/* 2. GLOBAL NAVIGATION & PROGRESS SYNC */}
      <div className="fixed top-10 w-full z-[100] bg-background/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto relative px-4 flex items-center justify-between h-16 md:h-20">
          {/* Left Slot (e.g. Logo/Back button) */}
          <div className="w-auto flex justify-start z-50">
            {headerLeft || (
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => window.location.href = '/'}>
                <img src={logo} alt="DeltaRQ Logo" className="h-8 md:h-9 w-auto object-contain" />
                <span className="text-[14px] font-black uppercase tracking-[0.2em] text-white">Deltarq</span>
              </div>
            )}
          </div>

          {/* SYNCED PROGRESS BAR (LOCKED) */}
          <div className="absolute left-1/2 -translate-x-1/2 w-full max-w-[200px] sm:max-w-sm md:max-w-lg pointer-events-none">
            <StepIndicator currentStep={currentStep || 1} className="bg-transparent border-none" />
          </div>

          {/* Right Slot (e.g. Profile/Exit) */}
          <div className="w-24 md:w-32 flex justify-end z-50 items-center text-right">
            {headerRight}
          </div>
        </div>
      </div>

      <main className={cn("flex-1 pt-28 md:pt-32", className)}>
        {children}
      </main>

      <footer className="border-t border-white/5 py-12 bg-black">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-4 mb-4">
              <img src={logo} alt="DeltaRQ" className="h-6 w-auto object-contain" />
              <span className="text-[12px] font-black uppercase tracking-[0.2em] text-white">Deltarq</span>
            </div>
            <p className="text-[11px] text-muted-foreground/40 font-bold tracking-widest uppercase">
              © 2026 DeltaRQ. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-8 text-[11px] font-bold text-muted-foreground/40 uppercase tracking-widest">
            <a href="#" className="hover:text-emerald-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
