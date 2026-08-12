import { z } from "zod";
import { resumeDataSchema } from "@/types/resume";

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
  candidateData: resumeDataSchema.default({}),
  missingInformation: z.array(z.string()).optional().default([]),
});

export type InterviewResponse = z.infer<typeof interviewResponseSchema>;
