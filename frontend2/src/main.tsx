import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "@mantine/core/styles.css";
import {
  MantineProvider,
  createTheme,
  type MantineColorsTuple,
} from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Login } from "./pages/auth/login/Login";
import { SignUp } from "./pages/auth/signUp/SignUp";
import { ForgotPassword } from "./pages/auth/forgotPassword/ForgotPassword";
import AuthLayout from "./components/authLayout/AuthLayout";
import Home from "./pages/Home";
import "./index.css";
import { Toaster } from "sonner";
import MainLayout from "./components/mainLayout/MainLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import { GetAllExercises } from "./pages/exercises/GetAllExercises";
import { PrivateRoute } from "./components/privateRoute/PrivateRoute";
import { Form } from "./pages/Form";

const myColor: MantineColorsTuple = [
  "#f5f5f5",
  "#e7e7e7",
  "#cdcdcd",
  "#b2b2b2",
  "#9a9a9a",
  "#8b8b8b",
  "#848484",
  "#717171",
  "#656565",
  "#000000",
];

const theme = createTheme({
  colors: {
    myColor,
  },
});

const router = createBrowserRouter([
  {
    path: "/", // landing page
    element: <Home />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <Login /> },
      { path: "/signUp", element: <SignUp /> },
      { path: "/forgotPassword", element: <ForgotPassword /> },
    ],
  },
  {
    element: <PrivateRoute />, // <- Rutas protegidas
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: "/Dashboard", element: <Dashboard /> },
          { path: "/Exercises", element: <GetAllExercises /> },
          { path: "/Form", element: <Form /> },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Provider store={store}>
        <Toaster position="top-center" richColors closeButton />
        <RouterProvider router={router} />
      </Provider>
    </MantineProvider>
  </StrictMode>
);
