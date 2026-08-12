"use client";

import React, { useState } from "react";
import { Plus, X, Sparkles, Loader2 } from "lucide-react";
import { ResumeData } from "@/types/resume";

/* ---------------------------------------------------------------------------
 * Shared classNames — pulled from the app's existing design tokens
 * (navy-*, ai-primary, surface, border-default/light, text-muted/secondary/
 * disabled) so the editor matches the marketing page instead of inventing
 * its own palette.
 * ------------------------------------------------------------------------- */

const cx = {
  input:
    "w-full rounded-lg border border-glass-border bg-glass-bg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted outline-none transition focus:border-glass-focus focus:ring-2 focus:ring-glass-focus/20 disabled:bg-glass-bg/50 disabled:text-text-disabled backdrop-blur-sm",
  label: "block text-xs font-semibold text-text-secondary mb-1.5",
  card: "relative rounded-2xl border border-glass-border bg-glass-bg/50 backdrop-blur-sm p-6 shadow-sm",
};

/* ---------------------------------------------------------------------------
 * Presentational helpers — module scope, so their identity is stable across
 * re-renders and inputs never lose focus mid-keystroke.
 * ------------------------------------------------------------------------- */

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-glass-border pb-3 mb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted mb-1">{eyebrow}</p>
        <h3 className="text-xl font-extrabold tracking-tight text-white">{title}</h3>
      </div>
      {action}
    </div>
  );
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-glass-border bg-glass-bg px-3.5 py-1.5 text-xs font-semibold text-text-primary transition hover:bg-glass-hover backdrop-blur-sm"
    >
      <Plus className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function RemoveButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Remove"
      className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full text-text-muted transition hover:bg-error/10 hover:text-error"
    >
      <X className="h-4 w-4" />
    </button>
  );
}

function EnhanceButton({
  onClick,
  disabled,
  loading,
}: {
  onClick: () => void;
  disabled: boolean;
  loading: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ai-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-ai-primary/20 transition hover:opacity-90 disabled:opacity-40 disabled:shadow-none"
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
      {loading ? "Enhancing" : "Enhance"}
    </button>
  );
}

