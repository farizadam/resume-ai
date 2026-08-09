import groq from '@/lib/groq';

const ATS_ENHANCER_PROMPT = `
You are an elite technical resume writer and ATS optimization expert.
Your job is to take raw, informal candidate information and rewrite it into a crisp, high-impact, ATS-friendly technical resume JSON.

REWRITING RULES:
1. WORK EXPERIENCE & PROJECTS:
   - Rewrite casual or weak bullets into strong, action-oriented bullet points starting with powerful verbs (e.g., "Engineered", "Implemented", "Spearheaded", "Optimized", "Architected").
   - Frame accomplishments around impact, scale, and technical depth.
   - Fix grammar, capitalization, and punctuation.
2. TECHNICAL SKILLS:
   - Clean up skill lists into standardized technical terms (e.g., "js" -> "JavaScript", "reactjs" -> "React", "postgres" -> "PostgreSQL").
   - Categorize skills correctly into languages, frameworks, and tools.
3. CONSTRAINTS:
   - CRITICAL: Do NOT invent false experiences, fake companies (like "ABC Corporation"), or fake names (like "John Doe"). 
   - If information is missing from the raw data, omit the key entirely or return an empty string/array. DO NOT FILL IT WITH PLACEHOLDER DATA.
   - Ensure the output strictly conforms to valid JSON.
   - MUST MATCH THIS EXACT JSON STRUCTURE (omit keys if missing in raw data):
   {
     "contactInfo": { "name": "...", "email": "...", "phone": "...", "linkedin": "...", "github": "..." },
     "summary": "...",
     "technicalSkills": { "languages": [], "frameworks": [], "databases": [], "tools": [], "operatingSystems": [], "cloudPlatforms": [] },
     "workExperience": [ { "company": "...", "position": "...", "dates": "...", "achievements": ["...", "..."] } ],
     "projects": [ { "name": "...", "description": "...", "technologies": [], "accomplishments": ["...", "..."] } ],
     "education": { "degree": "...", "fieldOfStudy": "...", "university": "...", "dates": "..." }
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
        return JSON.parse(enhancedJsonString);
    } catch (error) {
        console.error('ATS Enhancer Error:', error);
        // Fallback to raw candidate data if enhancement fails
        return rawCandidateData;
    }
}