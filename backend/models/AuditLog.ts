import { Schema, model, InferSchemaType } from "mongoose";

const auditLogSchema = new Schema(
  {
    action: { type: String, required: true }, // Ej: "CREAR_RUTINA", "CREAR_EJERCICIO", "LOGIN"
    entity: { type: String, required: true }, // Ej: "Routine", "Exercise", "User"
    entityId: { type: String }, // El ID del objeto creado/modificado (Opcional)
    
    // Quién realizó la acción (Puede ser Trainer, Admin o Student)
    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Detalles legibles para humanos
    details: { type: String }, 
    
    // Opcional: Si la acción afecta a otro usuario (Ej: Asignar rutina a X)
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