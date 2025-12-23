import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import axiosPrivate from "../../config/axios";

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

interface UserState {
  profile: IUserProfile | null;
  isLoading: boolean;
  isError: boolean;
  message: string;
  isSuccess: boolean;
}

const initialState: UserState = {
  profile: null,
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const fetchUserProfile = createAsyncThunk<
  IUserProfile,
  string,
  { rejectValue: string }
>("user/fetchProfile", async (uid, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.get(`/user/${uid}`);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error loading profile"
    );
  }
});

export const updateUserProfile = createAsyncThunk<
  IUserProfile,
  { id: string; userData: FormData },
  { rejectValue: string }
>("user/updateProfile", async ({ id, userData }, { rejectWithValue }) => {
  try {
    const res = await axiosPrivate.put(`/user/${id}`, userData);
    return res.data.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Error updating profile"
    );
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    reset: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH USER PROFILE
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // UPDATE USER PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.isSuccess = false;
        state.message = "";
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload; // perfil actualizado
        state.isSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { clearProfile, reset } = userSlice.actions;
export const selectUserProfile = (state: RootState) => state.user.profile;

export default userSlice.reducer;
