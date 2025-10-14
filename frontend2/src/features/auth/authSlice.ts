import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type {
  IAuthState,
  IRegisterUserData,
  ILoginUserData,
  IUser,
} from "../../types/auth";
import authService from "./authService";
import axios from "axios";

// Obtener usuario desde localStorage
const user = localStorage.getItem("user")
  ? (JSON.parse(localStorage.getItem("user") as string) as IUser)
  : null;

const initialState: IAuthState = {
  user,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const signUpUser = createAsyncThunk<
  IUser, // Tipo del "payload" que devuelve si la promesa se resuelve bien
  IRegisterUserData, // Tipo de los argumentos que recibe la función (user)
  { rejectValue: string }
>("auth/signUp", async (userData, thunkAPI) => { // Tipo del valor que retorna si la promesa falla (thunkAPI.rejectWithValue)
  // Nombre de la acción en Redux (prefix/type)
  try {
    return await authService.signUp(userData);
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

export const loginUser = createAsyncThunk<
  IUser,
  ILoginUserData,
  { rejectValue: string }
>("auth/login", async (userData, thunkAPI) => {
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
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(signUpUser.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
        state.user = null;
        console.log("SignUp: error", action.payload);
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IUser>) => {
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
