import { Schema, InferSchemaType } from "mongoose";

export const exerciseAssignmentSchema = new Schema(
  {
    exerciseId: { type: Schema.Types.ObjectId, ref: "Exercise", required: true },
    
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    restTime: { type: Number, required: true },
    notes: { type: String },
  },
  { 
    timestamps: true, 
    _id: true 
  }
);

export type ExerciseAssignmentType = InferSchemaType<typeof exerciseAssignmentSchema>;

