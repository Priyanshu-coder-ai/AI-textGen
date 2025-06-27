'use client';

import { useFormStatus } from 'react-dom';
import { Wand2, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type PromptFormProps = {
  prompt: string;
  setPrompt: (prompt: string) => void;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full sm:w-auto">
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Wand2 className="mr-2 h-4 w-4" />
          Generate
        </>
      )}
    </Button>
  );
}

export function PromptForm({ prompt, setPrompt }: PromptFormProps) {
  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your vision</CardTitle>
        <CardDescription>Enter a prompt and let our AI bring your idea to life as a video or image.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          name="prompt"
          placeholder="e.g., A cinematic shot of a futuristic city at night, with flying cars and neon lights"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          disabled={pending}
          required
          className="text-base"
        />
        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </CardContent>
    </Card>
  );
}
