/**
 * Extract text content from a PDF file
 */
async function parsePDF(file: File): Promise<string> {
    // Dynamic import to avoid SSR issues with DOMMatrix
    const pdfjsLib = await import('pdfjs-dist');

    // Initialize PDF.js worker
    if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    }

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
        fullText += pageText + '\n\n';
    }

    return fullText.trim();
}

/**
 * Extract text content from a DOCX file
 * Note: This is a simple implementation. For better results, install 'mammoth' package
 */
async function parseDOCX(file: File): Promise<string> {
    // For now, we'll return a message about needing the mammoth package
    // You can install it with: npm install mammoth

    try {
        // Try dynamic import if mammoth is installed
        const mammoth = await import('mammoth');
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    } catch (error) {
        // Mammoth not installed, provide fallback
        console.warn('mammoth package not installed. Install with: npm install mammoth');
        return `[DOCX file uploaded: ${file.name}. Install 'mammoth' package for full text extraction]`;
    }
}

/**
 * Extract text content from a TXT file
 */
async function parseTXT(file: File): Promise<string> {
    return await file.text();
}

/**
 * Main function to parse resume files based on their type
 */
export async function parseResumeFile(file: File): Promise<string> {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    try {
        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            return await parsePDF(file);
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            return await parseDOCX(file);
        } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
            return await parseTXT(file);
        } else {
            throw new Error(`Unsupported file type: ${fileType || 'unknown'}`);
        }
    } catch (error) {
        console.error('Error parsing resume file:', error);
        throw error;
    }
}

/**
 * Estimate token count for the extracted text
 * Rough estimate: 1 token ≈ 4 characters
 */
export function estimateTokenCount(text: string): number {
    return Math.ceil(text.length / 4);
}
