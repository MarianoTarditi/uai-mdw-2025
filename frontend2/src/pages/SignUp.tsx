import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { registerUser, reset } from "../features/auth/authSlice";
import Spinner from "../components/Spinner";
import type { RegisterUserData } from "../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import { Button } from "@mantine/core";


function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<RegisterUserData>({
    resolver: zodResolver(registerSchema),
  });

  const { user, isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || "An error occurred while registering");
    }

    if (isSuccess && user) {
      toast.success(`Registration successful, welcome! ${user.name}!`);
      navigate("/");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: RegisterUserData) => {
    dispatch(registerUser(data));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className="container">
        <section className="heading">
          <h1>
            <FaUser /> Register
          </h1>
          <p>Please create an account</p>
        </section>

        <section className="form">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <input
                {...register("name", { required: "Name is required" })}
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter your name"
              />
              {errors.name && (
                <p className="field-error">{errors.name.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("lastName", { required: "Last name is required" })}
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="field-error">{errors.lastName.message}</p>
              )}
            </div>
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
                {...register("password", { required: "Password is required" })}
                type="password"
                className="form-control"
                id="password"
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="field-error">{errors.password.message}</p>
              )}
            </div>
            <div className="form-group">
              <input
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                })}
                type="password"
                className="form-control"
                id="confirmPassword"
                placeholder="Confirm password"
              />
              {errors.confirmPassword && (
                <p className="field-error">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="form-group">
              <Button
                disabled={isSubmitting}
                type="submit"
                variant="gradient"
                gradient={{ from: "grape", to: "violet", deg: 208 }}
              >
                Register
              </Button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default SignUp;
