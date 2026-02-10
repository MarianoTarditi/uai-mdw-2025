import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../app/reduxHooks";
import { getAuthState } from "../../../features/auth/authSlice";
import type { ReactElement } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const { user, isCheckingAuth } = useAppSelector(getAuthState);

  if (isCheckingAuth) {
    return <SpinnerButton variant="sizes" />;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
