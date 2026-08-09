import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "PDF generation endpoint is ready.",
    status: "ok",
  });
}
