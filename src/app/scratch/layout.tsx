import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Scratch - Memos',
  description: 'A browser-local workspace for temporary brainstorming that connects to your self-hosted Memos instance. Work locally, save remotely when ready.',
  keywords: ['scratchpad', 'brainstorming', 'notes', 'memos', 'local-first'],
  openGraph: {
    title: 'Scratch - Memos',
    description: 'A browser-local workspace for temporary brainstorming that connects to your self-hosted Memos instance.',
    url: 'https://usememos.com/scratch',
  },
};

export default function ScratchLayout({ children }: { children: ReactNode }) {
  return children;
}
