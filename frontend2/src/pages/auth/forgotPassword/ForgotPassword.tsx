import { IconArrowLeft } from "@tabler/icons-react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  Paper,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./ForgotPassword.module.css";
import { Link } from "react-router-dom";
import { useAppDispatch } from "@/app/reduxHooks";
import { resetPassword } from "../../../features/auth/authSlice";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const resetPasswordSchema = z.object({
  email: z
    .string("El email es requerido")
    .min(3, "El campo email es requerido")
    .email("El formato del email es inválido")
    .max(100, "El email debe tener menos de 100 caracteres"),
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ForgotPassword() {
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    const result = await dispatch(resetPassword(data.email));

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Correo de recuperación enviado");
    } else {
      toast.error(result.payload as string);
    }
  };

return (

    <Container size={460} style={{ width: '100%' }}>
      <Paper withBorder shadow="md" p={40} radius="md"> 
        <Title className={classes.title} ta="center" order={2}>
          ¿Olvidaste tu contraseña?
        </Title>
        
        <Divider
          label="Ingresa tu email para obtener el enlace"
          labelPosition="center"
          my="lg"
        />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <TextInput
            label="Tu email"
            placeholder="tucorreo@gmail.com"
            required
            type="email"
            {...register("email")}
            error={errors.email?.message}
          />

          <Group justify="space-between" mt="xl">
            <Anchor c="dimmed" size="sm" component="div">
              <Center inline>
                <IconArrowLeft size={16} stroke={1.5} />
                <Box ml={5}>
                  <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Volver al login
                  </Link>
                </Box>
              </Center>
            </Anchor>

            <Button type="submit"  radius="xl" loading={isSubmitting}>
              Restablecer
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}