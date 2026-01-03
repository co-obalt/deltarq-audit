import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
  Svg,
  Path,
  G,
  Link,
} from '@react-pdf/renderer';
import { RemediationModule } from '@/data/remediationModules';

// Constants
const EMERALD = '#10B981';
const DARK_SLATE = '#1E293B';
const ROSE = '#EF4444';
const SLATE_600 = '#475569';
const SLATE_400 = '#94A3B8';
const LIGHT_EMERALD = '#ECFDF5';

const BOOKING_LINK = 'https://calendar.app.google/ExhxfcYvbV5PKMs36';

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    position: 'relative',
    color: DARK_SLATE,
  },

  // Header / Footer
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 15,
  },
  headerLogo: {
    width: 60,
  },
  headerInfo: {
    textAlign: 'right',
  },
  reportType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: EMERALD,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  headerFramework: {
    fontSize: 8,
    color: SLATE_400,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: SLATE_400,
  },

  // Cover Page Structure
  coverContent: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: DARK_SLATE,
    marginBottom: 6,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  mainSubtitle: {
    fontSize: 12,
    color: SLATE_600,
    marginBottom: 35,
    textAlign: 'center',
    letterSpacing: 1,
  },
  coverLogo: {
    width: 120,
    marginBottom: 20,
  },
  companyBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_SLATE,
  },
  assessmentDate: {
    fontSize: 9,
    color: SLATE_400,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Gauge Styling (Robust)
  gaugeContainer: {
    width: 300,
    height: 180,
    position: 'relative',
    alignItems: 'center',
    marginBottom: 30,
  },
  gaugeTextContainer: {
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gaugeScore: {
    fontSize: 52,
    fontWeight: 'bold',
    color: DARK_SLATE,
  },
  gaugeLabel: {
    fontSize: 8,
    color: SLATE_400,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginTop: -5,
  },

  // Section Headers
  sectionHeader: {
    marginTop: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: DARK_SLATE,
    borderLeftWidth: 4,
    borderLeftColor: EMERALD,
    paddingLeft: 12,
  },

  // Metrics Grid (Failsafe)
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    width: '100%',
  },
  metricCard: {
    width: '48.5%', // Solid width to prevent collapse
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: SLATE_600,
    marginBottom: 8,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  riskCritical: { color: ROSE, borderColor: ROSE + '40' },
  riskStable: { color: '#EAB308', borderColor: '#EAB30840' },
  riskHealthy: { color: EMERALD, borderColor: EMERALD + '40' },

  // Gaps List
  gapItem: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#FDF2F2',
    borderLeftWidth: 3,
    borderLeftColor: ROSE,
  },
  gapTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: DARK_SLATE,
    marginBottom: 4,
  },
  gapDescription: {
    fontSize: 10,
    color: SLATE_600,
    lineHeight: 1.4,
  },

  // Page 3 CTA - Free
  ctaBoxFree: {
    marginTop: 40,
    padding: 30,
    borderRadius: 16,
    backgroundColor: DARK_SLATE,
    alignItems: 'center',
  },
  ctaTitleFree: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 10,
  },
  ctaTextFree: {
    fontSize: 11,
    color: '#CBD5E1',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 1.6,
  },
  ctaButtonFreeBox: {
    backgroundColor: EMERALD,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },

  // Detailed Analysis Page
  gapHeaderContainer: {
    backgroundColor: DARK_SLATE,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  gapHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  gapBadge: {
    backgroundColor: ROSE,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#ffffff',
    alignSelf: 'flex-start',
  },
  infoSection: {
    marginBottom: 25,
  },
  infoSectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: EMERALD,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoText: {
    fontSize: 10,
    color: DARK_SLATE,
    lineHeight: 1.6,
  },

  // Roadmap Tables
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 10,
  },
  tableCellTitle: {
    width: '30%',
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCellContent: {
    width: '70%',
    fontSize: 10,
    color: SLATE_600,
  },

  // TOC
  tocItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  tocLabel: {
    fontSize: 11,
    color: DARK_SLATE,
  },
  tocPage: {
    fontSize: 11,
    color: SLATE_400,
  },

  // Premium Partnership CTA
  ctaBoxPremium: {
    marginTop: 40,
    padding: 40,
    borderRadius: 20,
    backgroundColor: LIGHT_EMERALD,
    borderWidth: 2,
    borderColor: EMERALD,
    alignItems: 'center',
  },
  ctaTitlePremium: {
    fontSize: 20,
    fontWeight: 'bold',
    color: DARK_SLATE,
    marginBottom: 12,
  },
  ctaTextPremium: {
    fontSize: 12,
    color: SLATE_600,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 1.6,
    maxWidth: 400,
  },
});

