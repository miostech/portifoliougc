import { Schema, model, models, Types, type InferSchemaType } from "mongoose";

const GeneratedScriptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    sourceModelId: { type: String, default: null },
    title: { type: String, default: "" },
    input: { type: Schema.Types.Mixed, default: {} },
    result: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export type GeneratedScriptDoc = InferSchemaType<typeof GeneratedScriptSchema> & {
  _id: Types.ObjectId;
};

export const GeneratedScript =
  models.GeneratedScript || model("GeneratedScript", GeneratedScriptSchema);
