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
  Title,
} from "@mantine/core";
import { GoogleButton } from "../signUp/GoogleButton";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/reduxHooks";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { registerUser, reset } from "../../../features/auth/authSlice";
import type { IRegisterUserData } from "../../../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../../zodValidations/authSchema";
import { useForm } from "react-hook-form";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
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
      height: "" as unknown as number,
      weight: "" as unknown as number,
    },
  });

  const { user, isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isError) {
      toast.error("An error occurred while registering");
    }

    if (isSuccess && user) {
      toast.success(`Registration successful, welcome! ${user.email}!`);
      navigate("/dashboard");
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, navigate, dispatch]);

  const onSubmit = (data: IRegisterUserData) => {
    dispatch(registerUser(data));
  };

  if (isLoading) {
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
          Crea tu cuenta
        </Title>
        <Text size="lg" fw={500} style={{ textAlign: "center" }}>
          Registrarse con
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
              label="Name"
              placeholder="Tu nombre"
              {...register("name")}
              error={errors.name?.message}
              radius="md"
            />
            <TextInput
              required
              label="Last name"
              placeholder="TuApellido"
              {...register("lastName")}
              error={errors.lastName?.message}
              radius="md"
            />
            <TextInput
              required
              label="Email"
              placeholder="tucorreo@gmail.com"
              {...register("email")}
              error={errors.email?.message}
              radius="md"
            />

            <TextInput
              label="Fecha de nacimiento (DD/MM/YYYY)"
              placeholder="01/01/2000"
              {...register("birthDate")}
              error={errors.birthDate?.message}
              radius="md"
            />
            <SelectGender register={register} defaultValue={undefined} />

            <div className="grid gap-3">
              <Label htmlFor="height">Altura (cm)</Label>
              <Input type="number" id="height" {...register("height")} />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height?.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="weight">Peso (kg)</Label>
              <Input type="number" id="weight" {...register("weight")} />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight?.message}</p>
              )}
            </div>
            <PasswordInput
              required
              label="Password"
              placeholder="Tu contraseña"
              {...register("password")}
              error={errors.password?.message}
              radius="md"
            />
            <PasswordInput
              required
              label="Confirm password"
              placeholder="Confirma tu contraseña"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
              radius="md"
            />
          </Stack>
          <Group justify="space-between" mt="xl">
            <Anchor
              component={Link}
              to={"/login"}
              type="button"
              c="dimmed"
              size="xs"
            >
              ¿Ya tienes una cuenta? Iniciar sesión
            </Anchor>
            <Button
              type="submit"
              radius="xl"
              loading={isSubmitting}
              color="myColor.9"
            >
              Registrarse
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
