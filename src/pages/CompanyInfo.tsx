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
  50000: '$50k',
  100000: '$100k',
  250000: '$250k',
  500000: '$500k+'
};

const CompanyInfo: React.FC = () => {
  const navigate = useNavigate();
  const { state, setCompanyInfo, setEmail, syncAuditToSupabase } = useAssessment();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [role, setRole] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmailState] = useState(state.email || ''); // Initial state from context
  const [dealSize, setDealSize] = useState(50000);
  const [isSliding, setIsSliding] = useState(false);

  // Strict Validation Regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 standard roughly (allows + and digits) or just simple strict digits: /^\+?[0-9]{10,15}$/
  // User asked for "no random words". Let's stick to a solid phone check.
  // Using a slightly more flexible but strict enough regex:
  const strictPhoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

  const isEmailValid = emailRegex.test(email);
  const isPhoneValid = strictPhoneRegex.test(phone) && phone.length >= 10;

  const isValid = companyName.trim().length > 1 && industry && role && isEmailValid && isPhoneValid;

  const handleContinue = () => {
    if (isValid) {
      setEmail(email); // Update context with validated email
      setCompanyInfo({ companyName, industry, role, dealSize, phone });
      syncAuditToSupabase();
      navigate('/questions');
    }
  };

  const getDealSizeValue = (value: number): number => {
    const sizes = [50000, 100000, 250000, 500000];
    return sizes.indexOf(value);
  };

  const getDealSizeFromIndex = (index: number): number => {
    const sizes = [50000, 100000, 250000, 500000];
    return sizes[index] || 50000;
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
              <div className="space-y-3 md:col-span-2">
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
                <div className="flex justify-between">
                  <Label htmlFor="email" className="text-base font-semibold">Business Email</Label>
                  {email && !isEmailValid && <span className="text-xs text-rose-500 font-medium self-center">Invalid email</span>}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmailState(e.target.value)}
                  onBlur={() => {
                    if (isEmailValid) {
                      setEmail(email);
                      syncAuditToSupabase();
                    }
                  }}
                  className={cn(
                    "h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base",
                    email && !isEmailValid && "border-rose-500/50 focus:ring-rose-500/20"
                  )}
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label htmlFor="phone" className="text-base font-semibold">Phone Number</Label>
                  {phone && !isPhoneValid && <span className="text-xs text-rose-500 font-medium self-center">Invalid number</span>}
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={cn(
                    "h-12 bg-secondary/30 border-border/50 focus:ring-primary/20 transition-all text-base",
                    phone && !isPhoneValid && "border-rose-500/50 focus:ring-rose-500/20"
                  )}
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
                  <span>$50k</span>
                  <span>$100k</span>
                  <span>$250k</span>
                  <span>$500k+</span>
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
