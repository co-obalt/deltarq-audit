export interface Question {
  id: number;
  text: string;
  category: 'access' | 'data' | 'business';
  weight: number;
}

export const questions: Question[] = [
  {
    id: 1,
    text: "Do you have a central identity provider (Google Workspace/Azure AD) for ALL employee logins?",
    category: "access",
    weight: 15
  },
  {
    id: 2,
    text: "Is Multi-Factor Authentication (MFA) MANDATORY for every employee, including contractors?",
    category: "access",
    weight: 20
  },
  {
    id: 3,
    text: "Can you revoke ALL access (email, code repos, databases) within 1 hour of an employee leaving?",
    category: "access",
    weight: 12
  },
  {
    id: 4,
    text: "Do you use a password manager (1Password/Dashlane) organization-wide?",
    category: "access",
    weight: 8
  },
  {
    id: 5,
    text: "Do you review and audit user access permissions at least quarterly?",
    category: "access",
    weight: 10
  },
  {
    id: 6,
    text: "Is ALL customer data encrypted at rest (AES-256 or equivalent)?",
    category: "data",
    weight: 20
  },
  {
    id: 7,
    text: "Is data encrypted in transit (TLS 1.2+ for all connections)?",
    category: "data",
    weight: 15
  },
  {
    id: 8,
    text: "Is production data stored COMPLETELY SEPARATE from development/testing?",
    category: "data",
    weight: 12
  },
  {
    id: 9,
    text: "Can you provide logs showing WHO accessed customer data in the last 6 months?",
    category: "data",
    weight: 18
  },
  {
    id: 10,
    text: "Do you have automated daily backups with tested recovery procedures?",
    category: "data",
    weight: 10
  },
  {
    id: 11,
    text: "Do you have a documented Incident Response Plan for data breaches?",
    category: "business",
    weight: 15
  },
  {
    id: 12,
    text: "Do ALL employees undergo background checks before hiring?",
    category: "business",
    weight: 8
  },
  {
    id: 13,
    text: "Do ALL third-party vendors (Stripe, AWS, OpenAI) have signed security agreements?",
    category: "business",
    weight: 12
  },
  {
    id: 14,
    text: "Have you had a penetration test or security audit in the last 12 months?",
    category: "business",
    weight: 10
  },
  {
    id: 15,
    text: "Do you have cyber insurance coverage for data breaches?",
    category: "business",
    weight: 5
  }
];

export const categoryLabels: Record<string, string> = {
  access: "ACCESS & IDENTITY",
  data: "DATA & INFRASTRUCTURE",
  business: "BUSINESS CONTINUITY"
};

