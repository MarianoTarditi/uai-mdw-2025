import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { Suspense, lazy, useEffect, type ComponentType } from "react";
import { AuthLayout } from "./components/public/authLayout/AuthLayout";
import MainLayout from "./components/public/mainLayout/MainLayout";
import PrivateRoute from "./components/private/privateRoute/PrivateRoute";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { observeUser } from "./features/auth/authSlice";
import { SpinnerButton } from "./components/private/spinner/Spinner";
import { UserRole } from "./features/users/userSlice";

const Home = lazy(() => import("./pages/Home"));
const ForgotPassword = lazy(() =>
  import("./pages/auth/forgotPassword/ForgotPassword").then((module) => ({
    default: module.ForgotPassword,
  })),
);
const Login = lazy(() =>
  import("./pages/auth/login/Login").then((module) => ({
    default: module.Login,
  })),
);
const SignUp = lazy(() =>
  import("./pages/auth/signUp/SignUp").then((module) => ({
    default: module.SignUp,
  })),
);
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const GetAllExercises = lazy(() =>
  import("./pages/exercises/GetAllExercises").then((module) => ({
    default: module.GetAllExercises,
  })),
);
const UserProfile = lazy(() => import("./pages/users/userProfile"));
const GetAllUsers = lazy(() =>
  import("./pages/users/GetAllUsers").then((module) => ({
    default: module.GetAllUsers,
  })),
);
const GetAllRoutines = lazy(() =>
  import("./pages/routines/GetAllRoutines").then((module) => ({
    default: module.GetAllRoutines,
  })),
);
const RoutineTemplates = lazy(() =>
  import("./pages/routines/RoutineTemplates").then((module) => ({
    default: module.RoutineTemplates,
  })),
);
const GetAllPayments = lazy(() =>
  import("./pages/Payments/GetAllPayments").then((module) => ({
    default: module.GetAllPayments,
  })),
);

const LoadingScreen = () => (
  <div className="flex h-screen w-full items-center justify-center bg-dark-9">
    <SpinnerButton variant="sizes" />
  </div>
);

const withSuspense = (Component: ComponentType) => (
  <Suspense fallback={<LoadingScreen />}>
    <Component />
  </Suspense>
);

const HomeOrRedirect = () => {
  const { profile, isDetailLoading } = useAppSelector((state) => state.user);
  const { isCheckingAuth, user: authUser } = useAppSelector(
    (state) => state.auth,
  );

  if (isCheckingAuth || isDetailLoading) {
    return <LoadingScreen />;
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
    element: withSuspense(Home),
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: withSuspense(Login) },
      { path: "/signUp", element: withSuspense(SignUp) },
      { path: "/forgotPassword", element: withSuspense(ForgotPassword) },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      { path: "/Dashboard", element: withSuspense(Dashboard) },
      { path: "/Exercises", element: withSuspense(GetAllExercises) },
      { path: "/UserProfile", element: withSuspense(UserProfile) },
      { path: "/GetAllUsers", element: withSuspense(GetAllUsers) },
      { path: "/GetAllRoutines", element: withSuspense(GetAllRoutines) },
      { path: "/RoutineTemplates", element: withSuspense(RoutineTemplates) },
      { path: "/Payments", element: withSuspense(GetAllPayments) },
    ],
  },
]);

export const AppWithObserver = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(observeUser());
  }, [dispatch]);

  return <RouterProvider router={router} />;
};
