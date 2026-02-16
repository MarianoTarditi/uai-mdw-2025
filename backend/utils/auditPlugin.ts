import { Schema } from "mongoose";
import AuditLog from "../models/AuditLog";
import { getCurrentUser } from "./requestContext";

export const auditPlugin = (schema: Schema) => {

  // 🔥 1. Función simplificada: ya no hace consultas a la BD
  const getPerformer = async (doc: any, modelName: string, isCreate: boolean) => {
    const currentUser = getCurrentUser();
    
    // Si el middleware encontró al usuario, ya viene con su _id, lo usamos directo.
    if (currentUser && currentUser._id) {
      return currentUser; 
    }

    // Solo si es un Registro nuevo (Creación de User sin sesión), asumimos que es él mismo
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
    return "Elemento sin nombre"; 
  };

  // =================================================================
  // 1. Hook para CREAR y MODIFICAR (.save())
  // =================================================================
  schema.post("save", async function (doc: any) {
    const modelName = (doc.constructor as any).modelName || "Entidad";
    
    // Calculamos si es creación ANTES de llamar a getPerformer
    const isCreate = doc.createdAt && doc.updatedAt && doc.createdAt.getTime() === doc.updatedAt.getTime();
    
    // Pasamos isCreate
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
        affectedUser: modelName === "User" ? doc._id : (doc.studentId || null),
      });
    } catch (err) {
      console.error("Error auditoría save:", err);
    }
  });

  // =================================================================
  // 2. Hook para MODIFICAR POR QUERY (findOneAndUpdate y updateOne)
  // =================================================================
  schema.post(["findOneAndUpdate", "updateOne"], async function (doc: any) {
    if (!doc) return; 

    const modelName = (this as any).model.modelName || "Entidad";
    
    // En una actualización, isCreate SIEMPRE es false
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
        affectedUser: modelName === "User" ? doc._id : (doc.studentId || null),
      });
    } catch (err) {
      console.error("Error auditoría update:", err);
    }
  });

  // =================================================================
  // 3. Hook para ELIMINAR (findOneAndDelete)
  // =================================================================
  schema.post("findOneAndDelete", async function (doc: any) {
    if (!doc) return;

    const modelName = (this as any).model.modelName || "Entidad";
    
    // En una eliminación, isCreate SIEMPRE es false
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
        affectedUser: modelName === "User" ? doc._id : (doc.studentId || null), 
      });
    } catch (err) {
      console.error("Error auditoría delete:", err);
    }
  });
};