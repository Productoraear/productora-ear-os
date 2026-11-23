'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export interface CopySnippetButtonProps {
  text: string;
}

export default function CopySnippetButton({ text }: CopySnippetButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }, [text]);

  return (
    <button
      type="button"
      onClick={() => void copy()}
      className="inline-flex min-h-[36px] items-center gap-2 rounded-xl border border-[#ecb613]/40 bg-[#ecb613]/10 px-3.5 font-mono text-xs font-bold text-[#ecb613] transition-colors hover:bg-[#ecb613]/20"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copiado' : 'Copiar codigo / snippet'}
    </button>
  );
}
