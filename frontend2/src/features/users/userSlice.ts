import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import axiosPrivate from "../../config/axios";
import { isAxiosError } from "axios";

export interface IUserProfile {
  name: string;
  lastName: string;
  email: string;
  phone?: string | null;
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

export enum UserRole {
  Admin = "admin",
  Trainer = "trainer",
  Student = "student",
}

interface UserState {
  profile: IUserProfile | null;
  users: IUserProfile[];
  selectedUser: IUserProfile | null;

  isProfileLoading: boolean;
  isFetchingLoading: boolean;
  isDetailLoading: boolean;
  isCreatingLoading: boolean;
  isUpdatingLoading: boolean;
  isDeletingLoading: boolean;

  isError: boolean;
  message: string;
  isFetchingSuccess: boolean;
  isCreatingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isDeletingSuccess: boolean;
}

const initialState: UserState = {
  profile: null,
  users: [],
  selectedUser: null,

  isProfileLoading: false,
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

export const fetchUserProfile = createAsyncThunk<
  IUserProfile,
  void,
  { rejectValue: string }
>("user/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.get(`/user/profile`);
    return res.data.data;
  } catch (error) {
    let message = "Error al obtener el detalle del usuario";

    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    }

    return rejectWithValue(message);
  }
});

export const getUserById = createAsyncThunk<
  IUserProfile,
  string,
  { rejectValue: string }
>("user/getUserById", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.get<{ data: IUserProfile }>(`/user/${id}`);
    return res.data.data;
  } catch (error) {
    let message = "Error al obtener el detalle del usuario";

    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
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
    let message = "Error al listar los usuarios";
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
    let message = "Error al actualizar el usuario";
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
  } catch (error) {
    let message = "Error al eliminar del usuario";

    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    }

    return rejectWithValue(message);
  }
});

export const activateUser = createAsyncThunk<
  IUserProfile,
  string,
  { rejectValue: string }
>("user/activate", async (id, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.patch(`/user/activate/${id}`);
    return res.data.data;
  } catch (error) {
    let message = "Error al activar usuario";

    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    }

    return rejectWithValue(message);
  }
});

export const setUserRole = createAsyncThunk<
  IUserProfile,
  { userId: string; roles: UserRole[] },
  { rejectValue: string }
>("user/setUserRole", async ({ userId, roles }, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.patch(`/user/setUserRole/${userId}`, {
      roles,
    });

    return res.data.data;
  } catch (error) {
    let message = "Error al actualizar el rol del usuario";

    if (isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    }

    return rejectWithValue(message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    reset: (state) => {
      state.isProfileLoading = false;
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
      // FETCH USER
      .addCase(fetchUserProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.profile = action.payload; // Guarda en 'profile'
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // GET USER BY ID
      .addCase(getUserById.pending, (state) => {
        state.isDetailLoading = true;
        state.isError = false;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedUser = action.payload;
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

        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u,
        );
        if (state.profile?._id === updatedUser._id) {
          state.profile = updatedUser;
        }
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

        state.users = state.users.map((u) =>
          u._id === deletedUser._id ? deletedUser : u,
        );

        if (state.profile?._id === deletedUser._id) state.profile = deletedUser;
        if (state.selectedUser?._id === deletedUser._id)
          state.selectedUser = deletedUser;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeletingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    builder
      .addCase(activateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;

        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user,
        );
      })
      // SET USER ROLE
      .addCase(setUserRole.pending, (state) => {
        state.isUpdatingLoading = true;
        state.isUpdatingSuccess = false;
        state.isError = false;
      })
      .addCase(setUserRole.fulfilled, (state, action) => {
        state.isUpdatingLoading = false;
        state.isUpdatingSuccess = true;

        const updatedUser = action.payload;

        state.users = state.users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u,
        );

        if (state.profile?._id === updatedUser._id) {
          state.profile = updatedUser;
        }

        if (state.selectedUser?._id === updatedUser._id) {
          state.selectedUser = updatedUser;
        }
      })
      .addCase(setUserRole.rejected, (state, action) => {
        state.isUpdatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { clearProfile, clearSelectedUser, reset } = userSlice.actions;

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectSelectedUser = (state: RootState) => state.user.selectedUser; // <--- Nuevo Selector
export const selectAllUsers = (state: RootState) => state.user.users;

export const selectUsersLoading = (state: RootState) =>
  state.user.isFetchingLoading;
export const selectUserDetailLoading = (state: RootState) =>
  state.user.isDetailLoading;
export const selectUserProfileLoading = (state: RootState) =>
  state.user.isProfileLoading;
export const selectUserUpdating = (state: RootState) =>
  state.user.isUpdatingLoading;
export const selectUserDeleting = (state: RootState) =>
  state.user.isDeletingLoading;

export default userSlice.reducer;
