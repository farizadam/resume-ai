import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingLeft: 42,
    paddingRight: 42,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    lineHeight: 1.35,
    color: '#000000',
  },

  /* =========================
     HEADER
  ========================= */

  header: {
    marginBottom: 12,
  },

  name: {
    fontSize: 19,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    marginBottom: 5,
    textTransform: 'uppercase',
  },

  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    fontSize: 8.5,
  },

  contactItem: {
    marginRight: 7,
  },

  link: {
    color: '#000000',
    textDecoration: 'none',
  },

  /* =========================
     SECTIONS
  ========================= */

  section: {
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 2,
    marginBottom: 5,
  },

  /* =========================
     SUMMARY
  ========================= */

  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.4,
  },

  /* =========================
     SKILLS
  ========================= */

  skillsRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },

  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    width: 82,
  },

  skillList: {
    flex: 1,
  },

  /* =========================
     EXPERIENCE / PROJECTS
  ========================= */

  itemGroup: {
    marginBottom: 7,
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },

  itemHeaderLeft: {
    flex: 1,
    paddingRight: 8,
  },

  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.8,
  },

  itemSubtitle: {
    fontSize: 9.3,
  },

  itemDate: {
    fontSize: 8.8,
    textAlign: 'right',
  },

  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 1.5,
  },

  bullet: {
    width: 9,
    fontSize: 9,
  },

  bulletText: {
    flex: 1,
    fontSize: 9.2,
    lineHeight: 1.35,
  },

  projectDescription: {
    fontSize: 9.2,
    lineHeight: 1.35,
    marginBottom: 4,
  },

  projectTechnologies: {
    fontSize: 8.8,
    marginBottom: 2,
  },

  /* =========================
     EDUCATION
  ========================= */

  educationDegree: {
    fontSize: 9.3,
  },
});

interface ResumeData {
  contactInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
  };

  summary?: string;

  technicalSkills?: {
    languages?: string[];
    frameworks?: string[];
    databases?: string[];
    tools?: string[];
    operatingSystems?: string[];
    cloudPlatforms?: string[];
  };

  workExperience?: Array<{
    company?: string;
    position?: string;
    dates?: string;
    achievements?: string[];
  }>;

  projects?: Array<{
    name?: string;
    description?: string;
    technologies?: string[];
    accomplishments?: string[];
  }>;

  education?: {
    degree?: string;
    fieldOfStudy?: string;
    university?: string;
    dates?: string;
  };
}

