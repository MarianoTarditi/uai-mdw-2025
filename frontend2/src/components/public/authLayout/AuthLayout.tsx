import classes from "./AuthLayout.module.css";
import { Outlet, Navigate } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { AuthHeader } from "../header/AuthHeader";
import { useAppSelector } from "@/app/reduxHooks";
import { SpinnerButton } from "@/components/private/spinner/Spinner";

export const AuthLayout = () => {
  const { user, isCheckingAuth } = useAppSelector((state) => state.auth);

  if (isCheckingAuth) {
    return <SpinnerButton variant="sizes" />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={classes.layout}>
      <AuthHeader />
      <main className={classes.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
