"use client";

import { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  latexContent: string;
}

export function PdfPreview({ latexContent }: PdfPreviewProps) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!latexContent) {
      setPdfUrl("");
      return;
    }

    const compilePdf = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch("/api/compile-latex", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ latexContent }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to compile LaTeX");
        }

        // Get PDF as blob
        const pdfBlob = await response.blob();
        const url = URL.createObjectURL(pdfBlob);
        
        // Revoke previous URL to prevent memory leaks
        if (pdfUrl) {
          URL.revokeObjectURL(pdfUrl);
        }
        
        setPdfUrl(url);
      } catch (err) {
        console.error("PDF compilation error:", err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    compilePdf();

    // Cleanup function
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [latexContent]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Compiling LaTeX to PDF...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white h-full flex items-center justify-center">
        <div className="text-center text-red-600">
          <h3 className="font-bold text-lg mb-2">Compilation Error</h3>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!pdfUrl) {
    return (
      <div className="p-8 bg-gray-50 flex items-center justify-center h-full">
        <p className="text-gray-600">No resume to preview yet.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-100">
      {/* PDF Controls */}
      {numPages > 1 && (
        <div className="flex items-center justify-center gap-4 p-2 bg-white border-b">
          <button
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="text-sm">
            Page {pageNumber} of {numPages}
          </span>
          <button
            onClick={() => setPageNumber((prev) => Math.min(prev + 1, numPages))}
            disabled={pageNumber >= numPages}
            className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto flex justify-center p-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="text-center p-8">
              <p>Loading PDF...</p>
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="shadow-lg"
          />
        </Document>
      </div>
    </div>
  );
}
