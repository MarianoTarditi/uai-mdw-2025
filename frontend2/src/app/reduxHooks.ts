import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Ese archivo sirve para tipar correctamente los hooks de Redux (useDispatch y useSelector)

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()



