export interface RemediationModule {
  id: string;
  questionIndex: number;
  title: string;
  category: 'Access & Identity' | 'Data & Infrastructure' | 'Business Continuity';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  
  auditorPerspective: {
    concern: string;
    dealImpact: string;
    complianceFlags: {
      soc2: string;
      iso: string;
      hipaa: string;
    };
  };
  
  technicalFix: {
    solution: string;
    steps: string[];
    timeline: string;
    cost: string;
    difficulty: 'Low' | 'Medium' | 'High';
  };
  
  financialImpact: {
    dealMultiplier: number;
    delayMonths: number;
    remediationCost: number;
  };
  
  evidenceRequired: string[];
  successMetrics: string[];
}

export const remediationModules: RemediationModule[] = [
  {
    id: "GAP-001",
    questionIndex: 0,
    title: "Missing Centralized Identity Provider",
    category: "Access & Identity",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Without centralized authentication, we cannot verify your access control governance. Manual user provisioning creates audit trail gaps and prevents real-time access revocation.",
      dealImpact: "Enterprise security teams classify decentralized identity management as 'High Risk.' This triggers extended vendor assessments (4-6 month delays) and often results in automatic disqualification during initial screening.",
      complianceFlags: {
        soc2: "Fails CC6.1 (Logical Access Controls)",
        iso: "Violates A.9.2 (User Access Management)",
        hipaa: "§164.312(a)(1) Technical Safeguard Deficiency"
      }
    },
    technicalFix: {
      solution: "Implement organization-wide Single Sign-On (SSO) through Google Workspace or Azure AD",
      steps: [
        "Choose identity provider: Google Workspace ($6/user/mo) or Azure AD ($8/user/mo)",
        "Migrate all employee accounts to centralized directory (1-2 weeks)",
        "Configure SAML/OAuth SSO for all business applications (GitHub, AWS, Slack)",
        "Enforce SSO requirement in identity provider settings",
        "Document user provisioning/deprovisioning procedures"
      ],
      timeline: "3-4 weeks",
      cost: "$300-800/month",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 2,
      delayMonths: 4,
      remediationCost: 5000
    },
    evidenceRequired: [
      "Screenshot of identity provider admin panel showing active users",
      "List of SSO-integrated applications",
      "User provisioning/deprovisioning policy document"
    ],
    successMetrics: [
      "100% employee authentication via SSO",
      "Zero shared passwords across organization",
      "Access revocation capability within 1 hour"
    ]
  },
  {
    id: "GAP-002",
    questionIndex: 1,
    title: "Multi-Factor Authentication Not Enforced",
    category: "Access & Identity",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Password-only authentication represents the highest credential compromise risk. 82% of data breaches involve stolen credentials. Without MFA, a single phishing attack grants attackers complete system access.",
      dealImpact: "MFA enforcement is explicitly required in 94% of enterprise security policies. Banking, healthcare, and government buyers will not proceed past initial questionnaire without confirmed MFA implementation.",
      complianceFlags: {
        soc2: "Fails CC6.1 (Authentication Controls)",
        iso: "Violates A.9.4.2 (Secure Log-on Procedures)",
        hipaa: "§164.312(d) Addressable - De Facto Required"
      }
    },
    technicalFix: {
      solution: "Enable mandatory MFA for all users via identity provider",
      steps: [
        "Enable MFA enforcement in Google Workspace/Azure AD admin console",
        "Configure accepted MFA methods (authenticator apps, security keys)",
        "Communicate rollout plan to employees (1 week notice)",
        "Set enforcement deadline and monitor compliance",
        "Enable MFA for third-party services (GitHub, AWS Console, databases)"
      ],
      timeline: "1 week",
      cost: "$0 (included in identity provider)",
      difficulty: "Low"
    },
    financialImpact: {
      dealMultiplier: 3,
      delayMonths: 6,
      remediationCost: 0
    },
    evidenceRequired: [
      "MFA enforcement policy document",
      "Screenshot showing 100% user MFA compliance",
      "List of MFA-protected systems"
    ],
    successMetrics: [
      "100% workforce using MFA",
      "Zero single-factor authentication endpoints",
      "MFA requirement documented in security policy"
    ]
  },
  {
    id: "GAP-003",
    questionIndex: 2,
    title: "Delayed Access Revocation Process",
    category: "Access & Identity",
    severity: "HIGH",
    auditorPerspective: {
      concern: "Manual offboarding creates windows of vulnerability where terminated employees retain data access. Enterprise legal teams view this as unacceptable liability—former employees accessing customer data post-termination is a breach waiting to happen.",
      dealImpact: "Inability to demonstrate instant, complete access revocation results in 'High Risk' vendor classification. Cyber insurance underwriters flag this as uninsurable, which enterprise procurement teams verify before contract approval.",
      complianceFlags: {
        soc2: "Fails CC6.3 (User Lifecycle Management)",
        iso: "Violates A.8.1.4 (Return of Assets)",
        hipaa: "§164.308(a)(3)(ii)(C) Termination Procedures"
      }
    },
    technicalFix: {
      solution: "Implement automated deprovisioning via identity provider + offboarding checklist",
      steps: [
        "Create offboarding workflow template (HR triggers IT)",
        "Configure automated deprovisioning in identity provider",
        "Document manual steps for non-SSO systems (code repos, AWS root access)",
        "Set up Slack/email alerts for IT when offboarding initiates",
        "Establish access verification procedure (weekly audit of active accounts)"
      ],
      timeline: "2-3 weeks",
      cost: "$3,000 (automation setup)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 2.5,
      delayMonths: 4,
      remediationCost: 3000
    },
    evidenceRequired: [
      "Offboarding checklist template",
      "Logs showing access revocation within 1 hour",
      "Quarterly access review reports"
    ],
    successMetrics: [
      "Access revoked within 60 minutes of termination notification",
      "Zero orphaned accounts in monthly audits",
      "100% offboarding checklist completion rate"
    ]
  },
  {
    id: "GAP-004",
    questionIndex: 3,
    title: "No Organization-Wide Password Manager",
    category: "Access & Identity",
    severity: "MEDIUM",
    auditorPerspective: {
      concern: "Shared passwords and credential reuse create untracked access to sensitive systems. Without centralized password management, you cannot demonstrate password hygiene or emergency credential rotation capabilities.",
      dealImpact: "Enterprise security questionnaires specifically ask about password management. Manual practices trigger 'Does Not Meet Requirements' classifications in 73% of enterprise RFPs.",
      complianceFlags: {
        soc2: "CC6.1 Weakness (Password Management)",
        iso: "A.9.4.3 Violation (Password Management System)",
        hipaa: "§164.308(a)(5)(ii)(D) Password Gap"
      }
    },
    technicalFix: {
      solution: "Deploy enterprise password manager organization-wide",
      steps: [
        "Select password manager (1Password Business, Dashlane, Bitwarden)",
        "Configure organization policies (password strength, sharing rules)",
        "Roll out to team with training session",
        "Migrate shared credentials to secure vaults",
        "Enable emergency access procedures"
      ],
      timeline: "1-2 weeks",
      cost: "$600/year (approx. $8/user/month)",
      difficulty: "Low"
    },
    financialImpact: {
      dealMultiplier: 1.5,
      delayMonths: 2,
      remediationCost: 600
    },
    evidenceRequired: [
      "Password manager admin console screenshot",
      "Password policy documentation",
      "User training completion records"
    ],
    successMetrics: [
      "100% team adoption of password manager",
      "Zero shared credentials outside vault",
      "Password rotation policy enforced"
    ]
  },
  {
    id: "GAP-005",
    questionIndex: 4,
    title: "Missing Quarterly Access Reviews",
    category: "Access & Identity",
    severity: "MEDIUM",
    auditorPerspective: {
      concern: "Without regular access reviews, permission creep accumulates. Users retain access to systems they no longer need, expanding your attack surface and violating least-privilege principles.",
      dealImpact: "This gap creates 'Material Weakness' findings in compliance audits, triggering 3-4 month delays while you establish retroactive evidence of access governance.",
      complianceFlags: {
        soc2: "Fails CC6.2 (Access Review)",
        iso: "Violates A.9.2.5 (Review of User Access Rights)",
        hipaa: "§164.308(a)(4)(ii)(C) Access Review Gap"
      }
    },
    technicalFix: {
      solution: "Establish quarterly user access review process",
      steps: [
        "Create access review template/checklist",
        "Assign access review owners for each system",
        "Schedule quarterly calendar reminders",
        "Document review findings and remediation actions",
        "Implement access certification workflow"
      ],
      timeline: "2 weeks",
      cost: "$2,000 (process setup + tools)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 2,
      delayMonths: 3,
      remediationCost: 2000
    },
    evidenceRequired: [
      "Access review policy document",
      "Completed quarterly review reports",
      "Evidence of remediation actions"
    ],
    successMetrics: [
      "Quarterly reviews completed on schedule",
      "All access exceptions documented and justified",
      "Permission creep reduced by 50%"
    ]
  },
  {
    id: "GAP-006",
    questionIndex: 5,
    title: "Unencrypted Data at Rest",
    category: "Data & Infrastructure",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Unencrypted customer data represents immediate regulatory violation and catastrophic breach risk. If physical storage is compromised (stolen laptop, decommissioned drive), all data is exposed in plaintext. This is legally indefensible in breach scenarios.",
      dealImpact: "Encryption at rest is table-stakes for regulated industries. Banks, healthcare, and government entities will not even begin security review without confirmed AES-256 encryption. This is the #1 technical requirement in 91% of enterprise RFPs.",
      complianceFlags: {
        soc2: "Fails Confidentiality Principle",
        iso: "Violates A.18.1.5 (Cryptographic Controls)",
        hipaa: "§164.312(a)(2)(iv) Encryption - Required"
      }
    },
    technicalFix: {
      solution: "Enable database encryption and encrypt file storage buckets",
      steps: [
        "Enable encryption at rest in database settings (AWS RDS, MongoDB Atlas)",
        "Encrypt S3 buckets using AWS KMS (Server-Side Encryption)",
        "Implement application-level encryption for sensitive fields (PII, PCI data)",
        "Document encryption key management procedures",
        "Test data recovery with encrypted backups"
      ],
      timeline: "4-6 weeks",
      cost: "$8,000 (implementation + key management)",
      difficulty: "High"
    },
    financialImpact: {
      dealMultiplier: 4,
      delayMonths: 6,
      remediationCost: 8000
    },
    evidenceRequired: [
      "Database encryption configuration screenshots",
      "S3 bucket encryption policy documentation",
      "Key management procedure document"
    ],
    successMetrics: [
      "100% customer data encrypted at rest (AES-256)",
      "Encryption key rotation procedure documented",
      "Annual encryption audit completed"
    ]
  },
  {
    id: "GAP-007",
    questionIndex: 6,
    title: "Missing Encryption in Transit",
    category: "Data & Infrastructure",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Without TLS encryption, data can be intercepted during transmission. Man-in-the-middle attacks become feasible, and any intercepted data is immediately compromised.",
      dealImpact: "Enterprise InfoSec teams classify unencrypted transmission as 'Critical Risk' and will not approve vendor onboarding. One intercepted transaction can result in lawsuit and contract termination.",
      complianceFlags: {
        soc2: "Fails CC6.7 (Transmission Protection)",
        iso: "Violates A.13.1.1 (Network Controls)",
        hipaa: "§164.312(e)(1) Transmission Security Required"
      }
    },
    technicalFix: {
      solution: "Implement TLS 1.2+ for all connections and APIs",
      steps: [
        "Audit all API endpoints for TLS configuration",
        "Upgrade any TLS 1.0/1.1 connections to TLS 1.2+",
        "Configure HTTPS-only for all web traffic",
        "Implement certificate management and auto-renewal",
        "Test for deprecated protocols with security scanner"
      ],
      timeline: "2-3 weeks",
      cost: "$4,000 (configuration + testing)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 3,
      delayMonths: 5,
      remediationCost: 4000
    },
    evidenceRequired: [
      "TLS configuration audit report",
      "SSL/TLS scanner results showing TLS 1.2+",
      "Certificate management documentation"
    ],
    successMetrics: [
      "100% connections using TLS 1.2 or higher",
      "Zero deprecated protocol usage",
      "Automated certificate renewal in place"
    ]
  },
  {
    id: "GAP-008",
    questionIndex: 7,
    title: "Mixed Production/Development Environments",
    category: "Data & Infrastructure",
    severity: "HIGH",
    auditorPerspective: {
      concern: "Using production data in development creates uncontrolled data exposure. Developers with test environment access gain unauthorized access to real customer data, violating data protection principles.",
      dealImpact: "Mixed environments are flagged as 'Uninsurable' by cyber insurance providers. Enterprise buyers check your insurance status before signing—no separation means no insurance means no deal.",
      complianceFlags: {
        soc2: "Fails CC6.5 (Segregation of Duties)",
        iso: "Violates A.12.1.4 (Environment Separation)",
        hipaa: "§164.308(a)(4)(ii)(B) Isolation Requirement"
      }
    },
    technicalFix: {
      solution: "Establish complete separation between production and non-production environments",
      steps: [
        "Create separate AWS accounts/GCP projects for prod vs. dev",
        "Implement synthetic data generation for testing",
        "Migrate development data to anonymized datasets",
        "Configure network isolation between environments",
        "Document access controls for each environment"
      ],
      timeline: "4-5 weeks",
      cost: "$6,000 (infrastructure + migration)",
      difficulty: "High"
    },
    financialImpact: {
      dealMultiplier: 2.5,
      delayMonths: 4,
      remediationCost: 6000
    },
    evidenceRequired: [
      "Environment architecture diagram",
      "Data anonymization procedures",
      "Access control matrix per environment"
    ],
    successMetrics: [
      "Zero production data in development",
      "Separate access credentials per environment",
      "Network segmentation verified"
    ]
  },
  {
    id: "GAP-009",
    questionIndex: 8,
    title: "Missing Comprehensive Audit Logs",
    category: "Data & Infrastructure",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Without audit logs, you cannot prove who accessed what data and when. This is the primary audit evidence for SOC 2 certification. In breach scenarios, lack of logs makes forensic investigation impossible and dramatically increases legal liability.",
      dealImpact: "This is the #1 reason SOC 2 audits fail. Enterprise legal teams will not approve vendor contracts without demonstrated audit trail capabilities. 100% deal rejection rate during security review if logs are missing.",
      complianceFlags: {
        soc2: "Fails CC7.2 (System Monitoring) - CRITICAL",
        iso: "Violates A.12.4.1 (Event Logging) - CRITICAL",
        hipaa: "§164.312(b) Audit Controls - Required"
      }
    },
    technicalFix: {
      solution: "Implement centralized logging with 6-month retention",
      steps: [
        "Enable AWS CloudTrail for infrastructure access logs",
        "Configure application logging (who accessed which customer records)",
        "Set up log aggregation (Datadog, Splunk, or AWS CloudWatch)",
        "Define log retention policy (minimum 6 months)",
        "Establish log review procedures (weekly security team review)"
      ],
      timeline: "6-8 weeks",
      cost: "$12,000 (infrastructure + retention storage)",
      difficulty: "High"
    },
    financialImpact: {
      dealMultiplier: 5,
      delayMonths: 8,
      remediationCost: 12000
    },
    evidenceRequired: [
      "Log retention policy document",
      "Sample log exports showing access trails",
      "Log review meeting notes (weekly)"
    ],
    successMetrics: [
      "100% system access logged with user identification",
      "Logs retained for minimum 6 months",
      "Log review conducted weekly by security team"
    ]
  },
  {
    id: "GAP-010",
    questionIndex: 9,
    title: "No Automated Backup with Tested Recovery",
    category: "Data & Infrastructure",
    severity: "HIGH",
    auditorPerspective: {
      concern: "Without tested backup and recovery procedures, you cannot guarantee business continuity. Ransomware attacks or system failures could result in permanent data loss.",
      dealImpact: "Enterprise SLAs require 99.9% uptime guarantees. Without proven recovery, you cannot sign those contracts. One ransomware attack without backups equals business death.",
      complianceFlags: {
        soc2: "Fails Availability Principle",
        iso: "Violates A.17.1.2 (Information Security Continuity)",
        hipaa: "§164.308(a)(7)(ii)(A) Backup Requirement"
      }
    },
    technicalFix: {
      solution: "Implement automated daily backups with quarterly recovery testing",
      steps: [
        "Configure automated daily database backups",
        "Set up file storage backup (S3 versioning, cross-region replication)",
        "Document recovery procedures (step-by-step runbook)",
        "Schedule quarterly disaster recovery drills",
        "Test backup restoration and verify data integrity"
      ],
      timeline: "3-4 weeks",
      cost: "$4,000 (setup + storage costs)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 3,
      delayMonths: 5,
      remediationCost: 4000
    },
    evidenceRequired: [
      "Backup configuration screenshots",
      "Recovery procedure documentation",
      "Quarterly DR drill reports"
    ],
    successMetrics: [
      "Daily automated backups verified",
      "Recovery tested quarterly",
      "RTO/RPO targets documented and met"
    ]
  },
  {
    id: "GAP-011",
    questionIndex: 10,
    title: "No Documented Incident Response Plan",
    category: "Business Continuity",
    severity: "CRITICAL",
    auditorPerspective: {
      concern: "Without an incident response plan, your reaction to breaches will be chaotic and legally indefensible. Delays in notification can result in regulatory penalties and increased liability.",
      dealImpact: "72% of enterprise contracts require proof of an Incident Response Plan before signing. Without it, procurement cannot approve you. Regulatory requirement for GDPR/HIPAA compliance.",
      complianceFlags: {
        soc2: "Fails CC7.3 (Incident Response)",
        iso: "Violates A.16.1 (Incident Management)",
        hipaa: "§164.308(a)(6) Security Incident Procedures - Required"
      }
    },
    technicalFix: {
      solution: "Create and document comprehensive incident response plan",
      steps: [
        "Define incident classification levels (severity 1-4)",
        "Document response procedures for each incident type",
        "Assign incident response team roles and responsibilities",
        "Create communication templates (customer, regulatory, internal)",
        "Conduct tabletop exercises with team"
      ],
      timeline: "2-3 weeks",
      cost: "$3,000 (documentation + training)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 3,
      delayMonths: 5,
      remediationCost: 3000
    },
    evidenceRequired: [
      "Incident Response Plan document",
      "Team roster with contact information",
      "Tabletop exercise results and lessons learned"
    ],
    successMetrics: [
      "IRP documented and approved",
      "Team trained on procedures",
      "Annual tabletop exercise completed"
    ]
  },
  {
    id: "GAP-012",
    questionIndex: 11,
    title: "No Employee Background Checks",
    category: "Business Continuity",
    severity: "MEDIUM",
    auditorPerspective: {
      concern: "Without background verification, you cannot demonstrate due diligence in workforce security. Insider threats remain unmitigated, and you lack defensible HR practices.",
      dealImpact: "Banks and healthcare companies will not work with vendors who skip background checks. This is non-negotiable for regulated industries.",
      complianceFlags: {
        soc2: "CC1.4 Weakness (Workforce Screening)",
        iso: "A.7.1.1 Violation (Screening)",
        hipaa: "§164.308(a)(3)(ii)(B) Background Check Gap"
      }
    },
    technicalFix: {
      solution: "Implement pre-employment background check process",
      steps: [
        "Select background check provider (Checkr, Sterling, GoodHire)",
        "Define screening criteria appropriate to role",
        "Update offer letters to require background check completion",
        "Document screening policy and retention procedures",
        "Train HR on consistent application of policy"
      ],
      timeline: "1-2 weeks",
      cost: "$1,500 (service setup + per-check costs)",
      difficulty: "Low"
    },
    financialImpact: {
      dealMultiplier: 2,
      delayMonths: 3,
      remediationCost: 1500
    },
    evidenceRequired: [
      "Background check policy document",
      "Provider contract or agreement",
      "Sample completion certificates (redacted)"
    ],
    successMetrics: [
      "100% new hires background checked",
      "Policy consistently applied",
      "Records retained per policy"
    ]
  },
  {
    id: "GAP-013",
    questionIndex: 12,
    title: "Missing Vendor Security Agreements",
    category: "Business Continuity",
    severity: "HIGH",
    auditorPerspective: {
      concern: "Without signed Business Associate Agreements (BAAs) or security agreements with subprocessors, you are legally liable for their security breaches affecting customer data.",
      dealImpact: "Healthcare/finance sectors mandate BAAs with all vendors processing regulated data. Using AWS, Stripe, or OpenAI without executed agreements creates immediate compliance violations.",
      complianceFlags: {
        soc2: "Fails CC9.2 (Vendor Risk Management)",
        iso: "Violates A.15.1.1 (Supplier Security)",
        hipaa: "§164.308(b)(1) Business Associate Contracts - Required"
      }
    },
    technicalFix: {
      solution: "Execute security agreements with all third-party service providers",
      steps: [
        "Inventory all third-party services accessing customer data",
        "Request BAAs from healthcare-relevant vendors (AWS, Twilio, SendGrid)",
        "Execute Data Processing Agreements (DPAs) with SaaS tools",
        "Document vendor security assessment process",
        "Maintain vendor risk register with annual review cycle"
      ],
      timeline: "3-4 weeks",
      cost: "$2,000 (legal review + contract management)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 3,
      delayMonths: 5,
      remediationCost: 2000
    },
    evidenceRequired: [
      "Executed BAAs with all relevant vendors",
      "Vendor risk register spreadsheet",
      "Vendor security assessment questionnaire template"
    ],
    successMetrics: [
      "100% vendors with signed security agreements",
      "Vendor risk register reviewed quarterly",
      "Annual vendor security reassessments completed"
    ]
  },
  {
    id: "GAP-014",
    questionIndex: 13,
    title: "No Recent Penetration Test or Security Audit",
    category: "Business Continuity",
    severity: "MEDIUM",
    auditorPerspective: {
      concern: "Without independent security validation, you cannot demonstrate proactive vulnerability management. Known security flaws may exist that attackers could exploit.",
      dealImpact: "Enterprise buyers require proof of recent security testing. Without a pentest report, they assume you are vulnerable. Competitors with pentests close deals 3x faster.",
      complianceFlags: {
        soc2: "CC7.1 Weakness (Vulnerability Management)",
        iso: "A.18.2.3 Recommendation (Technical Compliance Review)",
        hipaa: "§164.308(a)(8) Evaluation Gap"
      }
    },
    technicalFix: {
      solution: "Conduct annual penetration test by qualified third party",
      steps: [
        "Select penetration testing vendor (Cobalt, Synack, Bishop Fox)",
        "Define scope (web app, infrastructure, APIs)",
        "Schedule test window with minimal business impact",
        "Remediate identified vulnerabilities",
        "Document remediation and request retest of critical findings"
      ],
      timeline: "4-6 weeks (including remediation)",
      cost: "$8,000 (pentest engagement)",
      difficulty: "Medium"
    },
    financialImpact: {
      dealMultiplier: 2,
      delayMonths: 3,
      remediationCost: 8000
    },
    evidenceRequired: [
      "Penetration test report (executive summary)",
      "Remediation tracking spreadsheet",
      "Retest confirmation for critical findings"
    ],
    successMetrics: [
      "Annual pentest completed",
      "All critical/high findings remediated",
      "Remediation verified by retesting"
    ]
  },
  {
    id: "GAP-015",
    questionIndex: 14,
    title: "No Cyber Insurance Coverage",
    category: "Business Continuity",
    severity: "MEDIUM",
    auditorPerspective: {
      concern: "Without cyber insurance, breach response costs come directly from company reserves. Legal fees, forensic investigation, customer notification, and regulatory fines can exceed $500K for even small breaches.",
      dealImpact: "Most enterprise contracts require minimum $1M cyber insurance. Without it, procurement cannot approve the deal. Getting insurance last-minute takes 2-3 months.",
      complianceFlags: {
        soc2: "Not required - Contractual expectation",
        iso: "Risk Treatment option - Financial prudence",
        hipaa: "Not required - Financial safeguard"
      }
    },
    technicalFix: {
      solution: "Obtain cyber insurance policy with minimum $1M coverage",
      steps: [
        "Contact insurance broker specializing in cyber coverage",
        "Complete security questionnaire (triggers may be flagged)",
        "Address any security gaps flagged by underwriter",
        "Review policy terms and coverage limits",
        "Maintain certificate of insurance for customer requests"
      ],
      timeline: "4-6 weeks (underwriting process)",
      cost: "$5,000-15,000/year (premium)",
      difficulty: "Low"
    },
    financialImpact: {
      dealMultiplier: 2,
      delayMonths: 3,
      remediationCost: 5000
    },
    evidenceRequired: [
      "Certificate of Insurance",
      "Policy declarations page",
      "Coverage limit documentation"
    ],
    successMetrics: [
      "Active cyber insurance policy",
      "Minimum $1M coverage maintained",
      "Annual policy renewal completed"
    ]
  }
];

// Helper function to get remediation module by question index
export const getRemediationByIndex = (index: number): RemediationModule | undefined => {
  return remediationModules.find(m => m.questionIndex === index);
};

// Calculate financial impact for a specific gap
export const calculateGapImpact = (module: RemediationModule, dealSize: number) => {
  const pipelineImpact = dealSize * module.financialImpact.dealMultiplier;
  const delayImpact = (dealSize * 0.2) * module.financialImpact.delayMonths;
  const totalImpact = pipelineImpact + delayImpact + module.financialImpact.remediationCost;
  
  return {
    pipelineImpact,
    delayMonths: module.financialImpact.delayMonths,
    delayImpact,
    remediationCost: module.financialImpact.remediationCost,
    totalImpact
  };
};

// Get detected gaps based on answers
export const getDetectedGaps = (answers: (string | null)[]) => {
  return remediationModules.filter((module, index) => answers[index] === 'no');
};

// Sort gaps by severity
export const sortGapsBySeverity = (gaps: RemediationModule[]) => {
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 };
  return [...gaps].sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
};
