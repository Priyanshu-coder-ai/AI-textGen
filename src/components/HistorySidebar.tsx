'use client';

import { Wand2, History } from 'lucide-react';
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';

type HistorySidebarProps = {
  history: string[];
  onSelectPrompt: (prompt: string) => void;
};

export function HistorySidebar({ history, onSelectPrompt }: HistorySidebarProps) {
  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Wand2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold font-headline">VividAI</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <History />
            History
          </SidebarGroupLabel>
          <SidebarMenu>
            {history.length > 0 ? (
              history.map((prompt, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    onClick={() => onSelectPrompt(prompt)}
                    className="h-auto whitespace-normal py-2 text-left"
                    variant="ghost"
                    size="sm"
                  >
                    <span>{prompt}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <p className="px-2 text-sm text-muted-foreground">No history yet.</p>
            )}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </>
  );
}
