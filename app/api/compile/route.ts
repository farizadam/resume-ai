import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({ message: "Compile endpoint ready.", status: "ok" });
}
