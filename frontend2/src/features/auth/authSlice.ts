import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  type User,
} from "firebase/auth";
import { auth } from "@/firebase/firebase";
import type { AppDispatch, RootState } from "@/app/store";
import { FirebaseError } from "firebase/app";
import {
  getFirebaseLoginErrorMessage,
  getFirebaseRegisterError,
} from "../../firebase/firebaseErrors";
import { fetchUserProfile } from "../users/userSlice";
import { clearProfile } from "../users/userSlice";
import type { IRegisterUserData } from "@/types/auth";
import axiosPrivate from "../../config/axios";
import { toast } from "sonner";
import type { IUserProfile } from "@/features/users/userSlice";
import axios from "axios";

interface IAuthUser {
  uid: string;
  email: string | null;
  token: string;
}

interface IAuthState {
  user: IAuthUser | null;
  isError: boolean;
  isLoading: boolean;
  errorMessage: string;
  isSuccess: boolean;
  isCheckingAuth: boolean;
  profile: IUserProfile | null;
}

const initialState: IAuthState = {
  user: null,
  isError: false,
  isLoading: false,
  isSuccess: false,
  isCheckingAuth: true,
  errorMessage: "",
  profile: null,
};

export const registerUser = createAsyncThunk<
  IAuthUser,
  IRegisterUserData,
  { rejectValue: string }
>("auth/saveUser", async (formData, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.email,
      formData.password,
    );

    const user = userCredential.user;
    const firebaseToken = await user.getIdToken();

    const dbPayload = {
      firebaseUid: user.uid,
      email: formData.email,
      name: formData.name,
      lastName: formData.lastName,
      gender: formData.gender,
      birthDate: formData.birthDate,
      weight: formData.weight,
      height: formData.height,
    };

    await axiosPrivate.post("/auth/saveUser", dbPayload, {
      headers: {
        Authorization: `Bearer ${firebaseToken}`,
      },
    });

    return {
      uid: user.uid,
      email: user.email,
      token: firebaseToken,
    };
  } catch (error: unknown) {
    console.log("Error en registerUser thunk:", error);

    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }

    const firebaseErrorMessage = getFirebaseRegisterError(error);

    const fallbackMessage =
      error instanceof Error
        ? error.message
        : "Error inesperado al registrar usuario";

    return rejectWithValue(firebaseErrorMessage || fallbackMessage);
  }
});

export const loginUser = createAsyncThunk<
  IAuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    const user = userCredential.user;
    const token = await user.getIdToken();

    try {
      const response = await axiosPrivate.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userProfile = response.data.data;

      if (userProfile.isActive === false) {
        await signOut(auth);
        return rejectWithValue("Tu cuenta está inactiva. Contacta al soporte.");
      }
    } catch (backendError) {
      await signOut(auth);
      console.log(backendError);
      return rejectWithValue("Error verificando el estado de la cuenta.");
    }

    localStorage.setItem("token", token);
    toast.success(`Bienvenido, ${user.email}!`);

    return {
      uid: user.uid,
      email: user.email,
      token,
    };
  } catch (error: unknown) {
    if (typeof error === "string") {
      return rejectWithValue(error);
    }
    return rejectWithValue(getFirebaseLoginErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem("token");
      return true;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Unknown error occurred");
    }
  },
);

export const resetPassword = createAsyncThunk<
  boolean,
  string,
  { rejectValue: string }
>("auth/resetPassword", async (email, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    if (error instanceof FirebaseError) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Unknown error occurred");
  }
});

export const observeUser = createAsyncThunk<
  void,
  void,
  { dispatch: AppDispatch }
>("auth/observeUser", async (_, { dispatch }) => {
  dispatch(setCheckingAuth(true));

  onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = await user.getIdToken();

      localStorage.setItem("token", token);

      dispatch(setUser({ uid: user.uid, email: user.email, token }));

      await dispatch(fetchUserProfile());
    } else {
      localStorage.removeItem("token");
      dispatch(clearUser());
      dispatch(clearProfile());
    }

    dispatch(setCheckingAuth(false));
  });
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.errorMessage = "";
      state.isSuccess = false;
    },
    setUser: (state, action: PayloadAction<IAuthUser>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCheckingAuth: (state, action: PayloadAction<boolean>) => {
      state.isCheckingAuth = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
        state.user = null;
      })

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isError = false;
        state.errorMessage = "";
        state.isSuccess = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isError = false;
        state.errorMessage = "";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isError = true;
        state.errorMessage = action.payload as string;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = "";
        state.isSuccess = false;
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      });
  },
});

export const { setUser, clearUser, setLoading, setCheckingAuth, reset } =
  authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;
export const getAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
