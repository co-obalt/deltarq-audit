import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment, Framework } from '@/context/AssessmentContext';
import Layout from '@/components/Layout';
import { Shield, Lock, Heart, ChevronRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const frameworks = [
  {
    id: 'soc2' as Framework,
    name: 'SOC 2',
    subtitle: 'Type I / Type II',
    icon: Shield,
    label: 'System & Organization Controls',
    detail: 'The baseline security compliance expectation for US B2B SaaS, cloud platforms, and data infrastructure vendors.',
    scopes: ['Security & Access Control', 'Confidentiality Protection', 'Continuous Audit Logging'],
    tag: 'Most common',
  },
  {
    id: 'iso' as Framework,
    name: 'ISO 27001',
    subtitle: '2022 Edition',
    icon: Lock,
    label: 'Information Security Management',
    detail: 'Global information security standard required by European, APAC, and international enterprise buyers.',
    scopes: ['ISMS Policies', '114 Controls Framework', 'Risk Assessment Program'],
    tag: null,
  },
  {
    id: 'hipaa' as Framework,
    name: 'HIPAA',
    subtitle: 'Security Rule',
    icon: Heart,
    label: 'Protected Health Information',
    detail: 'Federal mandate for handling, processing, or storing Electronic Protected Health Information (ePHI).',
    scopes: ['ePHI Encryption Standards', 'Business Associate Agreement', 'Access Auditing & Logs'],
    tag: null,
  },
];

const FrameworkSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setFramework, syncAuditToSupabase } = useAssessment();
  const [hovered, setHovered] = useState<string | null>(null);

  const handleSelect = (framework: Framework) => {
    setFramework(framework);
    syncAuditToSupabase();
    navigate('/company-info');
  };

  return (
    <Layout currentStep={1}>
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <div className="mb-12 anim-fade-up">
          <p className="eyebrow mb-4">Step 01 — Framework</p>
          <h1 className="text-[36px] md:text-[48px] font-black text-slate-900 mb-5">
            Which framework are your<br />
            <span className="text-brand">enterprise buyers</span> asking about?
          </h1>
          <p className="text-[16px] text-slate-500 max-w-lg leading-relaxed">
            Select the compliance target most relevant to your active security reviews or revenue pipeline.
          </p>
        </div>

        {/* Framework list */}
        <div className="space-y-3 anim-fade-up" style={{ animationDelay: '0.1s' }}>
          {frameworks.map((fw) => (
            <button
              key={fw.id}
              id={`fw-${fw.id}`}
              onClick={() => handleSelect(fw.id)}
              onMouseEnter={() => setHovered(fw.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                'w-full text-left card p-6 md:p-7 transition-all duration-200 block',
                hovered === fw.id ? 'border-violet-300 shadow-md' : ''
              )}
            >
              <div className="flex items-start gap-5">
                {/* Icon */}
                <div className={cn(
                  'w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-all duration-200',
                  hovered === fw.id
                    ? 'bg-violet-50 border-violet-200 text-violet-600'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                )}>
                  <fw.icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1">
                    <h3 className="text-[18px] font-bold text-slate-800">{fw.name}</h3>
                    <span className="text-[11px] text-slate-400 font-medium">{fw.subtitle}</span>
                    {fw.tag && (
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-violet-600 text-white">
                        {fw.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{fw.label}</p>
                  <p className="text-[13px] text-slate-500 leading-relaxed mb-4">{fw.detail}</p>

                  {/* Scope chips */}
                  <div className="flex flex-wrap gap-2">
                    {fw.scopes.map((scope, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-500">
                        <Check className="w-3 h-3 text-slate-400" />
                        {scope}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow */}
                <ChevronRight className={cn(
                  'w-4 h-4 shrink-0 mt-1 transition-all duration-200',
                  hovered === fw.id ? 'text-violet-500 translate-x-0.5' : 'text-slate-300'
                )} />
              </div>
            </button>
          ))}
        </div>

        {/* Hint */}
        <div className="mt-6 p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-start gap-3.5 text-left anim-fade-in" style={{ animationDelay: '0.25s' }}>
          <Shield className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-[13px] text-slate-500 leading-relaxed">
            <span className="font-semibold text-slate-700">Not sure?</span>{' '}
            SOC 2 is standard for US B2B SaaS. ISO 27001 is the preferred choice for European and APAC enterprise buyers.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default FrameworkSelection;
