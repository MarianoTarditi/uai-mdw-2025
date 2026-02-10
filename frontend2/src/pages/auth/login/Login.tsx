import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GoogleButton } from "../signUp/GoogleButton";
import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import type { ILoginUserData } from "../../../types/auth";
import { useEffect } from "react";
import { loginUser, reset } from "../../../features/auth/authSlice";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { Center } from "@mantine/core";

export function Login() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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

  if (isLoading) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <SpinnerButton variant="sizes" />
      </Center>
    );
  }

  return (
    <Container size="xs" my={135}>
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500} style={{ textAlign: "center" }}>
          Bienvenido a AgustinTurriEDF
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
        </Group>

        <Divider
          label="O continúa con el email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="tucorreo@gmail.com"
              {...register("email")}
              error={errors.email?.message}
              radius="md"
            />

            <PasswordInput
              required
              label="Contraseña"
              placeholder="tu contraseña"
              {...register("password")}
              error={errors.password?.message}
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component={Link}
              to={"/signUp"}
              type="button"
              c="dimmed"
              size="xs"
            >
              ¿No tienes una cuenta? Registráte
            </Anchor>

            <Button type="submit" radius="xl" disabled={isSubmitting}>
              Iniciar sesión
            </Button>
          </Group>

          <Anchor
            type="button"
            c="dimmed"
            size="xs"
            style={{
              display: "block",
              marginTop: "0.5rem",
            }}
            component={Link}
            to={"/forgotPassword"}
          >
            ¿Olvidaste tu contraseña? Restablecer ahora
          </Anchor>
        </form>
      </Paper>
    </Container>
  );
}
