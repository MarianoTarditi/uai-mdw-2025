import { Schema, model, InferSchemaType } from "mongoose";
import { exerciseAssignmentSchema } from "./ExerciseAssignment"; 

const routineSchema = new Schema(
  {
    trainerId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },

    exerciseAssignments: {
      type: [exerciseAssignmentSchema],
      default: []
    },

    isTemplate: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type RoutineType = InferSchemaType<typeof routineSchema>;
const Routine = model<RoutineType>("Routine", routineSchema);

export default Routine;