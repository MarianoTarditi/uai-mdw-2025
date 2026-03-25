import { Schema, model, InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true }, 
    entity: { type: String, required: true }, 
    entityId: { type: String }, 
    
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    details: { type: String }, 
    
    affectedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

type AuditLogType = InferSchemaType<typeof auditLogSchema>;
const AuditLog = model<AuditLogType>("AuditLog", auditLogSchema);

export default AuditLog;