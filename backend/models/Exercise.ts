import { Schema, model, InferSchemaType, Types } from "mongoose";

const exerciseSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    muscleGroup: { type: String, required: true },
    videoUrl: { type: String },
    imageUrl: { type: String },
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

type ExerciseType = InferSchemaType<typeof exerciseSchema>;
const Exercise = model<ExerciseType>("Exercise", exerciseSchema);
export default Exercise;
