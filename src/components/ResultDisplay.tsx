'use client';

import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Film, ImageIcon } from 'lucide-react';
import type { GenerateVideoOutput } from '@/ai/flows/generate-video';

type ResultDisplayProps = {
  content: GenerateVideoOutput | null;
};

export function ResultDisplay({ content }: ResultDisplayProps) {
  const { pending } = useFormStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Film />
          Generated Output
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-secondary flex items-center justify-center">
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : content?.imageDataUri ? (
            <Image
              src={content.imageDataUri}
              alt="Generated image"
              width={1920}
              height={1080}
              className="h-full w-full object-contain"
            />
          ) : content?.videoDataUri ? (
            <video
              src={content.videoDataUri}
              controls
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-contain bg-black"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <ImageIcon className="h-16 w-16" />
              <p>Your generated content will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
