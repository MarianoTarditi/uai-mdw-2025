import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// ✅ Tipos globales del store
// El estado global (para useSelector)
export type RootState = ReturnType<typeof store.getState>

// El dispatch tipado (para useDispatch con thunks)
export type AppDispatch = typeof store.dispatch