import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import { usePdfGenerator } from '@/hooks/usePdfGenerator';
import { questions, painTriggers } from '@/data/questions';
import Layout from '@/components/Layout';
import ScoreWidget from '@/components/ScoreWidget';
import {
  AlertTriangle, ArrowRight, TrendingDown, RefreshCw, Crown,
  Loader2, Download, CheckCircle2, ShieldCheck, ChevronDown,
  ArrowLeft, Terminal as TermIcon, Copy, Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie,
} from 'recharts';

const cliFixes: Record<number, string> = {
  1:  "aws sso-admin create-account-assignment --instance-arn arn:aws:sso:::instance/ssoins-1234 --target-id 999999999 --target-type AWS_ACCOUNT",
  2:  "aws iam enable-mfa-device --user-name admin --serial-number arn:aws:iam::1234:mfa/admin --authentication-code-1 123456 --authentication-code-2 789012",
  3:  "gcloud iam service-accounts disable disabled-employee@acme.iam.gserviceaccount.com",
  4:  "aws iam generate-credential-report && aws iam get-credential-report",
  5:  "aws iam update-account-password-policy --minimum-password-length 14 --require-symbols --require-numbers",
  6:  "aws iam update-access-key --access-key-id AKIAIOSFODNN7EXAMPLE --status Inactive",
  7:  "trivy repo https://github.com/acme/project-api",
  8:  "npm audit --audit-level=high",
  9:  "terraform workspace select production && terraform apply",
  10: "aws cloudtrail create-trail --name security-audit-trail --s3-bucket-name acme-audit-logs && aws cloudtrail start-logging --name security-audit-trail",
  11: "aws rds modify-db-instance --db-instance-identifier prod-db --storage-encrypted --apply-immediately",
  12: "certbot --nginx -d api.acme.com --redirect --hsts",
  13: "aws backup start-backup-job --backup-vault-name production-vault --resource-arn arn:aws:rds:us-east-1:1234:db:prod-db",
  14: "npm install @audit/vendor-scanner && npx vendor-scanner --check-soc2",
  15: "npx incident-cli trigger --severity SEV-1 --channel #incidents-prod",
};

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  const v = payload[0].value;
  return (
    <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-lg text-xs text-left">
      <p className="font-semibold text-slate-500 mb-1">{payload[0].name || payload[0].payload.name}</p>
      <p className="font-black text-slate-800">{v > 100 ? `$${v.toLocaleString()}` : `${v}%`}</p>
    </div>
  );
};

