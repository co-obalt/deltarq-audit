import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { questions, painTriggers, frameworkCompliance } from '@/data/questions';
import Layout from '@/components/Layout';
import ScoreWidget from '@/components/ScoreWidget';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  RefreshCw,
  Crown,
  Loader2,
  Download,
  CheckCircle2,
  ShieldCheck,
  ChevronDown,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Score: React.FC = () => {
  const navigate = useNavigate();
  const { calculateScore, calculateMoneyAtRisk, resetAssessment, state } = useAssessment();
  const { isGenerating, generateFreePdf, generatePremiumPdf, error } = usePdfGenerator();

  const score = calculateScore();
  const moneyAtRisk = calculateMoneyAtRisk();

  // Navigation Logic
  const handleBackToDashboard = () => {
    resetAssessment(); // Clear state as requested for "Clean" button
    navigate('/');
  };

  const handleRestart = () => {
    resetAssessment(); // Full wipe
    navigate('/');
  };

  const handleFreePdf = async () => {
    toast.info('Generating summary...');
    await generateFreePdf();
    toast.success('Summary downloaded!');
  };

  const handlePremiumPdf = async () => {
    toast.info('Preparing roadmap...');
    await generatePremiumPdf();
    toast.success('Roadmap downloaded!');
  };

  const scrollToGaps = () => {
    document.getElementById('gaps-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter Tier 1 & 2 Gaps (Answer = 'NO')
  const TIER_1_2_IDS = [1, 2, 6, 9, 13, 3, 5, 8, 11, 15];
  const criticalGaps = questions.filter((q, idx) =>
    TIER_1_2_IDS.includes(q.id) && state.answers[idx] === 'no'
  );

  const [expandedGapId, setExpandedGapId] = useState<number | null>(null);

  const toggleGap = (id: number) => {
    setExpandedGapId(prev => prev === id ? null : id);
  };

  return (
    <Layout
      currentStep={4}
      headerLeft={(
        <button
          onClick={handleBackToDashboard}
          className="flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-white transition-all bg-white/5 px-3 md:px-4 py-2 rounded-lg border border-white/5 hover:border-white/10"
        >
          <ArrowLeft className="w-3 md:w-4 h-3 md:h-4" />
          <span className="hidden sm:inline">Exit</span>
        </button>
      )}
      headerRight={(
        <button
          onClick={handleRestart}
          className="flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-all bg-rose-500/5 px-3 md:px-4 py-2 rounded-lg border border-rose-500/10 hover:border-rose-500/20"
        >
          <RefreshCw className="w-3 md:w-4 h-3 md:h-4" />
          <span className="hidden sm:inline">Restart</span>
        </button>
      )}
    >
      <div className="container mx-auto px-4 max-w-6xl">

        {/* PHASE 1: HERO VIEW (100VH) */}
        <section className="h-screen flex flex-col items-center justify-center relative snap-start snap-always pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center w-full">

            {/* MATHEMATICAL GAUGE SYNC */}
            <div className="flex justify-center animate-in fade-in duration-1000">
              <ScoreWidget score={score} variant="hero" />
            </div>

            {/* IMPACT HIGHLIGHT */}
            <div className="glass-card p-10 lg:p-14 rounded-[40px] border border-rose-500/30 bg-rose-500/[0.03] relative overflow-hidden shadow-[0_0_80px_rgba(239,68,68,0.1)] animate-in fade-in duration-1000 delay-200">
              <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12">
                <TrendingDown className="w-40 h-40 text-rose-500" />
              </div>
              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <span className="text-rose-500 font-black text-[11px] uppercase tracking-widest leading-none">Security Risk Exposure</span>
                </div>
                <div>
                  <h2 className="text-[64px] font-black text-rose-500 tracking-tighter leading-none mb-2 drop-shadow-sm">
                    ${moneyAtRisk.toLocaleString()}
                  </h2>
                  <p className="text-[20px] font-bold text-white/90">Revenue Vulnerability</p>
                </div>
                <p className="text-muted-foreground/80 text-[16px] leading-[1.6] max-w-sm font-medium">
                  Critical failures identified in your architecture will likely block <span className="text-white font-bold">${state.companyInfo.dealSize.toLocaleString()}</span> enterprise deals during InfoSec review.
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Guide */}
          <div
            onClick={scrollToGaps}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer group animate-bounce"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-emerald-500 transition-colors">Audit Log Below</span>
            <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500" />
          </div>
        </section>

        {/* PHASE 2: CRITICAL GAPS (100VH) */}
        <section id="gaps-section" className="min-h-screen py-32 flex flex-col justify-start snap-start snap-always animate-in fade-in duration-1000 scroll-mt-20">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-white/5 pb-8">
            <div className="space-y-3">
              <span className="text-rose-500 font-black text-[12px] uppercase tracking-widest">Technical Discovery</span>
              <h3 className="text-[40px] font-black tracking-tight">Audit Deficiencies</h3>
            </div>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 text-[13px] font-black uppercase tracking-wider border border-rose-500/20">
              <ShieldCheck className="w-5 h-5" />
              {criticalGaps.length} Failed Controls
            </span>
          </div>

          <div className="space-y-6">
            {criticalGaps.length > 0 ? (
              criticalGaps.map((gap, idx) => {
                const isExpanded = expandedGapId === gap.id;
                const pain = painTriggers[`q${gap.id}`] ? painTriggers[`q${gap.id}`](state.companyInfo.dealSize) : null;

                return (
                  <div
                    key={gap.id}
                    className={cn(
                      "glass-card overflow-hidden rounded-[24px] border transition-all duration-500 group",
                      isExpanded ? "border-rose-500/40 bg-white/[0.04] ring-1 ring-rose-500/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)]" : "border-white/5 hover:border-white/10 bg-white/[0.01]"
                    )}
                  >
                    <div className="p-8 flex items-center justify-between gap-8">
                      <div className="flex items-center gap-8 flex-1">
                        <div className="w-14 h-14 rounded-[18px] bg-rose-500/10 flex items-center justify-center shrink-0 border border-rose-500/20 text-rose-500">
                          <span className="font-mono font-black text-[20px]">{String(idx + 1).padStart(2, '0')}</span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-3">
                            <span className="text-rose-500 font-black text-[11px] uppercase tracking-widest">Audit Deficiency</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-white/10" />
                            <span className="text-muted-foreground/60 font-bold text-[11px] uppercase tracking-widest">{gap.category} Control</span>
                          </div>
                          <h4 className="text-[20px] font-bold text-white leading-tight">{gap.text}</h4>
                        </div>
                      </div>

                      <Button
                        onClick={() => toggleGap(gap.id)}
                        variant="ghost"
                        className={cn(
                          "h-12 px-6 rounded-xl border border-white/5 font-black text-[12px] uppercase tracking-widest transition-all",
                          isExpanded ? "border-rose-500/30 text-rose-500 bg-rose-500/5" : "text-muted-foreground hover:bg-white/5 hover:text-white"
                        )}
                      >
                        {isExpanded ? "Hide Analysis" : "Show Full Analysis"}
                        <ChevronDown className={cn("ml-2 w-4 h-4 transition-transform duration-500", isExpanded && "rotate-180")} />
                      </Button>
                    </div>

                    {/* SMOOTH SLIDE ANALYSIS */}
                    <div className={cn(
                      "grid transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] bg-black/40 border-t border-white/5",
                      isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}>
                      <div className="overflow-hidden">
                        <div className="p-10 grid grid-cols-1 lg:grid-cols-2 gap-16">

                          {/* RISK ANALYSIS */}
                          <div className="space-y-6">
                            <h5 className="flex items-center gap-2.5 text-[12px] font-black uppercase tracking-widest text-rose-500 border-b border-rose-500/20 pb-2">
                              <AlertTriangle className="w-4 h-4" /> Why This Fails Audits
                            </h5>
                            <p className="text-[15px] leading-[1.6] text-muted-foreground/90 font-medium font-inter whitespace-pre-line">
                              {pain ? pain.message : "This represents a critical failure to implement baseline security requirements mandated by enterprise-grade frameworks."}
                            </p>
                            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                              <p className="text-[13px] font-mono text-rose-300 font-bold">
                                {pain?.impact}
                              </p>
                            </div>
                          </div>

                          {/* REMEDIATION */}
                          <div className="space-y-6">
                            <h5 className="flex items-center gap-2.5 text-[12px] font-black uppercase tracking-widest text-emerald-500 border-b border-emerald-500/20 pb-2">
                              <CheckCircle2 className="w-4 h-4" /> Recommended Remediation
                            </h5>
                            <ul className="space-y-5">
                              {[
                                "Deploy technical enforcement controls within 30 days.",
                                "Standardize internal policy documentation for the control.",
                                "Automate evidence generation for continuous compliance."
                              ].map((step, sIdx) => (
                                <li key={sIdx} className="flex items-start gap-4">
                                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                                    <span className="text-[10px] font-black text-emerald-500">{sIdx + 1}</span>
                                  </div>
                                  <span className="text-[15px] font-medium text-white/80 leading-snug font-inter">{step}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-32 text-center glass-card rounded-[40px] border border-emerald-400/20 bg-emerald-400/[0.02] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 animate-pulse">
                  <ShieldCheck className="w-12 h-12 text-emerald-500" />
                </div>
                <h4 className="text-[32px] font-black mb-4 tracking-tight">System Fully Secure</h4>
                <p className="text-muted-foreground text-[18px] max-w-lg mx-auto leading-relaxed">No critical vulnerabilities detected. Your current security posture is ready for professional audit engagement.</p>
              </div>
            )}
          </div>
        </section>

        {/* PHASE 3: CONVERSION (100VH) */}
        <section className="min-h-screen flex flex-col justify-center snap-start snap-always animate-in fade-in duration-1000">
          <div className="text-center mb-16 space-y-4">
            <h3 className="text-[48px] font-black tracking-tighter leading-none">Finalize Your Compliance</h3>
            <p className="text-muted-foreground text-[18px] max-w-xl mx-auto font-medium">Download your board-ready artifacts and start closing enterprise deals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto w-full items-stretch">
            {/* Executive Audit Summary (Free) */}
            <div className="glass-card bg-white/[0.02] border border-white/10 rounded-[32px] p-10 flex flex-col h-full transition-all hover:bg-white/[0.04] hover:border-white/20 shadow-2xl group">
              <div className="mb-10">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 border border-white/10 text-muted-foreground/60 group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="text-[24px] font-bold text-white mb-2">Executive Audit Summary</h3>
                <p className="text-emerald-500 font-black text-[11px] uppercase tracking-widest leading-none">Complimentary Hook</p>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {[
                  "Overall Readiness Score",
                  "Top 3 Critical Deal-Breakers",
                  "High-Level Risk Roadmap"
                ].map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-muted-foreground/40" />
                    </div>
                    <span className="text-[14px] font-medium text-muted-foreground/80 leading-[1.6] font-inter">{point}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handleFreePdf}
                disabled={isGenerating}
                variant="ghost"
                className="w-full h-16 text-[14px] font-black uppercase tracking-widest rounded-2xl border-2 border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : "DOWNLOAD FREE SUMMARY"}
              </Button>
            </div>

            {/* Remediation Blueprint (Paid) */}
            <div className="glass-card bg-emerald-500/[0.03] border border-emerald-500/20 rounded-[32px] p-10 flex flex-col h-full relative group hover:bg-emerald-500/[0.05] hover:border-emerald-500/40 transition-all shadow-[0_0_80px_rgba(16,185,129,0.05)]">
              {/* Expert Choice Badge */}
              <div className="absolute top-6 right-6 px-4 py-1.5 rounded-full bg-emerald-500 text-[#0A0A0A] text-[9px] font-black uppercase tracking-widest shadow-lg transform rotate-3">
                Recomended
              </div>

              <div className="mb-10">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 text-emerald-500 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <Crown className="w-8 h-8" />
                </div>
                <h3 className="text-[24px] font-bold text-emerald-500 mb-2">Full Remediation Blueprint ($49)</h3>
                <p className="text-emerald-500/60 font-black text-[11px] uppercase tracking-widest leading-none">The Complete Solution</p>
              </div>

              <ul className="space-y-6 mb-12 flex-grow">
                {[
                  "Detailed Audit Log",
                  "Step-by-Step Architecture Fixes",
                  "Control Mapping Guide",
                  "Priority Checklist for Engineers"
                ].map((point, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-4">
                    <div className="mt-1 shrink-0">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <span className="text-[14px] font-medium text-white/90 leading-[1.6] font-inter">{point}</span>
                  </li>
                ))}
              </ul>

              <Button
                onClick={handlePremiumPdf}
                disabled={isGenerating}
                className="w-full h-16 text-[14px] font-black uppercase tracking-widest rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0A] shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
              >
                {isGenerating ? <Loader2 className="animate-spin" /> : "UNLOCK FULL BLUEPRINT (49$)"}
              </Button>
            </div>
          </div>

          {/* Audit Readiness Concierge (High-Touch Service) */}
          <div className="mt-12 max-w-6xl mx-auto w-full">
            <div className="glass-card bg-emerald-500/10 border-2 border-emerald-500/30 rounded-[32px] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 group hover:bg-emerald-500/[0.15] transition-all shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Crown className="w-40 h-40 text-emerald-500" />
              </div>
              <div className="relative z-10 space-y-4 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                  Professional Partnership
                </div>
                <h3 className="text-[28px] font-black tracking-tight text-white leading-none">Complete Audit Readiness Concierge</h3>
                <p className="text-muted-foreground text-[16px] max-w-xl font-medium leading-relaxed">
                  Skip the manual effort. Our dedicated engineering team works directly with you to implement every control and bridge every gap. Save 100+ hours of documentation and engineering time.
                </p>
              </div>
              <Button
                onClick={() => window.open('https://calendar.app.google/ExhxfcYvbV5PKMs36', '_blank')}
                className="relative z-10 h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0A] text-[15px] font-black uppercase tracking-widest rounded-2xl shadow-xl transition-all shrink-0 border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
              >
                Book Readiness Consultation
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </section>

        {error && (
          <div className="fixed bottom-10 right-10 p-6 rounded-2xl bg-rose-500 text-white font-black text-[14px] shadow-2xl animate-in slide-in-from-right-10 z-[200] border border-rose-400">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Score;
