import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScoreWidgetProps {
  score: number;
  delta?: number;
  className?: string;
  variant?: 'sidebar' | 'hero';
}

const ScoreWidget: React.FC<ScoreWidgetProps> = ({ score, delta, className, variant = 'sidebar' }) => {
  const [animated, setAnimated] = useState(59);
  const [showDelta, setShowDelta] = useState(false);
  const [lastDelta, setLastDelta] = useState(0);

  const isHero = variant === 'hero';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  useEffect(() => {
    if (delta && delta !== 0) {
      setLastDelta(delta);
      setShowDelta(true);
      const t = setTimeout(() => setShowDelta(false), 3000);
      return () => clearTimeout(t);
    }
  }, [delta]);

  // Color logic — no neon, no blue
  const getColor = (s: number) => {
    if (s <= 40) return { stroke: '#dc2626', text: 'text-red-600' };
    if (s <= 70) return { stroke: '#d97706', text: 'text-amber-600' };
    return { stroke: '#059669', text: 'text-emerald-700' };
  };

  const { stroke, text } = getColor(animated);
  const CIRCUMFERENCE = 251.32;
  const offset = CIRCUMFERENCE * (1 - animated / 100);

  const grade =
    animated <= 40 ? 'Critical Risk' :
    animated <= 70 ? 'Moderate Risk' :
    'High Readiness';

  const gradeBg =
    animated <= 40 ? 'bg-red-50 border-red-200 text-red-700' :
    animated <= 70 ? 'bg-amber-50 border-amber-200 text-amber-700' :
    'bg-emerald-50 border-emerald-200 text-emerald-700';

  if (isHero) {
    return (
      <div className="flex flex-col items-center">
        {/* Large gauge */}
        <div className="relative w-[280px] h-[160px]">
          <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
            {/* Track */}
            <path d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
            {/* Active */}
            <path d="M 20 95 A 80 80 0 0 1 180 95"
              fill="none"
              stroke={stroke}
              strokeWidth="10"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1), stroke 0.8s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-3">
            <span className={cn('text-[72px] font-black tracking-tight leading-none', text)}
              style={{ transition: 'color 0.8s ease' }}>
              {Math.round(animated)}
            </span>
            <span className="text-[13px] font-semibold text-slate-400 tracking-widest uppercase">/ 100</span>
          </div>
        </div>

        <span className={cn('mt-5 px-4 py-1.5 rounded-full border text-[11px] font-bold uppercase tracking-wider', gradeBg)}>
          {grade}
        </span>
      </div>
    );
  }

  return (
    <div className={cn('p-6 flex flex-col items-center text-center', className)}>
      <div className="relative w-40 h-24 mb-3">
        <svg viewBox="0 0 180 100" className="w-full h-full overflow-visible">
          <path d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none" stroke="#f1f5f9" strokeWidth="8" strokeLinecap="round" />
          <path d="M 10 90 A 80 80 0 0 1 170 90"
            fill="none"
            stroke={stroke}
            strokeWidth="8"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.6s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
          <span className={cn('text-[34px] font-black tracking-tight leading-none', text)}>
            {Math.round(animated)}%
          </span>
          <div className="h-5 mt-1">
            {showDelta ? (
              <span className={cn('text-[11px] font-bold anim-fade-in',
                lastDelta > 0 ? 'text-emerald-600' : 'text-red-600')}>
                {lastDelta > 0 ? `+${lastDelta}` : lastDelta} pts
              </span>
            ) : (
              <span className="eyebrow text-[9px]">
                {animated === 59 ? 'Baseline' : 'Live score'}
              </span>
            )}
          </div>
        </div>
      </div>

      <span className={cn('px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest', gradeBg)}>
        {grade}
      </span>
    </div>
  );
};

export default ScoreWidget;
