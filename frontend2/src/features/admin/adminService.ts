import axiosPrivate from "../../config/axios";

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

export default {
  getDashboardStats,
  getChartData,
  getAuditLogs,
};
