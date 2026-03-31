import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import paymentService, {
  type PaymentsSummaryContract,
  type PaymentPayload,
  type PaymentStatusContract,
  type PaymentTrafficStatus,
  type PaymentContract,
  type ReminderChannel,
  type StudentPaymentContract,
} from "./paymentService";

export type IPaymentInfo = PaymentContract;

export type IPaymentStatus = PaymentStatusContract;

export type IStudentPayment = StudentPaymentContract;

export type IPaymentsSummary = PaymentsSummaryContract;

export const getPaymentStatusLabel = (status: PaymentTrafficStatus) => {
  switch (status) {
    case "al_dia":
      return "Pagado";
    case "vence":
      return "Próximo a vencer";
    case "vencido":
      return "Vencido";
    default:
      return "Sin configurar";
  }
};

interface PaymentState {
  students: IStudentPayment[];
  summary: IPaymentsSummary | null;
  isFetchingLoading: boolean;
  isUpdatingLoading: boolean;
  isSummaryLoading: boolean;
  isFetchingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isError: boolean;
  message: string;
}

const initialState: PaymentState = {
  students: [],
  summary: null,
  isFetchingLoading: false,
  isUpdatingLoading: false,
  isSummaryLoading: false,
  isFetchingSuccess: false,
  isUpdatingSuccess: false,
  isError: false,
  message: "",
};

export const fetchStudentPayments = createAsyncThunk<
  IStudentPayment[],
  void,
  { rejectValue: string }
>("payments/getStudents", async (_, thunkAPI) => {
  try {
    return await paymentService.getStudentPayments();
  } catch (error: unknown) {
    let message = "Error al obtener pagos de estudiantes";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateStudentPayment = createAsyncThunk<
  IStudentPayment,
  { id: string; payment: PaymentPayload },
  { rejectValue: string }
>("payments/updateStudentPayment", async ({ id, payment }, thunkAPI) => {
  try {
    return await paymentService.updateStudentPayment(id, payment);
  } catch (error: unknown) {
    let message = "Error al actualizar el pago del estudiante";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchPaymentsSummary = createAsyncThunk<
  IPaymentsSummary,
  void,
  { rejectValue: string }
>("payments/getSummary", async (_, thunkAPI) => {
  try {
    return await paymentService.getPaymentsSummary();
  } catch (error: unknown) {
    let message = "Error al obtener resumen de pagos";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const fetchStudentsProgressSummary = createAsyncThunk<
  IStudentPayment[],
  void,
  { rejectValue: string }
>("payments/getStudentsProgressSummary", async (_, thunkAPI) => {
  try {
    return await paymentService.getStudentsProgressSummary();
  } catch (error: unknown) {
    let message = "Error al obtener resumen de progreso";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

export const sendPaymentReminder = createAsyncThunk<
  IStudentPayment,
  { id: string; channel: ReminderChannel },
  { rejectValue: string }
>("payments/sendReminder", async ({ id, channel }, thunkAPI) => {
  try {
    return await paymentService.sendPaymentReminder(id, channel);
  } catch (error: unknown) {
    let message = "Error al enviar recordatorio";
    if (axios.isAxiosError(error) && error.response) {
      message = error.response.data?.message || error.message;
    }
    return thunkAPI.rejectWithValue(message);
  }
});

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    resetPaymentsState: (state) => {
      state.isError = false;
      state.message = "";
      state.isFetchingSuccess = false;
      state.isUpdatingSuccess = false;
      state.isFetchingLoading = false;
      state.isUpdatingLoading = false;
      state.isSummaryLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentPayments.pending, (state) => {
        state.isFetchingLoading = true;
        state.isError = false;
        state.message = "";
        state.isFetchingSuccess = false;
      })
      .addCase(fetchStudentPayments.fulfilled, (state, action) => {
        state.isFetchingLoading = false;
        state.isFetchingSuccess = true;
        state.students = action.payload;
      })
      .addCase(fetchStudentPayments.rejected, (state, action) => {
        state.isFetchingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(updateStudentPayment.pending, (state) => {
        state.isUpdatingLoading = true;
        state.isUpdatingSuccess = false;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateStudentPayment.fulfilled, (state, action) => {
        state.isUpdatingLoading = false;
        state.isUpdatingSuccess = true;
        const updatedStudent = action.payload;
        state.students = state.students.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student,
        );
      })
      .addCase(updateStudentPayment.rejected, (state, action) => {
        state.isUpdatingLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchPaymentsSummary.pending, (state) => {
        state.isSummaryLoading = true;
      })
      .addCase(fetchPaymentsSummary.fulfilled, (state, action) => {
        state.isSummaryLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchPaymentsSummary.rejected, (state, action) => {
        state.isSummaryLoading = false;
        state.isError = true;
        state.message = action.payload as string;
      })
      .addCase(fetchStudentsProgressSummary.fulfilled, (state, action) => {
        const progressMap = new Map(
          action.payload.map((student) => [student._id, student.progressSummary]),
        );

        state.students = state.students.map((student) => ({
          ...student,
          progressSummary: progressMap.get(student._id) || {
            totalEntries: 0,
            lastEntryDate: null,
          },
        }));
      })
      .addCase(sendPaymentReminder.fulfilled, (state, action) => {
        const updatedStudent = action.payload;
        state.students = state.students.map((student) =>
          student._id === updatedStudent._id ? updatedStudent : student,
        );
      })
      .addCase(sendPaymentReminder.rejected, (state, action) => {
        state.isError = true;
        state.message = action.payload as string;
      });
  },
});

export const { resetPaymentsState } = paymentSlice.actions;
export default paymentSlice.reducer;