const Score: React.FC = () => {
  const navigate = useNavigate();
  const { calculateScore, calculateMoneyAtRisk, resetAssessment, state } = useAssessment();
  const { isGenerating, generateFreePdf, generatePremiumPdf } = usePdfGenerator();
  const [copiedId, setCopiedId]         = useState<number | null>(null);
  const [expandedId, setExpandedId]     = useState<number | null>(null);

  const score        = calculateScore();
  const moneyAtRisk  = calculateMoneyAtRisk();

  const handleFreePdf    = async () => { toast.info('Generating...'); await generateFreePdf();    toast.success('Downloaded!'); };
  const handlePremiumPdf = async () => { toast.info('Preparing...'); await generatePremiumPdf(); toast.success('Downloaded!'); };
  const scrollToGaps     = () => document.getElementById('gaps-section')?.scrollIntoView({ behavior: 'smooth' });

  const TIER_1_2 = [1, 2, 6, 9, 13, 3, 5, 8, 11, 15];
  const gaps = questions.filter((q, i) => TIER_1_2.includes(q.id) && state.answers[i] === 'no');

  const copy = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success('Copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const iA = [0,1,2,3,4].map(i => state.answers[i]);
  const iS = Math.round((iA.filter(a => a === 'yes').length / 5) * 100);
  const nA = [5,6,7,8,9].map(i => state.answers[i]);
  const nS = Math.round((nA.filter(a => a === 'yes').length / 5) * 100);
  const dA = [10,11,12,13,14].map(i => state.answers[i]);
  const dS = Math.round((dA.filter(a => a === 'yes').length / 5) * 100);

  const bars = [
    { name: 'Identity & Access', Score: iS, fill: '#5d32e0' },
    { name: 'Infrastructure',    Score: nS, fill: '#7c3aed' },
    { name: 'Data Protection',   Score: dS, fill: '#059669' },
  ];

  const noI = iA.filter(a => a === 'no').length;
  const noN = nA.filter(a => a === 'no').length;
  const noD = dA.filter(a => a === 'no').length;
  const tot = noI + noN + noD || 1;

  const pies = [
    { name: 'Identity',         value: Math.round((noI / tot) * moneyAtRisk) || 1, fill: '#dc2626' },
    { name: 'Infrastructure',   value: Math.round((noN / tot) * moneyAtRisk) || 1, fill: '#7c3aed' },
    { name: 'Data Protection',  value: Math.round((noD / tot) * moneyAtRisk) || 1, fill: '#d97706' },
  ].filter(d => d.value > 1 || tot === 1);

  return (
    <Layout
      currentStep={4}
      headerLeft={(
        <button
          onClick={() => { resetAssessment(); navigate('/'); }}
          className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-slate-800 bg-white border border-slate-200 hover:border-slate-300 px-3.5 py-2 rounded-xl transition-all duration-150"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Exit
        </button>
      )}
      headerRight={(
        <button
          onClick={() => { resetAssessment(); navigate('/'); }}
          className="flex items-center gap-2 text-[12px] font-semibold text-slate-500 hover:text-red-600 bg-white border border-slate-200 hover:border-red-200 px-3.5 py-2 rounded-xl transition-all duration-150"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Restart
        </button>
      )}
    >
      <div className="max-w-6xl mx-auto px-6 anim-fade-up">

        {/* ── HERO ──────────────────────────────────── */}
        <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center w-full">

            {/* Gauge */}
            <div className="flex justify-center">
              <ScoreWidget score={score} variant="hero" />
            </div>

            {/* Impact card */}
            <div className="card p-8 lg:p-10 text-left">
              <p className="eyebrow mb-5">Revenue Vulnerability</p>
              <h2 className="text-[60px] md:text-[72px] font-black text-red-600 tracking-tight leading-none mb-2">
                ${moneyAtRisk.toLocaleString()}
              </h2>
              <p className="text-[14px] text-slate-500 leading-relaxed mb-7">
                Critical failures identified in your architecture will likely block{' '}
                <span className="font-bold text-slate-800">${state.companyInfo.dealSize.toLocaleString()}</span>{' '}
                enterprise deals during InfoSec review.
              </p>

              {/* Mini stats */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Readiness Score',  val: `${score}%`,       color: score >= 80 ? 'text-emerald-700' : score >= 60 ? 'text-amber-700' : 'text-red-600' },
                  { label: 'Failed Controls',  val: `${gaps.length}`,   color: gaps.length === 0 ? 'text-emerald-700' : 'text-red-600' },
                  { label: 'Deal Size',         val: `$${state.companyInfo.dealSize.toLocaleString()}`, color: 'text-slate-800' },
                  { label: 'Framework',         val: state.framework?.toUpperCase() || '—', color: 'text-violet-700' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 rounded-xl border border-slate-200 p-3.5">
                    <p className="eyebrow mb-1">{s.label}</p>
                    <p className={cn('text-[18px] font-black', s.color)}>{s.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <button
            onClick={scrollToGaps}
            className="mt-16 flex flex-col items-center gap-1.5 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span className="eyebrow">View deficiencies</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </section>

        {/* ── CHARTS ──────────────────────────────────── */}
        <section className="py-20 border-t border-slate-100">
          <p className="eyebrow mb-3">Analysis</p>
          <h3 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-14">Compliance Dashboard</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-600">Score by Domain</h4>
              </div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={bars} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                    <Bar dataKey="Score" radius={[4, 4, 0, 0]} barSize={32}>
                      {bars.map((e, i) => <Cell key={i} fill={e.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie chart */}
            <div className="card p-6 md:p-8">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-600">Risk Allocation</h4>
              </div>
              <div className="h-[220px] flex items-center">
                <div className="w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={pies} cx="50%" cy="50%" innerRadius={52} outerRadius={72} paddingAngle={3} dataKey="value">
                        {pies.map((e, i) => <Cell key={i} fill={e.fill} />)}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 space-y-4 pl-4">
                  {pies.map((p, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: p.fill }} />
                      <div>
                        <p className="eyebrow text-[9px] mb-0.5">{p.name}</p>
                        <p className="text-[14px] font-black text-slate-800">${p.value.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── GAPS ──────────────────────────────────────── */}
        <section id="gaps-section" className="py-20 scroll-mt-20 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 pb-6 border-b border-slate-100 gap-4">
            <div>
              <p className="eyebrow mb-3">Control Failures</p>
              <h3 className="text-[32px] md:text-[40px] font-black text-slate-900">Audit Deficiencies</h3>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-700 text-[11px] font-bold uppercase tracking-wider border border-red-200">
              <ShieldCheck className="w-4 h-4" />
              {gaps.length} failed
            </span>
          </div>

          <div className="space-y-3">
            {gaps.length > 0 ? gaps.map((gap, idx) => {
              const open = expandedId === gap.id;
              const pain = painTriggers[`q${gap.id}`]?.(state.companyInfo.dealSize) ?? null;
              const cli  = cliFixes[gap.id];

              return (
                <div key={gap.id} className={cn('card overflow-hidden transition-all duration-200', open ? 'border-slate-300' : '')}>
                  <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 text-left">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0 text-red-600 font-black text-[13px]">
                        {String(idx + 1).padStart(2, '0')}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="eyebrow text-red-600 text-[9px]">Deficiency</span>
                          <span className="eyebrow text-[9px]">· {gap.category}</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-slate-800 leading-snug">{gap.text}</h4>
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedId(open ? null : gap.id)}
                      className={cn(
                        'h-9 px-4 rounded-xl text-[11px] font-semibold border transition-all flex items-center gap-2 shrink-0',
                        open ? 'border-slate-300 bg-slate-50 text-slate-700' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                      )}
                    >
                      {open ? 'Collapse' : 'Review impact'}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform duration-200', open && 'rotate-180')} />
                    </button>
                  </div>

                  {open && (
                    <div className="border-t border-slate-100 bg-slate-50/60 anim-scale-in">
                      <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Why it fails */}
                        <div>
                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 pb-3 mb-4 border-b border-red-100">
                            <AlertTriangle className="w-3.5 h-3.5" /> Why this fails audits
                          </h5>
                          <p className="text-[13px] text-slate-500 leading-relaxed mb-4">
                            {pain?.message ?? "This represents a critical failure to implement baseline security requirements mandated by enterprise-grade frameworks."}
                          </p>
                          {pain?.impact && (
                            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200">
                              <p className="text-[12px] text-red-700 font-semibold leading-relaxed">{pain.impact}</p>
                            </div>
                          )}
                        </div>

                        {/* Remediation */}
                        <div>
                          <h5 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-700 pb-3 mb-4 border-b border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Recommended remediation
                          </h5>
                          <ul className="space-y-3 mb-5">
                            {[
                              "Deploy enforcement controls within 30 days.",
                              "Standardize policy documentation for this control.",
                              "Automate evidence generation for continuous compliance.",
                            ].map((step, si) => (
                              <li key={si} className="flex items-start gap-3">
                                <span className="w-5 h-5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black text-emerald-700">
                                  {si + 1}
                                </span>
                                <span className="text-[13px] text-slate-500 leading-snug">{step}</span>
                              </li>
                            ))}
                          </ul>

                          {cli && (
                            <div>
                              <p className="eyebrow mb-2 flex items-center gap-1.5 text-[9px]">
                                <TermIcon className="w-3 h-3 text-violet-600" /> CLI Fix
                              </p>
                              <div className="bg-slate-900 text-slate-300 p-3.5 rounded-xl font-mono text-[11px] flex items-center justify-between gap-3 border border-slate-800">
                                <span className="truncate select-all">{cli}</span>
                                <button
                                  onClick={() => copy(cli, gap.id)}
                                  className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors shrink-0"
                                >
                                  {copiedId === gap.id
                                    ? <Check className="w-3.5 h-3.5 text-emerald-400" />
                                    : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }) : (
              <div className="card py-16 text-center border-l-4 border-l-emerald-500">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="text-[18px] font-black text-slate-800 mb-2">No critical gaps found</h4>
                <p className="text-[13px] text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Your current controls meet technical audit standard expectations.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ── DOWNLOADS ─────────────────────────────────── */}
        <section className="py-20 border-t border-slate-100">
          <p className="eyebrow mb-3">Deliverables</p>
          <h3 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-14">Download Your Reports</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
            {/* Free */}
            <div className="card p-8 flex flex-col justify-between text-left">
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                  <Download className="w-4.5 h-4.5 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800 mb-1">Executive Audit Summary</h3>
                  <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider">Complimentary</p>
                </div>
                <ul className="space-y-3">
                  {['Readiness benchmark metrics', 'Critical pipeline blockers', 'Strategic overview roadmap'].map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-500">
                      <CheckCircle2 className="w-4 h-4 text-slate-400 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handleFreePdf} disabled={isGenerating}
                className="mt-7 h-11 w-full rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-[12px] font-semibold text-slate-600 flex items-center justify-center gap-2 transition-all"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Download summary</>}
              </button>
            </div>

            {/* Premium */}
            <div className="card p-8 flex flex-col justify-between text-left relative border-violet-200/60">
              <span className="absolute top-5 right-5 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-slate-900 text-white">
                Recommended
              </span>
              <div className="space-y-5">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-center">
                  <Crown className="w-4.5 h-4.5 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-[16px] font-bold text-slate-800 mb-1">Remediation Blueprint</h3>
                  <p className="text-[11px] font-semibold text-violet-600 uppercase tracking-wider">Full Assessment Package</p>
                </div>
                <ul className="space-y-3">
                  {['Technical discovery log', 'Step-by-step fixes per control', 'Framework-to-control criteria map', 'Engineering priority checklist'].map((p, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-[13px] text-slate-600">
                      <ShieldCheck className="w-4 h-4 text-violet-500 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                onClick={handlePremiumPdf} disabled={isGenerating}
                className="btn-primary mt-7 w-full h-11 text-[12px]"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Download className="w-4 h-4" /> Download blueprint</>}
              </button>
            </div>
          </div>

          {/* Consultation CTA */}
          <div className="mt-6 max-w-4xl">
            <div className="card p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 text-left">
              <div className="flex-1">
                <p className="eyebrow mb-2">Compliance Partnership</p>
                <h3 className="text-[18px] font-bold text-slate-800 mb-1.5">Readiness Concierge Consultation</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed max-w-lg">
                  Our team works with your engineers to implement every control — saving 100+ audit hours.
                </p>
              </div>
              <button
                onClick={() => window.open('https://calendar.app.google/ExhxfcYvbV5PKMs36', '_blank')}
                className="btn-primary shrink-0 h-11 text-[12px]"
              >
                Book consultation <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Score;
