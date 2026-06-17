import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import { questions, frameworkCompliance, painTriggers } from '@/data/questions';
import Layout from '@/components/Layout';
import ScoreWidget from '@/components/ScoreWidget';
import PainTriggerModal from '@/components/PainTriggerModal';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { ArrowRight, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIER_1 = [1, 2, 6, 9, 13];
const TIER_2 = [3, 5, 8, 11, 15];
const TIER_3 = [4, 7, 10, 12, 14];

const domains = [
  { name: 'Identity & Access', short: 'IAM',   ids: [1,2,3,4,5]   },
  { name: 'Infrastructure',    short: 'INFRA',  ids: [6,7,8,9,10]  },
  { name: 'Data Protection',   short: 'DATA',   ids: [11,12,13,14,15] },
];

const fwLabels: Record<string, string> = { soc2: 'SOC 2', iso: 'ISO 27001', hipaa: 'HIPAA' };

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAnswer, setCurrentQuestion, setEmail, calculateScore } = useAssessment();
  const [showPainModal, setShowPainModal]   = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [painTrigger, setPainTrigger]       = useState<ReturnType<typeof painTriggers.q1> | null>(null);
  const [isCompleting, setIsCompleting]     = useState(false);

  const q        = questions[state.currentQuestion];
  const answer   = state.answers[state.currentQuestion];
  const score    = calculateScore();
  const fwKey    = `q${q.id}` as keyof typeof frameworkCompliance;
  const fwInfo   = frameworkCompliance[fwKey]?.[state.framework || 'soc2'];
  const fw       = state.framework || 'soc2';
  const progress = (state.currentQuestion / questions.length) * 100;

  useEffect(() => {
    if (!state.framework) navigate('/framework');
  }, [state.framework, navigate]);

  const handleAnswer = (ans: 'yes' | 'no') => {
    setAnswer(state.currentQuestion, ans);
    if (ans === 'no' && TIER_1.includes(q.id)) {
      const key = `q${q.id}` as keyof typeof painTriggers;
      const trigger = painTriggers[key];
      if (trigger) { setPainTrigger(trigger(state.companyInfo.dealSize)); setShowPainModal(true); }
    }
  };

  const handleNext = () => {
    if (state.currentQuestion === 9 && !state.email) { setShowEmailModal(true); return; }
    if (state.currentQuestion < questions.length - 1) {
      setCurrentQuestion(state.currentQuestion + 1);
    } else {
      setIsCompleting(true);
      setTimeout(() => navigate('/score'), 1200);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    setShowEmailModal(false);
    if (state.currentQuestion < questions.length - 1) setCurrentQuestion(state.currentQuestion + 1);
    else { setIsCompleting(true); setTimeout(() => navigate('/score'), 1200); }
  };

  const getDelta = () => {
    const a = state.answers[state.currentQuestion];
    if (!a) return 0;
    const id = state.currentQuestion + 1;
    if (a === 'no')  return TIER_1.includes(id) ? -12 : TIER_2.includes(id) ? -9 : -7;
    return TIER_1.includes(id) ? 4 : TIER_2.includes(id) ? 3 : 2;
  };

  const activeDomain = domains.find(d => d.ids.includes(q.id));

  return (
    <Layout currentStep={isCompleting ? 4 : 3}>
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-24">

        {/* Top progress bar */}
        <div className="w-full h-0.5 bg-slate-100 rounded-full mb-10 overflow-hidden">
          <div
            className="h-full bg-violet-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">

          {/* ── LEFT ───────────────────────────────── */}
          <div className="space-y-5">
            {/* Question meta */}
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
                  {activeDomain?.short} · Control {state.currentQuestion + 1}
                </span>
                <p className="eyebrow">Phase 03 — Compliance Audit</p>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-slate-800 leading-none">
                  {String(state.currentQuestion + 1).padStart(2, '0')}
                </span>
                <span className="text-slate-300 text-lg font-light"> / 15</span>
              </div>
            </div>

            {/* Question card */}
            <div className="card p-8 md:p-12 text-center">
              <div className="w-8 h-0.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h2 className="text-[20px] md:text-[24px] font-bold text-slate-800 leading-snug max-w-xl mx-auto mb-10">
                {q.text}
              </h2>

              {/* YES / NO */}
              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                {(['yes', 'no'] as const).map((opt) => {
                  const isYes = opt === 'yes';
                  const isSelected = answer === opt;
                  return (
                    <button
                      key={opt}
                      id={`answer-${opt}`}
                      onClick={() => handleAnswer(opt)}
                      className={cn(
                        'h-18 py-5 rounded-xl border-2 font-bold text-[15px] flex items-center justify-center gap-2.5 transition-all duration-150',
                        isSelected && isYes  ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' :
                        isSelected && !isYes ? 'border-red-400    bg-red-50    text-red-700    shadow-sm' :
                        isYes   ? 'border-slate-200 bg-white text-slate-500 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-700' :
                                  'border-slate-200 bg-white text-slate-500 hover:border-red-300    hover:bg-red-50/40    hover:text-red-700'
                      )}
                    >
                      {isYes
                        ? <CheckCircle2 className={cn('w-4.5 h-4.5 shrink-0', isSelected ? 'text-emerald-500' : 'text-slate-300')} />
                        : <XCircle     className={cn('w-4.5 h-4.5 shrink-0', isSelected ? 'text-red-400'    : 'text-slate-300')} />
                      }
                      {opt.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              {/* Deficiency hint */}
              {answer === 'no' && !TIER_1.includes(q.id) && (
                <div className="mt-7 p-4 rounded-xl bg-amber-50 border border-amber-200 text-left max-w-sm mx-auto anim-scale-in">
                  <div className="flex gap-2 items-center text-amber-700 font-semibold text-[11px] uppercase tracking-wider mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    Control gap detected
                  </div>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    This gap will increase audit friction. A remediation plan will be included in your report.
                  </p>
                </div>
              )}
            </div>

            {/* Domain progress */}
            <div className="card p-5">
              <p className="eyebrow mb-4">Domain Progress</p>
              <div className="grid grid-cols-3 gap-3">
                {domains.map((d) => {
                  const answered = d.ids.map(id => state.answers[id - 1]).filter(a => a !== null);
                  const hasRisk  = answered.some(a => a === 'no');
                  const done     = answered.length === d.ids.length;
                  const pct      = Math.round((answered.length / d.ids.length) * 100);

                  return (
                    <div key={d.name}
                      className={cn(
                        'p-3.5 rounded-xl border text-left transition-all duration-200',
                        activeDomain?.short === d.short ? 'border-violet-200 bg-violet-50' : 'border-slate-100 bg-slate-50'
                      )}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn('text-[10px] font-bold uppercase tracking-widest',
                          activeDomain?.short === d.short ? 'text-violet-600' : 'text-slate-400')}>
                          {d.short}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400">{answered.length}/{d.ids.length}</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-200 mb-2 overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500',
                            hasRisk ? 'bg-red-500' : done ? 'bg-emerald-500' : 'bg-violet-500')}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {answered.length === 0 ? 'Pending' : hasRisk ? 'Risk found' : done ? 'Complete' : 'In progress'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Next button */}
            {answer && (
              <button
                id="next-question-btn"
                onClick={handleNext}
                className="btn-primary w-full h-13 py-3.5 text-[14px] rounded-xl anim-scale-in"
              >
                {state.currentQuestion < questions.length - 1
                  ? <>Next control <ArrowRight className="w-4 h-4" /></>
                  : <>Generate readiness report <ArrowRight className="w-4 h-4" /></>
                }
              </button>
            )}
          </div>

          {/* ── RIGHT ──────────────────────────────── */}
          <div className="space-y-4 lg:sticky lg:top-20">
            <ScoreWidget score={score} delta={getDelta()} className="card" />

            {/* Framework spec */}
            <div className="card p-5 text-left">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-600">Framework Spec</h3>
              </div>
              {fwInfo ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest">
                      {fwLabels[fw]}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">
                      {fwInfo.control}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-800 mb-1.5 leading-snug">{fwInfo.title}</h4>
                    <p className="text-[12px] text-slate-500 leading-relaxed">{fwInfo.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-100">
                    <p className="eyebrow mb-1.5">Audit Expectation</p>
                    <p className="text-[12px] text-slate-500 italic leading-relaxed">"{fwInfo.requirement}"</p>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center">
                  <Info className="w-4 h-4 text-slate-300 mx-auto mb-2" />
                  <p className="text-[11px] text-slate-400">Loading...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {painTrigger && (
        <PainTriggerModal
          isOpen={showPainModal}
          onClose={() => setShowPainModal(false)}
          title={painTrigger.title}
          impact={painTrigger.impact}
          breakdown={painTrigger.breakdown}
          message={painTrigger.message}
        />
      )}
      <EmailCaptureModal isOpen={showEmailModal} onSubmit={handleEmailSubmit} />
    </Layout>
  );
};

export default Questions;
