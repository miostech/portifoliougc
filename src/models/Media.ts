import { Schema, model, models, Types, type InferSchemaType } from "mongoose";

const MediaSchema = new Schema(
  {
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["video", "image"], required: true },
    url: { type: String, required: true },
    thumbnail: { type: String, default: null }, // AI/derived thumbnail
    title: { type: String, default: "" }, // AI generated
    description: { type: String, default: "" }, // AI generated
    category: { type: String, default: "" },
    niche: { type: String, default: "" },
    format: { type: String, default: "" },
    product: { type: String, default: "" },
    brand: { type: String, default: "" },
    order: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hidden: { type: Boolean, default: false },
    aiGenerated: { type: Boolean, default: false }, // was metadata AI generated
    status: {
      type: String,
      enum: ["uploading", "processing", "ready", "error"],
      default: "ready",
    },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type MediaDoc = InferSchemaType<typeof MediaSchema> & {
  _id: Types.ObjectId;
};

export const Media = models.Media || model("Media", MediaSchema);
