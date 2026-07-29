import { Schema, model, models, type InferSchemaType } from "mongoose";

const SceneSchema = new Schema(
  {
    order: { type: Number, default: 0 },
    description: { type: String, required: true },
    shot: { type: String, default: "" },
    line: { type: String, default: "" },
  },
  { _id: false }
);

const VideoModelSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true }, // slug
    title: { type: String, required: true },
    niche: { type: String, required: true, index: true },
    format: { type: String, required: true, index: true },
    objective: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["iniciante", "intermedia", "avancado"],
      default: "iniciante",
    },
    durationSeconds: { type: Number, default: 30 },
    onCamera: { type: Boolean, default: true },
    equipment: { type: [String], default: [] },
    minPlan: { type: String, enum: ["essencial", "pro"], default: "essencial" },
    description: { type: String, default: "" },
    hook: { type: String, default: "" },
    script: { type: String, default: "" },
    scenes: { type: [SceneSchema], default: [] },
    framing: { type: String, default: "" },
    lighting: { type: String, default: "" },
    editing: { type: String, default: "" },
    voiceOver: { type: String, default: "" },
    cta: { type: String, default: "" },
    caption: { type: String, default: "" },
    tips: { type: [String], default: [] },
    thumbnail: { type: String, default: null },
    referenceVideo: { type: String, default: null },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type VideoModelDoc = InferSchemaType<typeof VideoModelSchema>;

export const VideoModel = models.VideoModel || model("VideoModel", VideoModelSchema);
