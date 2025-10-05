import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, RegisterUserData, LoginUserData, User } from "../../types/auth";
import authService from "./authService";
import axios from "axios";

// Obtener usuario desde localStorage
const user = localStorage.getItem("user")
  ? (JSON.parse(localStorage.getItem("user") as string) as User)
  : null;

const initialState: AuthState = {
  user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const registerUser = createAsyncThunk<
  User,                // Tipo del "payload" que devuelve si la promesa se resuelve bien
  RegisterUserData,    // Tipo de los argumentos que recibe la función (user)
  { rejectValue: string } >(  // Tipo del valor que retorna si la promesa falla (thunkAPI.rejectWithValue)
    "auth/register", async (userData, thunkAPI) => {  // Nombre de la acción en Redux (prefix/type)
  try {
    return await authService.register(userData);
  } catch (error: unknown) {
    let message: string;
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk<User,LoginUserData,{ rejectValue: string }>("auth/login", async (userData, thunkAPI) => {
  try {
    return await authService.login(userData);
  } catch (error: unknown) {
    let message: string;
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logout();
});

// Reducer
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
