import axiosPrivate from "@/config/axios";
import { getAuth } from "firebase/auth";

export interface PaymentPayload {
  startDate: string | null;
  amount: number | null;
  paymentDate: string | null;
  isPaid: boolean;
  billingCycleDays?: number | null;
}

export type ReminderChannel = "email" | "whatsapp";

const getAuthHeader = async () => {
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const token =
    (await currentUser?.getIdToken(false)) || localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : undefined;
};

const getStudentPayments = async () => {
  const res = await axiosPrivate.get("/user/students/payments", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const updateStudentPayment = async (id: string, payload: PaymentPayload) => {
  const res = await axiosPrivate.patch(`/user/payment/${id}`, payload, {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const getPaymentsSummary = async () => {
  const res = await axiosPrivate.get("/user/students/payments/summary", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const getStudentsProgressSummary = async () => {
  const res = await axiosPrivate.get("/progress/students/summary", {
    headers: await getAuthHeader(),
  });
  return res.data.data;
};

const sendPaymentReminder = async (id: string, channel: ReminderChannel) => {
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