export const ResumeTemplate = ({
  data,
}: {
  data: ResumeData;
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>

        {/* =========================
            CONTACT INFORMATION
        ========================= */}

        {data.contactInfo && (
          <View style={styles.header}>

            {data.contactInfo.name && (
              <Text style={styles.name}>
                {data.contactInfo.name}
              </Text>
            )}

            <View style={styles.contactInfo}>

              {data.contactInfo.email && (
                <Text style={styles.contactItem}>
                  {data.contactInfo.email}
                </Text>
              )}

              {data.contactInfo.phone && (
                <Text style={styles.contactItem}>
                  | {data.contactInfo.phone}
                </Text>
              )}

              {data.contactInfo.linkedin && (
                <Text style={styles.contactItem}>
                  |{' '}
                  <Link
                    src={data.contactInfo.linkedin}
                    style={styles.link}
                  >
                    LinkedIn
                  </Link>
                </Text>
              )}

              {data.contactInfo.github && (
                <Text style={styles.contactItem}>
                  |{' '}
                  <Link
                    src={data.contactInfo.github}
                    style={styles.link}
                  >
                    GitHub
                  </Link>
                </Text>
              )}

            </View>
          </View>
        )}

        {/* =========================
            SUMMARY
        ========================= */}

        {data.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Summary
            </Text>

            <Text style={styles.summaryText}>
              {data.summary}
            </Text>
          </View>
        )}

        {/* =========================
            SKILLS
        ========================= */}

        {data.technicalSkills &&
          Object.values(data.technicalSkills).some(
            (skills) => skills && skills.length > 0
          ) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Skills
              </Text>

              {Object.entries(data.technicalSkills).map(
                ([category, skills]) => {

                  if (!skills || skills.length === 0) {
                    return null;
                  }

                  const categoryNames: Record<string, string> = {
                    languages: 'Languages',
                    frameworks: 'Frameworks',
                    databases: 'Databases',
                    tools: 'Tools',
                    operatingSystems: 'Operating Systems',
                    cloudPlatforms: 'Cloud Platforms',
                  };

                  return (
                    <View
                      style={styles.skillsRow}
                      key={category}
                    >
                      <Text style={styles.skillCategory}>
                        {categoryNames[category] || category}:
                      </Text>

                      <Text style={styles.skillList}>
                        {skills.join(', ')}
                      </Text>
                    </View>
                  );
                }
              )}
            </View>
          )}

        {/* =========================
            WORK EXPERIENCE
        ========================= */}

        {data.workExperience &&
          data.workExperience.length > 0 && (
            <View style={styles.section}>

              <Text style={styles.sectionTitle}>
                Work Experience
              </Text>

              {data.workExperience.map((exp, index) => (
                <View
                  style={styles.itemGroup}
                  key={index}
                >

                  <View style={styles.itemHeader}>

                    <View style={styles.itemHeaderLeft}>

                      {exp.position && (
                        <Text style={styles.itemTitle}>
                          {exp.position}
                        </Text>
                      )}

                      {exp.company && (
                        <Text style={styles.itemSubtitle}>
                          {exp.company}
                        </Text>
                      )}

                    </View>

                    {exp.dates && (
                      <Text style={styles.itemDate}>
                        {exp.dates}
                      </Text>
                    )}

                  </View>

                  {exp.achievements?.map(
                    (achievement, index) => (
                      <View
                        style={styles.bulletPoint}
                        key={index}
                      >
                        <Text style={styles.bullet}>
                          •
                        </Text>

                        <Text style={styles.bulletText}>
                          {achievement}
                        </Text>
                      </View>
                    )
                  )}

                </View>
              ))}
            </View>
          )}

        {/* =========================
            PROJECTS
        ========================= */}

        {data.projects &&
          data.projects.length > 0 && (
            <View style={styles.section}>

              <Text style={styles.sectionTitle}>
                Projects
              </Text>

              {data.projects.map((project, index) => (
                <View
                  style={styles.itemGroup}
                  key={index}
                >

                  <View style={styles.itemHeader}>

                    <View style={styles.itemHeaderLeft}>

                      {project.name && (
                        <Text style={styles.itemTitle}>
                          {project.name}
                        </Text>
                      )}

                      {project.technologies &&
                        project.technologies.length > 0 && (
                          <Text style={styles.projectTechnologies}>
                            Technologies: {project.technologies.join(', ')}
                          </Text>
                        )}

                    </View>

                  </View>

                  {project.description && (
                    <Text style={styles.projectDescription}>
                      {project.description}
                    </Text>
                  )}

                  {project.accomplishments?.map(
                    (accomplishment, index) => (
                      <View
                        style={styles.bulletPoint}
                        key={index}
                      >
                        <Text style={styles.bullet}>
                          •
                        </Text>

                        <Text style={styles.bulletText}>
                          {accomplishment}
                        </Text>
                      </View>
                    )
                  )}

                </View>
              ))}
            </View>
          )}

        {/* =========================
            EDUCATION
        ========================= */}

        {data.education && (
          <View style={styles.section}>

            <Text style={styles.sectionTitle}>
              Education
            </Text>

            <View style={styles.itemHeader}>

              <View style={styles.itemHeaderLeft}>

                {data.education.university && (
                  <Text style={styles.itemTitle}>
                    {data.education.university}
                  </Text>
                )}

                {data.education.degree && (
                  <Text style={styles.educationDegree}>
                    {data.education.degree}
                    {data.education.fieldOfStudy
                      ? ` in ${data.education.fieldOfStudy}`
                      : ''}
                  </Text>
                )}

              </View>

              {data.education.dates && (
                <Text style={styles.itemDate}>
                  {data.education.dates}
                </Text>
              )}

            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};