import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import exerciseReducer from "../features/exercises/exerciseSlice";
import userReducer from "../features/users/userSlice";
import routineReducer from "../features/routines/routineSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exercise: exerciseReducer,
    user: userReducer,   
    routine: routineReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
