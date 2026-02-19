import { Schema, model, InferSchemaType } from "mongoose";

const progressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    routineId: { type: Schema.Types.ObjectId, ref: "Routine", required: true },
    exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true, },
    date: { type: Date, required: true },
    weightUsed: { type: Number },
    notes: { type: String },
    completedSets: { type: Number },
    completedReps: { type: Number },
  },
  { 
    timestamps: true, 
    versionKey: false 
  }
);

type ProgressType = InferSchemaType<typeof progressSchema>;
const Progress = model<ProgressType>("Progress", progressSchema);
export default Progress;
