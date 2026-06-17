import React from 'react';
import { cn } from '@/lib/utils';
import StepIndicator from './StepIndicator';
import logo from '../logo.jpeg';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  currentStep?: number;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children, className, currentStep, headerLeft, headerRight }) => {
  return (
    <div className={cn('min-h-screen flex flex-col bg-white', className)}>

      {/* ── NAV ──────────────────────────────────────── */}
      <header
        className="fixed top-0 w-full z-[100] bg-white/90 backdrop-blur-md border-b border-slate-200/80"
        style={{ boxShadow: '0 1px 0 rgba(0,0,0,0.06)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-[60px] flex items-center justify-between gap-4">

          {/* Left */}
          <div className="flex items-center min-w-[120px]">
            {headerLeft || (
              <button
                onClick={() => window.location.href = '/'}
                className="flex items-center gap-2 group"
              >
                <img
                  src={logo}
                  alt="DeltaRQ"
                  className="h-7 w-auto object-contain mix-blend-multiply group-hover:opacity-70 transition-opacity duration-200"
                />
              </button>
            )}
          </div>

          {/* Center — step progress */}
          <div className="absolute left-1/2 -translate-x-1/2 max-w-[200px] sm:max-w-sm md:max-w-md w-full pointer-events-none">
            {currentStep !== undefined && currentStep > 0 && (
              <StepIndicator currentStep={currentStep} />
            )}
          </div>

          {/* Right */}
          <div className="flex items-center justify-end min-w-[120px]">
            {headerRight}
          </div>
        </div>
      </header>

      {/* ── MAIN ──────────────────────────────────────── */}
      <main className={cn('flex-grow pt-[60px] flex flex-col relative z-10', className)}>
        {children}
      </main>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className="border-t border-slate-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <img
              src={logo}
              alt="DeltaRQ"
              className="h-5 w-auto object-contain mix-blend-multiply opacity-70"
            />
            <span className="text-slate-300 mx-1">·</span>
            <span className="text-[12px] text-slate-400">
              © {new Date().getFullYear()} All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-5 text-[12px] text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
