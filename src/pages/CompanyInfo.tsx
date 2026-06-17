import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAssessment } from '@/context/AssessmentContext';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ArrowRight, DollarSign, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

const industries = ['SaaS', 'FinTech', 'HealthTech', 'E-Commerce', 'EdTech', 'Enterprise Software', 'Other'];
const roles      = ['Founder', 'CTO', 'Security Manager', 'Product Manager', 'Other'];

const dealLabels: Record<number, string> = {
  50000: '$50k', 100000: '$100k', 250000: '$250k', 500000: '$500k+',
};

const CompanyInfo: React.FC = () => {
  const navigate = useNavigate();
  const { state, setCompanyInfo, setEmail, syncAuditToSupabase } = useAssessment();

  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry]       = useState('');
  const [role, setRole]               = useState('');
  const [phone, setPhone]             = useState('');
  const [email, setEmailState]        = useState(state.email || '');
  const [dealSize, setDealSize]       = useState(50000);
  const [sliding, setSliding]         = useState(false);

  const emailValid = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  const phoneValid = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone) && phone.length >= 10;
  const isValid    = companyName.trim().length > 1 && industry && role && emailValid && phoneValid;

  const handleContinue = () => {
    if (!isValid) return;
    setEmail(email);
    setCompanyInfo({ companyName, industry, role, dealSize, phone });
    syncAuditToSupabase();
    navigate('/questions');
  };

  const sizeIdx  = (v: number) => [50000, 100000, 250000, 500000].indexOf(v);
  const idxSize  = (i: number) => [50000, 100000, 250000, 500000][i] || 50000;
  const vuln     = dealSize * 4.5 + 10000;

  const inputCls = (hasError?: boolean) => cn(
    'h-11 bg-white text-sm text-slate-800 rounded-xl border transition-all duration-150',
    'focus:ring-2 focus:ring-violet-500/15 focus:border-violet-400/60 focus:outline-none',
    hasError ? 'border-red-300' : 'border-slate-200 hover:border-slate-300'
  );

  return (
    <Layout currentStep={2}>
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">

        {/* Header */}
        <div className="mb-10 anim-fade-up">
          <p className="eyebrow mb-4">Step 02 — Company Profile</p>
          <h1 className="text-[36px] md:text-[44px] font-black text-slate-900 mb-3">Tell us about your company.</h1>
          <p className="text-[15px] text-slate-500 leading-relaxed">
            We use this to personalize your readiness assessment and risk calculations.
          </p>
        </div>

        {/* Form card */}
        <div className="card p-8 md:p-10 anim-fade-up" style={{ animationDelay: '0.1s' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-7">

            {/* Company Name */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="company" className="eyebrow">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g., Alpha Tech Inc."
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className={inputCls()}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="email" className="eyebrow">Business Email</Label>
                {email && !emailValid && <span className="text-[10px] font-semibold text-red-500">Invalid</span>}
              </div>
              <Input
                id="email" type="email" placeholder="name@company.com"
                value={email}
                onChange={e => setEmailState(e.target.value)}
                onBlur={() => { if (emailValid) { setEmail(email); syncAuditToSupabase(); } }}
                className={inputCls(Boolean(email && !emailValid))}
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="phone" className="eyebrow">Phone Number</Label>
                {phone && !phoneValid && <span className="text-[10px] font-semibold text-red-500">Invalid</span>}
              </div>
              <Input
                id="phone" type="tel" placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className={inputCls(Boolean(phone && !phoneValid))}
              />
            </div>

            {/* Industry */}
            <div className="space-y-2">
              <Label className="eyebrow">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger className={inputCls()}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl text-slate-800">
                  {industries.map(i => <SelectItem key={i} value={i} className="focus:bg-violet-50 focus:text-violet-700">{i}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="eyebrow">Your Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className={inputCls()}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 rounded-xl text-slate-800">
                  {roles.map(r => <SelectItem key={r} value={r} className="focus:bg-violet-50 focus:text-violet-700">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Deal Size */}
          <div className="pt-6 border-t border-slate-100 space-y-5 text-left">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <Label className="eyebrow">Average Deal Size</Label>
              </div>
              <span className={cn(
                'text-[14px] font-black text-slate-800 px-3 py-1 rounded-lg border transition-all duration-150',
                sliding ? 'border-violet-300 bg-violet-50 text-violet-700' : 'border-slate-200 bg-slate-50'
              )}>
                {dealLabels[dealSize]}
              </span>
            </div>

            <div className="px-1">
              <Slider
                value={[sizeIdx(dealSize)]}
                onValueChange={([v]) => { setDealSize(idxSize(v)); setSliding(true); }}
                onValueCommit={() => setSliding(false)}
                max={3} step={1}
                className="py-4 cursor-pointer [&_[role=slider]]:bg-violet-600 [&_[role=slider]]:border-violet-600 [&_.relative_.bg-primary]:bg-violet-600"
              />
              <div className="flex justify-between mt-1 px-0.5">
                {Object.values(dealLabels).map(l => (
                  <span key={l} className="text-[10px] font-semibold text-slate-400">{l}</span>
                ))}
              </div>
            </div>

            {/* Risk estimate */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500 mt-0.5 shrink-0" />
              <p className="text-[13px] text-slate-600 leading-relaxed">
                At this deal size, InfoSec deficiencies expose an estimated{' '}
                <span className="font-black text-red-600 font-mono">${vuln.toLocaleString()}</span>{' '}
                of active ARR to compliance-driven churn.
              </p>
            </div>
          </div>

          {/* Submit */}
          <button
            id="company-info-submit"
            onClick={handleContinue}
            disabled={!isValid}
            className={cn('btn-primary w-full mt-8 h-12 text-[14px]', !isValid && 'opacity-40 cursor-not-allowed')}
          >
            Begin Technical Discovery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default CompanyInfo;
