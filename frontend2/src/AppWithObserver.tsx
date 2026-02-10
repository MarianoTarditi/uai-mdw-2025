import Home from "./pages/Home";
import { createBrowserRouter } from "react-router-dom";
import { AuthLayout } from "./components/public/authLayout/AuthLayout";
import MainLayout from "./components/public/mainLayout/MainLayout";
import PrivateRoute from "./components/private/privateRoute/PrivateRoute";
import { ForgotPassword } from "./pages/auth/forgotPassword/ForgotPassword";
import { Login } from "./pages/auth/login/Login";
import { SignUp } from "./pages/auth/signUp/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import { GetAllExercises } from "./pages/exercises/GetAllExercises";
import { useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { observeUser } from "./features/auth/authSlice";
import { RouterProvider } from "react-router-dom";
import UserProfile from "./pages/users/userProfile";
import { useAppSelector } from "./app/reduxHooks";
import { GetAllUsers } from "./pages/users/GetAllUsers";
import { GetAllRoutines } from "./pages/routines/GetAllRoutines";
import { FAQ } from "./pages/FAQ/FAQ";

const router = createBrowserRouter([
  {
    path: "/",
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
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        children: [
          { path: "/Dashboard", element: <Dashboard /> },
          { path: "/Exercises", element: <GetAllExercises /> },
          { path: "/UserProfile", element: <UserProfile /> },
          { path: "/GetAllUsers", element: <GetAllUsers /> },
          { path: "/GetAllRoutines", element: <GetAllRoutines /> },
          { path: "/FAQ", element: <FAQ /> },
        ],
      },
    ],
  },
]);

export const AppWithObserver = () => {
  const dispatch = useAppDispatch();
  useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(observeUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
