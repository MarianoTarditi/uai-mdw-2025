import { Schema, model, InferSchemaType } from "mongoose";

const routineAssignmentSchema = new Schema(
  {
    routineId: { type: Schema.Types.ObjectId, ref: "Routine", required: true },
    studentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    trainerId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

type RoutineAssignmentType = InferSchemaType<typeof routineAssignmentSchema>;
const RoutineAssignmentModel = model<RoutineAssignmentType>(
  "RoutineAssignment",
  routineAssignmentSchema,
);
export default RoutineAssignmentModel;
