import Home from "./pages/Home";
import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "./components/authLayout/AuthLayout";
import MainLayout from "./components/mainLayout/MainLayout";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import { ForgotPassword } from "./pages/auth/forgotPassword/ForgotPassword";
import { Login } from "./pages/auth/login/Login";
import { SignUp } from "./pages/auth/signUp/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import { GetAllExercises } from "./pages/exercises/GetAllExercises";
import { useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { observeUser } from "./features/auth/authSlice";
import { RouterProvider } from "react-router-dom";
import UserProfile from "./pages/userProfile/userProfile";
import { useAppSelector } from "./app/reduxHooks";
import { fetchUserProfile } from "./features/users/userSlice";
import { ProfileStepper } from "./components/editUser/ProfileStepper";
import { GetAllUsers } from "./pages/users/GetAllUsers";

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
          { path: "/ProfileStepper", element: <ProfileStepper /> },
          { path: "/GetAllUsers", element: <GetAllUsers /> },
          ],
      },
    ],
  },
]);

export const AppWithObserver = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(observeUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
