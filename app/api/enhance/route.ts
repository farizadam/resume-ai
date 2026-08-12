import { NextResponse } from 'next/server';
import groq from '@/lib/groq';

const PROMPTS = {
  summary: `You are an elite technical resume writer.
Rewrite the provided user text into a crisp, compelling 2-3 sentence professional summary.
Maintain all factual accuracy while elevating technical tone and readability.
Return ONLY valid JSON with the exact key "enhancedText".

Example Output:
{
  "enhancedText": "Highly skilled Software Engineer with extensive experience in full-stack web application development and cloud infrastructure. Proven track record of architecting scalable backend microservices and responsive user interfaces that enhance user engagement and system performance."
}`,

  achievements: `You are an elite technical resume writer and ATS optimization expert.
Your goal is to transform user notes or simple statements into 2 to 3 powerful, highly detailed, ATS-optimized resume bullet points.

INSTRUCTIONS:
1. EXPAND & ELEVATE: If the user provides a simple or short phrase (e.g., "developed full stack applications"), do NOT just rewrite it as one generic line. Expand it into 2-3 detailed bullet points highlighting core software engineering standards (e.g., architecture, frontend/backend integration, database optimization, CI/CD, scalability).
2. STRUCTURE: Start every bullet point with a strong action verb (e.g., Engineered, Architected, Spearheaded, Designed, Deployed, Optimized). Frame accomplishments around technical depth and operational value.
3. WEAVE CONTEXT: Naturally incorporate any provided job title, company, or technical skills into the bullet points without fabricating impossible facts or fake metrics.
4. FORMAT: Return ONLY valid JSON with the key "enhancedText". Join multiple points using a single newline character (\\n). Do NOT use markdown list symbols like '-' or '*'.

  "enhancedText": "Architected and deployed responsive full-stack web applications utilizing modern JavaScript/TypeScript frameworks and RESTful microservices\\nEngineered scalable backend APIs and relational database schemas, optimizing query performance and response latency\\nImplemented secure authentication flows and continuous integration pipelines to accelerate feature delivery"
}`,

  skills: `You are an elite technical resume writer.
Clean up, standardize, and properly capitalize the following comma-separated list of skills.
Map informal aliases to their official names (e.g., "reactjs" -> "React", "js" -> "JavaScript", "postgres" -> "PostgreSQL", "aws" -> "Amazon Web Services (AWS)").
Remove any duplicates. Do not add skills that are not implied by the input.
Return ONLY valid JSON with the exact key "enhancedText". The value should be a single comma-separated string of the cleaned skills.

Example Output:
{
  "enhancedText": "JavaScript, React, PostgreSQL, Amazon Web Services (AWS), Docker"
}`
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, type, role, company, skills } = body;

    // 1. Sanitize text input
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Valid non-empty text is required' },
        { status: 400 }
      );
    }

    const trimmedText = text.trim();

    // 2. Validate and map prompt type
    let promptType: keyof typeof PROMPTS = 'summary';
    if (type === 'achievements' || type === 'experience' || type === 'projects') {
      promptType = 'achievements';
    } else if (type === 'summary') {
      promptType = 'summary';
    } else if (type === 'skills') {
      promptType = 'skills';
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Allowed values: summary, achievements, experience, projects, skills' },
        { status: 400 }
      );
    }

    const systemPrompt = PROMPTS[promptType];

    // 3. Build enriched context message
    let contextMessage = `Target Context:\n`;
    if (role) contextMessage += `- Role/Position: ${role}\n`;
    if (company) contextMessage += `- Company: ${company}\n`;
    if (skills && Array.isArray(skills) && skills.length > 0) {
      contextMessage += `- Technologies/Skills: ${skills.join(', ')}\n`;
    }
    contextMessage += `\nUser Input to Enhance:\n"${trimmedText}"`;

    // 4. Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextMessage }
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
      temperature: 0.4, // Slight variance allows better creative expansion
    });

    const aiResponseText = completion.choices[0]?.message?.content;

    if (!aiResponseText) {
      return NextResponse.json(
        { error: 'Failed to generate AI response' },
        { status: 500 }
      );
    }

    // 5. Safe JSON Parsing
    let parsedResponse: { enhancedText?: string };
    try {
      parsedResponse = JSON.parse(aiResponseText);
    } catch {
      return NextResponse.json({
        enhancedText: trimmedText,
        warning: 'Failed to parse AI response. Returned original text.'
      });
    }

    let enhancedText = parsedResponse.enhancedText || trimmedText;

    // 6. Clean up stray bullets / markdown formatting
    if (promptType === 'achievements') {
      enhancedText = enhancedText
        .split('\n')
        .map(line => line.replace(/^[\s\-\*\•\d\.\)]+/, '').trim()) // Strip leading dashes, stars, numbers
        .filter(Boolean)
        .join('\n');
    }

    return NextResponse.json({
      enhancedText
    });

  } catch (error: any) {
    console.error('API Enhance POST Error:', error);

    // Handle Groq API Rate Limiting (HTTP 429)
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