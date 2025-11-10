import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import exerciseReducer from "../features/exercises/exerciseSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercise: exerciseReducer,
  },
});

// Tipos globales del store
export type RootState = ReturnType<typeof store.getState>; // El estado global (para useSelector)
export type AppDispatch = typeof store.dispatch; // El dispatch tipado (para useDispatch con thunks)