export const frameworkCompliance: Record<string, Record<string, { control: string; title: string; description: string; requirement: string }>> = {
  q1: {
    soc2: {
      control: "CC6.1",
      title: "Logical and Physical Access Controls",
      description: "Organizations must implement centralized authentication mechanisms to restrict both logical and physical access to information assets.",
      requirement: "Mandatory for SOC 2 Type II certification"
    },
    iso: {
      control: "A.9.2",
      title: "User Access Management",
      description: "ISO 27001 requires formal user registration and de-registration procedures with centralized identity management.",
      requirement: "Core control for ISO 27001:2022 compliance"
    },
    hipaa: {
      control: "§164.312(a)(1)",
      title: "Access Control - Technical Safeguards",
      description: "HIPAA mandates technical policies for electronic systems to allow access only to authorized persons.",
      requirement: "Required implementation specification"
    }
  },
  q2: {
    soc2: {
      control: "CC6.1",
      title: "Logical and Physical Access Controls",
      description: "Multi-factor authentication is a critical component. SOC 2 auditors expect MFA for all personnel accessing production systems.",
      requirement: "Standard practice for SOC 2 Type II"
    },
    iso: {
      control: "A.9.4.2",
      title: "Secure Log-on Procedures",
      description: "ISO 27001 requires strong authentication mechanisms. MFA satisfies 'something you know' and 'something you have' requirements.",
      requirement: "Recommended control for sensitive systems"
    },
    hipaa: {
      control: "§164.312(d)",
      title: "Person or Entity Authentication",
      description: "HIPAA requires procedures to verify identity of persons seeking access to ePHI. MFA is best practice.",
      requirement: "Addressable - strongly recommended"
    }
  },
  q3: {
    soc2: {
      control: "CC6.3",
      title: "User Lifecycle Management",
      description: "SOC 2 requires documented processes for timely removal of access rights when employment terminates.",
      requirement: "Critical for SOC 2 Type II certification"
    },
    iso: {
      control: "A.8.1.4",
      title: "Return of Assets",
      description: "ISO 27001 mandates that access rights are revoked upon termination with immediate, complete revocation.",
      requirement: "Mandatory control for ISO 27001"
    },
    hipaa: {
      control: "§164.308(a)(3)(ii)(C)",
      title: "Termination Procedures",
      description: "HIPAA requires procedures for terminating access to ePHI when employment ends.",
      requirement: "Required implementation specification"
    }
  },
  q4: {
    soc2: {
      control: "CC6.1",
      title: "Password Management",
      description: "SOC 2 auditors evaluate password complexity, storage, and sharing practices. Password managers demonstrate technical controls.",
      requirement: "Expected for SOC 2 Type II compliance"
    },
    iso: {
      control: "A.9.4.3",
      title: "Password Management System",
      description: "ISO 27001 requires formal password management systems that enforce complexity and secure storage.",
      requirement: "Standard control for ISO 27001"
    },
    hipaa: {
      control: "§164.308(a)(5)(ii)(D)",
      title: "Password Management",
      description: "HIPAA requires procedures for creating, changing, and safeguarding passwords.",
      requirement: "Addressable - industry best practice"
    }
  },
  q5: {
    soc2: {
      control: "CC6.2",
      title: "Prior to Issuing Credentials",
      description: "SOC 2 requires periodic review of logical access rights. Auditors examine evidence of regular review cycles.",
      requirement: "Required for SOC 2 Type II"
    },
    iso: {
      control: "A.9.2.5",
      title: "Review of User Access Rights",
      description: "ISO 27001 mandates that asset owners review users' access rights at regular intervals.",
      requirement: "Mandatory control for certification"
    },
    hipaa: {
      control: "§164.308(a)(4)(ii)(C)",
      title: "Access Review",
      description: "HIPAA requires periodic review of access rights to ePHI to ensure minimum necessary access.",
      requirement: "Required implementation specification"
    }
  },
  q6: {
    soc2: {
      control: "Confidentiality Principle",
      title: "Encryption of Data at Rest",
      description: "SOC 2 requires technical controls to protect data. AES-256 encryption is the industry standard.",
      requirement: "Critical for SOC 2 with Confidentiality"
    },
    iso: {
      control: "A.18.1.5",
      title: "Cryptographic Controls",
      description: "ISO 27001 requires cryptographic controls to protect confidentiality of information.",
      requirement: "Mandatory for sensitive data protection"
    },
    hipaa: {
      control: "§164.312(a)(2)(iv)",
      title: "Encryption and Decryption",
      description: "HIPAA strongly recommends encryption of ePHI at rest. OCR considers unencrypted ePHI critical vulnerability.",
      requirement: "Addressable - de facto required"
    }
  },
  q7: {
    soc2: {
      control: "CC6.7",
      title: "Transmission Protection",
      description: "SOC 2 requires encryption of data over public networks. TLS 1.2+ is minimum standard.",
      requirement: "Mandatory for SOC 2 certification"
    },
    iso: {
      control: "A.13.1.1",
      title: "Network Controls",
      description: "ISO 27001 requires technical controls to protect information in transit across networks.",
      requirement: "Core control for ISO 27001"
    },
    hipaa: {
      control: "§164.312(e)(1)",
      title: "Transmission Security",
      description: "HIPAA mandates technical security measures against unauthorized access during transmission.",
      requirement: "Required implementation specification"
    }
  },
  q8: {
    soc2: {
      control: "CC6.5",
      title: "Segregation of Duties",
      description: "SOC 2 requires separation between production and non-production environments.",
      requirement: "Standard practice for SOC 2 Type II"
    },
    iso: {
      control: "A.12.1.4",
      title: "Environment Separation",
      description: "ISO 27001 mandates separation between development/test and operational facilities.",
      requirement: "Mandatory control for ISO 27001"
    },
    hipaa: {
      control: "§164.308(a)(4)(ii)(B)",
      title: "Isolating Healthcare Functions",
      description: "HIPAA requires policies ensuring ePHI is not accessed during non-production activities.",
      requirement: "Required implementation specification"
    }
  },
  q9: {
    soc2: {
      control: "CC7.2",
      title: "Logging and Monitoring",
      description: "SOC 2 Type II requires comprehensive audit logging. This is the most scrutinized control in audits.",
      requirement: "Critical - primary audit evidence source"
    },
    iso: {
      control: "A.12.4.1",
      title: "Event Logging",
      description: "ISO 27001 mandates event logs recording user activities and security events with 6-month retention minimum.",
      requirement: "Mandatory control - audit trail requirement"
    },
    hipaa: {
      control: "§164.312(b)",
      title: "Audit Controls",
      description: "HIPAA requires mechanisms to record and examine activity in systems containing ePHI.",
      requirement: "Required - breach notification dependency"
    }
  },
  q10: {
    soc2: {
      control: "Availability Principle",
      title: "Backup and Recovery",
      description: "SOC 2 requires automated backup procedures and tested recovery processes.",
      requirement: "Critical for SOC 2 with Availability"
    },
    iso: {
      control: "A.17.1.2",
      title: "Information Security Continuity",
      description: "ISO 27001 requires mechanisms for availability and continuity during adverse situations.",
      requirement: "Mandatory for business continuity"
    },
    hipaa: {
      control: "§164.308(a)(7)(ii)(A)",
      title: "Data Backup",
      description: "HIPAA requires procedures to create and maintain retrievable exact copies of ePHI.",
      requirement: "Required implementation specification"
    }
  },
  q11: {
    soc2: {
      control: "CC7.3",
      title: "Incident Response",
      description: "SOC 2 requires documented procedures for identifying and responding to security incidents.",
      requirement: "Mandatory for SOC 2 Type II"
    },
    iso: {
      control: "A.16.1",
      title: "Incident Management",
      description: "ISO 27001 mandates formal incident management including detection, reporting, and response.",
      requirement: "Core control for ISO 27001"
    },
    hipaa: {
      control: "§164.308(a)(6)",
      title: "Security Incident Procedures",
      description: "HIPAA requires procedures to identify and respond to security incidents and document outcomes.",
      requirement: "Required - regulatory obligation"
    }
  },
  q12: {
    soc2: {
      control: "CC1.4",
      title: "Workforce Screening",
      description: "SOC 2 evaluates HR practices including background verification for personnel with data access.",
      requirement: "Expected for SOC 2 Type II"
    },
    iso: {
      control: "A.7.1.1",
      title: "Screening",
      description: "ISO 27001 requires background verification checks on all candidates prior to employment.",
      requirement: "Mandatory pre-employment control"
    },
    hipaa: {
      control: "§164.308(a)(3)(ii)(B)",
      title: "Background Checks",
      description: "HIPAA requires procedures for determining workforce access appropriateness to ePHI.",
      requirement: "Required implementation specification"
    }
  },
  q13: {
    soc2: {
      control: "CC9.2",
      title: "Vendor Risk Management",
      description: "SOC 2 requires evaluation of third-party security controls before sharing customer data.",
      requirement: "Critical for SOC 2 Type II"
    },
    iso: {
      control: "A.15.1.1",
      title: "Supplier Relationships",
      description: "ISO 27001 mandates security requirements in agreements with suppliers accessing information.",
      requirement: "Mandatory for third-party relationships"
    },
    hipaa: {
      control: "§164.308(b)(1)",
      title: "Business Associate Contracts",
      description: "HIPAA requires written contracts (BAAs) with business associates. Operating without BAAs is a violation.",
      requirement: "Required - contract mandate"
    }
  },
  q14: {
    soc2: {
      control: "CC7.1",
      title: "Vulnerability Management",
      description: "SOC 2 requires periodic security assessments. Penetration tests provide third-party validation.",
      requirement: "Standard practice for SOC 2 Type II"
    },
    iso: {
      control: "A.18.2.3",
      title: "Technical Compliance Review",
      description: "ISO 27001 requires regular reviews to ensure compliance with security policies.",
      requirement: "Recommended annual assessment"
    },
    hipaa: {
      control: "§164.308(a)(8)",
      title: "Security Assessment",
      description: "HIPAA requires periodic evaluation to demonstrate compliance with security rules.",
      requirement: "Required - ongoing evaluation mandate"
    }
  },
  q15: {
    soc2: {
      control: "Risk Management",
      title: "Cyber Insurance",
      description: "While not explicitly required, cyber insurance demonstrates risk management maturity.",
      requirement: "Not required - contractual expectation"
    },
    iso: {
      control: "Risk Treatment",
      title: "Financial Risk Transfer",
      description: "ISO 27001 includes risk transfer as acceptable treatment. Insurance provides financial protection.",
      requirement: "Not required - risk management option"
    },
    hipaa: {
      control: "Risk Management",
      title: "Financial Safeguards",
      description: "HIPAA doesn't mandate cyber insurance, but breach costs can be substantial.",
      requirement: "Not required - financial prudence"
    }
  }
};

