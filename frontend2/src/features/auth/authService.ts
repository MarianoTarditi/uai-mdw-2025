// import axios from "axios";
// import type { IRegisterUserData, ILoginUserData } from "../../types/auth";

// const API_URL = "/api/auth/";

// // Register user
// const signUp = async (userData: IRegisterUserData) => {
//   const response = await axios.post(API_URL + "signUp", userData, {});
//   if (response.data) {
//     localStorage.setItem("user", JSON.stringify(response.data));
//   }

//   return response.data;
// };

// // Login user
// const login = async (userData: ILoginUserData) => {
//   const response = await axios.post(API_URL + "login", userData);

//   if (response.data) {
//     localStorage.setItem("user", JSON.stringify(response.data));
//   }

//   return response.data;
// };

// // Logout user
// const logout = () => {
//   localStorage.removeItem("user");
// };

// const authService = {
//   signUp,
//   logout,
//   login,
// };

// export default authService;
