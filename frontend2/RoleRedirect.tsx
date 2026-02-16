import { Navigate } from "react-router-dom";
import { useAppSelector } from "./src/app/reduxHooks";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

export const RoleRedirect = () => {
  const { user, profile, isLoading } = useAppSelector(
    (state) => state.auth
  );

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <SpinnerButton />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!profile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <SpinnerButton />
      </div>
    );
  }

  const isAdmin = profile.role === "Admin";

  return (
    <Navigate
      to={isAdmin ? "/Dashboard" : "/GetAllRoutines"}
      replace
    />
  );
};
