import axios from "axios";
import type { RegisterUserData, LoginUserData } from "../../types/auth";

const API_URL = "/api/auth/";

// Register user
const register = async (userData: RegisterUserData) => {
  const response = await axios.post(API_URL + "register", userData, {
  });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData: LoginUserData) => {
  const response = await axios.post(API_URL + "login", userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  console.log(response.data)

  return response.data;
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
};

export default authService;
