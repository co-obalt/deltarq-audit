import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is the DeltaRQ Enterprise Deal-Readiness Audit?",
    answer: "The DeltaRQ Deal-Readiness Audit is a comprehensive assessment designed to evaluate your SaaS platform's security controls, cloud configurations, and operational posture against the standards enterprise buyers expect (such as SOC 2, HIPAA, and ISO 27001)."
  },
  {
    question: "How long does the audit assessment take?",
    answer: "The automated self-assessment takes less than 15 minutes. Once completed, you will immediately receive a readiness score and a detailed gap report mapping control failures to business ARR risk."
  },
  {
    question: "What frameworks are supported by the audit scanner?",
    answer: "DeltaRQ currently supports SOC 2 (Security and Confidentiality Criteria), HIPAA Security Rule (for healthcare compliance), and ISO 27001 (Information Security Management System)."
  },
  {
    question: "Are my cloud credentials and scan data secure?",
    answer: "Yes. DELTARQ SCAN runs completely local via a developer-focused CLI tool, scanning configuration parameters and git logs on your device. Your sensitive code metadata and credentials never leave your workspace, ensuring complete privacy."
  },
  {
    question: "What does the readiness report include?",
    answer: "The report includes an overall compliance readiness score, a detailed breakdown of failed controls across Identity, Infrastructure, and Data Protection domains, technical remediation guides, and a PDF format report ready to share with stakeholders."
  }
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="mb-24 border-t border-slate-100 pt-20">
      <div className="max-w-3xl mx-auto text-left">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-violet-600 mb-4">FAQ</p>
        <h2 className="text-[32px] md:text-[40px] font-black text-slate-900 mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50/50 transition-colors duration-200 hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="flex items-center justify-between w-full p-5 text-left focus:outline-none"
                >
                  <span className="text-[15px] font-bold text-slate-800 pr-4">{faq.question}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-violet-600' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-[13px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3 bg-white">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