// Components
const GaugeSVG = ({ score }: { score: number }) => {
  const percentage = Math.min(Math.max(score, 0), 100);
  const strokeWidth = 16;
  const radius = 100;
  const centerX = 150;
  const centerY = 140;

  // Manual SVG calculation for maximum stability
  const startAngle = 180;
  const endAngle = 180 + (percentage * 1.8);

  const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
    const rad = (angle * Math.PI) / 180.0;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    };
  };

  const start = polarToCartesian(centerX, centerY, radius, startAngle);
  const end = polarToCartesian(centerX, centerY, radius, endAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;

  const getColor = () => {
    if (score < 40) return ROSE;
    if (score < 75) return '#F59E0B'; // Amber - more professional than yellow
    return EMERALD;
  };

  return (
    <View style={styles.gaugeContainer}>
      <Svg width="300" height="180" viewBox="0 0 300 180">
        {/* Track */}
        <Path
          d="M 50,140 A 100,100 0 0,1 250,140"
          fill="none"
          stroke="#F1F5F9"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress */}
        <Path
          d={d}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      </Svg>
      <View style={styles.gaugeTextContainer}>
        <Text style={styles.gaugeScore}>{Math.round(score)}</Text>
        <Text style={styles.gaugeLabel}>COMPLIANCE READINESS</Text>
      </View>
    </View>
  );
};

const PageHeader = ({ pageType, framework }: { pageType: string, framework: string }) => (
  <View style={styles.header} fixed>
    <Image
      src="c:\Users\game\OneDrive\Desktop\Project\src\deltarq-logo.png"
      style={styles.headerLogo}
    />
    <View style={styles.headerInfo}>
      <Text style={styles.reportType}>{pageType.toUpperCase()}</Text>
      <Text style={styles.headerFramework}>{framework.toUpperCase()} COMPLIANCE ANALYSIS</Text>
    </View>
  </View>
);

const CommonFooter = ({ pageNumber, totalPages }: { pageNumber: number, totalPages?: number }) => (
  <View style={styles.footer} fixed>
    <Text style={styles.footerText}>© 2025 DeltaRQ | CONFIDENTIAL AUDIT REPORT</Text>
    <Text style={styles.footerText}>Page {pageNumber} {totalPages ? `of ${totalPages}` : ''}</Text>
  </View>
);

interface PDFReportProps {
  companyName: string;
  framework: string;
  score: number;
  riskLevel: 'CRITICAL' | 'MODERATE' | 'HEALTHY';
  moneyAtRisk: number;
  dealSize: number;
  gaps: RemediationModule[];
  isPremium: boolean;
  email?: string;
  completedAt?: string;
}

