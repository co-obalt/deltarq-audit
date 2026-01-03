import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment, Framework } from '@/context/AssessmentContext';
import Layout from '@/components/Layout';
import { Shield, Lock, Heart, Info, ChevronRight } from 'lucide-react';

const frameworks = [
  {
    id: 'soc2' as Framework,
    name: 'SOC 2',
    icon: Shield,
    description: 'Service Organization Control 2',
    detail: 'For SaaS, cloud services, and tech companies',
    color: 'primary'
  },
  {
    id: 'iso' as Framework,
    name: 'ISO 27001',
    icon: Lock,
    description: 'Information Security Management',
    detail: 'International standard for enterprise security',
    color: 'primary'
  },
  {
    id: 'hipaa' as Framework,
    name: 'HIPAA',
    icon: Heart,
    description: 'Health Insurance Portability & Accountability',
    detail: 'For healthcare and health data companies',
    color: 'primary'
  }
];

const FrameworkSelection: React.FC = () => {
  const navigate = useNavigate();
  const { setFramework, syncAuditToSupabase } = useAssessment();

  const handleSelect = (framework: Framework) => {
    setFramework(framework);
    syncAuditToSupabase(); // Explicit sync on selection
    navigate('/company-info');
  };

  return (
    <Layout currentStep={1}>
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Which framework are your{' '}
              <span className="text-gradient">enterprise buyers</span>{' '}
              asking about?
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Select the compliance framework most relevant to your current deals or future growth plans.
            </p>
          </div>

          {/* Framework Cards */}
          <div className="grid gap-6">
            {frameworks.map((framework, index) => (
              <button
                key={framework.id}
                onClick={() => handleSelect(framework.id)}
                className="group relative glass-card p-6 text-left transition-all duration-500 hover:border-primary/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:-translate-y-1.5 animate-fade-in overflow-hidden"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <framework.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                        {framework.name}
                      </h3>
                      <ChevronRight className="w-6 h-6 text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-lg text-foreground/80 mb-1 group-hover:text-foreground transition-colors">{framework.description}</p>
                    <p className="text-sm text-muted-foreground/70">{framework.detail}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Info Alert Box */}
          <div
            className="mt-12 p-6 rounded-2xl bg-secondary/30 backdrop-blur-md border border-border/50 flex items-start gap-4 animate-fade-in"
            style={{ animationDelay: '500ms' }}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-foreground mb-1">Not sure which one to pick?</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-medium">SOC 2</span> is the most common requirement for B2B SaaS companies selling into the US enterprise market. If you're targeting global or European enterprises, <span className="text-primary font-medium">ISO 27001</span> is often preferred.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FrameworkSelection;
