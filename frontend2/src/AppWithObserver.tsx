import Home from "./pages/Home";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthLayout } from "./components/public/authLayout/AuthLayout";
import MainLayout from "./components/public/mainLayout/MainLayout";
import PrivateRoute from "./components/private/privateRoute/PrivateRoute";
import { ForgotPassword } from "./pages/auth/forgotPassword/ForgotPassword";
import { Login } from "./pages/auth/login/Login";
import { SignUp } from "./pages/auth/signUp/SignUp";
import Dashboard from "./pages/dashboard/Dashboard";
import { GetAllExercises } from "./pages/exercises/GetAllExercises";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { useEffect } from "react";
import { observeUser } from "./features/auth/authSlice";
import UserProfile from "./pages/users/userProfile";
import { GetAllUsers } from "./pages/users/GetAllUsers";
import { GetAllRoutines } from "./pages/routines/GetAllRoutines";
import { SpinnerButton } from "./components/private/spinner/Spinner";
import { UserRole } from "./features/users/userSlice";

const HomeOrRedirect = () => {
  const { profile, isDetailLoading } = useAppSelector((state) => state.user);
  const { isCheckingAuth, user: authUser } = useAppSelector(
    (state) => state.auth,
  );

  if (isCheckingAuth || isDetailLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-dark-9">
        <SpinnerButton variant="sizes" />
      </div>
    );
  }

  if (!authUser || (profile && profile.isActive === false)) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = profile?.roles?.includes(UserRole.Admin);
  return <Navigate to={isAdmin ? "/Dashboard" : "/GetAllRoutines"} replace />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeOrRedirect />,
  },

  {
    path: "/home",
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
      { path: "/Dashboard", element: <Dashboard /> },
      { path: "/Exercises", element: <GetAllExercises /> },
      { path: "/UserProfile", element: <UserProfile /> },
      { path: "/GetAllUsers", element: <GetAllUsers /> },
      { path: "/GetAllRoutines", element: <GetAllRoutines /> },
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
