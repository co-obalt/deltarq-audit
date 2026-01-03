import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useAssessment, initialState } from '@/context/AssessmentContext';
import { supabase } from '@/lib/supabase';
import {
  Shield,
  AlertTriangle,
  TrendingDown,
  Clock,
  CheckCircle2,
  FileText,
  ArrowRight,
  Zap
} from 'lucide-react';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { state, history, calculateScore, resumeSession, resetAssessment, setIpAddress, syncAuditToSupabase } = useAssessment();

  // 1. Initial Lead Tracking & IP Capture
  React.useEffect(() => {
    const initLead = async () => {
      let currentIp = state.ip_address;

      // Capture IP Address first if missing
      if (!currentIp) {
        try {
          const response = await fetch('https://api.ipify.org?format=json');
          const data = await response.json();
          if (data.ip) {
            currentIp = data.ip;
            setIpAddress(data.ip);
          }
        } catch (e) {
          if (import.meta.env.DEV) console.error('IP capture failed:', e);
        }
      }

      // Initialize audit_id if not present
      // 2. Initialize or Resume Audit ID
      let finalAuditId = state.audit_id;
      let finalFramework = state.framework;
      let finalCompanyInfo = state.companyInfo;
      let finalEmail = state.email;
      let finalAnswers = state.answers;

      if (!finalAuditId) {
        const savedState = localStorage.getItem('assessmentState');
        const parsed = savedState ? JSON.parse(savedState) : null;

        if (!parsed || !parsed.audit_id) {
          finalAuditId = crypto.randomUUID();
          // We manually trigger reset with the new ID but we need it for the sync call BELOW
          const newState = {
            ...initialState,
            id: Math.random().toString(36).substr(2, 9),
            audit_id: finalAuditId,
            ip_address: currentIp
          };
          resumeSession(newState);
        } else {
          finalAuditId = parsed.audit_id;
          try {
            const { data, error } = await supabase
              .from('audits')
              .select('*')
              .eq('audit_id', finalAuditId)
              .single();

            if (data && !error) {
              currentIp = data.ip_address || currentIp;
              finalFramework = data.framework || finalFramework;
              finalEmail = data.email || finalEmail;
              finalAnswers = data.answers || finalAnswers;

              const resumedState = {
                ...state,
                audit_id: data.audit_id,
                framework: data.framework,
                companyInfo: {
                  companyName: data.company_name || '',
                  industry: data.industry || '',
                  role: data.user_role || '',
                  dealSize: Number(data.deal_size) || 25000
                },
                email: data.email || '',
                answers: data.answers || Array(15).fill(null),
                ip_address: currentIp
              };
              resumeSession(resumedState);
            }
          } catch (e) {
            if (import.meta.env.DEV) console.error('Supabase resume fetch failed:', e);
          }
        }
      }

      // 3. FORCE Sync with the definitely captured IP
      if (finalAuditId) {
        syncAuditToSupabase({
          ...state,
          audit_id: finalAuditId,
          ip_address: currentIp,
          framework: finalFramework,
          companyInfo: finalCompanyInfo,
          email: finalEmail,
          answers: finalAnswers
        });
      }
    };

    initLead();
  }, []);

  // Format history sessions - most recent first
  const activeSessions = [...history]
    .filter(s => s.framework !== null)
    .sort((a, b) => {
      const timeA = a.lastModified ? new Date(a.lastModified).getTime() : 0;
      const timeB = b.lastModified ? new Date(b.lastModified).getTime() : 0;
      return timeB - timeA;
    });

  const handleResume = (session: typeof state) => {
    resumeSession(session);
    if (!session.framework) navigate('/framework');
    else if (!session.companyInfo.companyName) navigate('/company-info');
    else navigate('/questions');
  };

  return (
    <Layout currentStep={1} className="mesh-gradient min-h-screen">
      <div className="container mx-auto px-6 max-w-7xl">

        {/* HERO SECTION */}
        <section className="flex flex-col items-center pt-24 mb-[120px]">
          <div className="max-w-4xl mx-auto text-center animate-in fade-in duration-1000">
            <div className="inline-flex items-center gap-2.5 bg-emerald-500/10 text-emerald-400 px-5 py-2 rounded-full mb-10 border border-emerald-500/20">
              <Shield className="w-3.5 h-3.5 fill-emerald-500/20" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Enterprise Trust Architecture</span>
            </div>

            <h1 className="text-[48px] md:text-[80px] font-[800] mb-8 leading-[1] tracking-tight text-white font-inter">
              Why Are Enterprise Deals <br />
              <span className="text-emerald-500">Ghosting You?</span>
            </h1>

            <p className="text-[16px] md:text-[20px] text-muted-foreground/80 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              Free 5-minute technical deep dive reveals the <span className="text-emerald-500/80">compliance gaps</span> <br className="hidden md:block" />
              killing your revenue and stalling security reviews.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
              <Button
                onClick={() => {
                  resetAssessment();
                  navigate('/framework');
                }}
                className="h-16 px-10 bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0A] text-[15px] font-[800] uppercase tracking-widest rounded-2xl shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all animate-pulse-slow border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1"
              >
                Scan My Deal-Readiness
                <ArrowRight className="w-4 h-4 ml-3" />
              </Button>

              <Button
                variant="ghost"
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/src/alphatech-DeltaRQ-Full-Report.pdf';
                  link.download = 'DeltaRQ-Global-Report-Sample.pdf';
                  link.click();
                }}
                className="h-16 px-10 text-[14px] font-bold uppercase tracking-widest rounded-2xl border border-white/10 hover:bg-white/5 text-white/60 hover:text-white transition-all"
              >
                Download Global Report Sample
              </Button>
            </div>

            <p className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground/30">
              No Credit Card Required | 5-Minute Technical Deep Dive
            </p>
          </div>

          {/* DYNAMIC SESSION HISTORY (HORIZONTAL RESUME BOX) */}
          {activeSessions.length > 0 && (
            <div className="w-full max-w-5xl mt-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-[32px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                <div className="glass-card relative bg-[#0A0A0A]/60 border border-white/10 border-l-4 border-l-emerald-500 rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  {activeSessions.slice(0, 1).map((session, idx) => {
                    const sessionScore = calculateScore(session.answers);
                    const dateStr = session.lastModified
                      ? new Date(session.lastModified).toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: '2-digit' })
                      : '03/01/26';

                    return (
                      <React.Fragment key={session.id || idx}>
                        <div className="flex items-center gap-8 w-full md:w-auto">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            {session.framework === 'soc2' && <Shield className="w-7 h-7 text-emerald-500" />}
                            {(!session.framework || session.framework !== 'soc2') && <Zap className="w-7 h-7 text-emerald-500" />}
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 leading-none">Resuming Analysis</span>
                            <div className="flex items-center gap-3">
                              <h3 className="text-[20px] font-bold text-white uppercase tracking-wider">{session.framework?.toUpperCase() || 'GENERAL'}</h3>
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="text-[15px] font-medium text-muted-foreground/60">{dateStr}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                          <div className="flex flex-col gap-1.5 md:items-end">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 leading-none">Progress</span>
                            <span className="text-[20px] font-bold text-emerald-500">{sessionScore}% Complete</span>
                          </div>

                          <Button
                            onClick={() => handleResume(session)}
                            className="h-14 px-10 text-[13px] font-black uppercase tracking-widest rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0A0A0A] shadow-lg transition-all"
                          >
                            Resume
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 3-PILLAR TRUST INDICATORS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto mb-[120px] animate-in fade-in duration-1000 delay-300">
          {[
            {
              icon: TrendingDown,
              title: 'The Risk',
              stat: '67% of Deals',
              desc: 'Stall at security review or legal drafting.',
              color: 'text-rose-500',
              bg: 'bg-rose-500/10'
            },
            {
              icon: Clock,
              title: 'The Delay',
              stat: '4-6 Months',
              desc: 'Average delay without SOC 2 readiness.',
              color: 'text-amber-500',
              bg: 'bg-amber-500/10'
            },
            {
              icon: AlertTriangle,
              title: 'The Loss',
              stat: '$250K+ Revenue',
              desc: 'Average ARR at risk per discovered gap.',
              color: 'text-emerald-500',
              bg: 'bg-emerald-500/10'
            }
          ].map((item, index) => (
            <div
              key={index}
              className="glass-card p-10 rounded-[32px] border border-white/5 bg-white/[0.02] relative group hover:bg-white/[0.04] transition-all hover:-translate-y-2 duration-500"
            >
              <div className={item.bg + " w-14 h-14 rounded-2xl flex items-center justify-center mb-8 shadow-xl " + item.color}>
                <item.icon className="w-7 h-7" />
              </div>
              <div className="space-y-3">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">{item.title}</p>
                <h3 className="text-[30px] font-black tracking-tight leading-none text-white">{item.stat}</h3>
                <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* PROFESSIONAL SERVICES & TIERED UPSELL */}
        <section className="max-w-7xl mx-auto mb-[120px] animate-in fade-in duration-1000">
          <div className="text-center mb-20">
            <h2 className="text-[36px] md:text-[48px] font-[800] tracking-tighter mb-4 text-white">Beyond the Scan: Engineering Your Compliance</h2>
            <p className="text-muted-foreground/60 text-[18px] max-w-2xl mx-auto font-medium">Strategic remediation designed for high-growth engineering teams.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              {
                title: "SOC 2 Readiness Program ($4,999)",
                body: "Full end-to-end audit prep. We build your roadmap, collect evidence, and handle the auditor communication.",
                highlight: "Most Popular for Series A/B",
                icon: Zap
              },
              {
                title: "Policy & Document Templates",
                body: "Audit-vetted templates for InfoSec, Access Control, and Disaster Recovery. Just fill and sign.",
                icon: FileText
              },
              {
                title: "Lead Auditor Consultation",
                body: "Direct 1:1 sessions to bridge complex technical gaps. Book a strategy call today.",
                button: "Book Compliance Consultation",
                icon: Shield
              }
            ].map((service, idx) => (
              <div key={idx} className="glass-card relative p-10 rounded-[32px] border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all group overflow-hidden">
                {service.highlight && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-[#0A0A0A] px-4 py-1 text-[10px] font-black uppercase tracking-widest rounded-bl-xl shadow-lg">
                    {service.highlight}
                  </div>
                )}
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-[20px] font-[800] mb-4 text-white leading-tight">{service.title}</h3>
                <p className="text-[14px] text-muted-foreground/60 leading-[1.6] font-medium mb-6">{service.body}</p>

                {service.button && (
                  <Button
                    onClick={() => window.open('https://calendar.app.google/ExhxfcYvbV5PKMs36', '_blank')}
                    variant="ghost"
                    className="w-full h-12 text-[11px] font-black uppercase tracking-widest rounded-xl border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500 hover:text-[#0A0A0A] transition-all"
                  >
                    {service.button}
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* THE "GAP BRIDGE" SECTION (ABOUT US) */}
        <section className="max-w-7xl mx-auto mb-[120px] relative overflow-hidden">
          {/* Watermark Decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
            <Shield className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-emerald-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10 px-4">
            <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
              <h2 className="text-[40px] md:text-[64px] font-[800] tracking-tighter text-white leading-[1.1]">
                We Bridge the Gap <br />
                Between Engineering <br />
                <span className="text-emerald-500">& Sales.</span>
              </h2>
            </div>

            <div className="animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
              <p className="text-[16px] md:text-[18px] text-muted-foreground/80 font-medium leading-[1.8] max-w-2xl">
                DeltaRQ helps high-growth startups automate the friction out of compliance so your engineers can focus on product,
                and your sales team can close $100K+ deals with confidence. Our scanner identifies the exact points of failure
                that enterprise CISO's look for, turning security into a sales accelerator.
                <br /><br />
                Founded by security auditors and software engineers, we believe that compliance shouldn't be a blocker to innovation,
                but a competitive advantage for startups ready to scale.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Landing;
