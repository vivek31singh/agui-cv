"use client";

import { useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface LaTeXRendererProps {
  latex: string;
  displayMode?: boolean;
  className?: string;
}

export function LaTeXRenderer({ latex, displayMode = true, className = '' }: LaTeXRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && latex) {
      try {
        katex.render(latex, containerRef.current, {
          displayMode,
          throwOnError: false,
          trust: true,
        });
      } catch (error) {
        console.error('LaTeX rendering error:', error);
        if (containerRef.current) {
          containerRef.current.textContent = 'Error rendering LaTeX';
          containerRef.current.className = 'text-red-600';
        }
      }
    }
  }, [latex, displayMode]);

  return <div ref={containerRef} className={`latex-content ${className}`} />;
}
