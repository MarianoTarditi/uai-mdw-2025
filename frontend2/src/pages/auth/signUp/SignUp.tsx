import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { GoogleButton } from "../signUp/GoogleButton";
import { TwitterButton } from "../signUp/TwitterButton";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser, reset } from "../../../features/auth/authSlice";
import type { IRegisterUserData } from "../../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import { SpinnerButton } from "@/components/spinner/Spinner";

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
      toast.success(`Registration successful, welcome! ${user.email}!`);
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onSubmit = (data: IRegisterUserData) => {
    dispatch(registerUser(data));
  };

  if (isLoading) {
    <SpinnerButton variant="sizes" />;
  }

  return (
    <Container size="xs" my={30}>
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

            <TextInput
              required
              label="Birth Date"
              placeholder="2000-02-10"
              {...register("birthDate")}
              error={errors.birthDate?.message}
              radius="md"
            />

            <Select
              label="Gender"
              placeholder="Select gender"
              {...register("gender")}
              data={[
                { value: "male", label: "Male" },
                { value: "female", label: "Female" },
                { value: "other", label: "Other" },
              ]}
              error={errors.gender?.message}
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

            <Button
              type="submit"
              radius="xl"
              disabled={isSubmitting}
              color="myColor.9"
            >
              {/* color="myColor.7" variant="outline"  */}
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
