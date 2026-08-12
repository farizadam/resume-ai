import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  atsCreditsUsed: number;
  atsCreditsLimit: number;
  resumeCreditsUsed: number;
  resumeCreditsLimit: number;
  interviewCreditsUsed: number;
  interviewCreditsLimit: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: false,
      select: false, 
    },
    atsCreditsUsed: { type: Number, default: 0 },
    atsCreditsLimit: { type: Number, default: 5 },
    resumeCreditsUsed: { type: Number, default: 0 },
    resumeCreditsLimit: { type: Number, default: 5 },
    interviewCreditsUsed: { type: Number, default: 0 },
    interviewCreditsLimit: { type: Number, default: 5 },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
