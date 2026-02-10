import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import routineService from "./routineService";
import { type IRoutine } from "./routineTypes";
import axios from "axios";
import { deleteExercise } from "../exercises/exerciseSlice";

interface RoutineState {
  routines: IRoutine[];
  selectedRoutine: IRoutine | null;

  isFetchingLoading: boolean;
  isDetailLoading: boolean;
  isActionLoading: boolean;

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
  selectedRoutine: null,

  isFetchingLoading: false,
  isDetailLoading: false,
  isActionLoading: false,

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

const routineSlice = createSlice({
  name: "routines",
  initialState,
  reducers: {
    clearSelectedRoutine(state) {
      state.selectedRoutine = null;
    },
    reset(state) {
      state.selectedRoutine = null;
      state.isDetailLoading = false;
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    // CREATE ROUTINE
    builder
      .addCase(createRoutine.pending, (state) => {
        state.isActionLoading = true;
        state.isError = false;
      })
      .addCase(createRoutine.fulfilled, (state, action) => {
        state.isActionLoading = false;
        state.routines.push(action.payload);
      })
      .addCase(createRoutine.rejected, (state, action) => {
        state.isActionLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 1. FETCH
    builder
      .addCase(fetchRoutines.pending, (state) => {
        state.isFetchingLoading = true;
      })
      .addCase(fetchRoutines.fulfilled, (state, action) => {
        state.isFetchingLoading = false;
        state.routines = action.payload;
      })
      .addCase(fetchRoutines.rejected, (state, action) => {
        state.isFetchingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // 3. GET BY ID
    builder
      .addCase(getRoutineById.pending, (state) => {
        state.isDetailLoading = true;
        state.isError = false;
        state.message = "";
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

    // UPDATE RUTINE
    builder
      .addCase(updateRoutine.pending, (state) => {
        state.isActionLoading = true;
        state.isError = false;
      })
      .addCase(updateRoutine.fulfilled, (state, action) => {
        state.isActionLoading = false;

        const updatedRoutine = action.payload as IRoutine;

        const index = state.routines.findIndex(
          (r) => r._id === updatedRoutine._id,
        );

        if (index !== -1) {
          state.routines[index] = updatedRoutine;
        }

        if (state.selectedRoutine?._id === updatedRoutine._id) {
          state.selectedRoutine = updatedRoutine;
        }
      })
      .addCase(updateRoutine.rejected, (state, action) => {
        state.isActionLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // DELETE ROUTINE
    builder
      .addCase(deleteRoutine.pending, (state) => {
        state.isActionLoading = true;
        state.isError = false;
      })
      .addCase(deleteRoutine.fulfilled, (state, action) => {
        state.isActionLoading = false;

        const idDeleted = action.meta.arg;

        state.routines = state.routines.filter((r) => r._id !== idDeleted);

        if (state.selectedRoutine?._id === idDeleted) {
          state.selectedRoutine = null;
        }
      })
      .addCase(deleteRoutine.rejected, (state, action) => {
        state.isActionLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });

    // DELETE EXERCISE ASSIGNMENT
    builder.addCase(deleteExerciseAssignment.pending, (state) => {
      state.isActionLoading = true;
    });

    builder.addCase(deleteExerciseAssignment.fulfilled, (state, action) => {
      state.isActionLoading = false;
      const { assignmentId, routineId, routineDeleted } = action.payload;

      if (routineDeleted) {
        state.routines = state.routines.filter((r) => r._id !== routineId);
        if (state.selectedRoutine?._id === routineId) {
          state.selectedRoutine = null;
        }
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
    });

    builder.addCase(deleteExerciseAssignment.rejected, (state, action) => {
      state.isActionLoading = false;
      state.isError = true;
      state.message = action.payload as string;
    });

    // 5. DELETE EXERCISE (GLOBAL)
    builder.addCase(deleteExercise.fulfilled, (state, action) => {
      const { id: deletedExerciseId, routineDeleted } = action.payload;

      state.routines.forEach((routine) => {
        routine.exerciseAssignments = routine.exerciseAssignments.filter(
          (assignment) => {
            // Chequeo seguro por si es objeto o string
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
