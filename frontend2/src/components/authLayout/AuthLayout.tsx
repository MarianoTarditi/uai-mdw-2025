import classes from "./AuthLayout.module.css";
import { Outlet } from "react-router-dom";
import { Footer } from "../footer/Footer";
import { AuthHeader } from "../header/AuthHeader";

const AuthLayout = () => {
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

export default AuthLayout;
