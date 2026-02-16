import { AsyncLocalStorage } from "async_hooks";

// Esto crea un "almacén" que vive solo durante la duración de una petición HTTP
export const requestContext = new AsyncLocalStorage<any>();

// Helper para obtener el usuario actual desde cualquier parte de la app (incluso dentro de Mongoose)
export const getCurrentUser = () => {
  const store = requestContext.getStore();
  return store?.user;
};