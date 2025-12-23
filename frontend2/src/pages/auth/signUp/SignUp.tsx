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
  TextInput, // Usaremos este para todos los inputs de texto/número
  Title,
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
// Eliminamos las importaciones de shadcn/ui que no se necesitan: Input, Label
import { SelectGender } from "../../../components/shadcn-studio/select/SelectGender";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<IRegisterUserData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: "",
      gender: "",
      height: "" as unknown as number, // Cast para que TS acepte "" en un campo numérico
      weight: "" as unknown as number,
    }, // Usamos 'as any' po
  });

  const { user, isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error("An error occurred while registering");
    }

    if (isSuccess && user) {
      toast.success(`Registration successful, welcome! ${user.email}!`);
      navigate("/dashboard");
    } // Es mejor resetear el estado después de los chequeos para evitar que se ejecute la limpieza
    // y para asegurar que la navegación termine.
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, navigate, dispatch]);

  const onSubmit = (data: IRegisterUserData) => {
    dispatch(registerUser(data));
  };

  if (isLoading) {
    // 🚨 BUG FIX: Debe retornar el componente en este punto
    return (
      <Container
        size="xs"
        my={30}
        className="flex justify-center items-center h-screen"
      >
        <SpinnerButton variant="sizes" />
      </Container>
    );
  }

  return (
    <Container size="xs" my={30}>
      <Paper radius="md" p="lg" withBorder>
        <Title size="h3" style={{ textAlign: "center", marginBottom: "1rem" }}>
          Create Your Account
        </Title>
        <Text size="lg" fw={500} style={{ textAlign: "center" }}>
          Register with
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
              placeholder="hello@example.com"
              {...register("email")}
              error={errors.email?.message}
              radius="md"
            />

            <TextInput
              label="Birth Date (DD/MM/YYYY)"
              placeholder="01/01/2000"
              {...register("birthDate")}
              error={errors.birthDate?.message}
              radius="md"
            />
            <SelectGender register={register} defaultValue={undefined} />

            <div className="grid gap-3">
              <Label htmlFor="height">Height (cm)</Label>
              <Input type="number" id="height" {...register("height")} />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height?.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input type="number" id="weight" {...register("weight")} />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight?.message}</p>
              )}
            </div>
            {/* Fin de Inputs convertidos */}
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
              loading={isSubmitting} // Usamos la prop loading de Mantine
              color="myColor.9"
            >
              Register
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
