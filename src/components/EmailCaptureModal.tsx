import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail, ArrowRight } from 'lucide-react';

interface EmailCaptureModalProps {
  isOpen: boolean;
  onSubmit: (email: string) => void;
}

const EmailCaptureModal: React.FC<EmailCaptureModalProps> = ({ isOpen, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    onSubmit(email);
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-md bg-card border-border" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            You're 67% Done! 🎯
          </DialogTitle>
          <DialogDescription className="sr-only">
            Please enter your email to continue the assessment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <p className="text-center text-muted-foreground">
            You're doing better than <span className="text-primary font-semibold">45% of startups</span>.
            Enter your email to see the final 5 questions and get your full report.
          </p>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="bg-secondary/50 border-border"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <Button onClick={handleSubmit} className="w-full" size="lg">
            Continue Scan
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            We'll send your results here. No spam, ever.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmailCaptureModal;
