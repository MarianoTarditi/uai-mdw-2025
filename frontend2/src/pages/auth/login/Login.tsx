import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../../app/reduxHooks";
import type { ILoginUserData } from "../../../types/auth";
import { loginSchema } from "../../../zodValidations/authSchema";
import { loginUser, reset } from "../../../features/auth/authSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import classes from "../AuthForm.module.css";

export function Login() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginUserData>({
    resolver: zodResolver(loginSchema),
  });

  const { isError, errorMessage, isLoading } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError && errorMessage) {
      toast.error(errorMessage);
      dispatch(reset());
    }
  }, [isError, errorMessage, dispatch]);

  const onSubmit = (data: ILoginUserData) => {
    dispatch(loginUser(data));
  };

  return (
    <section className={`${classes.containerLogin} auth-premium-main`}>
      <Card className={`${classes.card} auth-premium-card border-0 py-0`}>
        <CardHeader className={classes.cardHeader}>
          <p className={classes.eyebrow}>Acceso privado</p>
          <CardTitle className={classes.title}>Inicia sesión</CardTitle>
      
        </CardHeader>
        <CardContent className={classes.cardContent}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.field}>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="tucorreo@gmail.com"
                autoComplete="email"
                {...register("email")}
              />
              {errors.email?.message ? (
                <p className={classes.error}>{errors.email.message}</p>
              ) : null}
            </div>

            <div className={classes.field}>
              <Label htmlFor="login-password">Contraseña</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Tu contraseña"
                autoComplete="current-password"
                {...register("password")}
              />
              {errors.password?.message ? (
                <p className={classes.error}>{errors.password.message}</p>
              ) : null}
            </div>

            <div className={classes.hintRow}>
              <Link to="/forgotPassword" className={classes.switch}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              className={`${classes.submit} w-full`}
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
