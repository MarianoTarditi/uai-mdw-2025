import axiosPrivate from "../../config/axios";

export interface CreateManagedUserPayload {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  height?: number | null;
  weight?: number | null;
  paymentAmount: number;
  paymentBillingCycleDays: number;
}

const getDashboardStats = async () => {
  const response = await axiosPrivate.get("/admin/dashboard");
  return response.data;
};

const getChartData = async (type: string) => {
  const response = await axiosPrivate.get(`/admin/chartData?type=${type}`);
  return response.data;
};

const getAuditLogs = async () => {
  const response = await axiosPrivate.get("/admin/auditLogs");
  return response.data;
};

const createManagedUser = async (payload: CreateManagedUserPayload) => {
  const response = await axiosPrivate.post("/admin/users", payload);
  return response.data;
};

export default {
  getDashboardStats,
  getChartData,
  getAuditLogs,
  createManagedUser,
};
