"use client";

import { useEffect, useRef } from "react";
import { parse, HtmlGenerator } from "latex.js";

interface LatexJSRendererProps {
  latexContent: string;
}

export function LatexJSRenderer({ latexContent }: LatexJSRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !latexContent) return;

    try {
      // Clear previous content
      containerRef.current.innerHTML = "";

      // Create a generator
      const generator = new HtmlGenerator({ hyphenate: false });

      // Parse the LaTeX content
      const doc = parse(latexContent, { generator });
      const htmlDoc = doc.htmlDocument();

      // Append styles
      const styleElement = document.createElement("style");
      styleElement.textContent = htmlDoc.styles;
      containerRef.current.appendChild(styleElement);

      // Append body content
      while (htmlDoc.body.firstChild) {
        containerRef.current.appendChild(htmlDoc.body.firstChild);
      }

    } catch (e) {
      console.error("LaTeX rendering error:", e);
      if (containerRef.current) {
        containerRef.current.innerHTML = `<div class="text-red-500 p-4">
          <h3 class="font-bold">Rendering Error</h3>
          <pre class="whitespace-pre-wrap text-sm mt-2">${(e as Error).message}</pre>
          <details class="mt-4">
            <summary class="font-semibold cursor-pointer">Show Raw LaTeX</summary>
            <pre class="bg-gray-100 p-2 rounded mt-1 overflow-auto text-xs">${latexContent}</pre>
          </details>
        </div>`;
      }
    }
  }, [latexContent]);

  return (
    <div 
      ref={containerRef} 
      className="latex-preview p-8 bg-white overflow-auto h-full w-full shadow-sm"
    />
  );
}