export const PDFReport: React.FC<PDFReportProps> = ({
  companyName,
  framework,
  score,
  riskLevel,
  moneyAtRisk,
  dealSize,
  gaps,
  isPremium,
  completedAt
}) => {
  const sortedGaps = [...gaps].sort((a, b) => {
    const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  const dateStr = completedAt
    ? new Date(completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <Document title={`${companyName} - ${framework} Security Report`}>
      {/* -------------------- PAGE 1: COVER -------------------- */}
      <Page size="A4" style={styles.page}>
        <PageHeader pageType="Executive Summary" framework={framework} />

        <View style={styles.coverContent}>
          <Image
            src="c:\Users\game\OneDrive\Desktop\Project\src\deltarq-logo.png"
            style={styles.coverLogo}
          />
          <Text style={styles.mainTitle}>Security Readiness Report</Text>
          <Text style={styles.mainSubtitle}>Enterprise Framework Gap Analysis</Text>

          <View style={styles.companyBox}>
            <Text style={styles.companyName}>{companyName}</Text>
            <Text style={styles.assessmentDate}>Assessment Date: {dateStr}</Text>
          </View>

          <GaugeSVG score={score} />

          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, riskLevel === 'CRITICAL' ? styles.riskCritical : riskLevel === 'MODERATE' ? styles.riskStable : styles.riskHealthy]}>
              <Text style={styles.metricLabel}>OVERALL RISK</Text>
              <Text style={styles.metricValue}>{riskLevel}</Text>
            </View>
            <View style={[styles.metricCard, { borderColor: ROSE + '40' }]}>
              <Text style={styles.metricLabel}>REVENUE AT RISK</Text>
              <Text style={[styles.metricValue, { color: ROSE }]}>${moneyAtRisk.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        <CommonFooter pageNumber={1} />
      </Page>

      {/* -------------------- PAGE 2: REVENUE RISK & TOP GAPS -------------------- */}
      <Page size="A4" style={styles.page}>
        <PageHeader pageType="Executive Summary" framework={framework} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pipeline Vulnerability Analysis</Text>
        </View>

        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontSize: 11, color: SLATE_600, lineHeight: 1.6 }}>
            The following infrastructure failures represent immediate deal-breakers for Enterprise InfoSec teams.
            Estimated pipeline impact is based on a projected average deal size of ${dealSize.toLocaleString()}.
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top 3 Priority Deficiencies</Text>
        </View>

        {sortedGaps.slice(0, 3).map((gap, idx) => (
          <View key={idx} style={styles.gapItem}>
            <Text style={styles.gapTitle}>{idx + 1}. {gap.title}</Text>
            <Text style={styles.gapDescription}>{gap.auditorPerspective.concern}</Text>
          </View>
        ))}

        <CommonFooter pageNumber={2} />
      </Page>

      {/* -------------------- PAGE 3: TIERED CTA -------------------- */}
      <Page size="A4" style={styles.page}>
        <PageHeader pageType="Executive Summary" framework={framework} />

        <View style={{ flex: 1, justifyContent: 'center' }}>
          {!isPremium ? (
            <View style={styles.ctaBoxFree}>
              <Text style={styles.ctaTitleFree}>Want Detailed Remediation Steps?</Text>
              <Text style={styles.ctaTextFree}>
                Unlock the full Remediation Blueprint for only $49.{'\n'}
                Gain access to technical checklists, policy templates,{'\n'}
                and 30-60-90 day engineering roadmaps.
              </Text>
              <View style={styles.ctaButtonFreeBox}>
                <Text style={styles.ctaButtonText}>UPGRADE TO FULL REPORT - $49</Text>
              </View>
            </View>
          ) : (
            <View style={styles.ctaBoxPremium}>
              <Text style={styles.ctaTitlePremium}>Complete Audit Readiness</Text>
              <Text style={styles.ctaTextPremium}>
                Don't waste months on trial and error. Our dedicated engineering team
                will work directly with you to implement every control, saving you
                hundreds of hours of research and documentation work.
              </Text>
              <Link src={BOOKING_LINK} style={{ textDecoration: 'none' }}>
                <View style={styles.ctaButtonFreeBox}>
                  <Text style={styles.ctaButtonText}>BOOK READINESS CONSULTATION</Text>
                </View>
              </Link>
            </View>
          )}

          <View style={{ marginTop: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 10, color: SLATE_400, textAlign: 'center' }}>
              DeltaRQ helps high-growth startups bridge the gap between engineering compliance and enterprise sales confidence.
            </Text>
          </View>
        </View>

        <CommonFooter pageNumber={3} />
      </Page>

      {/* -------------------- PREMIUM ONLY: LOG & ROADMAP -------------------- */}
      {isPremium && (
        <>
          {/* Table of Contents */}
          <Page size="A4" style={styles.page}>
            <PageHeader pageType="Remediation Blueprint" framework={framework} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Table of Contents</Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <View style={styles.tocItem}>
                <Text style={styles.tocLabel}>1. Executive Summary</Text>
                <Text style={styles.tocPage}>P. 1-3</Text>
              </View>
              <View style={styles.tocItem}>
                <Text style={styles.tocLabel}>2. Detailed Audit Deficiency Log</Text>
                <Text style={styles.tocPage}>P. 5-{sortedGaps.length + 4}</Text>
              </View>
              <View style={styles.tocItem}>
                <Text style={styles.tocLabel}>3. Strategic Remediation Roadmap</Text>
                <Text style={styles.tocPage}>P. {sortedGaps.length + 5}</Text>
              </View>
              <View style={styles.tocItem}>
                <Text style={styles.tocLabel}>4. Certification Readiness Checklist</Text>
                <Text style={styles.tocPage}>P. {sortedGaps.length + 6}</Text>
              </View>
            </View>
            <CommonFooter pageNumber={4} />
          </Page>

          {/* Detailed Gaps */}
          {sortedGaps.map((gap, index) => (
            <Page key={index} size="A4" style={styles.page} wrap={false}>
              <PageHeader pageType="Gap Analysis" framework={framework} />

              <View style={styles.gapHeaderContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={styles.gapHeaderTitle}>{gap.title}</Text>
                  <Text style={styles.gapBadge}>{gap.severity} RISK</Text>
                </View>
                <Text style={{ fontSize: 9, color: SLATE_400 }}>Control ID: GAP-{gap.id.toString().replace('GAP-', '')}</Text>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Auditor Perspective</Text>
                <View style={styles.infoBox}>
                  <Text style={styles.infoText}>{gap.auditorPerspective.concern}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Technical Remediation</Text>
                <View style={[styles.infoBox, { borderLeftColor: EMERALD, borderLeftWidth: 3 }]}>
                  <Text style={styles.infoText}>{gap.technicalFix.solution}</Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>Required Evidence for Audit</Text>
                <View style={[styles.infoBox, { backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }]}>
                  <Text style={styles.infoText}>Provide the following evidence to auditors:{'\n\n'}• {gap.evidenceRequired.join('\n• ')}</Text>
                </View>
              </View>

              <CommonFooter pageNumber={index + 5} />
            </Page>
          ))}

          {/* 30-60-90 Day Roadmap */}
          <Page size="A4" style={styles.page}>
            <PageHeader pageType="Strategic Roadmap" framework={framework} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>30-60-90 Day Priority Roadmap</Text>
            </View>

            <View style={{ marginTop: 10 }}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellTitle, { color: EMERALD }]}>Days 0-30</Text>
                <Text style={styles.tableCellContent}>Focus on Critical Identity and Access controls (MFA, SSO, Revocation). These are binary "pass/fail" filters for enterpise deals.</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellTitle, { color: '#EAB308' }]}>Days 31-60</Text>
                <Text style={styles.tableCellContent}>Implement Infrastructure Encryption and Data Protection. Draft Incident Response and Data Privacy policies.</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCellTitle, { color: SLATE_600 }]}>Days 61-90</Text>
                <Text style={styles.tableCellContent}>Engage for External Penetration Testing and finalize third-party vendor assessments. Readiness review for formal audit.</Text>
              </View>
            </View>

            <View style={styles.ctaBoxPremium}>
              <Text style={styles.ctaTitlePremium}>Scale Faster with Concierge</Text>
              <Text style={styles.ctaTextPremium}>
                Our "Audit Readiness Concierge" service handles the entire implementation
                effort. We work with your engineers to bridge these gaps in weeks, not months.
              </Text>
              <Link src={BOOKING_LINK} style={{ textDecoration: 'none' }}>
                <View style={styles.ctaBoxFree}>
                  <Text style={[styles.ctaButtonText, { color: '#ffffff' }]}>BOOK PARTNERSHIP CALL</Text>
                </View>
              </Link>
            </View>

            <CommonFooter pageNumber={sortedGaps.length + 5} />
          </Page>

          {/* Certification Readiness Checklist */}
          <Page size="A4" style={styles.page}>
            <PageHeader pageType="Readiness Checklist" framework={framework} />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Certification Readiness Checklist</Text>
            </View>

            <View style={{ marginTop: 20 }}>
              {[
                'Technical controls enforced in production',
                'Last 6 months of audit logs preserved',
                'All employee background checks completed',
                'Incident Response Plan tested and signed',
                'External Penetration Test completed',
                'Cyber Insurance policy active',
                'All vendor BAAs/Security agreements signed'
              ].map((item, idx) => (
                <View key={idx} style={[styles.tableRow, { alignItems: 'center' }]}>
                  <View style={{ width: 12, height: 12, borderWidth: 1, borderColor: SLATE_400, marginRight: 10 }} />
                  <Text style={{ fontSize: 11, color: DARK_SLATE }}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={{ marginTop: 40, padding: 20, backgroundColor: '#F8FAFC', borderRadius: 12 }}>
              <Text style={{ fontSize: 10, lineHeight: 1.6, color: SLATE_600 }}>
                Disclaimer: This report is a gap analysis tool. While based on standard industry auditor
                expectations, formal certification requires a signed report from a licensed CPA firm
                or accredited registrar. DeltaRQ prepares you to pass that audit with zero friction.
              </Text>
            </View>

            <CommonFooter pageNumber={sortedGaps.length + 6} />
          </Page>
        </>
      )}
    </Document>
  );
};

export default PDFReport;
