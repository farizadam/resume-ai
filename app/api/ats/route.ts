import { NextResponse } from 'next/server';
import groq from '@/lib/groq';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const PROMPT = `You are an elite Applicant Tracking System (ATS) and expert technical recruiter.
Your objective is to evaluate a candidate's resume against a target job description and provide a strict match score and actionable feedback.

INSTRUCTIONS:
1. Carefully analyze the provided Resume Text and Job Description.
2. Calculate a match score from 0 to 100 based on how well the resume aligns with the job requirements (skills, experience, keywords).
3. Identify exactly what the resume is missing or how it can be improved to better match the job description. Provide specific, actionable improvements (e.g. "Add experience with CI/CD pipelines", "Use stronger action verbs for the full-stack project").
4. Return ONLY valid JSON with exactly two keys: "score" (a number) and "improvements" (an array of strings).

Example Output:
{
  "score": 75,
  "improvements": [
    "Mention specific AWS services used, as the job requires AWS infrastructure experience.",
    "Quantify your impact in the Software Engineer role (e.g., 'improved performance by 20%')."
  ]
}`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in to use this feature.' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.atsCreditsUsed >= user.atsCreditsLimit) {
      return NextResponse.json({ error: 'ATS check limit reached. Please upgrade your plan.' }, { status: 429 });
    }

    const formData = await req.formData();
    const pdfFile = formData.get('resume') as File | null;
    const jobDescription = formData.get('jobDescription') as string | null;

    if (!pdfFile) {
      return NextResponse.json({ error: 'Resume PDF is required' }, { status: 400 });
    }
    if (!jobDescription || !jobDescription.trim()) {
      return NextResponse.json({ error: 'Job description is required' }, { status: 400 });
    }

    // Extract text from PDF
    const arrayBuffer = await pdfFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let resumeText = '';
    try {
      const parsedData = await pdfParse(buffer);
      resumeText = parsedData.text;
    } catch (err) {
      console.error('Error parsing PDF:', err);
      return NextResponse.json({ error: 'Failed to read text from the uploaded PDF' }, { status: 400 });
    }

    if (!resumeText || !resumeText.trim()) {
      return NextResponse.json({ error: 'No readable text found in the PDF' }, { status: 400 });
    }

    // Build context message
    const contextMessage = `Target Job Description:\n"${jobDescription.trim()}"\n\nResume Text:\n"${resumeText.trim()}"`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: PROMPT },
        { role: 'user', content: contextMessage }
      ],
      model: 'openai/gpt-oss-120b',
      response_format: { type: 'json_object' },
      temperature: 0.2,
    });

    const aiResponseText = completion.choices[0]?.message?.content;

    if (!aiResponseText) {
      return NextResponse.json({ error: 'Failed to generate AI response' }, { status: 500 });
    }

    // Parse AI response
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponseText);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI response' }, { status: 500 });
    }

    // Ensure shape
    const score = typeof parsedResponse.score === 'number' ? parsedResponse.score : 0;
    const improvements = Array.isArray(parsedResponse.improvements) ? parsedResponse.improvements : [];

    user.atsCreditsUsed += 1;
    await user.save();

    return NextResponse.json({
      score,
      improvements
    });

  } catch (error: any) {
    console.error('API ATS POST Error:', error);

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please wait a moment and try again.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
