import axios from "axios";

const API_URL = "/api/auth/";


// 📌 Definir la forma de un usuario (ajustá según tu backend)
export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  token: string;
}

// 📌 Datos que se envían para registrar/loguear
export interface UserCredentials {
  email: string;
  password: string;
}

// Register user
const register = async (userData: UserCredentials) => {
  const response = await axios.post(API_URL + "register/", userData, {
  });
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

// Login user
const login = async (userData: UserCredentials) => {
  const response = await axios.post(API_URL + "login", userData);
  console.log(response)

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
