import { api } from '@/lib/api';

async function isAvailable(): Promise<{ available: boolean; model: string }> {
  return api.get<{ available: boolean; model: string }>('/v1/local-ai/available');
}

async function sendChatMessage(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>): Promise<{ content: string }> {
  return api.post<{ content: string }>('/v1/local-ai/chat', { messages });
}

async function generateFlowFromNl(description: string): Promise<{
  flowName: string;
  trigger: { type: string; settings: unknown };
  steps: Array<{ name: string; connectorName?: string; actionName?: string; settings: unknown }>;
}> {
  return api.post('/v1/local-ai/nl-to-flow', { description });
}

async function diagnoseError(input: {
  stepName: string;
  errorMessage: string;
  flowName: string;
}): Promise<{ diagnosis: string; likelyCause: string; fix: string }> {
  return api.post('/v1/local-ai/diagnose', input);
}

export const localAiApi = {
  isAvailable,
  sendChatMessage,
  generateFlowFromNl,
  diagnoseError,
};
