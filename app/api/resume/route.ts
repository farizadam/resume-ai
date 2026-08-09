import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    message: "Resume API is ready.",
    status: "ok",
  });
}

export async function POST() {
  return NextResponse.json({
    message: "Resume draft received.",
    status: "ok",
  });
}
