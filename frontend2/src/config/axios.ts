import axios from "axios";
import { getAuth } from "firebase/auth";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const resolvedBaseURL = isLocalhost
  ? "/api"
  : (import.meta.env.VITE_API_URL ?? "");

const axiosPrivate = axios.create({
  baseURL: resolvedBaseURL,
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const savedToken = localStorage.getItem("token");

    if (user) {
      const token = await user.getIdToken(false);
      config.headers.Authorization = `Bearer ${token}`;
    } else if (savedToken) {
      config.headers.Authorization = `Bearer ${savedToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const newToken = await user.getIdToken(true);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosPrivate(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosPrivate;
