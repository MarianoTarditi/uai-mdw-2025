import { Schema, model, InferSchemaType } from "mongoose";
import { exerciseAssignmentSchema } from "./ExerciseAssignment";
import { auditPlugin } from "../utils/auditPlugin";

const routineSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },

    trainerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      default: null,
    },
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: true,
    },

    exerciseAssignments: {
      type: [exerciseAssignmentSchema],
      default: [],
    },

    isTemplate: { type: Boolean, default: true },
  },
  { timestamps: true },
);

routineSchema.plugin(auditPlugin);

type RoutineType = InferSchemaType<typeof routineSchema>;
const Routine = model<RoutineType>("Routine", routineSchema);

export default Routine;
