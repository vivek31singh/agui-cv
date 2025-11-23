import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { latexContent } = await request.json();

    if (!latexContent) {
      return NextResponse.json(
        { error: "LaTeX content is required" },
        { status: 400 }
      );
    }

    // Use LaTeX.Online API with URL-encoded text parameter
    // API: https://latexonline.cc/compile?text=<url-encoded-latex>
    const encodedLatex = encodeURIComponent(latexContent);
    const apiUrl = `https://latexonline.cc/compile?text=${encodedLatex}`;

    const response = await fetch(apiUrl, {
      method: "GET",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("LaTeX compilation error:", errorText);
      return NextResponse.json(
        { error: "Failed to compile LaTeX", details: errorText },
        { status: 500 }
      );
    }

    // Get the PDF as a buffer
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error("Error in compile-latex:", error);
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
