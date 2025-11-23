import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";

export async function GET(req: NextRequest) {
  try {
    const pdfPath = path.join(process.cwd(), "storage", "resume.pdf");

    if (!existsSync(pdfPath)) {
      return new NextResponse("PDF not found. Please generate it first.", { status: 404 });
    }

    const pdfBuffer = await readFile(pdfPath);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=resume.pdf",
      },
    });
  } catch (error) {
    console.error("Error serving PDF:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
