'use client';

import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageIcon, Download } from 'lucide-react';
import type { ContentResult } from '@/app/actions';

type ResultDisplayProps = {
  content: ContentResult | null;
};

export function ResultDisplay({ content }: ResultDisplayProps) {
  const { pending } = useFormStatus();

  const handleDownload = () => {
    if (!content?.dataUri) return;

    fetch(content.dataUri)
      .then(res => res.blob())
      .then(blob => {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          const fileExtension = 'png';
          link.download = `prompt2text-generated.${fileExtension}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
      })
      .catch(e => {
        console.error("Download failed", e);
        const link = document.createElement('a');
        link.href = content.dataUri;
        const fileExtension = 'png';
        link.download = `prompt2text-generated.${fileExtension}`;
        link.click();
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon />
          Generated Output
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-video w-full overflow-hidden rounded-lg border bg-secondary flex items-center justify-center">
          {pending ? (
            <Skeleton className="h-full w-full" />
          ) : content?.type === 'image' && content.dataUri ? (
            <Image
              src={content.dataUri}
              alt="Generated image"
              width={1920}
              height={1080}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center">
              <ImageIcon className="h-16 w-16" />
              <p>Your generated content will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
      {content && !pending && (
         <CardFooter className="justify-end">
            <Button onClick={handleDownload} className="hover:animate-jiggle active:animate-bubble">
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
         </CardFooter>
      )}
    </Card>
  );
}
