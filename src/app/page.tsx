'use client';

import { useState, useEffect, useActionState } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { HistorySidebar } from '@/components/HistorySidebar';
import { PromptForm } from '@/components/PromptForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { generateContentAction, type FormState } from './actions';
import { useToast } from "@/hooks/use-toast";

const initialState: FormState = {
  result: null,
  error: null,
  timestamp: Date.now(),
};

export default function Home() {
  const [state, formAction] = useActionState(generateContentAction, initialState);
  const { toast } = useToast();

  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [lastHandledTimestamp, setLastHandledTimestamp] = useState(0);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('vividai-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
    }
  }, []);

  // Handle form state changes
  useEffect(() => {
    if (state.timestamp > lastHandledTimestamp) {
      if (state.error) {
        toast({
          title: "Generation Failed",
          description: state.error,
          variant: "destructive",
        });
      }
      if (state.result) {
        const currentPrompt = prompt.trim();
        // Add prompt to history if it's new
        if (currentPrompt && !history.includes(currentPrompt)) {
          const newHistory = [currentPrompt, ...history].slice(0, 20); // Keep last 20
          setHistory(newHistory);
          try {
            localStorage.setItem('vividai-history', JSON.stringify(newHistory));
          } catch (error) {
            console.error('Failed to save history to localStorage', error);
          }
        }
      }
      setLastHandledTimestamp(state.timestamp);
    }
  }, [state, history, prompt, toast, lastHandledTimestamp]);

  const handleSelectPrompt = (selectedPrompt: string) => {
    setPrompt(selectedPrompt);
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <HistorySidebar history={history} onSelectPrompt={handleSelectPrompt} />
      </Sidebar>
      <SidebarInset>
        <main className="flex min-h-svh flex-1 flex-col p-4 md:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-4xl flex flex-col gap-8">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl font-headline">
                VividAI
              </h1>
              <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
                Bring your ideas to life. Describe a scene and watch our AI create a video or image from your words.
              </p>
            </header>
            
            <form action={formAction} className="flex flex-col gap-8">
              <PromptForm prompt={prompt} setPrompt={setPrompt} />
              <ResultDisplay content={state.result} />
            </form>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
