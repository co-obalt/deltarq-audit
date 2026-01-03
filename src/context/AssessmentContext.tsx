import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type Framework = 'soc2' | 'iso' | 'hipaa' | null;
export type Answer = 'yes' | 'no' | null;

export interface CompanyInfo {
  companyName: string;
  industry: string;
  role: string;
  dealSize: number;
}

export interface AssessmentState {
  framework: Framework;
  companyInfo: CompanyInfo;
  email: string;
  answers: Answer[];
  currentQuestion: number;
  lastModified?: string;
  id?: string;
  audit_id?: string;
  ip_address?: string;
}

interface AssessmentContextType {
  state: AssessmentState;
  history: AssessmentState[];
  setFramework: (framework: Framework) => void;
  setCompanyInfo: (info: CompanyInfo) => void;
  setEmail: (email: string) => void;
  setAnswer: (questionIndex: number, answer: Answer) => void;
  setCurrentQuestion: (index: number) => void;
  resetAssessment: () => void;
  calculateScore: (answersOverride?: Answer[]) => number;
  getRiskLevel: (score: number) => 'CRITICAL' | 'MODERATE' | 'HEALTHY';
  calculateMoneyAtRisk: () => number;
  resumeSession: (session: AssessmentState) => void;
  setIpAddress: (ip: string) => void;
  syncAuditToSupabase: (stateOverride?: AssessmentState) => void;
}

export const initialState: AssessmentState = {
  framework: null,
  companyInfo: {
    companyName: '',
    industry: '',
    role: '',
    dealSize: 25000
  },
  email: '',
  answers: Array(15).fill(null),
  currentQuestion: 0,
  id: Math.random().toString(36).substr(2, 9),
  audit_id: undefined,
  ip_address: undefined,
  lastModified: new Date().toISOString()
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AssessmentState>(() => {
    const saved = localStorage.getItem('assessmentState');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [history, setHistory] = useState<AssessmentState[]>(() => {
    const saved = localStorage.getItem('assessmentHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Persist Current State
  React.useEffect(() => {
    localStorage.setItem('assessmentState', JSON.stringify({ ...state, lastModified: new Date().toISOString() }));

    // Auto-update history if it's an existing session
    if (state.framework) {
      setHistory(prev => {
        const index = prev.findIndex(item => item.id === state.id);
        const newState = { ...state, lastModified: new Date().toISOString() };
        if (index >= 0) {
          const newHistory = [...prev];
          newHistory[index] = newState;
          return newHistory;
        } else {
          return [newState, ...prev];
        }
      });
    }
  }, [state]);

  // Persist History
  React.useEffect(() => {
    localStorage.setItem('assessmentHistory', JSON.stringify(history));
  }, [history]);

  const setFramework = (framework: Framework) => {
    setState(prev => ({ ...prev, framework }));
  };

  const setCompanyInfo = (info: CompanyInfo) => {
    setState(prev => ({ ...prev, companyInfo: info }));
  };

  const setEmail = (email: string) => {
    setState(prev => ({ ...prev, email }));
    // Sync will be triggered by onBlur in the component for the lead capture requirement
  };

  const setIpAddress = (ip: string) => {
    setState(prev => ({ ...prev, ip_address: ip }));
  };

  const syncAuditToSupabase = async (stateOverride?: AssessmentState) => {
    const dataToSync = stateOverride || state;

    // Skip if we don't have an audit_id yet
    if (!dataToSync.audit_id) return;

    try {
      const payload = {
        audit_id: dataToSync.audit_id,
        company_name: dataToSync.companyInfo.companyName,
        industry: dataToSync.companyInfo.industry,
        user_role: dataToSync.companyInfo.role,
        deal_size: dataToSync.companyInfo.dealSize,
        email: dataToSync.email,
        readiness_score: calculateScore(dataToSync.answers),
        answers: dataToSync.answers,
        ip_address: dataToSync.ip_address,
        framework: dataToSync.framework
      };


      const { error } = await supabase
        .from('audits')
        .upsert(payload, { onConflict: 'audit_id' });

      if (error && import.meta.env.DEV) {
        console.error('Supabase Sync Error:', error.message, error.details, error.hint);
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Network Error during Supabase sync:', error);
      }
    }
  };

  const setAnswer = (questionIndex: number, answer: Answer) => {
    setState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[questionIndex] = answer;
      return { ...prev, answers: newAnswers };
    });
  };

  const setCurrentQuestion = (index: number) => {
    setState(prev => ({ ...prev, currentQuestion: index }));
  };

  // Live Sync Effect
  useEffect(() => {
    if (state.audit_id) {
      syncAuditToSupabase();
    }
  }, [state.answers, state.framework, state.companyInfo, state.email, state.audit_id, state.ip_address]);

  const resetAssessment = () => {
    const newState = {
      ...initialState,
      id: Math.random().toString(36).substr(2, 9),
      audit_id: crypto.randomUUID(), // New UUID for fresh start
      ip_address: state.ip_address // Preserve IP
    };
    setState(newState);
    localStorage.setItem('assessmentState', JSON.stringify(newState));
  };

  const resumeSession = (session: AssessmentState) => {
    setState(session);
  };

  const calculateScore = (answersOverride?: Answer[]): number => {
    const targetAnswers = answersOverride || state.answers;
    let score = 59; // Initial score
    const TIER_1 = [1, 2, 6, 9, 13];
    const TIER_2 = [3, 5, 8, 11, 15];
    const TIER_3 = [4, 7, 10, 12, 14];

    targetAnswers.forEach((answer, index) => {
      const qId = index + 1;
      if (answer === 'yes') {
        if (TIER_1.includes(qId)) score += 4;
        else if (TIER_2.includes(qId)) score += 3;
        else if (TIER_3.includes(qId)) score += 2;
      } else if (answer === 'no') {
        if (TIER_1.includes(qId)) score -= 12;
        else if (TIER_2.includes(qId)) score -= 9;
        else if (TIER_3.includes(qId)) score -= 7;
      }
    });

    return Math.min(89, Math.max(0, score));
  };

  const getRiskLevel = (score: number): 'CRITICAL' | 'MODERATE' | 'HEALTHY' => {
    if (score < 40) return 'CRITICAL';
    if (score < 70) return 'MODERATE';
    return 'HEALTHY';
  };

  const calculateMoneyAtRisk = (): number => {
    const { dealSize } = state.companyInfo;
    const score = calculateScore();

    const pipelineRisk = dealSize * 3;
    const auditFine = score < 30 ? 50000 : score < 50 ? 25000 : 10000;
    const delayMonths = score < 50 ? 6 : 3;
    const delayCost = (dealSize * 0.5) * delayMonths;

    return Math.round(pipelineRisk + auditFine + delayCost);
  };

  return (
    <AssessmentContext.Provider
      value={{
        state,
        history,
        setFramework,
        setCompanyInfo,
        setEmail,
        setAnswer,
        setCurrentQuestion,
        resetAssessment,
        calculateScore,
        getRiskLevel,
        calculateMoneyAtRisk,
        resumeSession,
        setIpAddress,
        syncAuditToSupabase
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
