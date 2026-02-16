import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "./adminService";
import axios from "axios";

interface DashboardStats {
  totalStudents: number;
  totalTrainers: number;
  totalRoutines: number;
  totalExercises: number;
}

interface AdminState {
  stats: DashboardStats | null;
  isLoading: boolean;
  isError: boolean;
  message: string;

  // ChartData
  chartData: ChartDataPoint[];
  isChartLoading: boolean;

  // Audit Logs
  auditLogs: IAuditLog[];
}

interface ChartDataPoint {
  date: string;
  count: number;
}

export interface IAuditLog {
  _id: string;
  action: string;
  entity: string;
  details: string;
  createdAt: string;
  performedBy: { name: string; lastName: string; email: string };
  affectedUser?: { name: string; lastName: string; email: string };
}

const initialState: AdminState = {
  stats: null,
  isLoading: false,
  isError: false,
  message: "",

  // ChartData
  chartData: [],
  isChartLoading: false,

  // Audit Logs
  auditLogs: [],
};

export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, thunkAPI) => {
    try {
      const data = await adminService.getDashboardStats();
      return data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Ocurrió un error desconocido");
    }
  },
);

export const getChartData = createAsyncThunk(
  "admin/getChartData",
  async (type: string, thunkAPI) => {
    try {
      const data = await adminService.getChartData(type);
      return data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || error.message,
        );
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue("Error al obtener los datos del gráfico");
    }
  },
);

export const getAuditLogs = createAsyncThunk(
  "admin/getAuditLogs",
  async (_, thunkAPI) => {
    try {
      const data = await adminService.getAuditLogs();
      return data.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || error.message,
        );
      }
      if (error instanceof Error) {
        return thunkAPI.rejectWithValue(error.message);
      }
      return thunkAPI.rejectWithValue(
        "Error al obtener el registro de auditoría",
      );
    }
  },
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    resetAdminState: (state) => {
      state.isError = false;
      state.message = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })

      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      });
    builder
      .addCase(getChartData.pending, (state) => {
        state.isChartLoading = true;
      })
      .addCase(getChartData.fulfilled, (state, action) => {
        state.isChartLoading = false;
        state.chartData = action.payload;
      });
    builder.addCase(getAuditLogs.fulfilled, (state, action) => {
      state.auditLogs = action.payload;
    });
  },
});

export default adminSlice.reducer;
export const { resetAdminState } = adminSlice.actions;
