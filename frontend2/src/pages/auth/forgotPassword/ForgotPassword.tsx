import { IconArrowLeft } from "@tabler/icons-react";
import {
  Anchor,
  Box,
  Button,
  Center,
  Container,
  Group,
  Paper,
  Text,
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

/* ZOD SCHEMA */
const resetPasswordSchema = z.object({
  email: z
    .email("invalid email format")
    .min(3, "email must be at least 3 characters")
    .max(100, "email must be less than 100 characters"),
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
      toast.success("Password reset email sent");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <Container size={460} my={170}>
      <Title className={classes.title} ta="center">
        Forgot your password?
      </Title>
      <Text c="dimmed" fz="sm" ta="center">
        Enter your email to get a reset link
      </Text>

      <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Your email"
            placeholder="youremail@gmail.com"
            {...register("email")}
            error={errors.email?.message}
          />

          <Group justify="space-between" mt="lg">
            <Anchor c="dimmed" size="sm">
              <Center inline>
                <IconArrowLeft size={12} stroke={1.5} />
                <Box ml={5} component={Link} to="/login">
                  Back to the login page
                </Box>
              </Center>
            </Anchor>

            <Button type="submit" loading={isSubmitting}>
              Reset password
            </Button>
          </Group>
        </form>
      </Paper>
    </Container>
  );
}
