import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Interview from "@/models/Interview";
import groq from "@/lib/groq";
import { interviewResponseSchema } from "@/lib/schemas/interview";

export async function GET() {
  return NextResponse.json({
    message: "Interview API is ready.",
    status: "ok",
  });
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const { interviewId, message } = await request.json();

    // Validate message
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    let interview;

    // First message: create a new interview
    if (!interviewId) {
      interview = await Interview.create({
        status: "active",
        currentSection: "personal",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
        candidateData: {},
        questionCount: 0,
      });
    } else {
      // Existing interview: find it
      interview = await Interview.findById(interviewId);

      if (!interview) {
        return NextResponse.json(
          { error: "Interview not found" },
          { status: 404 }
        );
      }

      // Check if interview is already completed
      if (interview.status === "completed") {
        return NextResponse.json(
          { error: "This interview has already been completed" },
          { status: 400 }
        );
      }

      // Add user's new message
      interview.messages.push({
        role: "user",
        content: message,
        createdAt: new Date(),
      });
    }

    const systemPrompt = {
      role: "system" as const,
      content: `You are an expert AI recruiter conducting a short, efficient resume interview.
Your goal is to collect enough high-quality information to create a strong professional resume, without making it a long questionnaire.

CRITICAL RULES:
- Ask ONE conversational question at a time.
- Prefer questions that collect multiple related pieces of information (e.g., role, company, dates, technologies) so the user can answer naturally.
- DO NOT ask for information that the user has already provided in previous answers.
- Extract all provided information and update the candidateData.
- If the user gives a detailed answer, move on to the next most valuable missing piece of information.
- Use these sections internally: personal, education, experience, projects, skills, certifications, languages, achievements, final_check.
- Spend more time on high-value sections (experience, projects, skills) and skip optional sections quickly if the user doesn't have them.
- Do NOT drill into every detail. The goal is a strong resume, not an exhaustive interview.
- Do not continue asking questions simply to reach 8-15. 8-15 is only a guideline. If enough high-quality information has been collected after 6 questions, finish. If important information is still missing after 15 questions, prioritize the most important missing information and then finish as soon as reasonably possible.
- Always return ALL previously collected candidateData plus any newly extracted information. Never remove previously collected information.
- Once you have enough factual and detailed information, enter the "final_check" section and ask if they have anything to add.
- If they say no, set status to "complete".
- Your response MUST be valid JSON matching exactly this structure:
{
  "message": "The conversational question or response to show to the user",
  "status": "collecting" | "complete",
  "currentSection": "personal" | "education" | "experience" | "projects" | "skills" | "certifications" | "languages" | "achievements" | "final_check",
  "candidateData": { /* The accumulated information */ },
  "missingInformation": ["List of missing important fields"]
}

Current Candidate Data: ${JSON.stringify(interview.candidateData)}
Current Section: ${interview.currentSection}
Questions Asked: ${interview.questionCount}
`,
    };

    const conversationHistory = interview.messages.map((msg: any) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    }));

    const completion = await groq.chat.completions.create({
      messages: [systemPrompt, ...conversationHistory],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
    });

    const aiResponseText = completion.choices[0]?.message?.content;

    if (!aiResponseText) {
      return NextResponse.json(
        { error: "Failed to generate AI response" },
        { status: 500 }
      );
    }

    // Parse and validate the response
    let parsedResponse;
    try {
      const jsonResponse = JSON.parse(aiResponseText);
      parsedResponse = interviewResponseSchema.parse(jsonResponse);
    } catch (parseError) {
      console.error("Failed to parse or validate AI JSON response:", parseError);
      return NextResponse.json(
        { error: "Invalid AI response format" },
        { status: 500 }
      );
    }

    // Update interview state
    interview.candidateData = parsedResponse.candidateData;
    interview.currentSection = parsedResponse.currentSection;
    
    // Server acts as the source of truth for questionCount
    interview.questionCount += 1;

    if (parsedResponse.status === "complete") {
      interview.status = "completed";
    }

    interview.messages.push({
      role: "assistant",
      content: parsedResponse.message, // Store only the message in history
      createdAt: new Date(),
    });

    // Mark candidateData as modified for Mongoose Mixed type
    interview.markModified("candidateData");
    await interview.save();

    return NextResponse.json({
      interviewId: interview._id,
      message: parsedResponse.message,
      status: parsedResponse.status,
      currentSection: parsedResponse.currentSection,
      questionCount: interview.questionCount,
      candidateData: parsedResponse.candidateData,
      missingInformation: parsedResponse.missingInformation,
    });
  } catch (error) {
    console.error("Interview POST error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
