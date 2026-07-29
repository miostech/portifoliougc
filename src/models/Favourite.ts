import { Schema, model, models, type InferSchemaType } from "mongoose";

const FavouriteSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    modelId: { type: String, required: true }, // catalog model id
  },
  { timestamps: true }
);

FavouriteSchema.index({ userId: 1, modelId: 1 }, { unique: true });

export type FavouriteDoc = InferSchemaType<typeof FavouriteSchema>;

export const Favourite = models.Favourite || model("Favourite", FavouriteSchema);
