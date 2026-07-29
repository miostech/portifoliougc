import { Schema, model, models, Types, type InferSchemaType } from "mongoose";

export const PLAN_STATUSES = [
  "quero_gravar",
  "em_preparacao",
  "gravado",
  "em_edicao",
  "pronto",
  "adicionado",
] as const;

export type PlanStatus = (typeof PLAN_STATUSES)[number];

const RecordingPlanItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sourceModelId: { type: String, default: null }, // catalog model id
    title: { type: String, required: true },
    product: { type: String, default: "" },
    brand: { type: String, default: "" },
    status: { type: String, enum: PLAN_STATUSES, default: "quero_gravar", index: true },
    notes: { type: String, default: "" },
    contentLink: { type: String, default: "" },
    deadline: { type: Date, default: null },
    generatedScriptId: { type: Schema.Types.ObjectId, ref: "GeneratedScript", default: null },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type RecordingPlanItemDoc = InferSchemaType<typeof RecordingPlanItemSchema> & {
  _id: Types.ObjectId;
};

export const RecordingPlanItem =
  models.RecordingPlanItem || model("RecordingPlanItem", RecordingPlanItemSchema);
