import { z } from "zod";

export const interviewResponseSchema = z.object({
  message: z.string(),
  status: z.enum(["collecting", "complete"]),
  currentSection: z.enum([
    "personal",
    "education",
    "experience",
    "projects",
    "skills",
    "certifications",
    "languages",
    "achievements",
    "final_check",
  ]),
  candidateData: z.record(z.string(), z.any()),
  missingInformation: z.array(z.string()).optional().default([]),
});

export type InterviewResponse = z.infer<typeof interviewResponseSchema>;
