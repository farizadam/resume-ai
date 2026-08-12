import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Link,
} from '@react-pdf/renderer';
import { ResumeData } from '@/types/resume';

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
    marginBottom: 12,
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


export const ResumeTemplate = ({
  data = {} as ResumeData,
}: {
  data?: ResumeData;
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
            
            {data.contactInfo.title && (
              <Text style={{ textAlign: 'center', fontSize: 11, marginBottom: 6, fontFamily: 'Helvetica-Bold' }}>
                {data.contactInfo.title}
              </Text>
            )}

            <View style={styles.contactInfo}>
              <Text style={styles.contactItem}>
                {[
                  data.contactInfo.location,
                  data.contactInfo.email,
                  data.contactInfo.phone,
                ].filter(Boolean).join('  |  ')}
              </Text>

              {data.contactInfo.linkedin && (
                <Text style={styles.contactItem}>
                  | <Link src={data.contactInfo.linkedin} style={styles.link}>LinkedIn</Link>
                </Text>
              )}

              {data.contactInfo.github && (
                <Text style={styles.contactItem}>
                  | <Link src={data.contactInfo.github} style={styles.link}>GitHub</Link>
                </Text>
              )}

              {data.contactInfo.portfolio && (
                <Text style={styles.contactItem}>
                  | <Link src={data.contactInfo.portfolio} style={styles.link}>Portfolio</Link>
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
                    softSkills: 'Soft Skills',
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
                          {exp.company}{exp.location ? ` - ${exp.location}` : ''}
                        </Text>
                      )}

                    </View>

                    {(exp.startDate || exp.endDate || exp.isCurrent) && (
                      <Text style={styles.itemDate}>
                        {exp.startDate || ''} - {exp.isCurrent ? 'Present' : (exp.endDate || '')}
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

        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu, index) => (
              <View style={styles.itemGroup} key={index}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    {edu.university && (
                      <Text style={styles.itemTitle}>
                        {edu.university}{edu.location ? `, ${edu.location}` : ''}
                      </Text>
                    )}
                    {edu.degree && (
                      <Text style={styles.educationDegree}>
                        {edu.degree}{edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''}
                      </Text>
                    )}
                  </View>
                  {(edu.startDate || edu.endDate || edu.isCurrent) && (
                    <Text style={styles.itemDate}>
                      {edu.startDate || ''} - {edu.isCurrent ? 'Present' : (edu.endDate || '')}
                    </Text>
                  )}
                </View>
                
                {edu.gpa && (
                  <Text style={{ fontSize: 9, marginTop: 1 }}>GPA: {edu.gpa}</Text>
                )}
                {edu.honors && (
                  <Text style={{ fontSize: 9, marginTop: 1 }}>Honors: {edu.honors}</Text>
                )}
                {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                  <Text style={{ fontSize: 9, marginTop: 1 }}>Relevant Coursework: {edu.relevantCoursework.join(', ')}</Text>
                )}
              </View>
            ))}
          </View>
        )}
        
        {/* =========================
            CERTIFICATIONS
        ========================= */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {data.certifications.map((cert, i) => (
              <View style={styles.itemHeader} key={i}>
                <View style={styles.itemHeaderLeft}>
                  <Text style={styles.itemTitle}>{cert.name}</Text>
                  {cert.issuer && <Text style={styles.itemSubtitle}>{cert.issuer}</Text>}
                </View>
                {cert.date && <Text style={styles.itemDate}>{cert.date}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* =========================
            AWARDS
        ========================= */}
        {data.awards && data.awards.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Awards & Honors</Text>
            {data.awards.map((award, i) => (
              <View style={styles.itemGroup} key={i}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{award.title}</Text>
                    {award.issuer && <Text style={styles.itemSubtitle}>{award.issuer}</Text>}
                  </View>
                  {award.date && <Text style={styles.itemDate}>{award.date}</Text>}
                </View>
                {award.description && <Text style={styles.projectDescription}>{award.description}</Text>}
              </View>
            ))}
          </View>
        )}

        {/* =========================
            VOLUNTEER
        ========================= */}
        {data.volunteer && data.volunteer.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Volunteer Experience</Text>
            {data.volunteer.map((vol, i) => (
              <View style={styles.itemGroup} key={i}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemHeaderLeft}>
                    <Text style={styles.itemTitle}>{vol.role}</Text>
                    {vol.organization && <Text style={styles.itemSubtitle}>{vol.organization}</Text>}
                  </View>
                  {vol.dates && <Text style={styles.itemDate}>{vol.dates}</Text>}
                </View>
                {vol.description && <Text style={styles.projectDescription}>{vol.description}</Text>}
              </View>
            ))}
          </View>
        )}
        
        {/* =========================
            LANGUAGES
        ========================= */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {data.languages.map((lang, i) => (
                <Text key={i} style={{ fontSize: 9.2, marginRight: 15 }}>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>{lang.language}</Text>
                  {lang.proficiency ? ` - ${lang.proficiency}` : ''}
                </Text>
              ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};