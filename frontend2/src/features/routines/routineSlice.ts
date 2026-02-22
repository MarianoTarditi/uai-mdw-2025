import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import routineService from "./routineService";
import { type IRoutine } from "./routineTypes";
import axios from "axios";
import { deleteExercise } from "../exercises/exerciseSlice";

export interface IStudent {
  _id: string;
  name: string;
  lastName: string;
  email?: string;
  profileImage?: string;
}

interface RoutineState {
  routines: IRoutine[];
  students: IStudent[];
  selectedRoutine: IRoutine | null;

  isFetchingLoading: boolean;
  isCreatingLoading: boolean;
  isUpdatingLoading: boolean;
  isDeletingLoading: boolean;
  isDetailLoading: boolean;
  isStudentsLoading: boolean;

  isFetchingSuccess: boolean;
  isCreatingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isDeletingSuccess: boolean;

  isError: boolean;
  message: string;
}
interface DeleteAssignmentResponse {
  assignmentId: string;
  routineId: string;
  routineDeleted: boolean;
}

const initialState: RoutineState = {
  routines: [],
  students: [],
  selectedRoutine: null,

  isFetchingLoading: false,
  isCreatingLoading: false,
  isUpdatingLoading: false,
  isDeletingLoading: false,
  isDetailLoading: false,
  isStudentsLoading: false,

  isFetchingSuccess: false,
  isCreatingSuccess: false,
  isUpdatingSuccess: false,
  isDeletingSuccess: false,

  isError: false,
  message: "",
};

export const deleteExerciseAssignment = createAsyncThunk<
  DeleteAssignmentResponse,
  { assignmentId: string; routineId: string },
  { rejectValue: string }
>(
  "routines/deleteAssignment",
  async ({ assignmentId, routineId }, thunkAPI) => {
    try {
      const response =
        await routineService.deleteExerciseAssignment(assignmentId);
      return {
        assignmentId,
        routineId,
        routineDeleted: response?.routineDeleted || false,
      };
    } catch (error: unknown) {
      let message = "Error al eliminar la asignación";
      if (axios.isAxiosError(error) && error.response) {
        message = error.response.data?.message || error.message;
      }
      return thunkAPI.rejectWithValue(message);
    }
  },
);

export const fetchRoutines = createAsyncThunk<
  IRoutine[],
  void,
  { rejectValue: string }
