import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import { questions, categoryLabels, frameworkCompliance, painTriggers } from '@/data/questions';
import Layout from '@/components/Layout';
import ScoreWidget from '@/components/ScoreWidget';
import { Button } from '@/components/ui/button';
import PainTriggerModal from '@/components/PainTriggerModal';
import EmailCaptureModal from '@/components/EmailCaptureModal';
import { ArrowRight, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const TIER_1_QUESTIONS = [1, 2, 6, 9, 13];
const TIER_2_QUESTIONS = [3, 5, 8, 11, 15];
const TIER_3_QUESTIONS = [4, 7, 10, 12, 14];

const Questions: React.FC = () => {
  const navigate = useNavigate();
  const { state, setAnswer, setCurrentQuestion, setEmail, calculateScore, syncAuditToSupabase } = useAssessment();
  const [showPainModal, setShowPainModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showInlineDetails, setShowInlineDetails] = useState(false);
  const [currentPainTrigger, setCurrentPainTrigger] = useState<ReturnType<typeof painTriggers.q1> | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const currentQuestion = questions[state.currentQuestion];
  const currentAnswer = state.answers[state.currentQuestion];
  const currentScore = calculateScore();

  // Get framework info for current question
  const frameworkKey = `q${currentQuestion.id}` as keyof typeof frameworkCompliance;
  const frameworkInfo = frameworkCompliance[frameworkKey];
  const selectedFramework = state.framework || 'soc2';
  const currentFrameworkInfo = frameworkInfo?.[selectedFramework];

  const frameworkLabels = {
    soc2: 'SOC 2',
    iso: 'ISO 27001',
    hipaa: 'HIPAA'
  };

  useEffect(() => {
    // Redirect if no framework selected
    if (!state.framework) {
      navigate('/framework');
    }
    // Reset inline details when question changes
    setShowInlineDetails(false);
  }, [state.framework, navigate, state.currentQuestion]);

  const handleAnswer = (answer: 'yes' | 'no') => {
    setAnswer(state.currentQuestion, answer);

    // Logic for NO answers
    if (answer === 'no') {
      const isTier1 = TIER_1_QUESTIONS.includes(currentQuestion.id);

      if (isTier1) {
        const triggerKey = `q${currentQuestion.id}` as keyof typeof painTriggers;
        const trigger = painTriggers[triggerKey];
        if (trigger) {
          setCurrentPainTrigger(trigger(state.companyInfo.dealSize));
          setShowPainModal(true);
        }
      } else {
        // For regular questions, reveal inline details instead of a popup
        setShowInlineDetails(true);
      }
    }
  };

  const handleNext = () => {
    // Check if we need to show email capture after Q10
    if (state.currentQuestion === 9 && !state.email) {
      setShowEmailModal(true);
      return;
    }

    if (state.currentQuestion < questions.length - 1) {
      setCurrentQuestion(state.currentQuestion + 1);
    } else {
      // All questions answered, trigger completion sequence
      setIsCompleting(true);
      setTimeout(() => {
        navigate('/score');
      }, 1500);
    }
  };

  const handleEmailSubmit = (email: string) => {
    setEmail(email);
    setShowEmailModal(false);
    // Continue to next question
    if (state.currentQuestion < questions.length - 1) {
      setCurrentQuestion(state.currentQuestion + 1);
    } else {
      setIsCompleting(true);
      setTimeout(() => {
        navigate('/score');
      }, 1500);
    }
  };

  // Deduction Log Logic for Delta
  const getLatestDelta = () => {
    const lastAnswer = state.answers[state.currentQuestion];
    if (lastAnswer === null) return 0;
    const qId = state.currentQuestion + 1;
    if (lastAnswer === 'no') {
      if (TIER_1_QUESTIONS.includes(qId)) return -12;
      if (TIER_2_QUESTIONS.includes(qId)) return -9;
      if (TIER_3_QUESTIONS.includes(qId)) return -7;
    } else {
      if (TIER_1_QUESTIONS.includes(qId)) return 4;
      if (TIER_2_QUESTIONS.includes(qId)) return 3;
      if (TIER_3_QUESTIONS.includes(qId)) return 2;
    }
    return 0;
  };

  const currentDelta = getLatestDelta();

  return (
    <Layout currentStep={isCompleting ? 4 : 3}>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6 items-start">

          {/* Left Column: Compliance Proof & Tech Analysis */}
          <div className="space-y-4 order-3 lg:order-1 lg:sticky lg:top-20">
            <div className="glass-card p-6 backdrop-blur-xl border border-white/10 rounded-[12px] shadow-lg">
              <div className="flex items-center gap-2.5 mb-6 pb-2 border-b border-white/5">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h3 className="font-bold text-[16px] tracking-tight text-foreground">Compliance Proof</h3>
              </div>

              {currentFrameworkInfo ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-emerald-500 font-black text-[10px] px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest leading-none">
                      {frameworkLabels[selectedFramework]}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground bg-secondary/30 px-2 py-1 rounded border border-border/30 leading-none">
                      {currentFrameworkInfo.control}
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    <h4 className="text-[15px] font-bold text-foreground leading-snug">{currentFrameworkInfo.title}</h4>
                    <p className="text-[14px] font-normal text-muted-foreground leading-[1.5] font-inter">
                      {currentFrameworkInfo.description}
                    </p>
                  </div>
                  <div className="pt-5 border-t border-border/20">
                    <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-[0.2em] mb-3">Audit Expectation</p>
                    <p className="text-[14px] font-medium text-muted-foreground/70 italic leading-[1.5] font-inter">
                      "{currentFrameworkInfo.requirement}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center space-y-3">
                  <Info className="w-8 h-8 text-muted-foreground/20 mx-auto" />
                  <p className="text-[14px] text-muted-foreground/60 font-medium italic">Scanning for analysis...</p>
                </div>
              )}
            </div>

            {/* Injected Tech Analysis Section */}
            {currentAnswer && (
              <div className="glass-card p-5 backdrop-blur-xl border border-white/5 bg-white/2 rounded-[12px] shadow-sm">
                <div className="space-y-5">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      {currentAnswer === 'no' ? <XCircle className="w-4 h-4 text-rose-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      <h4 className={cn("font-bold text-[16px]", currentAnswer === 'no' ? "text-rose-500" : "text-emerald-500")}>
                        {currentAnswer === 'no' ? "Structural Impact" : "Operational Advantage"}
                      </h4>
                    </div>
                    <p className="text-muted-foreground text-[14px] leading-[1.5] font-inter">
                      {currentAnswer === 'no'
                        ? "Critical gap identified. This lack of control orchestration signals elevated risk levels to enterprise auditors."
                        : "Strategic advantage secured. This control acts as a trust-accelerator during technical due diligence."}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500/70" />
                      <h4 className="text-amber-500/70 font-bold text-[16px]">Architectural Guide</h4>
                    </div>
                    <ul className="text-muted-foreground/80 text-[14px] leading-[1.5] space-y-1.5 font-inter">
                      {currentAnswer === 'no' ? (
                        <>
                          <li className="flex items-start gap-2">• Define enterprise-grade policy</li>
                          <li className="flex items-start gap-2">• Implement technical enforcement</li>
                        </>
                      ) : (
                        <>
                          <li className="flex items-start gap-2">• Automate continuous monitoring</li>
                          <li className="flex items-start gap-2">• Perform quarterly audits</li>
                        </>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Center Column: Assessment Core */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="flex items-center justify-between px-4 mb-4">
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-primary uppercase tracking-[0.3em]">Phase 03: Risk Assessment</span>
                <span className="text-[12px] text-muted-foreground font-bold tracking-tighter opacity-40">Security Component Analysis</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[24px] font-black text-foreground tracking-tighter leading-none">Q{state.currentQuestion + 1}</span>
                <span className="text-[12px] text-muted-foreground font-bold uppercase tracking-[0.1em]">of 15</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="glass-card p-8 md:p-12 backdrop-blur-2xl rounded-[16px] border border-white/10 shadow-xl text-center relative overflow-hidden min-h-[400px] flex flex-col justify-center transition-all duration-700">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              <h2 className="text-[20px] font-black text-foreground mb-12 leading-[1.3] tracking-tight flex flex-col items-center max-w-xl mx-auto">
                <span className="w-10 h-1 bg-primary mb-8 rounded-full opacity-30" />
                {currentQuestion.text}
              </h2>

              {/* Authority Buttons */}
              <div className="grid grid-cols-2 gap-8 mb-12 max-w-2xl mx-auto w-full">
                <Button
                  variant={currentAnswer === 'yes' ? 'default' : 'yes'}
                  onClick={() => handleAnswer('yes')}
                  className={cn(
                    "h-32 text-[24px] font-black rounded-[24px] border-2 transition-all duration-500 hover:shadow-[inset_0_0_20px_rgba(16,185,129,0.3)]",
                    currentAnswer === 'yes' ? "bg-emerald-500 border-emerald-400 text-white scale-105 shadow-[0_20px_40px_rgba(16,185,129,0.3)]" : "border-emerald-500/20"
                  )}
                >
                  <CheckCircle2 className={cn("w-10 h-10 mr-4 transition-transform duration-500", currentAnswer === 'yes' && "scale-110")} />
                  YES
                </Button>
                <Button
                  variant={currentAnswer === 'no' ? 'destructive' : 'no'}
                  onClick={() => handleAnswer('no')}
                  className={cn(
                    "h-32 text-[24px] font-black rounded-[24px] border-2 transition-all duration-500 hover:shadow-[inset_0_0_20px_rgba(239,68,68,0.3)]",
                    currentAnswer === 'no' ? "bg-rose-500 border-rose-400 text-white scale-105 shadow-[0_20px_40px_rgba(239,68,68,0.3)]" : "border-rose-500/20"
                  )}
                >
                  <XCircle className={cn("w-10 h-10 mr-4 transition-transform duration-500", currentAnswer === 'no' && "scale-110")} />
                  NO
                </Button>
              </div>

            </div>

            {/* Navigation */}
            {currentAnswer && (
              <div className="pt-4">
                <Button
                  onClick={handleNext}
                  className="w-full h-20 text-[20px] font-black rounded-[16px] shadow-3xl group transition-all duration-700 hover:scale-[1.01] bg-[#1e293b] border border-emerald-500/50 text-white hover:bg-emerald-500 hover:border-emerald-400"
                  size="lg"
                >
                  {state.currentQuestion < questions.length - 1 ? (
                    <>
                      Next Control →
                    </>
                  ) : (
                    'GENERATE FINAL READINESS REPORT'
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Live Score & History */}
          <div className="space-y-4 order-2 lg:order-3 lg:sticky lg:top-24 mt-8 lg:mt-12">
            <ScoreWidget score={currentScore} delta={currentDelta} />

            <div className="glass-card p-6 backdrop-blur-xl border border-white/10 rounded-[16px] shadow-xl">
              <h4 className="text-[16px] font-bold text-foreground mb-6 border-b border-border/50 pb-3">Audit Status</h4>

              <div className="space-y-6">
                {[
                  { name: 'Identity', ids: [1, 2, 3, 4, 5] },
                  { name: 'Infrastructure', ids: [6, 7, 8, 9, 10] },
                  { name: 'Data Security', ids: [11, 12, 13, 14, 15] }
                ].map((cat) => {
                  const answeredInCat = cat.ids.map(id => state.answers[id - 1]).filter(a => a !== null);
                  const isHealthy = answeredInCat.every(a => a === 'yes');
                  const hasRisk = answeredInCat.some(a => a === 'no');

                  return (
                    <div key={cat.name} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/30">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]",
                          answeredInCat.length === 0 ? "bg-muted-foreground/30 text-muted-foreground/20" :
                            hasRisk ? "bg-rose-500 text-rose-500/50" :
                              answeredInCat.length === cat.ids.length ? "bg-emerald-500 text-emerald-500/50" :
                                "bg-amber-500 text-amber-500/50"
                        )} />
                        <span className="text-[14px] font-bold text-foreground/90">{cat.name}</span>
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase opacity-50 tracking-widest">
                        {answeredInCat.length} / {cat.ids.length}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-[16px] bg-secondary/20 border border-border/50 backdrop-blur-sm">
              <p className="text-[12px] font-bold text-muted-foreground/80 uppercase tracking-widest leading-relaxed text-center">
                Audit integrity guaranteed by Tiered weights.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Pain Trigger Modal */}
      {currentPainTrigger && (
        <PainTriggerModal
          isOpen={showPainModal}
          onClose={() => setShowPainModal(false)}
          title={currentPainTrigger.title}
          impact={currentPainTrigger.impact}
          breakdown={currentPainTrigger.breakdown}
          message={currentPainTrigger.message}
        />
      )}

      {/* Email Capture Modal */}
      <EmailCaptureModal
        isOpen={showEmailModal}
        onSubmit={handleEmailSubmit}
      />
    </Layout>
  );
};

export default Questions;
