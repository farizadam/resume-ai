import mongoose, { Document, Schema } from "mongoose";

export interface IResume extends Document {
  userId: mongoose.Types.ObjectId;
  interviewId?: mongoose.Types.ObjectId;
  title: string;
  targetRole: string;
  candidateData: Record<string, unknown>;
  atsScore?: number;
  status: "draft" | "completed";
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewId: {
      type: Schema.Types.ObjectId,
      ref: "Interview",
    },
    title: {
      type: String,
      default: "Untitled Resume",
    },
    targetRole: {
      type: String,
      default: "",
    },
    candidateData: {
      type: Schema.Types.Mixed,
      default: {},
    },
    atsScore: {
      type: Number,
    },
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
    template: {
      type: String,
      default: "modern",
    },
  },
  {
    timestamps: true,
  }
);

const Resume =
  mongoose.models.Resume || mongoose.model<IResume>("Resume", resumeSchema);

export default Resume;
