import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux"; // Importación de solo tipo
import type { RootState, AppDispatch } from "./store";

// Ese archivo sirve para tipar correctamente los hooks de Redux (useDispatch y useSelector) en tu proyecto con TypeScript.

// Esto permite que cuando hagas dispatch(someThunk()), 
// TypeScript conozca el tipo correcto y te dé autocompletado y chequeo de errores.
export const useAppDispatch = () => useDispatch<AppDispatch>(); // Versión tipada de useDispatch

// Crea una versión tipada de useSelector. Esto asegura que TypeScript sepa 
// que state tiene el tipo de tu RootState, y te da autocompletado y chequeo de tipos para todos los slices.
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; // Versión tipada de useSelector




