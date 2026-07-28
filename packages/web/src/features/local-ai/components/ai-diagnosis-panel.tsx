import { useMutation } from '@tanstack/react-query';
import { AlertCircle, ArrowLeft, Bug, Lightbulb, Loader2, Wrench } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

import { localAiApi } from '../lib/local-ai-api';
import { useAiSidebarStore } from '../stores/ai-sidebar-store';

type DiagnosisResult = {
  diagnosis: string;
  likelyCause: string;
  fix: string;
};

export function AiDiagnosisPanel({
  stepName,
  errorMessage,
  flowName,
}: {
  stepName: string;
  errorMessage: string;
  flowName: string;
}) {
  const { setView } = useAiSidebarStore();
  const [result, setResult] = useState<DiagnosisResult | null>(null);

  const mutation = useMutation({
    mutationFn: () => localAiApi.diagnoseError({ stepName, errorMessage, flowName }),
    onSuccess: (data) => setResult(data),
  });

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-2">
        <Button variant="ghost" size="sm" onClick={() => setView('chat')} className="h-8 w-8 p-0">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Error Diagnosis</span>
      </div>

      <div className="border-b border-border bg-muted/30 px-4 py-3">
        <p className="text-xs text-muted-foreground">Flow</p>
        <p className="text-sm font-medium">{flowName}</p>
        <p className="mt-1 text-xs text-muted-foreground">Step</p>
        <p className="text-sm font-medium">{stepName}</p>
        <p className="mt-1 text-xs text-muted-foreground">Error</p>
        <p className="mt-0.5 text-sm text-destructive">{errorMessage.slice(0, 200)}</p>
      </div>

      <ScrollArea className="flex-1 px-4 py-4">
        {!mutation.isPending && !result && (
          <div className="flex flex-col items-center gap-4 py-8 text-center">
            <Bug className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium text-foreground">Diagnose this error</p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI will analyze the error and suggest a fix
              </p>
            </div>
            <Button onClick={() => mutation.mutate()} className="gap-2">
              <AlertCircle className="h-4 w-4" />
              Diagnose with AI
            </Button>
          </div>
        )}

        {mutation.isPending && (
          <div className="flex flex-col items-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing error...</p>
          </div>
        )}

        {mutation.isError && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive">Failed to diagnose. Ollama may be offline.</p>
            <Button variant="outline" size="sm" onClick={() => mutation.mutate()}>
              Retry
            </Button>
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-primary">
                <AlertCircle className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Diagnosis</h3>
              </div>
              <p className="mt-1 text-sm text-foreground">{result.diagnosis}</p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-warning">
                <Lightbulb className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Likely Cause</h3>
              </div>
              <p className="mt-1 text-sm text-foreground">{result.likelyCause}</p>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 text-success">
                <Wrench className="h-4 w-4" />
                <h3 className="text-sm font-semibold">Suggested Fix</h3>
              </div>
              <p className="mt-1 text-sm text-foreground">{result.fix}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setResult(null);
                mutation.reset();
              }}
              className="mt-2"
            >
              Diagnose Another
            </Button>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
