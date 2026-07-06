import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useAssessment, initialState } from '@/context/AssessmentContext';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  FileText,
  Clock,
  AlertCircle,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import samplePdf from '../alphatech-DeltaRQ-Full-Report.pdf';
import { FAQ } from '@/components/FAQ';

/* ─────────────────────────────────────────────────────
   STATIC PRODUCT VISUAL — professional, no animation
   ───────────────────────────────────────────────────── */
const ProductVisual: React.FC = () => {
  const domains = [
    { label: 'Identity & Access',     pct: 89, pass: 4, fail: 1 },
    { label: 'Infrastructure',        pct: 60, pass: 3, fail: 2 },
    { label: 'Data Protection',       pct: 75, pass: 3, fail: 2 },
  ];

  const controls = [
    { name: 'Single Sign-On',              status: 'pass' },
    { name: 'Multi-Factor Authentication', status: 'pass' },
    { name: 'Audit Log Retention',         status: 'pass' },
    { name: 'Encrypted Backups',           status: 'fail' },
    { name: 'Vulnerability Scanning',      status: 'fail' },
  ];

  return (
    <div className="w-full max-w-[400px] bg-white rounded-2xl border border-slate-200 overflow-hidden"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)' }}>

      {/* Window chrome */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
        </div>
        <div className="flex-1 bg-white rounded-md border border-slate-200 px-3 py-1 mx-4">
          <span className="text-[10px] text-slate-400 font-mono">app.deltarq.com/score</span>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Overall Readiness</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">74%</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Moderate Risk</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-0.5">Revenue at Risk</p>
            <span className="text-2xl font-black text-red-600">$540k</span>
          </div>
        </div>

        {/* Domain bars */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Domain Scores</p>
          {domains.map(d => (
            <div key={d.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-[12px] font-semibold text-slate-600">{d.label}</span>
                <span className="text-[12px] font-bold text-slate-700">{d.pct}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${d.pct}%`,
                    background: d.pct >= 80 ? '#059669' : d.pct >= 65 ? '#d97706' : '#dc2626',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Controls list */}
        <div className="space-y-1.5 border-t border-slate-100 pt-4">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-2">Security Controls</p>
          {controls.map(c => (
            <div key={c.name}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100">
              <span className="text-[12px] font-medium text-slate-600">{c.name}</span>
              {c.status === 'pass' ? (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">Pass</span>
              ) : (
                <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">Fail</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────
   LANDING PAGE
   ───────────────────────────────────────────────────── */
const Landing: React.FC = () => {
  const navigate = useNavigate();
  const {
    state, history, calculateScore, resumeSession,
    resetAssessment, setIpAddress, syncAuditToSupabase,
  } = useAssessment();

  useEffect(() => {
    const initLead = async () => {
      let currentIp = state.ip_address;
      if (!currentIp) {
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          if (res.ok) { const d = await res.json(); currentIp = d.ip; setIpAddress(d.ip); }
        } catch { /* silent */ }
      }

      let finalAuditId = state.audit_id;
      if (!finalAuditId) {
        const saved = localStorage.getItem('assessmentState');
        const parsed = saved ? JSON.parse(saved) : null;
        if (!parsed?.audit_id) {
          finalAuditId = crypto.randomUUID();
          resumeSession({ ...initialState, id: Math.random().toString(36).substr(2, 9), audit_id: finalAuditId, ip_address: currentIp });
        } else {
          finalAuditId = parsed.audit_id;
          try {
            const { data, error } = await supabase.from('audits').select('*').eq('audit_id', finalAuditId).single();
            if (data && !error) {
              resumeSession({
                ...state,
                audit_id: data.audit_id,
                framework: data.framework,
                companyInfo: { companyName: data.company_name || '', industry: data.industry || '', role: data.user_role || '', dealSize: Number(data.deal_size) || 50000, phone: data.phone || '' },
                email: data.email || '',
                answers: data.answers || Array(15).fill(null),
                ip_address: data.ip_address || currentIp,
              });
            }
          } catch { /* silent */ }
        }
      }
      if (finalAuditId) syncAuditToSupabase({ ...state, audit_id: finalAuditId, ip_address: currentIp });
    };
    initLead();
  }, []);

  const activeSessions = [...history]
    .filter(s => s.framework !== null)
    .sort((a, b) => (new Date(b.lastModified || 0).getTime()) - (new Date(a.lastModified || 0).getTime()));

  const handleResume = (session: typeof state) => {
    resumeSession(session);
    if (!session.framework) navigate('/framework');
    else if (!session.companyInfo.companyName) navigate('/company-info');
    else navigate('/questions');
  };

  return (
    <Layout currentStep={0} className="page-bg">
      <div className="max-w-6xl mx-auto px-6">

        {/* ── HERO ──────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center pt-20 md:pt-28 pb-28">

          {/* Copy */}
          <div className="anim-fade-up">
            <div className="inline-flex items-center gap-2 mb-7 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-500 text-[11px] font-semibold">
              <span className="dot-active" />
              Enterprise Compliance Scanner
            </div>

            <h1 className="text-[44px] md:text-[60px] font-black text-slate-900 mb-6 leading-none">
              Your next big deal<br />
              is stuck in <span className="text-brand">security review.</span>
            </h1>

            <p className="text-[17px] text-slate-500 mb-10 max-w-[460px] leading-relaxed">
              DeltaRQ surfaces the compliance gaps that stall enterprise
              deals — and tells you exactly how to fix them, in minutes.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                id="hero-cta-primary"
                onClick={() => { resetAssessment(); navigate('/framework'); }}
                className="btn-primary"
              >
                Run Free Scan
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-cta-pdf"
                onClick={() => {
                  const l = document.createElement('a');
                  l.href = samplePdf;
                  l.download = 'DeltaRQ-Sample-Report.pdf';
                  l.click();
                }}
                className="btn-ghost"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                Sample Report
              </button>
            </div>

            <p className="text-[12px] text-slate-400 font-medium">
              Free · No credit card · 5-minute assessment
            </p>
          </div>

          {/* Product visual */}
          <div className="flex justify-center lg:justify-end anim-fade-in" style={{ animationDelay: '0.15s' }}>
            <ProductVisual />
          </div>
        </section>

        {/* ── RESUME BANNER ──────────────────────────────── */}
        {activeSessions.length > 0 && (
          <div className="mb-20 anim-fade-in">
            <div className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-l-4 border-l-violet-600">
              {activeSessions.slice(0, 1).map((session, idx) => {
                const sessionScore = calculateScore(session.answers);
                const date = session.lastModified
                  ? new Date(session.lastModified).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                  : '';
                return (
                  <React.Fragment key={session.id || idx}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="eyebrow mb-0.5">Resume session</p>
                        <p className="text-[14px] font-bold text-slate-800">
                          {session.framework?.toUpperCase()} audit
                          <span className="font-normal text-slate-400 ml-2 text-[12px]">{date}</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-5 sm:ml-auto">
                      <div>
                        <p className="eyebrow mb-0.5">Progress</p>
                        <p className="text-[14px] font-bold text-violet-600">{sessionScore}% complete</p>
                      </div>
                      <button
                        onClick={() => handleResume(session)}
                        className="btn-primary py-0 h-10 px-5 text-[12px]"
                      >
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        )}

        {/* ── RISK STATS ─────────────────────────────────── */}
        <section className="mb-24 border-t border-slate-100 pt-20">
          <p className="eyebrow mb-4">Why this matters</p>
          <h2 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-14 max-w-xl">
            Enterprise deals die quietly in compliance review.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: AlertCircle,
                value: '67%',
                label: 'of enterprise deals stall at security review',
                note: 'Source: Gartner B2B Sales Research',
                color: 'text-red-600',
                iconBg: 'bg-red-50 border-red-100 text-red-500',
              },
              {
                icon: Clock,
                value: '4–6 mo',
                label: 'average delay without SOC 2 certification',
                note: 'Costs $80–200k in delayed ARR',
                color: 'text-amber-700',
                iconBg: 'bg-amber-50 border-amber-100 text-amber-600',
              },
              {
                icon: TrendingUp,
                value: '$250K',
                label: 'ARR put at risk per discovered security gap',
                note: 'Per our proprietary assessment model',
                color: 'text-violet-700',
                iconBg: 'bg-violet-50 border-violet-100 text-violet-600',
              },
            ].map((s, i) => (
              <div key={i} className="card p-7 text-left">
                <div className={cn('w-10 h-10 rounded-xl border flex items-center justify-center mb-6', s.iconBg)}>
                  <s.icon className="w-4.5 h-4.5" />
                </div>
                <p className="eyebrow mb-2">Metric 0{i + 1}</p>
                <h3 className={cn('text-[36px] font-black tracking-tight mb-2', s.color)}>{s.value}</h3>
                <p className="text-[14px] text-slate-600 leading-relaxed mb-3">{s.label}</p>
                <p className="text-[11px] text-slate-400 font-medium">{s.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── SERVICES ────────────────────────────────────── */}
        <section className="mb-24 border-t border-slate-100 pt-20">
          <p className="eyebrow mb-4">What we offer</p>
          <h2 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-14 max-w-lg">
            Beyond the scan — full compliance engineering.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'SOC 2 Readiness Program',
                price: '$4,999',
                desc: 'End-to-end audit prep — roadmap, evidence collection, and auditor communication handled for you.',
                tag: 'Most popular',
                tagColor: 'bg-violet-600 text-white',
              },
              {
                icon: FileText,
                title: 'Policy & Document Templates',
                desc: 'Audit-vetted policies for InfoSec, Access Control, and Disaster Recovery. Fill, sign, and submit.',
              },
              {
                icon: Shield,
                title: 'Lead Auditor Consultation',
                desc: 'Direct 1:1 sessions to close complex technical gaps. Book a strategy call with our senior team.',
                cta: 'Book a call',
              },
            ].map((svc, i) => (
              <div key={i} className="card p-7 text-left flex flex-col">
                {svc.tag && (
                  <span className={cn('self-start text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md mb-5', svc.tagColor)}>
                    {svc.tag}
                  </span>
                )}
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center mb-5 text-slate-500">
                  <svc.icon className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-[16px] font-bold text-slate-800 mb-1 leading-snug">{svc.title}</h3>
                {svc.price && <p className="text-[11px] font-semibold text-violet-600 mb-3">{svc.price}</p>}
                <p className="text-[13px] text-slate-500 leading-relaxed flex-1">{svc.desc}</p>
                {svc.cta && (
                  <button
                    onClick={() => window.open('https://calendar.app.google/ExhxfcYvbV5PKMs36', '_blank')}
                    className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-violet-600 hover:text-violet-700 transition-colors"
                  >
                    {svc.cta} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ── ABOUT ───────────────────────────────────────── */}
        <section className="mb-24 border-t border-slate-100 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="eyebrow mb-4">About DeltaRQ</p>
              <h2 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-8">
                We close the gap between engineering and sales.
              </h2>
              <button
                onClick={() => { resetAssessment(); navigate('/framework'); }}
                className="btn-primary"
              >
                Start free scan <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5">
              <p className="text-[15px] text-slate-500 leading-relaxed">
                DeltaRQ helps high-growth startups remove compliance friction so engineers can focus
                on product and sales teams can close $100K+ deals with confidence.
              </p>
              <p className="text-[15px] text-slate-500 leading-relaxed">
                Founded by security auditors and software engineers, we built our scanner to identify
                the exact control failures that enterprise CISOs flag — turning security into a
                sales accelerator, not a blocker.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                {['SOC 2', 'ISO 27001', 'HIPAA', 'Instant PDF Reports', 'Supabase-Backed'].map(f => (
                  <span key={f}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                    <CheckCircle2 className="w-3 h-3 text-violet-500" />
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <FAQ />
      </div>
    </Layout>
  );
};

export default Landing;
