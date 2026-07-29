import { Schema, model, models, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true, select: false },
    image: { type: String, default: null },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    onboarded: { type: Boolean, default: false },
    acceptedTermsAt: { type: Date, default: null },

    // Subscription snapshot (source of truth for gating). Full history lives
    // in the Subscription collection.
    plan: {
      type: String,
      enum: ["none", "essencial", "pro"],
      default: "none",
    },
    subscriptionStatus: {
      type: String,
      enum: ["inactive", "active", "trialing", "canceled", "past_due"],
      default: "inactive",
    },
    currentPeriodEnd: { type: Date, default: null },

    // Account lifecycle
    suspended: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }, // soft delete
  },
  { timestamps: true }
);

export type UserRole = "user" | "admin";
export type UserPlan = "none" | "essencial" | "pro";

export type UserDoc = InferSchemaType<typeof UserSchema> & { _id: string };

export const User = models.User || model("User", UserSchema);
