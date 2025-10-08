import { Schema, model, InferSchemaType } from "mongoose";

const exerciseAssignmentSchema = new Schema(
  {
    exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    restTime: { type: Number, required: true },
    notes: { type: String },
  },
  { 
    timestamps: true,
    versionKey: false
  }
);

type ExerciseAssignmentType = InferSchemaType<typeof exerciseAssignmentSchema>;
const ExerciseAssignment = model<ExerciseAssignmentType>(
  "ExerciseAssignment",
  exerciseAssignmentSchema
);
export default ExerciseAssignment;