export const painTriggers: Record<string, (dealSize: number) => { title: string; impact: string; breakdown: string; message: string }> = {
  q1: (dealSize) => ({
    title: "Deal-Blocking Gap: Centralized Identity",
    impact: `Total Financial Impact: $${((dealSize * 2) + (dealSize * 0.2 * 4) + 5000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2).toLocaleString()} (stalled deals)\n• Deal Delay Cost: $${(dealSize * 0.2 * 4).toLocaleString()} (4-month avg delay)\n• Implementation Cost: $5,000`,
    message: `Enterprise security teams require centralized authentication to verify access controls during vendor assessments. Without a single identity provider:\n\n• You cannot demonstrate immediate access revocation capabilities\n• Security questionnaires flag your access management as "manual" or "undefined"\n• Procurement teams classify your risk profile as "High" or "Uninsurable"\n• Legal teams cannot verify employee vs. contractor access segregation\n\nThis gap typically surfaces during security review questionnaires, causing deals to stall while you implement a solution.`
  }),
  q2: (dealSize) => ({
    title: "Deal-Blocking Gap: Multi-Factor Authentication",
    impact: `Total Financial Impact: $${((dealSize * 3) + (dealSize * 0.2 * 6)).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 3).toLocaleString()} (stalled deals)\n• Deal Delay Cost: $${(dealSize * 0.2 * 6).toLocaleString()} (6-month avg delay)\n• Implementation Cost: $0 (free with identity provider)`,
    message: `Multi-factor authentication is a non-negotiable requirement in modern enterprise procurement:\n\n• 82% of F500 security policies mandate vendor MFA\n• Password-only authentication is classified as "Critical Risk"\n• Single-factor access is automatic disqualification in banking, healthcare, and government RFPs\n• Insurance providers consider lack of MFA a primary breach indicator\n\nYour competitors with enforced MFA move through security reviews 3x faster.`
  }),
  q3: (dealSize) => ({
    title: "Deal-Blocking Gap: Access Revocation",
    impact: `Total Financial Impact: $${((dealSize * 2.5) + (dealSize * 0.2 * 4) + 3000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2.5).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 4).toLocaleString()}\n• Implementation Cost: $3,000`,
    message: `Immediate access revocation is critical for enterprise legal teams:\n\n• "High Risk" classification in vendor risk assessments\n• Uninsurable status in cyber insurance underwriting\n• Contract liability if former employees access customer data\n• Failed compliance audits due to inadequate termination procedures\n\nCompanies without automated revocation average 4+ months in procurement delays.`
  }),
  q4: (dealSize) => ({
    title: "Security Gap: Password Management",
    impact: `Total Financial Impact: $${((dealSize * 1.5) + (dealSize * 0.2 * 2) + 600).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 1.5).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 2).toLocaleString()}\n• Implementation Cost: $600/year`,
    message: `Enterprise questionnaires specifically ask about organization-wide password management:\n\n• Cannot verify unique, complex passwords for each system\n• Shared credentials create audit trail gaps\n• Password rotation becomes manual and error-prone\n• Post-breach forensics cannot determine compromise scope\n\nManual password practices trigger "Does Not Meet Requirements" in 73% of enterprise RFPs.`
  }),
  q5: (dealSize) => ({
    title: "Compliance Gap: Access Reviews",
    impact: `Total Financial Impact: $${((dealSize * 2) + (dealSize * 0.2 * 3) + 2000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 3).toLocaleString()}\n• Implementation Cost: $2,000`,
    message: `Quarterly access reviews demonstrate ongoing security governance:\n\n• Auditors cannot verify principle of least privilege\n• "Permission creep" expands your attack surface\n• Compliance certifications require evidence of regular audits\n• Legal teams cannot validate appropriate data boundaries\n\nThis gap creates "Material Weakness" findings in compliance audits.`
  }),
  q6: (dealSize) => ({
    title: "Deal-Killer Gap: Data Encryption at Rest",
    impact: `Total Financial Impact: $${((dealSize * 4) + (dealSize * 0.2 * 6) + 8000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 4).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 6).toLocaleString()}\n• Implementation Cost: $8,000`,
    message: `Unencrypted data at rest is immediate disqualification for regulated industries:\n\n• AES-256 encryption required for all customer data\n• Key management procedures required\n• Protection against physical storage theft\n• Compliance with data protection regulations\n\nBanking, healthcare, and government buyers won't begin reviews without this. Missing this typically adds 6 months to your sales cycle.`
  }),
  q7: (dealSize) => ({
    title: "Critical Gap: Data Encryption in Transit",
    impact: `Total Financial Impact: $${((dealSize * 3) + (dealSize * 0.2 * 5) + 4000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 3).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 5).toLocaleString()}\n• Implementation Cost: $4,000`,
    message: `TLS 1.2+ for all connections is table-stakes for enterprise procurement:\n\n• Data can be intercepted during transmission\n• Man-in-the-middle attacks become feasible\n• Compliance frameworks classify this as "Critical Risk"\n• Legal teams cannot approve contracts\n\nInfoSec teams reject vendor applications immediately upon discovering unencrypted connections.`
  }),
  q8: (dealSize) => ({
    title: "High-Risk Gap: Environment Separation",
    impact: `Total Financial Impact: $${((dealSize * 2.5) + (dealSize * 0.2 * 4) + 6000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2.5).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 4).toLocaleString()}\n• Implementation Cost: $6,000`,
    message: `Mixed environments create unacceptable data exposure risk:\n\n• Complete separation required between prod and non-prod\n• Synthetic data required in dev/testing\n• Documented procedures preventing data migration\n• Access controls ensuring developers can't access live data\n\nWithout separation, you're classified as "Uninsurable" by cyber insurance underwriters.`
  }),
  q9: (dealSize) => ({
    title: "DEAL-KILLER GAP: Audit Logging",
    impact: `Total Financial Impact: $${((dealSize * 5) + (dealSize * 0.2 * 8) + 12000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 5).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 8).toLocaleString()}\n• Implementation Cost: $12,000`,
    message: `Comprehensive access logging is THE most critical technical control. This is the #1 reason compliance audits fail:\n\n• Cannot prove who accessed what data and when\n• Security incident investigation becomes impossible\n• Compliance certifications are unattainable\n• Legal liability increases exponentially\n• Cyber insurance providers classify you as "Uninsurable"\n\nThis single gap can eliminate you from 100% of enterprise deals requiring compliance certification.`
  }),
  q10: (dealSize) => ({
    title: "High-Risk Gap: Backup & Recovery",
    impact: `Total Financial Impact: $${((dealSize * 3) + (dealSize * 0.2 * 5) + 4000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 3).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 5).toLocaleString()}\n• Implementation Cost: $4,000`,
    message: `Enterprise SLAs require 99.9% uptime guarantees:\n\n• Proven recovery capability required\n• Tested backup procedures mandatory\n• Business continuity documentation needed\n• Recovery time objectives must be defined\n\nOne ransomware attack without backups = potential business death.`
  }),
  q11: (dealSize) => ({
    title: "Critical Gap: Incident Response Plan",
    impact: `Total Financial Impact: $${((dealSize * 3) + (dealSize * 0.2 * 5) + 3000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 3).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 5).toLocaleString()}\n• Implementation Cost: $3,000`,
    message: `72% of enterprise contracts require proof of an Incident Response Plan:\n\n• Procurement won't approve without it\n• Regulatory requirement under GDPR/HIPAA\n• Fine for non-compliance: Up to $100K per incident\n• Legal teams need evidence of team training\n\nWithout documented procedures, you cannot satisfy security questionnaires.`
  }),
  q12: (dealSize) => ({
    title: "Security Gap: Background Checks",
    impact: `Total Financial Impact: $${((dealSize * 2) + (dealSize * 0.2 * 3) + 1500).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 3).toLocaleString()}\n• Implementation Cost: $1,500`,
    message: `Banks and healthcare companies require background checks:\n\n• Non-negotiable for compliance\n• One bad hire = data breach = $2M+ lawsuit risk\n• Security questionnaires ask specifically about this\n• Insurance underwriters verify screening practices`
  }),
  q13: (dealSize) => ({
    title: "High-Risk Gap: Vendor Agreements",
    impact: `Total Financial Impact: $${((dealSize * 3) + (dealSize * 0.2 * 5) + 2000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 3).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 5).toLocaleString()}\n• Implementation Cost: $2,000`,
    message: `Without Business Associate Agreements (BAAs), you're legally liable for vendor breaches:\n\n• Enterprise legal teams reject immediately\n• Using AWS without BAA = HIPAA violation\n• Fine risk: $50K per violation\n• Must document all third-party security commitments\n\nOperating without vendor agreements is a direct compliance violation.`
  }),
  q14: (dealSize) => ({
    title: "Security Gap: Penetration Testing",
    impact: `Total Financial Impact: $${((dealSize * 2) + (dealSize * 0.2 * 3) + 8000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 3).toLocaleString()}\n• Implementation Cost: $8,000`,
    message: `Enterprise buyers require proof of recent security testing:\n\n• Without pentest report, they assume you're vulnerable\n• Annual testing is industry standard\n• Competitors with pentests close deals 3x faster\n• Security questionnaires ask for last test date`
  }),
  q15: (dealSize) => ({
    title: "Risk Gap: Cyber Insurance",
    impact: `Total Financial Impact: $${((dealSize * 2) + (dealSize * 0.2 * 3) + 5000).toLocaleString()}`,
    breakdown: `• Pipeline Risk: $${(dealSize * 2).toLocaleString()}\n• Deal Delay Cost: $${(dealSize * 0.2 * 3).toLocaleString()}\n• Premium Cost: $5,000/year`,
    message: `Most enterprise contracts require minimum $1M cyber insurance:\n\n• Procurement won't approve without it\n• Cost of getting it last-minute: $5K-15K/year\n• Deal delay: 2-3 months while you secure coverage\n• Some carriers won't cover you without other controls in place`
  })
};
