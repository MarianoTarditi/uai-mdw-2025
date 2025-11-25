import axios from "axios";
import { getAuth } from "firebase/auth";

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ejemplo: http://localhost:3001/api
});

axiosPrivate.interceptors.request.use(
  async (config) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const token = await user.getIdToken(/* forceRefresh */ false);
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Token expirado o inválido
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const auth = getAuth();
      const user = auth.currentUser;

      if (user) {
        const newToken = await user.getIdToken(true); // 🔥 Fuerza refresh total
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosPrivate(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosPrivate;
