import groq from '@/lib/groq';
import { resumeDataSchema } from '@/types/resume';

const ATS_ENHANCER_PROMPT = `
You are an elite technical resume writer and ATS optimization expert.
Your job is to take raw, informal candidate information and rewrite it into a crisp, high-impact, ATS-friendly technical resume JSON.

REWRITING RULES:
1. WORK EXPERIENCE & PROJECTS (EXPAND & ENHANCE):
   - CRITICAL: Do not just copy the user's short answers. Heavily expand and embellish their brief inputs into 3-4 comprehensive, highly professional bullet points per role/project.
   - Rewrite casual or weak bullets into strong, action-oriented bullet points starting with powerful verbs (e.g., "Engineered", "Implemented", "Spearheaded", "Optimized", "Architected").
   - Frame accomplishments around impact, scale, and technical depth. Incorporate the listed technologies into the bullets naturally.
   - Fix grammar, capitalization, and punctuation.
2. PROFESSIONAL SUMMARY:
   - Generate a strong, compelling 2-3 sentence professional summary based on their skills and experience.
3. TECHNICAL SKILLS:
   - Clean up skill lists into standardized technical terms (e.g., "js" -> "JavaScript", "reactjs" -> "React", "postgres" -> "PostgreSQL").
   - Categorize skills correctly into languages, frameworks, and tools.
4. CONSTRAINTS:
   - CRITICAL: Do NOT invent false experiences, fake companies (like "ABC Corporation"), or fake names (like "John Doe"). 
   - If information is missing from the raw data, omit the key entirely or return an empty string/array. DO NOT FILL IT WITH PLACEHOLDER DATA.
   - Ensure the output strictly conforms to valid JSON.
   - MUST MATCH THIS EXACT JSON STRUCTURE (omit keys if missing in raw data):
   {
     "contactInfo": { "name": "...", "title": "...", "email": "...", "phone": "...", "location": "...", "linkedin": "...", "github": "...", "portfolio": "..." },
     "summary": "...",
     "technicalSkills": { "languages": [], "frameworks": [], "databases": [], "tools": [], "operatingSystems": [], "cloudPlatforms": [], "softSkills": [] },
     "workExperience": [ { "company": "...", "position": "...", "location": "...", "startDate": "...", "endDate": "...", "isCurrent": false, "achievements": ["...", "..."] } ],
     "projects": [ { "name": "...", "description": "...", "technologies": [], "accomplishments": ["...", "..."] } ],
     "education": [ { "university": "...", "degree": "...", "fieldOfStudy": "...", "location": "...", "startDate": "...", "endDate": "...", "isCurrent": false, "gpa": "...", "honors": "...", "relevantCoursework": [] } ],
     "certifications": [ { "name": "...", "issuer": "...", "date": "..." } ],
     "languages": [ { "language": "...", "proficiency": "..." } ],
     "awards": [ { "title": "...", "issuer": "...", "date": "...", "description": "..." } ],
     "volunteer": [ { "organization": "...", "role": "...", "dates": "...", "description": "..." } ]
   }
`;

export async function enhanceCandidateDataForAts(rawCandidateData: any) {
    try {
        const response = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: ATS_ENHANCER_PROMPT },
                {
                    role: 'user',
                    content: `Optimize and polish this raw candidate data into ATS-friendly structure:\n${JSON.stringify(rawCandidateData, null, 2)}`
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
        });

        const enhancedJsonString = response.choices[0]?.message?.content || '{}';
        const parsedJson = JSON.parse(enhancedJsonString);
        
        // Strict Zod validation on AI output
        const validationResult = resumeDataSchema.safeParse(parsedJson);
        if (validationResult.success) {
            return validationResult.data;
        } else {
            console.error('ATS Enhancer JSON Validation Failed:', validationResult.error);
            // If LLM returned bad format, return original to prevent crashing
            return rawCandidateData;
        }
    } catch (error) {
        console.error('ATS Enhancer Error:', error);
        // Fallback to raw candidate data if enhancement fails
        return rawCandidateData;
    }
}