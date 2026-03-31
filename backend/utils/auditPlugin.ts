import { Schema } from "mongoose";
import AuditLog from "../models/AuditLog";
import { getCurrentUser } from "./requestContext";

export const auditPlugin = (schema: Schema) => {

  const getPerformer = async (doc: any, modelName: string, isCreate: boolean) => {
    const currentUser = getCurrentUser();
    
    if (currentUser && currentUser._id) {
      return currentUser; 
    }

    if (modelName === "User" && isCreate) {
      return { _id: doc._id }; 
    }

    return null;
  };

  const getResourceName = (doc: any) => {
    if (!doc) return "";
    if (doc.nombre) return doc.nombre;
    if (doc.name && doc.lastName) return `${doc.name} ${doc.lastName}`;
    if (doc.name) return doc.name;
    if (doc.email) return doc.email;
    if (doc.title) return doc.title;
    return "Elemento sin nombree"; 
  };

  schema.post("save", async function (doc: any) {
    const modelName = (doc.constructor as any).modelName || "Entidad";
    
    const isCreate = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    const user = await getPerformer(doc, modelName, isCreate); 
    
    if (!user) return; 

    const actionType = isCreate ? "Crear" : "Actualizar";
    const resourceName = getResourceName(doc);

    try {
      await AuditLog.create({
        action: `${actionType} ${modelName}`,
        entity: modelName,
        entityId: doc._id,
        performedBy: user._id,
        details: resourceName,
        affectedUser:
          modelName === "User" ? doc._id : (doc.userId || doc.studentId || null),
      });
    } catch (err) {
      console.error("Error auditoría save:", err);
    }
  });

  schema.post(["findOneAndUpdate", "updateOne"], async function (doc: any) {
    if (!doc) return; 

    const modelName = (this as any).model.modelName || "Entidad";
    
    const user = await getPerformer(doc, modelName, false);
    
    if (!user) return;

    const resourceName = getResourceName(doc);

    const updateQuery = (this as any).getUpdate();
    let actionPrefix = "Actualizar";
    
    if (updateQuery.$set && updateQuery.$set.isActive === false) {
      actionPrefix = "Desactivar";
    }

    try {
      await AuditLog.create({
        action: `${actionPrefix} ${modelName}`,
        entity: modelName,
        entityId: doc._id,
        performedBy: user._id,
        details: resourceName,
        affectedUser:
          modelName === "User" ? doc._id : (doc.userId || doc.studentId || null),
      });
    } catch (err) {
      console.error("Error auditoría update:", err);
    }
  });

  schema.post("findOneAndDelete", async function (doc: any) {
    if (!doc) return;

    const modelName = (this as any).model.modelName || "Entidad";
    
    const user = await getPerformer(doc, modelName, false);
    
    if (!user) return;

    const resourceName = getResourceName(doc);

    try {
      await AuditLog.create({
        action: `Eliminar ${modelName}`,
        entity: modelName,
        entityId: doc._id,
        performedBy: user._id,
        details: resourceName,
        affectedUser:
          modelName === "User" ? doc._id : (doc.userId || doc.studentId || null),
      });
    } catch (err) {
      console.error("Error auditoría delete:", err);
    }
  });
};
