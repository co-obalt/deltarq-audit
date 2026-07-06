# DELTARQ AUDIT — Enterprise Deal-Readiness Audit Platform

DELTARQ AUDIT is an AI-native enterprise security and deal-readiness audit platform. It enables high-growth startups to unblock procurement pipelines, identify SOC 2, HIPAA, and ISO 27001 compliance gaps, and prove security posture to enterprise buyers.

---

## 💎 The DELTARQ Audit Core Values

For startups selling to enterprise customers, passing security questionnaires and showing compliance documents is a major deal blocker. 

DELTARQ AUDIT streamlines this with:
1.  **Instant Self-Assessment:** Evaluate security controls and cloud configuration standards against typical CISO checklists.
2.  **Risk Analysis & Scoring:** Maps control failures directly to business revenue (ARR) risk.
3.  **Audit-Ready Verification:** Connects to local scanners to verify evidence automatically.
4.  **Remediation Action Items:** Guided remediation roadmaps to close detected security gaps.

---

## 🛠️ Compliance Frameworks Supported

### 1. SOC 2 (Trust Services Criteria)
*   Access controls (SSO, MFA).
*   Encryption controls (in-transit, at-rest).
*   Audit log retention and monitoring.
*   Incident response and disaster recovery drills.

### 2. HIPAA Security Rule
*   Administrative, physical, and technical safeguards.
*   Data protection policies for Protected Health Information (PHI).
*   Audit control logs and database encryption checks.

### 3. ISO 27001 (Information Security Management)
*   Information security policies and asset management.
*   Role-based access boundaries and supplier security controls.
*   Physical security and business continuity compliance.

---

## 🚀 Technical Remediation & CLI Audit Integration

DELTARQ AUDIT integrates with our local CLI tool `deltarq-scan` to verify infrastructure controls automatically:

```bash
npx deltarq-scan
```
This CLI tool scans Docker container permissions, IAM wildcards, database SSL, and git leak histories completely on your local device.
