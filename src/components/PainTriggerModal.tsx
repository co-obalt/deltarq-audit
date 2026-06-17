import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface PainTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  impact: string;
  breakdown: string;
  message: string;
}

const PainTriggerModal: React.FC<PainTriggerModalProps> = ({
  isOpen,
  onClose,
  title,
  impact,
  breakdown,
  message
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-destructive/20 to-destructive/5 -mx-6 -mt-6 px-6 pt-6 pb-4 rounded-t-lg border-b border-destructive/20">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <DialogTitle className="text-lg font-bold text-destructive">
                {title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Impact details for {title}
              </DialogDescription>
            </div>
          </DialogHeader>
        </div>

        <div className="space-y-4 pt-4">
          {/* Impact Amount */}
          <div className="text-center p-4 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-2xl md:text-3xl font-bold text-destructive">{impact}</p>
          </div>

          {/* Breakdown */}
          <div className="p-4 bg-secondary/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Cost Breakdown:</p>
            <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{breakdown}</pre>
          </div>

          {/* Message */}
          <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {message}
          </div>

          {/* Close Button */}
          <Button onClick={onClose} className="w-full" variant="outline">
            I Understand
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PainTriggerModal;
