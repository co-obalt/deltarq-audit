import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Building2, ArrowRight, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const industries = [
  'SaaS',
  'FinTech',
  'HealthTech',
  'E-Commerce',
  'EdTech',
  'Enterprise Software',
  'Other'
];

const roles = [
  'Founder',
  'CTO',
  'Security Manager',
  'Product Manager',
  'Other'
];

const dealSizeLabels: Record<number, string> = {
  10000: '$10k',
  25000: '$25k',
  50000: '$50k',
  100000: '$100k+'
};

const CompanyInfo: React.FC = () => {
  const navigate = useNavigate();
  const { state, setCompanyInfo, setEmail, syncAuditToSupabase } = useAssessment();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [dealSize, setDealSize] = useState(25000);
  const [isSliding, setIsSliding] = useState(false);

  const isValid = companyName.trim() && industry && role;

  const handleContinue = () => {
    if (isValid) {
      setCompanyInfo({ companyName, industry, role, dealSize });
      syncAuditToSupabase(); // Final sync before next step
      navigate('/questions');
    }
  };

  const getDealSizeValue = (value: number): number => {
    const sizes = [10000, 25000, 50000, 100000];
    return sizes.indexOf(value);
  };

  const getDealSizeFromIndex = (index: number): number => {
    const sizes = [10000, 25000, 50000, 100000];
    return sizes[index] || 25000;
  };

  return (
    <Layout currentStep={2}>
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/5">
              <Building2 className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">Company Profile</h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">Help us personalize your readiness assessment and risk calculations.</p>
          </div>

          {/* Form */}
          <div className="glass-card p-8 md:p-10 space-y-8 animate-fade-in shadow-2xl" style={{ animationDelay: '100ms' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Company Name */}
              <div className="space-y-3">
                <Label htmlFor="company" className="text-base font-semibold">Company Name</Label>
                <Input
                  id="company"
                  placeholder="e.g., Alpha Tech"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base"
                />
              </div>

              {/* Email Capture (Highest Priority Lead) */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold">Business Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  defaultValue={state.email}
                  onBlur={(e) => {
                    setEmail(e.target.value);
                    syncAuditToSupabase(); // Instant sync on blur
                  }}
                  className="h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base"
                />
              </div>

              {/* Industry */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((ind) => (
                      <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Your Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Deal Size Slider */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <Label className="text-base font-semibold">Average Deal Size</Label>
                </div>
                <div className={cn(
                  "px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 transition-all duration-300",
                  isSliding ? "scale-110 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-primary/20" : "scale-100"
                )}>
                  <span className="text-xl font-bold text-primary tabular-nums">
                    {dealSizeLabels[dealSize]}
                  </span>
                </div>
              </div>

              <div className="px-2">
                <Slider
                  value={[getDealSizeValue(dealSize)]}
                  onValueChange={([value]) => {
                    setDealSize(getDealSizeFromIndex(value));
                    setIsSliding(true);
                  }}
                  onValueCommit={() => setIsSliding(false)}
                  max={3}
                  step={1}
                  className="py-4 cursor-pointer"
                />
                <div className="flex justify-between text-xs font-semibold text-muted-foreground/60 mt-2 px-1">
                  <span>$10k</span>
                  <span>$25k</span>
                  <span>$50k</span>
                  <span>$100k+</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleContinue}
              disabled={!isValid}
              className="w-full h-14 text-lg font-bold transition-all duration-500 hover:scale-[1.02]"
              size="lg"
            >
              Continue to Assessment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyInfo;
