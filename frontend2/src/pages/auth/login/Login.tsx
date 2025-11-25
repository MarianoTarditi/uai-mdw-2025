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
import { TwitterButton } from "../signUp/TwitterButton";
import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import type { ILoginUserData } from "../../../types/auth";
import { useEffect } from "react";
import { loginUser, reset } from "../../../features/auth/authSlice";
import { Loader, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ILoginUserData>({
    // Interfaz para los datos del formulario
    resolver: zodResolver(loginSchema), // Validación con Zod
  });

  const { user, isLoading, isError, isSuccess, errorMessage } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isError) {
      toast.error(errorMessage);
    }

    if (isSuccess && user) {
      toast.success(`Welcome back, ${user.email}!`);
      navigate("/dashboard");
    }

    dispatch(reset());
  }, [user, isError, isSuccess, errorMessage, navigate, dispatch]);

  const onSubmit = (data: ILoginUserData) => {
    dispatch(loginUser(data));
  };

  if (isLoading) {
    return (
      <Center style={{ width: "100vw", height: "100vh" }}>
        <Loader color="rgba(0, 0, 0, 0.87)" size="sm" type="dots" />
      </Center>
    );
  }

  return (
    <Container size="xs" my={135}>
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500} style={{ textAlign: "center" }}>
          Welcome to Mantine, login with
        </Text>

        <Group grow mb="md" mt="md">
          <GoogleButton radius="xl">Google</GoogleButton>
          <TwitterButton radius="xl">Twitter</TwitterButton>
        </Group>

        <Divider
          label="Or continue with email"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              required
              label="Email"
              placeholder="hello@mantine.dev"
              {...register("email")}
              error={errors.email?.message}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Your password"
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
              Don't have an account? Register
            </Anchor>

            <Button type="submit" radius="xl" disabled={isSubmitting}>
              Login
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
            Forgot password? Reset now
          </Anchor>
        </form>
      </Paper>
    </Container>
  );
}
