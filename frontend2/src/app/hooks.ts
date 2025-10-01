import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";  // 👈 Importación de solo tipo
import type { RootState, AppDispatch } from "./store";

// ✅ Versión tipada de useDispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

// ✅ Versión tipada de useSelector
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
