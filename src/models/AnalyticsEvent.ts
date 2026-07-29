import { Schema, model, models, Types, type InferSchemaType } from "mongoose";

const AnalyticsEventSchema = new Schema(
  {
    portfolioId: {
      type: Schema.Types.ObjectId,
      ref: "Portfolio",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["visit", "social_click", "contact_click", "video_view"],
      required: true,
      index: true,
    },
    mediaId: {
      type: Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
    meta: { type: Schema.Types.Mixed, default: {} }, // e.g. { platform: "instagram" }
    referrer: { type: String, default: null },
  },
  { timestamps: true }
);

export type AnalyticsEventDoc = InferSchemaType<typeof AnalyticsEventSchema> & {
  _id: Types.ObjectId;
};

export const AnalyticsEvent =
  models.AnalyticsEvent || model("AnalyticsEvent", AnalyticsEventSchema);
