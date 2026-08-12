import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select(
      "atsCreditsUsed atsCreditsLimit resumeCreditsUsed resumeCreditsLimit interviewCreditsUsed interviewCreditsLimit"
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ats: {
        used: user.atsCreditsUsed,
        limit: user.atsCreditsLimit,
      },
      resume: {
        used: user.resumeCreditsUsed,
        limit: user.resumeCreditsLimit,
      },
      interview: {
        used: user.interviewCreditsUsed,
        limit: user.interviewCreditsLimit,
      },
    });
  } catch (error) {
    console.error("Usage API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
