import { useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { createManagedUser, resetAdminState } from "@/features/admin/adminSlice";
import { getAllUsers } from "@/features/users/userSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ARGENTINA_PHONE_PLACEHOLDER,
  MANAGED_USER_WEIGHT_MAX,
  MANAGED_USER_WEIGHT_MIN,
  normalizeArgentinaPhone,
  sanitizeArgentinaPhoneInput,
} from "@/utils/phoneAr";

const dateRegex = /^([0-2]?\d|3[01])\/([0]?\d|1[0-2])\/(19|20)\d{2}$/;

const createManagedUserSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  lastName: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Formato de email invalido"),
  phone: z
    .string()
    .trim()
    .refine(
      (value) => Boolean(normalizeArgentinaPhone(value)),
      `Ingresa un celular argentino valido, por ejemplo ${ARGENTINA_PHONE_PLACEHOLDER}`,
    ),
  birthDate: z
    .string()
    .transform((value) => (value === "" ? undefined : value))
    .optional()
    .refine(
      (value) => !value || dateRegex.test(value),
      "Formato de fecha invalido (DD/MM/AAAA)",
    ),
  gender: z.enum(["male", "female", "other"]).optional(),
  height: z
    .string()
    .optional()
    .refine(
      (value) => !value || (Number(value) >= 100 && Number(value) <= 250),
      "Ingresa una altura valida (100-250 cm)",
    ),
  weight: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        (Number(value) >= MANAGED_USER_WEIGHT_MIN &&
          Number(value) <= MANAGED_USER_WEIGHT_MAX),
      `Ingresa un peso valido (${MANAGED_USER_WEIGHT_MIN}-${MANAGED_USER_WEIGHT_MAX} kg)`,
    ),
  paymentAmount: z
    .string()
    .trim()
    .min(1, "Ingresa el monto del primer pago")
    .refine(
      (value) => !Number.isNaN(Number(value)) && Number(value) >= 0,
      "Ingresa un monto valido mayor o igual a 0",
    ),
  paymentBillingCycleDays: z
    .string()
    .trim()
    .min(1, "Ingresa el ciclo de cobro")
    .refine(
      (value) => {
        const parsedValue = Number(value);
        return (
          Number.isInteger(parsedValue) &&
          parsedValue >= 1 &&
          parsedValue <= 365
        );
      },
      "Ingresa un ciclo valido entre 1 y 365 dias",
    ),
});

type CreateManagedUserForm = {
  name: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  gender?: "male" | "female" | "other";
  height?: string;
  weight?: string;
  paymentAmount: string;
  paymentBillingCycleDays: string;
};

interface CreateManagedUserProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function CreateManagedUser({
  isOpen,
  setIsOpen,
}: CreateManagedUserProps) {
  const dispatch = useAppDispatch();
  const { isCreatingUser, isError, message, isCreateUserSuccess } =
    useAppSelector((state) => state.admin);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateManagedUserForm>({
    resolver: zodResolver(createManagedUserSchema),
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: undefined,
      height: "",
      weight: "",
      paymentAmount: "",
      paymentBillingCycleDays: "30",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset();
      dispatch(resetAdminState());
      return;
    }

    if (isError && message) {
      toast.error(message);
      dispatch(resetAdminState());
    }

    if (isCreateUserSuccess) {
      toast.success("Alumno creado correctamente");
      dispatch(getAllUsers());
      dispatch(resetAdminState());
      reset();
      setIsOpen(false);
    }
  }, [
    dispatch,
    isCreateUserSuccess,
    isError,
    isOpen,
    message,
    reset,
    setIsOpen,
  ]);

  const onSubmit: SubmitHandler<CreateManagedUserForm> = async (data) => {
    const normalizedPhone = normalizeArgentinaPhone(data.phone);

    if (!normalizedPhone) {
      toast.error(
        `Ingresa un celular argentino valido. Ejemplo: ${ARGENTINA_PHONE_PLACEHOLDER}`,
      );
      return;
    }

    await dispatch(
      createManagedUser({
        name: data.name.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: normalizedPhone,
        birthDate: data.birthDate || undefined,
        gender: data.gender,
        height: data.height ? Number(data.height) : null,
        weight: data.weight ? Number(data.weight) : null,
        paymentAmount: Number(data.paymentAmount),
        paymentBillingCycleDays: Number(data.paymentBillingCycleDays),
      }),
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="premium-dialog sm:max-w-[560px] bg-background text-foreground max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <DialogHeader className="premium-dialog-header px-1 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-primary" />
              Crear alumno
            </DialogTitle>
            <DialogDescription>
              Los usuarios Admin y trainer pueden dar de alta alumnos desde esta
              seccion. El usuario accedera al sistema con su{" "}
              <strong>"Email"</strong> y contraseña <strong>"123456789"</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="managed-name">Nombre *</Label>
              <Input id="managed-name" {...register("name")} />
              {errors.name ? (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="managed-lastname">Apellido *</Label>
              <Input id="managed-lastname" {...register("lastName")} />
              {errors.lastName ? (
                <p className="text-xs text-red-500">{errors.lastName.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="managed-email">Email *</Label>
            <Input id="managed-email" type="email" {...register("email")} />
            {errors.email ? (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="managed-phone">Celular *</Label>
            <Input
              id="managed-phone"
              inputMode="tel"
              autoComplete="tel"
              placeholder={ARGENTINA_PHONE_PLACEHOLDER}
              {...register("phone", {
                onChange: (event) => {
                  event.target.value = sanitizeArgentinaPhoneInput(
                    event.target.value,
                  );
                },
              })}
            />
            {errors.phone ? (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            ) : null}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="managed-birthdate">Fecha de nacimiento</Label>
              <Input
                id="managed-birthdate"
                placeholder="DD/MM/AAAA"
                {...register("birthDate")}
              />
              {errors.birthDate ? (
                <p className="text-xs text-red-500">{errors.birthDate.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label>Genero</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value ?? undefined}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar genero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Femenino</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gender ? (
                <p className="text-xs text-red-500">{errors.gender.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="managed-height">Altura (cm)</Label>
              <Input id="managed-height" type="number" {...register("height")} />
              {errors.height ? (
                <p className="text-xs text-red-500">{errors.height.message}</p>
              ) : null}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="managed-weight">Peso (kg)</Label>
              <Input
                id="managed-weight"
                type="number"
                min={MANAGED_USER_WEIGHT_MIN}
                max={MANAGED_USER_WEIGHT_MAX}
                step="0.1"
                placeholder={`${MANAGED_USER_WEIGHT_MIN}-${MANAGED_USER_WEIGHT_MAX}`}
                {...register("weight")}
              />
              {errors.weight ? (
                <p className="text-xs text-red-500">{errors.weight.message}</p>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold">Primer pago</h3>
  
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="managed-payment-amount">Monto inicial *</Label>
                <Input
                  id="managed-payment-amount"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Ej: 35000"
                  {...register("paymentAmount")}
                />
                {errors.paymentAmount ? (
                  <p className="text-xs text-red-500">
                    {errors.paymentAmount.message}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="managed-payment-cycle">
                  Ciclo de cobro (dias) *
                </Label>
                <Input
                  id="managed-payment-cycle"
                  type="number"
                  min={1}
                  max={365}
                  step="1"
                  {...register("paymentBillingCycleDays")}
                />
                {errors.paymentBillingCycleDays ? (
                  <p className="text-xs text-red-500">
                    {errors.paymentBillingCycleDays.message}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Default recomendado: 30 dias.
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingUser}>
              {isCreatingUser ? "Creando..." : "Crear alumno"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
