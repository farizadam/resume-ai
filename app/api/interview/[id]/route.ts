import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import Resume from "@/models/Resume";
import { migrateResumeData } from "@/lib/migrations";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const interview = await Interview.findById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const migratedData = migrateResumeData(interview.candidateData);

    return NextResponse.json({
      candidateData: migratedData,
      status: interview.status,
      isEnhanced: interview.isEnhanced,
    });
  } catch (error) {
    console.error("Error fetching interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const { id } = resolvedParams;

    const body = await req.json();
    const { candidateData } = body;

    if (!candidateData) {
      return NextResponse.json(
        { error: "Missing candidateData in request body" },
        { status: 400 }
      );
    }

    const interview = await Interview.findById(id);

    if (!interview) {
      return NextResponse.json(
        { error: "Interview not found" },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    if (userId && !interview.userId) {
      interview.userId = userId;
    }

    // Apply manual user updates
    interview.candidateData = candidateData;
    
    // Setting to true prevents the ATS enhancer from overwriting manual changes
    interview.isEnhanced = true; 
    
    // Mongoose mixed type requires explicit markModified
    interview.markModified("candidateData");
    
    await interview.save();

    if (userId) {
      const existingResume = await Resume.findOne({ interviewId: interview._id });
      if (!existingResume) {
        await Resume.create({
          userId: userId,
          interviewId: interview._id,
          title: `${candidateData?.contactInfo?.name || "Candidate"}'s Resume`,
          targetRole: candidateData?.workExperience?.[0]?.position || "Software Engineer",
          candidateData: candidateData,
          status: "completed",
        });
      } else {
        existingResume.candidateData = candidateData;
        existingResume.markModified("candidateData");
        await existingResume.save();
      }
    }

    return NextResponse.json({
      message: "Interview updated successfully",
      candidateData: interview.candidateData,
    });
  } catch (error) {
    console.error("Error updating interview:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
