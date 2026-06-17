import { useState, useCallback } from 'react';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { PDFReport } from '@/components/pdf/PDFReport';
import { RemediationModule, getDetectedGaps, sortGapsBySeverity } from '@/data/remediationModules';
import { useAssessment } from '@/context/AssessmentContext';

interface UsePdfGeneratorReturn {
  isGenerating: boolean;
  generateFreePdf: () => Promise<void>;
  generatePremiumPdf: () => Promise<void>;
  error: string | null;
}

export const usePdfGenerator = (): UsePdfGeneratorReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { state, calculateScore, getRiskLevel, calculateMoneyAtRisk } = useAssessment();

  const generatePdf = useCallback(async (isPremium: boolean) => {
    setIsGenerating(true);
    setError(null);

    try {
      const score = calculateScore();
      const riskLevel = getRiskLevel(score);
      const moneyAtRisk = calculateMoneyAtRisk();

      // Get detected gaps from answers
      const detectedGaps = getDetectedGaps(state.answers);
      const sortedGaps = sortGapsBySeverity(detectedGaps);

      // Generate the PDF blob
      const doc = (
        <PDFReport
          companyName={state.companyInfo.companyName || 'Your Company'}
          framework={state.framework || 'soc2'}
          score={score}
          riskLevel={riskLevel}
          moneyAtRisk={moneyAtRisk}
          dealSize={state.companyInfo.dealSize}
          gaps={sortedGaps}
          isPremium={isPremium}
          email={state.email}
          completedAt={state.lastModified}
        />
      );

      const blob = await pdf(doc).toBlob();

      // Generate filename
      const companySlug = (state.companyInfo.companyName || 'company')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 30);

      const reportType = isPremium ? 'Full-Report' : 'Summary';
      const filename = `${companySlug}-DeltaRQ-${reportType}.pdf`;

      // Trigger download
      saveAs(blob, filename);

    } catch (err) {
      console.error('PDF generation error:', err);
      setError('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [state, calculateScore, getRiskLevel, calculateMoneyAtRisk]);

  const generateFreePdf = useCallback(() => {
    return generatePdf(false);
  }, [generatePdf]);

  const generatePremiumPdf = useCallback(() => {
    return generatePdf(true);
  }, [generatePdf]);

  return {
    isGenerating,
    generateFreePdf,
    generatePremiumPdf,
    error
  };
};
