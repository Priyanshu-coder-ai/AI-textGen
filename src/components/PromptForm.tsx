'use client';

import { useFormStatus } from 'react-dom';
import { Image as ImageIcon, Video, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type PromptFormProps = {
  prompt: string;
  setPrompt: (prompt: string) => void;
};

function GenerateButtons() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col sm:flex-row gap-2">
       <Button type="submit" name="action" value="image" disabled={pending} size="lg" className="w-full sm:w-auto hover:animate-jiggle active:animate-bubble">
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <ImageIcon className="mr-2 h-4 w-4" />
            Generate Image
          </>
        )}
      </Button>
      <Button type="submit" name="action" value="video" disabled={pending} size="lg" className="w-full sm:w-auto hover:animate-jiggle active:animate-bubble">
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Video className="mr-2 h-4 w-4" />
            Generate Video
          </>
        )}
      </Button>
    </div>
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
          <GenerateButtons />
        </div>
      </CardContent>
    </Card>
  );
}
