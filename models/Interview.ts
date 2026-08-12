import mongoose, { Document, Schema } from "mongoose";

export interface IMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface IInterview extends Document {
  userId?: mongoose.Types.ObjectId;
  status: "active" | "completed";
  currentSection: string;
  messages: IMessage[];
  candidateData: Record<string, unknown>;
  questionCount: number;
  isEnhanced: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const interviewSchema = new Schema<IInterview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["active", "completed"],
      default: "active",
    },

    currentSection: {
      type: String,
      default: "personal",
    },

    messages: {
      type: [messageSchema],
      default: [],
    },

    candidateData: {
      type: Schema.Types.Mixed,
      default: {},
    },

    questionCount: {
      type: Number,
      default: 0,
    },

    isEnhanced: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Interview =
  mongoose.models.Interview ||
  mongoose.model<IInterview>("Interview", interviewSchema);

export default Interview;