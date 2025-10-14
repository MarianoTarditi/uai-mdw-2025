import {
  Anchor,
  Button,
  Checkbox,
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
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signUpUser, reset } from "../../../features/auth/authSlice";
import type { IRegisterUserData } from "../../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import Spinner from "../../../components/Spinner";

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IRegisterUserData>({
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

  const onSubmit = (data: IRegisterUserData) => {
    console.log("Formulario enviado:", data);
    console.log(errors);

    dispatch(signUpUser(data));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <Container size="xs" style={{ marginTop: "100px" }}>
      <Paper radius="md" p="lg" withBorder>
        <Text size="lg" fw={500} style={{ textAlign: "center" }}>
          Welcome to Mantine, register with
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
              label="Name"
              placeholder="Your name"
              {...register("name")}
              error={errors.name?.message}
              radius="md"
            />

            <TextInput
              required
              label="Last name"
              placeholder="Your last name"
              {...register("lastName")}
              error={errors.lastName?.message}
              radius="md"
            />

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

            <PasswordInput
              required
              label="Confirm password"
              placeholder="Your confirm password"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              radius="md"
            />

            <Checkbox label="I accept terms and conditions" />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component={Link}
              to={"/login"}
              type="button"
              c="dimmed"
              size="xs"
            >
              Already have an account? Login
            </Anchor>

            <Button type="submit" radius="xl" disabled={isSubmitting}>
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
