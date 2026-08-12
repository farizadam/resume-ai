import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resume from "@/models/Resume";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const mongoose = require("mongoose");
    const userIdObj = new mongoose.Types.ObjectId(session.user.id);

    const resumes = await Resume.find({ userId: userIdObj }).sort({ updatedAt: -1 });

    return NextResponse.json({ resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.resumeCreditsUsed >= user.resumeCreditsLimit) {
      return NextResponse.json({ error: "Resume creation limit reached. Please upgrade your plan." }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));

    const newResume = await Resume.create({
      userId: session.user.id,
      title: body.title || "Untitled Resume",
      targetRole: body.targetRole || "",
      candidateData: body.candidateData || {},
    });

    user.resumeCreditsUsed += 1;
    await user.save();

    return NextResponse.json({ resume: newResume }, { status: 201 });
  } catch (error) {
    console.error("Error creating resume:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
