"use client";

import { useMemo } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface KaTeXRendererProps {
  latexContent: string;
}

export function KaTeXRenderer({ latexContent }: KaTeXRendererProps) {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latexContent, {
        throwOnError: false,
        displayMode: true,
      });
    } catch (e) {
      // Fallback: show raw LaTeX in a pre block
      return `<pre>${latexContent}</pre>`;
    }
  }, [latexContent]);

  return (
    <div
      className="p-8 bg-white overflow-auto h-full"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
