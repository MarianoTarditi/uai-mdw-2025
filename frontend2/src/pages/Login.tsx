import { useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import { useForm } from "react-hook-form";
import type { LoginUserData } from "../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../zodValidations/authSchema";

function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginUserData>({
    resolver: zodResolver(loginSchema),
  });

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.name}!`);
      navigate("/");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: LoginUserData) => {
    dispatch(loginUser(data));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Login and start setting goals</p>
      </section>

      <section className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="field-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <input
              {...register("password", {required: "Password is required" })}
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
            />
            {errors.password && (<p className="field-error">{errors.password.message}</p> )}
          </div>

          <div className="form-group">
            <button
              disabled={isSubmitting}
              type="submit"
              className="btn btn-block"
            >
              Login
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;
