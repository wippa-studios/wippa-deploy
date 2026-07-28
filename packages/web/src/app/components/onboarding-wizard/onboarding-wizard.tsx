import { t } from 'i18next';
import { CheckCircle2, ChevronRight, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  globalConnectionsQueries,
  globalConnectionsMutations,
} from '@/features/connections';
import { templatesHooks } from '@/features/templates';
import { cn } from '@/lib/utils';

type WizardStep = 'connect' | 'template' | 'done';

type OnboardingWizardProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const WippaWordmark = () => (
  <span className="font-display font-extrabold tracking-tight">
    <span className="text-[#d4c48a]">W</span>
    <span className="text-white">ippa</span>
  </span>
);

const StepIndicator = ({
  current,
  total,
}: {
  current: number;
  total: number;
}) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={cn(
          'h-1.5 rounded-full transition-all',
          i < current
            ? 'w-8 bg-[#f5e6a3]'
            : i === current
              ? 'w-8 bg-[#f5e6a3]/60'
              : 'w-8 bg-white/10',
        )}
      />
    ))}
  </div>
);

const OnboardingWizard = ({
  open,
  onOpenChange,
}: OnboardingWizardProps) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>('connect');
  const [selectedTemplateId, setSelectedTemplateId] = useState<
    string | null
  >(null);

const { data: connections } = globalConnectionsQueries.useGlobalConnections({
  request: {},
  extraKeys: [],
});
const hasXero = connections?.some(
  (c) => c.connectorName === '@wippa/connector-xero',
);

  const { templates } = templatesHooks.useOfficialTemplates();

  const stepIndex =
    step === 'connect' ? 0 : step === 'template' ? 1 : 2;

  const handleSkipToTemplates = () => setStep('template');
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep('done');
  };
  const handleFinish = () => {
    onOpenChange(false);
    if (selectedTemplateId) {
      navigate(`/templates/${selectedTemplateId}`);
    } else {
      navigate('/flows');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] bg-[#111] border-[#333]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <WippaWordmark />
            <StepIndicator current={stepIndex} total={3} />
          </div>
          <DialogTitle className="font-display text-white text-xl mt-4">
            {step === 'connect' && t('Connect Wippa to Xero')}
            {step === 'template' && t('Pick a Wippa template')}
            {step === 'done' && t("You're Wippa automated!")}
          </DialogTitle>
        </DialogHeader>

        {step === 'connect' && (
          <div className="space-y-4">
            <p className="text-sm text-[#999]">
              {t(
                'Connect your Xero account to automate invoicing, payments, and contacts. Your data stays in Australia.',
              )}
            </p>
            <div
              className={cn(
                'flex items-center gap-3 p-4 rounded-lg border',
                hasXero
                  ? 'border-[#4ade80]/30 bg-[#4ade80]/5'
                  : 'border-[#333] bg-[#0a0a0a]',
              )}
            >
              <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-[#333] flex items-center justify-center text-sm font-bold text-white">
                X
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">Xero</p>
                <p className="text-xs text-[#666]">
                  {hasXero
                    ? t('Connected')
                    : t('Not connected yet')}
                </p>
              </div>
              {hasXero ? (
                <CheckCircle2 className="w-5 h-5 text-[#4ade80]" />
              ) : (
                <Button
                  size="sm"
                  className="bg-[#f5e6a3] text-black hover:bg-[#d4c48a]"
                  onClick={() => navigate('/connections')}
                >
                  {t('Connect')}
                </Button>
              )}
            </div>
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#666] hover:text-white"
                onClick={handleSkipToTemplates}
              >
                {t('Skip for now')}
              </Button>
              <Button
                size="sm"
                className="bg-[#f5e6a3] text-black hover:bg-[#d4c48a]"
                onClick={handleSkipToTemplates}
              >
                {t('Continue')}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 'template' && (
          <div className="space-y-3">
            <p className="text-sm text-[#999]">
              {t(
                'Pick a pre-built template to get started. You can customise it later.',
              )}
            </p>
            <div className="space-y-2 max-h-[320px] overflow-y-auto">
              {templates?.slice(0, 6).map((template) => (
                <button
                  key={template.id}
                  onClick={() => handleSelectTemplate(template.id)}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all',
                    'border-[#333] bg-[#0a0a0a] hover:border-[#f5e6a3]/30 hover:bg-[#f5e6a3]/3',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#f5e6a3] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {template.name}
                      </p>
                      <p className="text-xs text-[#666] truncate">
                        {template.summary}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#666] shrink-0" />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-[#666] hover:text-white"
                onClick={() => setStep('connect')}
              >
                {t('Back')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#666] hover:text-white"
                onClick={handleFinish}
              >
                {t('Skip — start from scratch')}
              </Button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="space-y-4 text-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#f5e6a3]/10 border border-[#f5e6a3]/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#f5e6a3]" />
            </div>
            <p className="text-sm text-[#999] max-w-[360px] mx-auto">
              {t(
                'Your first automation is ready. You can customise it, add more steps, or create new flows anytime.',
              )}
            </p>
            <Button
              className="bg-[#f5e6a3] text-black hover:bg-[#d4c48a]"
              onClick={handleFinish}
            >
              {t('Go to my automation')}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

OnboardingWizard.displayName = 'OnboardingWizard';
export { OnboardingWizard };
