import {
  Anchor,
  Button,
  Container,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
  SimpleGrid
} from "@mantine/core";
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
    <Container size="sm" my={30}>
      <Paper radius="md" p="lg" withBorder>
        <Title size="h3" style={{ textAlign: "center", marginBottom: "1rem" }}>
          Crea tu cuenta
        </Title>
        <Divider label="Continúa con tu email" labelPosition="center" my="lg" />

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                required
                label="Nombre"
                placeholder="Tu nombre"
                {...register("name")}
                error={errors.name?.message}
                radius="md"
              />
              <TextInput
                required
                label="Apellido"
                placeholder="Tu apellido"
                {...register("lastName")}
                error={errors.lastName?.message}
                radius="md"
              />
            </SimpleGrid>

            <TextInput
              required
              label="Email"
              placeholder="tucorreo@gmail.com"
              {...register("email")}
              error={errors.email?.message}
              radius="md"
            />

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <TextInput
                label="Fecha de nacimiento"
                placeholder="DD/MM/YYYY"
                {...register("birthDate")}
                error={errors.birthDate?.message}
                radius="md"
              />
              <SelectGender register={register} defaultValue={undefined} />
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <div className="grid gap-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  placeholder="Ej: 175"
                  type="number"
                  id="height"
                  {...register("height")}
                />
                {errors.height && (
                  <p className="text-sm text-red-500 m-0">{errors.height?.message as string}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  placeholder="Ej: 75"
                  type="number"
                  id="weight"
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-sm text-red-500 m-0">{errors.weight?.message as string}</p>
                )}
              </div>
            </SimpleGrid>

            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <PasswordInput
                required
                label="Contraseña"
                placeholder="Tu contraseña"
                {...register("password")}
                error={errors.password?.message}
                radius="md"
              />
              <PasswordInput
                required
                label="Confirmar contraseña"
                placeholder="Confirma tu contraseña"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
                radius="md"
              />
            </SimpleGrid>
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
              loading={isLoading}
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

