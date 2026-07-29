import { Schema, model, models, type InferSchemaType } from "mongoose";

const TemplateSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    previewImage: { type: String, default: null },
    accent: { type: String, default: "#7c5cff" },
    // Free-form layout/style config the public renderer reads.
    config: { type: Schema.Types.Mixed, default: {} },
    isActive: { type: Boolean, default: true },
    isPremium: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type TemplateDoc = InferSchemaType<typeof TemplateSchema>;

export const Template = models.Template || model("Template", TemplateSchema);
