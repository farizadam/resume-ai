import { z } from "zod";

export const resumeDataSchema = z.object({
  contactInfo: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
  }).optional(),
  
  summary: z.string().optional(),
  
  technicalSkills: z.object({
    languages: z.array(z.string()).optional(),
    frameworks: z.array(z.string()).optional(),
    databases: z.array(z.string()).optional(),
    tools: z.array(z.string()).optional(),
    operatingSystems: z.array(z.string()).optional(),
    cloudPlatforms: z.array(z.string()).optional(),
    softSkills: z.array(z.string()).optional(),
  }).optional(),
  
  workExperience: z.array(z.object({
    company: z.string().optional(),
    position: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    achievements: z.array(z.string()).optional(),
  })).optional(),
  
  projects: z.array(z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    technologies: z.array(z.string()).optional(),
    accomplishments: z.array(z.string()).optional(),
  })).optional(),
  
  education: z.array(z.object({
    university: z.string().optional(),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    location: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isCurrent: z.boolean().optional(),
    gpa: z.string().optional(),
    honors: z.string().optional(),
    relevantCoursework: z.array(z.string()).optional(),
  })).optional(),
  
  certifications: z.array(z.object({
    name: z.string().optional(),
    issuer: z.string().optional(),
    date: z.string().optional(),
  })).optional(),
  
  languages: z.array(z.object({
    language: z.string().optional(),
    proficiency: z.string().optional(),
  })).optional(),
  
  awards: z.array(z.object({
    title: z.string().optional(),
    issuer: z.string().optional(),
    date: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
  
  volunteer: z.array(z.object({
    organization: z.string().optional(),
    role: z.string().optional(),
    dates: z.string().optional(),
    description: z.string().optional(),
  })).optional(),
});

export type ResumeData = z.infer<typeof resumeDataSchema>;