>("routines/getAll", async (_, thunkAPI) => {
  try {
    return await routineService.getAllRoutines();
  } catch (error: unknown) {
    let message = "Error al obtener las rutinas";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const createRoutine = createAsyncThunk<
  IRoutine,
  Omit<IRoutine, "_id">,
  { rejectValue: string }
>("routines/create", async (data, thunkAPI) => {
  try {
    console.log(data);

    return await routineService.createRoutine(data);
  } catch (error: unknown) {
    let message = "Error al crear la rutina";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const getRoutineById = createAsyncThunk<
  IRoutine,
  string,
  { rejectValue: string }
>("routines/getById", async (id, thunkAPI) => {
  try {
    return await routineService.getRoutineById(id);
  } catch (error: unknown) {
    let message = "Error al obtener el detalle";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateRoutine = createAsyncThunk<
  IRoutine,
  { id: string; routineData: Partial<IRoutine> },
  { rejectValue: string }
>("routines/update", async ({ id, routineData }, thunkAPI) => {
  try {
    return await routineService.updateRoutine(id, routineData);
  } catch (error: unknown) {
    let message = "Error al actualizar la rutina";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      console.error("Error en updateRoutine thunk:", error);
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteRoutine = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("routines/delete", async (id, thunkAPI) => {
  try {
    await routineService.deleteRoutine(id);
    return id;
  } catch (error: unknown) {
    let message = "Error al eliminar la rutina";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const getStudents = createAsyncThunk(
  "user/getStudents",
  async (_, { rejectWithValue }) => {
    try {
      const students = await routineService.getStudents();
      return students;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }

      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }

      return rejectWithValue("Ocurrió un error al obtener los estudiantes");
    }
  },
);

const routineSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    clearSelectedRoutine(state) {
      state.selectedRoutine = null;
    },
    reset(state) {
      state.isFetchingSuccess = false;
      state.isCreatingSuccess = false;
      state.isUpdatingSuccess = false;
      state.isDeletingSuccess = false;
      state.isError = false;
      state.message = "";
      state.selectedRoutine = null;
    },
  },
  extraReducers: (builder) => {
    // 1. FETCH ROUTINE
    builder
      .addCase(fetchRoutines.pending, (state) => {
        state.isFetchingLoading = true;
        state.isFetchingSuccess = false;
        state.isError = false;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.isFetchingLoading = false;
        state.isFetchingSuccess = true;
        state.routines = action.payload;
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.isFetchingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 2. CREATE ROUTINE
    builder
      .addCase(createRoutine.pending, (state) => {
        state.isCreatingLoading = true;
        state.isCreatingSuccess = false;
        state.isError = false;
      })
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.isCreatingLoading = false;
        state.isCreatingSuccess = true;
        state.routines.push(action.payload);
      })
      .addCase(createRoutine.rejected, (state, action) => {
        state.isCreatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 3. GET BY ID
    builder
      .addCase(getRoutineById.pending, (state) => {
        state.isDetailLoading = true;
        state.isError = false;
      })
      .addCase(getRoutineById.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.selectedRoutine = action.payload;
      })
      .addCase(getRoutineById.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 4. UPDATE ROUTINE
    builder
      .addCase(updateRoutine.pending, (state) => {
        state.isUpdatingLoading = true;
        state.isUpdatingSuccess = false;
        state.isError = false;
      })
      .addCase(updateRoutine.fulfilled, (state, action) => {
        state.isUpdatingLoading = false;
        state.isUpdatingSuccess = true;
        const updated = action.payload;
        const index = state.routines.findIndex((r) => r._id === updated._id);
        if (index !== -1) state.routines[index] = updated;
        if (state.selectedRoutine?._id === updated._id)
          state.selectedRoutine = updated;
      })
      .addCase(updateRoutine.rejected, (state, action) => {
        state.isUpdatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 5. DELETE ROUTINE
    builder
      .addCase(deleteRoutine.pending, (state) => {
        state.isDeletingLoading = true;
        state.isDeletingSuccess = false;
        state.isError = false;
      })
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.isDeletingLoading = false;
        state.isDeletingSuccess = true;
        const idDeleted = action.meta.arg;
        state.routines = state.routines.filter((r) => r._id !== idDeleted);
        if (state.selectedRoutine?._id === idDeleted)
          state.selectedRoutine = null;
      })
      .addCase(deleteRoutine.rejected, (state, action) => {
        state.isDeletingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 6. DELETE EXERCISE ASSIGNMENT
    builder
      .addCase(deleteExerciseAssignment.pending, (state) => {
        state.isDeletingLoading = true;
      })
      .addCase(deleteExerciseAssignment.fulfilled, (state, action) => {
        state.isDeletingLoading = false;
        state.isDeletingSuccess = true;
        const { assignmentId, routineId, routineDeleted } = action.payload;
        if (routineDeleted) {
          state.routines = state.routines.filter((r) => r._id !== routineId);
          if (state.selectedRoutine?._id === routineId)
            state.selectedRoutine = null;
        } else {
          const routine = state.routines.find((r) => r._id === routineId);
          if (routine) {
            routine.exerciseAssignments = routine.exerciseAssignments.filter(
              (a) => a._id !== assignmentId,
            );
          }
          if (state.selectedRoutine?._id === routineId) {
            state.selectedRoutine.exerciseAssignments =
              state.selectedRoutine.exerciseAssignments.filter(
                (a) => a._id !== assignmentId,
              );
          }
        }
      })
      .addCase(deleteExerciseAssignment.rejected, (state, action) => {
        state.isDeletingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 7. GET STUDENTS 
    builder
      .addCase(getStudents.pending, (state) => {
        state.isStudentsLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(getStudents.fulfilled, (state, action) => {
        state.isStudentsLoading = false;
        state.students = action.payload;
      })
      .addCase(getStudents.rejected, (state, action) => {
        state.isStudentsLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 8. DELETE EXERCISE 
    builder.addCase(deleteExercise.fulfilled, (state, action) => {
      const { id: deletedExerciseId, routineDeleted } = action.payload;

      state.routines.forEach((routine) => {
        routine.exerciseAssignments = routine.exerciseAssignments.filter(
          (assignment) => {
            const currentExId =
              typeof assignment.exerciseId === "string"
                ? String(assignment.exerciseId)
                : String(assignment.exerciseId?._id);

            return currentExId !== String(deletedExerciseId);
          },
        );
      });

      if (routineDeleted) {
        const routinesBefore = state.routines.length;

        state.routines = state.routines.filter(
          (routine) => routine.exerciseAssignments.length > 0,
        );

        if (state.selectedRoutine && state.routines.length !== routinesBefore) {
          const stillExists = state.routines.find(
            (r) => r._id === state.selectedRoutine?._id,
          );
          if (!stillExists) {
            state.selectedRoutine = null;
          }
        }
      }
    });
  },
});

export const { clearSelectedRoutine, reset } = routineSlice.actions;
export default routineSlice.reducer;
