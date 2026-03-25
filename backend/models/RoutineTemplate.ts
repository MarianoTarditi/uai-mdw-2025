import { Schema, model, InferSchemaType } from "mongoose";

const routineTemplateSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    originalName: { type: String, required: true },
    mimeType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true, versionKey: false },
);

type RoutineTemplateType = InferSchemaType<typeof routineTemplateSchema>;
const RoutineTemplate = model<RoutineTemplateType>(
  "RoutineTemplate",
  routineTemplateSchema,
);

export default RoutineTemplate;

