import { ResumeData, resumeDataSchema } from "@/types/resume";

/**
 * Parses a free-text date string like "Jan 2020 - Present" into structured fields.
 */
function parseDates(dateString?: string): { startDate?: string; endDate?: string; isCurrent?: boolean } {
  if (!dateString) return {};
  
  const parts = dateString.split(/\s*-\s*|\s+to\s+/i);
  if (parts.length === 2) {
    const start = parts[0].trim();
    const end = parts[1].trim();
    
    if (end.toLowerCase() === "present" || end.toLowerCase() === "current") {
      return { startDate: start, isCurrent: true };
    }
    
    return { startDate: start, endDate: end, isCurrent: false };
  }
  
  // If we can't split it reliably, just put it all in startDate as a fallback
  return { startDate: dateString.trim() };
}

/**
 * Migrates legacy candidateData from MongoDB into the robust ResumeData format.
 */
export function migrateResumeData(legacyData: any): ResumeData {
  if (!legacyData) return {};

  const migrated: any = { ...legacyData };

  // 1. Migrate Education (Object -> Array)
  if (migrated.education && !Array.isArray(migrated.education)) {
    const oldEdu = migrated.education;
    const dateParsed = parseDates(oldEdu.dates);
    
    migrated.education = [
      {
        university: oldEdu.university,
        degree: oldEdu.degree,
        fieldOfStudy: oldEdu.fieldOfStudy,
        ...dateParsed
      }
    ];
  }

  // 2. Migrate Work Experience (Dates -> startDate/endDate/isCurrent)
  if (Array.isArray(migrated.workExperience)) {
    migrated.workExperience = migrated.workExperience.map((work: any) => {
      if (work.dates && !work.startDate) {
        const dateParsed = parseDates(work.dates);
        const { dates, ...rest } = work; // Remove the old dates field
        return {
          ...rest,
          ...dateParsed
        };
      }
      return work;
    });
  }

  // 3. Migrate Projects (Dates if any, though projects might not have them)
  if (Array.isArray(migrated.projects)) {
    migrated.projects = migrated.projects.map((proj: any) => {
       // Just in case they had dates in projects, handle them if needed, 
       // but our new schema for projects doesn't explicitly have dates yet, 
       // or we could add them. For now, keep as is.
       return proj;
    });
  }

  // 4. Safely parse through Zod to strip any unexpected fields
  const parseResult = resumeDataSchema.safeParse(migrated);
  if (parseResult.success) {
    return parseResult.data;
  } else {
    console.error("Migration validation failed:", parseResult.error);
    // If it fails Zod, just return the raw migrated object and hope for the best
    return migrated as ResumeData;
  }
}
