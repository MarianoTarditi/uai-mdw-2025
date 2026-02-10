import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { IExercise, IExerciseState } from "../../types/auth";
import exerciseService from "./exerciseService";
import axios from "axios";

const initialState: IExerciseState = {
  exercises: [],
  exercise: undefined,

  isError: false,
  message: "",

  isFetchingLoading: false,
  isCreatingLoading: false,
  isUpdatingLoading: false,
  isDeletingLoading: false,
  isDetailLoading: false,

  isFetchingSuccess: false,
  isCreatingSuccess: false,
  isUpdatingSuccess: false,
  isDeletingSuccess: false,

  deletedRoutine: false,
};

export const getAllExercises = createAsyncThunk<
  IExercise[],
  void,
  { rejectValue: string }
>("exercises/getAllExercises", async (_, thunkAPI) => {
  try {
    return await exerciseService.getAllExercises();
  } catch (error: unknown) {
    let message = "Ocurrió un error desconocido";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error del servidor (Backend):", error.response.data);
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const getExercise = createAsyncThunk<
  IExercise,
  string,
  { rejectValue: string }
>("exercise/fetchOne", async (id, thunkAPI) => {
  try {
    return await exerciseService.getExercise(id);
  } catch (error: unknown) {
    let message = "Ocurrió un error desconocido";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error del servidor (Backend):", error.response.data);
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const createExercise = createAsyncThunk<
  IExercise,
  IExercise,
  { rejectValue: string }
>("exercise/create", async (exerciseData, thunkAPI) => {
  try {
    return await exerciseService.createExercise(exerciseData);
  } catch (error: unknown) {
    let message = "Ocurrió un error desconocido";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error del servidor (Backend):", error.response.data);
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateExercise = createAsyncThunk<
  IExercise,
  { id: string; exerciseData: IExercise | FormData },
  { rejectValue: string }
>("exercise/update", async ({ id, exerciseData }, thunkAPI) => {
  try {
    return await exerciseService.updateExercise(id, exerciseData);
  } catch (error: unknown) {
    let message = "Ocurrió un error desconocido";
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error del servidor (Backend):", error.response.data);
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

interface DeleteExerciseResponse {
  id: string;
  routineDeleted: boolean;
}

export const deleteExercise = createAsyncThunk<
  DeleteExerciseResponse,
  string,
  { rejectValue: string }
>("exercise/delete", async (id, thunkAPI) => {
  try {
    const response = await exerciseService.deleteExercise(id);
    const data = response as { routineDeleted?: boolean };

    return {
      id: id,
      routineDeleted: data.routineDeleted || false,
    };
  } catch (error: unknown) {
    let message = "Error al eliminar";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    reset: (state) => {
      state.isFetchingLoading = false;
      state.isError = false;
      state.message = "";
      state.exercise = undefined;
      state.deletedRoutine = false;

      state.isFetchingSuccess = false;
      state.isCreatingSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeletingSuccess = false;
      state.isDetailLoading = false;

      state.isFetchingLoading = false;
      state.isCreatingLoading = false;
      state.isDeletingLoading = false;
      state.isUpdatingLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET ALL
      .addCase(getAllExercises.pending, (state) => {
        state.isFetchingLoading = true;
        state.isFetchingSuccess = false;
      })
      .addCase(
        getAllExercises.fulfilled,
        (state, action: PayloadAction<IExercise[]>) => {
          state.isFetchingLoading = false;
          state.isFetchingSuccess = true;
          state.exercises = action.payload;
        },
      )
      .addCase(getAllExercises.rejected, (state, action) => {
        state.isFetchingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // GET ONE
      .addCase(getExercise.pending, (state) => {
        state.isDetailLoading = true;
        state.isFetchingSuccess = false;
      })
      .addCase(getExercise.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.exercise = action.payload;
        state.isFetchingSuccess = true;
      })
      .addCase(getExercise.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // CREATE
      .addCase(createExercise.pending, (state) => {
        state.isCreatingLoading = true;
        state.isCreatingSuccess = false;
      })
      .addCase(
        createExercise.fulfilled,
        (state, action: PayloadAction<IExercise>) => {
          state.isCreatingLoading = false;
          state.isCreatingSuccess = true;
          state.exercises.push(action.payload);
        },
      )
      .addCase(createExercise.rejected, (state, action) => {
        state.isCreatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })

      // UPDATE
      .addCase(updateExercise.pending, (state) => {
        state.isUpdatingLoading = true;
        state.isUpdatingSuccess = false;
      })
      .addCase(
        updateExercise.fulfilled,
        (state, action: PayloadAction<IExercise>) => {
          state.isUpdatingLoading = false;
          state.isUpdatingSuccess = true;

          state.exercises = state.exercises.map((ex) =>
            ex._id === action.payload._id ? action.payload : ex,
          );

          if (state.exercise && state.exercise._id === action.payload._id) {
            state.exercise = action.payload;
          }
        },
      )
      .addCase(updateExercise.rejected, (state, action) => {
        state.isUpdatingLoading = false;
        state.isError = true;
        state.message = action.payload || "Error updating exercise";
      })

      // DELETE
      .addCase(deleteExercise.pending, (state) => {
        state.isDeletingLoading = true;
        state.isDeletingSuccess = false;
      })
      .addCase(deleteExercise.rejected, (state, action) => {
        state.isDeletingLoading = false;
        state.isError = true;
        state.message = action.payload || "Error deleting exercise";
      })
      .addCase(
        deleteExercise.fulfilled,
        (state, action: PayloadAction<DeleteExerciseResponse>) => {
          state.isDeletingLoading = false;
          state.isDeletingSuccess = true;

          state.deletedRoutine = action.payload.routineDeleted;

          state.exercises = state.exercises.filter(
            (ex) => ex._id !== action.payload.id,
          );
        },
      );
  },
});

export const { reset } = exerciseSlice.actions;
export default exerciseSlice.reducer;
