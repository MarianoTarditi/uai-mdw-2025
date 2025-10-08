import { Schema, model, InferSchemaType } from "mongoose";

const routineSchema = new Schema(
  {
    trainerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    studentIds: [{ type: Schema.Types.ObjectId, ref: "User", required: true }],
    exerciseAssignment: [{ type: Schema.Types.ObjectId, ref: "ExerciseAssignment", required: true }],
    name: { type: String, required: true },
    description: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true ,
    versionKey: false
  }
);

type RoutineType = InferSchemaType<typeof routineSchema>;
const Routine = model<RoutineType>("Routine", routineSchema);
export default Routine;
