import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import axiosPrivate from "../../config/axios";
import { isAxiosError } from "axios";

// 1. Definición de la Interfaz (Igual que antes)
export interface IUserProfile {
  name: string;
  lastName: string;
  email: string;
  roles: string[];
  isActive: boolean;
  _id: string;
  birthDate: string | null;
  gender: "male" | "female" | "other" | null;
  height: number | null;
  weight: number | null;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

// 2. Estado del Slice
interface UserState {
  profile: IUserProfile | null; // Usuario autenticado (MI perfil)
  users: IUserProfile[]; // Lista de usuarios (Tabla)
  selectedUser: IUserProfile | null; // <--- NUEVO: Usuario seleccionado para ver detalle/editar

  // Estados de Carga
  isFetchingLoading: boolean;
  isDetailLoading: boolean;
  isCreatingLoading: boolean;
  isUpdatingLoading: boolean;
  isDeletingLoading: boolean;

  // Estados de Error/Éxito
  isError: boolean;
  message: string;
  isFetchingSuccess: boolean;
  isCreatingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isDeletingSuccess: boolean;
}

// 3. Estado Inicial
const initialState: UserState = {
  profile: null,
  users: [],
  selectedUser: null, // <--- Inicializamos en null

  isFetchingLoading: false,
  isDetailLoading: false,
  isCreatingLoading: false,
  isUpdatingLoading: false,
  isDeletingLoading: false,

  isError: false,
  message: "",

  isFetchingSuccess: false,
  isCreatingSuccess: false,
  isUpdatingSuccess: false,
  isDeletingSuccess: false,
};

// --- THUNKS ---

// Thunk existente para cargar MI perfil (usualmente al login)
export const fetchUserProfile = createAsyncThunk<
  IUserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.get(`/user/profile`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error loading profile",
    );
  }
});


// NUEVO THUNK: Obtener usuario por ID (para el detalle)
export const getUserById = createAsyncThunk<
  IUserProfile,
  string,
  { rejectValue: string }
>("user/getUserById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.get(`/user/${id}`);
    return res.data.data;
  } catch (error: any) {
    console.log(error);
    let message = "Error al obtener el detalle del usuario";
    if (isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return rejectWithValue(message);
  }
});

export const getAllUsers = createAsyncThunk<
  IUserProfile[],
  void,
  { rejectValue: string }
>("user/getAllUsers", async (_, thunkAPI) => {
  try {
    const res = await axiosPrivate.get(`/user`);
    return res.data.data;
  } catch (error: unknown) {
    let message = "Ocurrió un error desconocido";
    if (isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateUserProfile = createAsyncThunk<
  IUserProfile,
  { id: string; userData: Partial<IUserProfile> | FormData },
  { rejectValue: string }
>("user/updateProfile", async ({ id, userData }, thunkAPI) => {
  try {
    const res = await axiosPrivate.put(`/user/${id}`, userData);
    return res.data.data;
  } catch (error: unknown) {
    let message = "Error al actualizar";
    if (isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteUser = createAsyncThunk<
  IUserProfile,
  string,
  { rejectValue: string }
>("user/delete", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.patch(`/user/soft/${id}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error desactivando usuario",
    );
  }
});

// --- SLICE ---

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    // Acción útil para limpiar el usuario seleccionado al cerrar el modal
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    reset: (state) => {
      state.isFetchingLoading = false;
      state.isDetailLoading = false;
      state.isCreatingLoading = false;
      state.isUpdatingLoading = false;
      state.isDeletingLoading = false;
      state.isError = false;
      state.message = "";
      state.isFetchingSuccess = false;
      state.isCreatingSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeletingSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH USER PROFILE (MI PERFIL)
      .addCase(fetchUserProfile.pending, (state) => {
        state.isDetailLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.profile = action.payload; // Guarda en 'profile'
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // NUEVO: GET USER BY ID (DETALLE DE OTRO)
      .addCase(getUserById.pending, (state) => {
        state.isDetailLoading = true;
        state.isError = false;
        state.selectedUser = null; // Limpiamos selección previa
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedUser = action.payload; // Guarda en 'selectedUser'
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.isFetchingLoading = true;
        state.isError = false;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isFetchingLoading = false;
        state.isFetchingSuccess = true;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isFetchingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // UPDATE USER
      .addCase(updateUserProfile.pending, (state) => {
        state.isUpdatingLoading = true;
        state.isUpdatingSuccess = false;
        state.isError = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isUpdatingLoading = false;
        state.isUpdatingSuccess = true;
        const updatedUser = action.payload;

        // 1. Actualizar lista
        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u,
        );
        // 2. Actualizar 'profile' si soy yo
        if (state.profile?._id === updatedUser._id) {
          state.profile = updatedUser;
        }
        // 3. Actualizar 'selectedUser' si es el que estoy viendo
        if (state.selectedUser?._id === updatedUser._id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isUpdatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // DELETE USER
      .addCase(deleteUser.pending, (state) => {
        state.isDeletingLoading = true;
        state.isError = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeletingLoading = false;
        state.isDeletingSuccess = true;
        const deletedUser = action.payload;

        // Actualizar lista
        state.users = state.users.map((u) =>
          u._id === deletedUser._id ? deletedUser : u,
        );

        // Actualizar vistas individuales si coinciden
        if (state.profile?._id === deletedUser._id) state.profile = deletedUser;
        if (state.selectedUser?._id === deletedUser._id)
          state.selectedUser = deletedUser;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeletingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { clearProfile, clearSelectedUser, reset } = userSlice.actions;

// Selectores
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser; // <--- Nuevo Selector
export const selectAllUsers = (state: RootState) => state.user.users;

export const selectUsersLoading = (state: RootState) =>
  state.user.isFetchingLoading;
export const selectUserDetailLoading = (state: RootState) =>
  state.user.isDetailLoading;
export const selectUserUpdating = (state: RootState) =>
  state.user.isUpdatingLoading;
export const selectUserDeleting = (state: RootState) =>
  state.user.isDeletingLoading;

export default userSlice.reducer;