// Read-only chip preview under a comma-field, so typing "a, b, c" gives
// immediate visual confirmation of what was parsed — purely additive, does
// not change how the field is edited or how data is committed.
function TagPreview({ items }: { items: string[] }) {
  const clean = (items || []).filter(Boolean);
  if (clean.length === 0) return null;
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {clean.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="rounded-full border border-glass-border bg-glass-bg/50 px-2.5 py-0.5 text-xs text-text-secondary"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

// Dot + connecting line for chronological sections (work experience,
// education) — reads the way a resume reads: most recent first, one
// continuous history.
function TimelineRail({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex flex-col items-center pt-2 w-5 shrink-0">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-ai-primary ring-4 ring-ai-primary/20" />
      {!isLast && <span className="mt-1 w-px flex-1 bg-glass-border" />}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={cx.label}>{label}</label>
      {children}
    </div>
  );
}

// Same ArrayInput behavior as before — module scope so it keeps a stable
// identity across re-renders and never loses focus mid-keystroke.
function ArrayInput({ value, onChange }: { value: string[]; onChange: (val: string[]) => void }) {
  const [text, setText] = React.useState((value || []).join(", "));

  React.useEffect(() => {
    const currentJoined = (value || []).join(", ");
    if (text.split(",").map(s => s.trim()).filter(Boolean).join(", ") !== currentJoined) {
      setText(currentJoined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const notifyParent = (newText: string) => {
    const parsedArray = newText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onChange(parsedArray);
  };

  return (
    <>
      <input
        type="text"
        className={cx.input}
        value={text}
        placeholder="Separate with commas"
        onChange={(e) => {
          setText(e.target.value);
          notifyParent(e.target.value);
        }}
      />
      <TagPreview items={value || []} />
    </>
  );
}

export function ResumeEditor({ data = {} as ResumeData, onChange = () => {} }: { data?: ResumeData; onChange?: (data: ResumeData) => void }) {
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);

  const handleEnhance = async (fieldId: string, text: string, type: string, callback: (enhanced: string) => void) => {
    if (!text.trim()) return;
    setIsEnhancing(fieldId);
    try {
      const res = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type }),
      });
      if (!res.ok) throw new Error("Failed to enhance text");
      const result = await res.json();
      if (result.enhancedText) {
        callback(result.enhancedText);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to enhance text. Please try again.");
    } finally {
      setIsEnhancing(null);
    }
  };

  const handleSimpleChange = (section: keyof ResumeData, value: any) => {
    onChange({
      ...data,
      [section]: value,
    });
  };

  const handleNestedChange = (section: keyof ResumeData, field: string, value: any) => {
    onChange({
      ...data,
      [section]: {
        ...(data[section] as any || {}),
        [field]: value,
      },
    });
  };

  const handleArrayChange = (section: keyof ResumeData, index: number, field: string, value: any) => {
    const arr = [...(data[section] as any[] || [])];
    if (!arr[index]) arr[index] = {};
    arr[index][field] = value;
    onChange({ ...data, [section]: arr });
  };

  const addArrayItem = (section: keyof ResumeData, defaultItem: any = {}) => {
    const arr = [...(data[section] as any[] || [])];
    arr.push(defaultItem);
    onChange({ ...data, [section]: arr });
  };

  const removeArrayItem = (section: keyof ResumeData, index: number) => {
    const arr = [...(data[section] as any[] || [])];
    arr.splice(index, 1);
    onChange({ ...data, [section]: arr });
  };

  const handleSkillsChange = (category: string, value: string) => {
    handleNestedChange("technicalSkills", category, value.split(",").map((s) => s.trim()).filter(Boolean));
  };

  return (
    <div className="flex flex-col gap-10 h-full">
      {/* Personal Information */}
      <section>
        <SectionHeader eyebrow="Contact" title="Personal Information" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Full name">
            <input className={cx.input}
              value={data?.contactInfo?.name || ""} onChange={(e) => handleNestedChange("contactInfo", "name", e.target.value)} />
          </Field>
          <Field label="Professional title">
            <input className={cx.input}
              value={data?.contactInfo?.title || ""} onChange={(e) => handleNestedChange("contactInfo", "title", e.target.value)} placeholder="e.g. Senior Software Engineer" />
          </Field>
          <Field label="Email">
            <input type="email" className={cx.input}
              value={data?.contactInfo?.email || ""} onChange={(e) => handleNestedChange("contactInfo", "email", e.target.value)} />
          </Field>
          <Field label="Phone">
            <input type="tel" className={cx.input}
              value={data?.contactInfo?.phone || ""} onChange={(e) => handleNestedChange("contactInfo", "phone", e.target.value)} />
          </Field>
          <Field label="Location">
            <input className={cx.input}
              value={data?.contactInfo?.location || ""} onChange={(e) => handleNestedChange("contactInfo", "location", e.target.value)} placeholder="City, State" />
          </Field>
          <Field label="LinkedIn URL">
            <input type="url" className={cx.input}
              value={data?.contactInfo?.linkedin || ""} onChange={(e) => handleNestedChange("contactInfo", "linkedin", e.target.value)} />
          </Field>
          <Field label="GitHub URL">
            <input type="url" className={cx.input}
              value={data?.contactInfo?.github || ""} onChange={(e) => handleNestedChange("contactInfo", "github", e.target.value)} />
          </Field>
          <Field label="Portfolio / website">
            <input type="url" className={cx.input}
              value={data?.contactInfo?.portfolio || ""} onChange={(e) => handleNestedChange("contactInfo", "portfolio", e.target.value)} />
          </Field>
        </div>
      </section>

      {/* Summary */}
      <section>
        <SectionHeader
          eyebrow="Overview"
          title="Professional Summary"
          action={
            <EnhanceButton
              onClick={() => handleEnhance("summary", data?.summary || "", "summary", (enhanced) => handleSimpleChange("summary", enhanced))}
              disabled={isEnhancing === "summary" || !(data?.summary?.trim())}
              loading={isEnhancing === "summary"}
            />
          }
        />
        <textarea className={`${cx.input} min-h-[120px] resize-y leading-relaxed`}
          value={data?.summary || ""}
          onChange={(e) => handleSimpleChange("summary", e.target.value)}
          placeholder="A brief overview of your professional background..." />
      </section>

      {/* Work Experience */}
      <section>
        <SectionHeader
          eyebrow={`${data?.workExperience?.length || 0} role${(data?.workExperience?.length || 0) === 1 ? "" : "s"}, most recent first`}
          title="Work Experience"
          action={<AddButton label="Add role" onClick={() => addArrayItem("workExperience", { company: "", position: "", achievements: [] })} />}
        />

        <div className="flex flex-col">
          {data?.workExperience?.map((job, index) => {
            const isLast = index === (data.workExperience?.length || 0) - 1;
            return (
              <div key={index} className="flex gap-3">
                <TimelineRail isLast={isLast} />
                <div className={`${cx.card} flex-1 mb-5`}>
                  <RemoveButton onClick={() => removeArrayItem("workExperience", index)} />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <Field label="Company">
                      <input className={cx.input}
                        value={job.company || ""} onChange={(e) => handleArrayChange("workExperience", index, "company", e.target.value)} />
                    </Field>
                    <Field label="Position / title">
                      <input className={cx.input}
                        value={job.position || ""} onChange={(e) => handleArrayChange("workExperience", index, "position", e.target.value)} />
                    </Field>
                    <Field label="Location">
                      <input className={cx.input}
                        value={job.location || ""} onChange={(e) => handleArrayChange("workExperience", index, "location", e.target.value)} placeholder="City, State or Remote" />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Start date">
                        <input className={cx.input}
                          value={job.startDate || ""} onChange={(e) => handleArrayChange("workExperience", index, "startDate", e.target.value)} placeholder="Jan 2020" />
                      </Field>
                      <div>
                        <label className={`${cx.label} flex items-center justify-between`}>
                          End date
                          <span className="flex items-center gap-1.5 text-xs font-normal text-text-muted cursor-pointer">
                            <input type="checkbox" checked={!!job.isCurrent} onChange={(e) => {
                              handleArrayChange("workExperience", index, "isCurrent", e.target.checked);
                              if (e.target.checked) handleArrayChange("workExperience", index, "endDate", "");
                            }} className="rounded border-glass-border accent-ai-primary" />
                            Current
                          </span>
                        </label>
                        <input className={cx.input}
                          value={job.endDate || ""} disabled={!!job.isCurrent} onChange={(e) => handleArrayChange("workExperience", index, "endDate", e.target.value)} placeholder="Present" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={cx.label + " mb-0"}>Achievements</label>
                      <EnhanceButton
                        onClick={() => handleEnhance(`work-${index}`, (job.achievements || []).join("\n"), "achievements", (enhanced) => handleArrayChange("workExperience", index, "achievements", enhanced.split("\n")))}
                        disabled={isEnhancing === `work-${index}` || !(job.achievements?.join("").trim())}
                        loading={isEnhancing === `work-${index}`}
                      />
                    </div>
                    <textarea className={`${cx.input} min-h-[100px] leading-relaxed`}
                      value={(job.achievements || []).join("\n")}
                      onChange={(e) => handleArrayChange("workExperience", index, "achievements", e.target.value.split("\n"))}
                      placeholder="One achievement per line..." />
                  </div>
                </div>
              </div>
            );
          })}
          {(!data?.workExperience || data.workExperience.length === 0) && (
            <p className="text-sm text-text-disabled">No roles added yet.</p>
          )}
        </div>
      </section>

      {/* Projects */}
      <section>
        <SectionHeader
          eyebrow={`${data?.projects?.length || 0} project${(data?.projects?.length || 0) === 1 ? "" : "s"}`}
          title="Projects"
          action={<AddButton label="Add project" onClick={() => addArrayItem("projects", { name: "", accomplishments: [] })} />}
        />

        <div className="grid grid-cols-1 gap-4">
          {data?.projects?.map((project, index) => (
            <div key={index} className={cx.card}>
              <RemoveButton onClick={() => removeArrayItem("projects", index)} />

              <div className="grid grid-cols-1 gap-4 pr-8">
                <Field label="Project name">
                  <input className={cx.input}
                    value={project.name || ""} onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)} />
                </Field>
                <Field label="Technologies used">
                  <ArrayInput
                    value={project.technologies || []}
                    onChange={(arr) => handleArrayChange("projects", index, "technologies", arr)}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className={cx.label + " mb-0"}>Accomplishments & description</label>
                  <EnhanceButton
                    onClick={() => handleEnhance(`proj-${index}`, (project.accomplishments || []).join("\n"), "achievements", (enhanced) => handleArrayChange("projects", index, "accomplishments", enhanced.split("\n")))}
                    disabled={isEnhancing === `proj-${index}` || !(project.accomplishments?.join("").trim())}
                    loading={isEnhancing === `proj-${index}`}
                  />
                </div>
                <textarea className={`${cx.input} min-h-[100px] leading-relaxed`}
                  value={(project.accomplishments || []).join("\n")}
                  onChange={(e) => handleArrayChange("projects", index, "accomplishments", e.target.value.split("\n"))}
                  placeholder="One accomplishment per line..." />
              </div>
            </div>
          ))}
          {(!data?.projects || data.projects.length === 0) && (
            <p className="text-sm text-text-disabled">No projects added yet.</p>
          )}
        </div>
      </section>

      {/* Education */}
      <section>
        <SectionHeader
          eyebrow={`${data?.education?.length || 0} entr${(data?.education?.length || 0) === 1 ? "y" : "ies"}, most recent first`}
          title="Education"
          action={<AddButton label="Add education" onClick={() => addArrayItem("education", { university: "", degree: "" })} />}
        />

        <div className="flex flex-col">
          {data?.education?.map((edu, index) => {
            const isLast = index === (data.education?.length || 0) - 1;
            return (
              <div key={index} className="flex gap-3">
                <TimelineRail isLast={isLast} />
                <div className={`${cx.card} flex-1 mb-5`}>
                  <RemoveButton onClick={() => removeArrayItem("education", index)} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                    <Field label="University / institution">
                      <input className={cx.input}
                        value={edu.university || ""} onChange={(e) => handleArrayChange("education", index, "university", e.target.value)} />
                    </Field>
                    <Field label="Location">
                      <input className={cx.input}
                        value={edu.location || ""} onChange={(e) => handleArrayChange("education", index, "location", e.target.value)} />
                    </Field>
                    <Field label="Degree">
                      <input className={cx.input}
                        value={edu.degree || ""} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} placeholder="B.S." />
                    </Field>
                    <Field label="Field of study">
                      <input className={cx.input}
                        value={edu.fieldOfStudy || ""} onChange={(e) => handleArrayChange("education", index, "fieldOfStudy", e.target.value)} placeholder="Computer Science" />
                    </Field>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="Start date">
                        <input className={cx.input}
                          value={edu.startDate || ""} onChange={(e) => handleArrayChange("education", index, "startDate", e.target.value)} placeholder="Aug 2018" />
                      </Field>
                      <div>
                        <label className={`${cx.label} flex items-center justify-between`}>
                          End date
                          <span className="flex items-center gap-1.5 text-xs font-normal text-text-muted cursor-pointer">
                            <input type="checkbox" checked={!!edu.isCurrent} onChange={(e) => {
                              handleArrayChange("education", index, "isCurrent", e.target.checked);
                              if (e.target.checked) handleArrayChange("education", index, "endDate", "");
                            }} className="rounded border-glass-border accent-ai-primary" />
                            Current
                          </span>
                        </label>
                        <input className={cx.input}
                          value={edu.endDate || ""} disabled={!!edu.isCurrent} onChange={(e) => handleArrayChange("education", index, "endDate", e.target.value)} placeholder="May 2022" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Field label="GPA">
                        <input className={cx.input}
                          value={edu.gpa || ""} onChange={(e) => handleArrayChange("education", index, "gpa", e.target.value)} placeholder="3.9/4.0" />
                      </Field>
                      <Field label="Honors">
                        <input className={cx.input}
                          value={edu.honors || ""} onChange={(e) => handleArrayChange("education", index, "honors", e.target.value)} placeholder="Summa Cum Laude" />
                      </Field>
                    </div>
                    <div className="md:col-span-2">
                      <Field label="Relevant coursework">
                        <ArrayInput
                          value={edu.relevantCoursework || []}
                          onChange={(arr) => handleArrayChange("education", index, "relevantCoursework", arr)}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          {(!data?.education || data.education.length === 0) && (
            <p className="text-sm text-text-disabled">No education added yet.</p>
          )}
        </div>
      </section>

      {/* Skills */}
      <section>
        <SectionHeader eyebrow="Capabilities" title="Skills" />
        <div className="grid grid-cols-1 gap-5">
          <Field label="Languages">
            <div className="flex items-center justify-end mb-1.5 -mt-1">
              <EnhanceButton
                onClick={() => handleEnhance("lang", (data?.technicalSkills?.languages || []).join(", "), "skills", (enhanced) => handleNestedChange("technicalSkills", "languages", enhanced.split(",").map(s => s.trim())))}
                disabled={isEnhancing === "lang" || !(data?.technicalSkills?.languages?.join("").trim())}
                loading={isEnhancing === "lang"}
              />
            </div>
            <ArrayInput
              value={data?.technicalSkills?.languages || []}
              onChange={(arr) => handleNestedChange("technicalSkills", "languages", arr)} />
          </Field>
          <Field label="Frameworks">
            <div className="flex items-center justify-end mb-1.5 -mt-1">
              <EnhanceButton
                onClick={() => handleEnhance("fw", (data?.technicalSkills?.frameworks || []).join(", "), "skills", (enhanced) => handleNestedChange("technicalSkills", "frameworks", enhanced.split(",").map(s => s.trim())))}
                disabled={isEnhancing === "fw" || !(data?.technicalSkills?.frameworks?.join("").trim())}
                loading={isEnhancing === "fw"}
              />
            </div>
            <ArrayInput
              value={data?.technicalSkills?.frameworks || []}
              onChange={(arr) => handleNestedChange("technicalSkills", "frameworks", arr)} />
          </Field>
          <Field label="Tools & cloud">
            <div className="flex items-center justify-end mb-1.5 -mt-1">
              <EnhanceButton
                onClick={() => handleEnhance("tools", [...(data?.technicalSkills?.tools || []), ...(data?.technicalSkills?.cloudPlatforms || [])].join(", "), "skills", (enhanced) => handleNestedChange("technicalSkills", "tools", enhanced.split(",").map(s => s.trim())))}
                disabled={isEnhancing === "tools" || !([...(data?.technicalSkills?.tools || []), ...(data?.technicalSkills?.cloudPlatforms || [])].join("").trim())}
                loading={isEnhancing === "tools"}
              />
            </div>
            <ArrayInput
              value={[...(data?.technicalSkills?.tools || []), ...(data?.technicalSkills?.cloudPlatforms || [])]}
              onChange={(arr) => handleNestedChange("technicalSkills", "tools", arr)} />
          </Field>
          <Field label="Soft skills">
            <div className="flex items-center justify-end mb-1.5 -mt-1">
              <EnhanceButton
                onClick={() => handleEnhance("soft", (data?.technicalSkills?.softSkills || []).join(", "), "skills", (enhanced) => handleNestedChange("technicalSkills", "softSkills", enhanced.split(",").map(s => s.trim())))}
                disabled={isEnhancing === "soft" || !(data?.technicalSkills?.softSkills?.join("").trim())}
                loading={isEnhancing === "soft"}
              />
            </div>
            <ArrayInput
              value={data?.technicalSkills?.softSkills || []}
              onChange={(arr) => handleNestedChange("technicalSkills", "softSkills", arr)} />
          </Field>
        </div>
      </section>

      {/* Certifications */}
      <section>
        <SectionHeader
          eyebrow={`${data?.certifications?.length || 0} certification${(data?.certifications?.length || 0) === 1 ? "" : "s"}`}
          title="Certifications"
          action={<AddButton label="Add certification" onClick={() => addArrayItem("certifications", { name: "", issuer: "" })} />}
        />

        <div className="grid grid-cols-1 gap-4">
          {data?.certifications?.map((cert, index) => (
            <div key={index} className={cx.card}>
              <RemoveButton onClick={() => removeArrayItem("certifications", index)} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                <Field label="Name">
                  <input className={cx.input}
                    value={cert.name || ""} onChange={(e) => handleArrayChange("certifications", index, "name", e.target.value)} />
                </Field>
                <Field label="Issuer">
                  <input className={cx.input}
                    value={cert.issuer || ""} onChange={(e) => handleArrayChange("certifications", index, "issuer", e.target.value)} />
                </Field>
                <Field label="Date">
                  <input className={cx.input}
                    value={cert.date || ""} onChange={(e) => handleArrayChange("certifications", index, "date", e.target.value)} />
                </Field>
              </div>
            </div>
          ))}
          {(!data?.certifications || data.certifications.length === 0) && (
            <p className="text-sm text-text-disabled">No certifications added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}