import axiosPrivate from "@/config/axios";
import { getAuth } from "firebase/auth";

export type PaymentTrafficStatus =
  | "al_dia"
  | "vence"
  | "vencido"
  | "sin_configurar";

export interface PaymentPayload {
  startDate: string | null;
  amount: number | null;
  paymentDate: string | null;
  isPaid: boolean;
  billingCycleDays?: number | null;
}

export type ReminderChannel = "email" | "whatsapp";

export interface PaymentContract {
  startDate: string | null;
  dueDate?: string | null;
  amount: number | null;
  paymentDate: string | null;
  isPaid: boolean;
  billingCycleDays?: number | null;
  reminderCount?: number;
  lastReminderAt?: string | null;
  lastReminderChannel?: ReminderChannel | null;
}

export interface PaymentStatusContract {
  status: PaymentTrafficStatus;
  nextDueDate: string | null;
  daysUntilDue: number | null;
  isCurrentCyclePaid: boolean;
}

export interface StudentPaymentContract {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string | null;
  roles?: string[];
  isActive: boolean;
  profileImage: string | null;
  payment: PaymentContract;
  paymentStatus?: PaymentStatusContract;
  createdAt?: string;
  updatedAt?: string;
  progressSummary?: {
    totalEntries: number;
    lastEntryDate: string | null;
  };
}

export interface PaymentsSummaryContract {
  totalStudents: number;
  paidStudents: number;
  pendingStudents: number;
  dueSoonStudents: number;
  overdueStudents: number;
  totalAmount: number;
  collectedAmount: number;
  pendingAmount: number;
}

const getAuthHeader = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const token =
    (await currentUser?.getIdToken(false)) || localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const getStudentPayments = async (): Promise<StudentPaymentContract[]> => {
  const res = await axiosPrivate.get("/user/students/payments", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const updateStudentPayment = async (
  id: string,
  payload: PaymentPayload,
): Promise<StudentPaymentContract> => {
  const res = await axiosPrivate.patch(`/user/payment/${id}`, payload, {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const getPaymentsSummary = async (): Promise<PaymentsSummaryContract> => {
  const res = await axiosPrivate.get("/user/students/payments/summary", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const getStudentsProgressSummary = async (): Promise<StudentPaymentContract[]> => {
  const res = await axiosPrivate.get("/progress/students/summary", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const sendPaymentReminder = async (
  id: string,
  channel: ReminderChannel,
): Promise<StudentPaymentContract> => {
  const res = await axiosPrivate.post(
    `/user/payment/reminder/${id}`,
    { channel },
    { headers: await getAuthHeader() },
  );

  return res.data.data;
};

export default {
  getStudentPayments,
  updateStudentPayment,
  getPaymentsSummary,
  getStudentsProgressSummary,
  sendPaymentReminder,
};
