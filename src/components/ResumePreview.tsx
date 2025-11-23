"use client";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface ResumePreviewProps {
  pdfUrl: string | null;
}

export function ResumePreview({ pdfUrl }: ResumePreviewProps) {
  const [numPages, setNumPages] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  if (!pdfUrl) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-500">
        <p>No resume generated yet. Start chatting to build one!</p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center overflow-y-auto bg-gray-200 p-8">
      <Document
        file={pdfUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="shadow-lg"
        loading={
          <div className="flex h-[800px] w-[600px] items-center justify-center bg-white shadow-lg">
            Loading PDF...
          </div>
        }
        error={
          <div className="flex h-[800px] w-[600px] items-center justify-center bg-white text-red-500 shadow-lg">
            Failed to load PDF.
          </div>
        }
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page
            key={`page_${index + 1}`}
            pageNumber={index + 1}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="mb-4"
            width={600}
          />
        ))}
      </Document>
    </div>
  );
}
