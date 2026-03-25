import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch, useAppSelector } from "../../../app/reduxHooks";
import { registerUser, reset } from "../../../features/auth/authSlice";
import type { IRegisterUserData } from "../../../types/auth";
import { registerSchema } from "../../../zodValidations/authSchema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectNative } from "@/components/ui/select-native";
import classes from "../AuthForm.module.css";

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterUserData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      gender: "",
      height: "" as unknown as number,
      weight: "" as unknown as number,
    },
  });

  const { user, isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error("Ocurrio un error al registrarte.");
    }

    if (isSuccess && user) {
      toast.success(`Registro exitoso. Bienvenido ${user.email}.`);
      navigate("/");
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, navigate, dispatch]);

  const onSubmit = (data: IRegisterUserData) => {
    dispatch(registerUser(data));
  };

  return (
    <section className={`${classes.containerWide} auth-premium-main`}>
      <Card className={`${classes.card} auth-premium-card border-0 py-0`}>
        <CardHeader className={classes.cardHeader}>
          <p className={classes.eyebrow}>Nuevo acceso</p>
          <CardTitle className={classes.title}>Crea tu cuenta</CardTitle>
          <p className={classes.subtitle}>
            Completa tus datos para ingresar al espacio privado de entrenamiento.
          </p>
        </CardHeader>

        <CardContent className={classes.cardContent}>
          <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
            <div className={classes.gridTwo}>
              <div className={classes.field}>
                <Label htmlFor="signup-name">Nombre</Label>
                <Input
                  id="signup-name"
                  placeholder="Tu nombre"
                  autoComplete="given-name"
                  {...register("name")}
                />
                {errors.name?.message ? (
                  <p className={classes.error}>{errors.name.message}</p>
                ) : null}
              </div>

              <div className={classes.field}>
                <Label htmlFor="signup-lastname">Apellido</Label>
                <Input
                  id="signup-lastname"
                  placeholder="Tu apellido"
                  autoComplete="family-name"
                  {...register("lastName")}
                />
                {errors.lastName?.message ? (
                  <p className={classes.error}>{errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div className={classes.field}>
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
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
              <Label htmlFor="signup-phone">Telefono</Label>
              <Input
                id="signup-phone"
                type="tel"
                placeholder="Ej: +54 9 2474 416101"
                autoComplete="tel"
                {...register("phone")}
              />
              {errors.phone?.message ? (
                <p className={classes.error}>{errors.phone.message}</p>
              ) : null}
            </div>

            <div className={classes.gridTwo}>
              <div className={classes.field}>
                <Label htmlFor="signup-birthDate">Fecha de nacimiento</Label>
                <Input
                  id="signup-birthDate"
                  placeholder="DD/MM/AAAA"
                  {...register("birthDate")}
                />
                {errors.birthDate?.message ? (
                  <p className={classes.error}>{errors.birthDate.message}</p>
                ) : null}
              </div>

              <div className={classes.field}>
                <Label htmlFor="signup-gender">Genero</Label>
                <SelectNative id="signup-gender" defaultValue="" {...register("gender")}>
                  <option value="" disabled>
                    Selecciona tu genero
                  </option>
                  <option value="male">Masculino</option>
                  <option value="female">Femenino</option>
                  <option value="other">Otro</option>
                </SelectNative>
                {errors.gender?.message ? (
                  <p className={classes.error}>{errors.gender.message}</p>
                ) : null}
              </div>
            </div>

            <div className={classes.gridTwo}>
              <div className={classes.field}>
                <Label htmlFor="signup-height">Altura (cm)</Label>
                <Input
                  id="signup-height"
                  type="number"
                  placeholder="Ej: 175"
                  {...register("height")}
                />
                {errors.height?.message ? (
                  <p className={classes.error}>{errors.height.message as string}</p>
                ) : null}
              </div>

              <div className={classes.field}>
                <Label htmlFor="signup-weight">Peso (kg)</Label>
                <Input
                  id="signup-weight"
                  type="number"
                  placeholder="Ej: 75"
                  {...register("weight")}
                />
                {errors.weight?.message ? (
                  <p className={classes.error}>{errors.weight.message as string}</p>
                ) : null}
              </div>
            </div>

            <div className={classes.gridTwo}>
              <div className={classes.field}>
                <Label htmlFor="signup-password">Contraseña</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Tu contraseña"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className={classes.error}>{errors.password.message}</p>
                ) : null}
              </div>

              <div className={classes.field}>
                <Label htmlFor="signup-confirm-password">Confirmar contraseña</Label>
                <Input
                  id="signup-confirm-password"
                  type="password"
                  placeholder="Repite tu contraseña"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword?.message ? (
                  <p className={classes.error}>{errors.confirmPassword.message}</p>
                ) : null}
              </div>
            </div>

            <div className={classes.hintRow}>
              <Link to="/login" className={classes.switch}>
                Ya tienes cuenta? Inicia sesion
              </Link>
            </div>

            <Button
              type="submit"
              className={`${classes.submit} w-full`}
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Crear cuenta"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
