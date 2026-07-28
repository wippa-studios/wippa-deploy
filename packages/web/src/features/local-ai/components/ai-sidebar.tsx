import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { Bot, Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';
import { KeyboardEvent, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { localAiApi } from '../lib/local-ai-api';
import { useAiSidebarStore } from '../stores/ai-sidebar-store';

import { AiDiagnosisPanel } from './ai-diagnosis-panel';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export function AiSidebar() {
  const { isOpen, view, close, diagnosisContext } = useAiSidebarStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your local AI assistant. I can help you build flows, diagnose errors, or just answer questions about Wippa." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { data: availability } = useQuery({
    queryKey: ['local-ai-available'],
    queryFn: () => localAiApi.isAvailable(),
    refetchInterval: 30_000,
  });

  const available = availability?.available ?? false;

  async function handleSend() {
    const content = input.trim();
    if (!content || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const result = await localAiApi.sendChatMessage([
        { role: 'system', content: 'You are a helpful AI assistant for the Wippa automation platform. Answer concisely and helpfully.' },
        ...messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
        { role: 'user', content },
      ]);
      setMessages((prev) => [...prev, { role: 'assistant', content: result.content }]);
    }
    catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please make sure Ollama is running and try again.' }]);
    }
    finally {
      setLoading(false);
    }

    // Scroll to bottom after render
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed right-0 top-0 z-50 flex h-full w-[400px] flex-col border-l border-border bg-background shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">AI Assistant</span>
              {!available && (
                <span className="ml-2 flex items-center gap-1 rounded-md bg-warning/10 px-2 py-0.5 text-xs text-warning">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Offline
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setMessages([{ role: 'assistant', content: "Hi! I'm your local AI assistant. I can help you build flows, diagnose errors, or just answer questions about Wippa." }]);
                }}
                className="h-8 w-8 p-0"
              >
                <Sparkles className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={close} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          {view === 'diagnosis' && diagnosisContext ? (
            <AiDiagnosisPanel
              stepName={diagnosisContext.stepName}
              errorMessage={diagnosisContext.errorMessage}
              flowName={diagnosisContext.flowName}
            />
          ) : (
            <>
              <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
                <div className="flex flex-col gap-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex flex-col gap-1',
                        msg.role === 'user' ? 'items-end' : 'items-start',
                      )}
                    >
                      <div
                        className={cn(
                          'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                          msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground',
                        )}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-2">
                      <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Thinking...
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="border-t border-border p-4">
                <div className="flex items-end gap-2">
                  <Textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={available ? 'Ask me anything...' : 'Ollama is offline...'}
                    className="min-h-[40px] max-h-[120px] resize-none"
                    rows={1}
                    disabled={!available}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!input.trim() || loading || !available}
                    className="h-10 w-10 shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Floating toggle button */
export function AiSidebarToggle() {
  const { isOpen, toggle } = useAiSidebarStore();

  if (isOpen) return null;

  return (
    <Button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-40 h-12 w-12 rounded-full shadow-lg"
      size="icon"
    >
      <MessageCircle className="h-5 w-5" />
    </Button>
  );
}
