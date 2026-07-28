import { useMutation } from '@tanstack/react-query';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

import { localAiApi } from '../lib/local-ai-api';

export type NlToFlowResult = {
  flowName: string;
  trigger: { type: string; settings: unknown };
  steps: Array<{ name: string; connectorName?: string; actionName?: string; settings: unknown }>;
};

export function NlToFlowDialog({
  onFlowGenerated,
  children,
}: {
  onFlowGenerated?: (result: NlToFlowResult) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [result, setResult] = useState<NlToFlowResult | null>(null);

  const mutation = useMutation({
    mutationFn: () => localAiApi.generateFlowFromNl(description),
    onSuccess: (data) => setResult(data),
  });

  function handleApply() {
    if (result && onFlowGenerated) {
      onFlowGenerated(result);
    }
    handleReset();
  }

  function handleReset() {
    setOpen(false);
    setDescription('');
    setResult(null);
    mutation.reset();
  }

  return (
    <Dialog open={open} onOpenChange={(o) => {
      setOpen(o);
      if (!o) setTimeout(handleReset, 200);
    }}>
      <DialogTrigger asChild>
        {children ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Generate Flow with AI
          </DialogTitle>
          <DialogDescription>
            Describe the automation you want, and AI will generate a flow structure for you.
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="flex flex-col gap-4">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. When I receive a webhook from GitHub, parse the payload, create a task in my project management tool, and send me an email notification..."
              className="min-h-[150px] resize-none"
            />
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {description.length} / 2000 characters
              </p>
              <Button
                onClick={() => mutation.mutate()}
                disabled={!description.trim() || mutation.isPending}
                className="gap-2"
              >
                {mutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="h-4 w-4" />
                )}
                {mutation.isPending ? 'Generating...' : 'Generate Flow'}
              </Button>
            </div>

            {mutation.isError && (
              <p className="text-sm text-destructive">
                Failed to generate. Make sure Ollama is running.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <h3 className="text-sm font-semibold text-foreground">{result.flowName}</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Trigger: <span className="font-medium text-foreground">{result.trigger.type}</span>
              </p>
              {result.steps.length > 0 && (
                <>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Steps ({result.steps.length}):
                  </p>
                  <ol className="mt-1 list-inside list-decimal text-sm text-foreground">
                    {result.steps.map((step, i) => (
                      <li key={i} className="text-xs">
                        {step.name}
                        {step.connectorName && (
                          <span className="text-muted-foreground"> ({step.connectorName})</span>
                        )}
                      </li>
                    ))}
                  </ol>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleReset}>
                Cancel
              </Button>
              <Button onClick={handleApply} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Apply to Flow Builder
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
