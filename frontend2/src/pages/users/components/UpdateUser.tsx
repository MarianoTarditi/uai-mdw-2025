"use client";

import { useState, useEffect } from "react";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UploadCloud, Image as ImageIcon, UserPen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { reset, updateUserProfile } from "@/features/users/userSlice";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import type { IUserProfile } from "@/features/users/userSlice";
import { updateUserSchema } from "../../../zodValidations/updateUserSchema";
import {
  ARGENTINA_PHONE_PLACEHOLDER,
  MANAGED_USER_WEIGHT_MAX,
  MANAGED_USER_WEIGHT_MIN,
  getArgentinaPhoneInputValue,
  normalizeArgentinaPhone,
  sanitizeArgentinaPhoneInput,
} from "@/utils/phoneAr";

const formatIsoToDDMMYYYY = (date?: string | null): string => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";

  const day = d.getUTCDate().toString().padStart(2, "0");
  const month = (d.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = d.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

const parseDDMMYYYYToISO = (value?: string | null): string | null => {
  if (!value) return null;

  const [day, month, year] = value.split("/");
  if (!day || !month || !year) return null;

  const isoDate = new Date(`${year}-${month}-${day}`);
  if (Number.isNaN(isoDate.getTime())) return null;

  return isoDate.toISOString().split("T")[0];
};

type UserFormData = z.infer<typeof updateUserSchema>;
type UserFormInput = z.input<typeof updateUserSchema>;

interface UpdateUserProps {
  user: IUserProfile | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function UpdateUser({ user, isOpen, setIsOpen }: UpdateUserProps) {
  const dispatch = useAppDispatch();

  const { isError, isUpdatingLoading, message, isUpdatingSuccess } =
    useAppSelector((state) => state.user);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm<UserFormInput, unknown, UserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      name: "",
      lastName: "",
      phone: null,
      birthDate: "",
      gender: undefined,
      height: null,
      weight: null,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (isOpen && user) {
      resetForm({
        name: user.name ?? "",
        lastName: user.lastName ?? "",
        phone: getArgentinaPhoneInputValue(user.phone),
        birthDate: formatIsoToDDMMYYYY(user.birthDate),
        gender: user.gender ?? undefined,
        height: user.height ?? null,
        weight: user.weight ?? null,
      });

      setImageFile(null);
      setFileName(null);
    }
  }, [isOpen, user, resetForm]);

  useEffect(() => {
    if (!isOpen) return;

    if (isError) {
      toast.error(message || "Error al actualizar usuario");
      dispatch(reset());
    }

    if (isUpdatingSuccess) {
      toast.success("Usuario actualizado correctamente");
      dispatch(reset());
      setIsOpen(false);
    }
  }, [isError, isUpdatingSuccess, message, dispatch, setIsOpen, isOpen]);

  const handleFormSubmit: SubmitHandler<UserFormData> = async (data) => {
    if (!user?._id) return;

    const formData = new FormData();
    const normalizedPhone = data.phone ? normalizeArgentinaPhone(data.phone) : null;

    formData.append("name", data.name);
    formData.append("lastName", data.lastName);
    formData.append("phone", normalizedPhone ?? "");

    if (data.height != null) formData.append("height", data.height.toString());
    if (data.weight != null) formData.append("weight", data.weight.toString());

    const parsedBirthDate = parseDDMMYYYYToISO(data.birthDate);
    if (parsedBirthDate) formData.append("birthDate", parsedBirthDate);
    if (data.gender) formData.append("gender", data.gender);

    if (imageFile) {
      formData.append("profileImage", imageFile);
    } else if (user.profileImage) {
      formData.append("existingProfileImage", user.profileImage);
    }

    await dispatch(updateUserProfile({ id: user._id, userData: formData }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="premium-dialog sm:max-w-[500px] bg-background text-foreground max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="premium-dialog-header mb-4 px-1 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <UserPen className="h-4 w-4 text-primary" />
              Editar Usuario
            </DialogTitle>
            <DialogDescription>
              Modifica la informacion personal del usuario.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-red-500">
                    {errors.name.message as string}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Apellido</Label>
                <Input id="lastName" {...register("lastName")} />
                {errors.lastName && (
                  <p className="text-xs text-red-500">
                    {errors.lastName.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">Celular (WhatsApp)</Label>
              <Input
                id="phone"
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
        
              {errors.phone && (
                <p className="text-xs text-red-500">
                  {errors.phone.message as string}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label>Genero</Label>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  step="0.01"
                  {...register("height")}
                />
                {errors.height && (
                  <p className="text-xs text-red-500">
                    {errors.height.message as string}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={MANAGED_USER_WEIGHT_MIN}
                  max={MANAGED_USER_WEIGHT_MAX}
                  step="0.1"
                  placeholder={`${MANAGED_USER_WEIGHT_MIN}-${MANAGED_USER_WEIGHT_MAX}`}
                  {...register("weight")}
                />
                {errors.weight && (
                  <p className="text-xs text-red-500">
                    {errors.weight.message as string}
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Fecha de nacimiento</Label>
              <Input
                type="text"
                placeholder="DD/MM/YYYY"
                {...register("birthDate")}
              />
              {errors.birthDate && (
                <p className="text-xs text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="premium-editor-panel mt-2 grid gap-3 p-4">
              <Label className="text-base font-semibold">Foto de Perfil</Label>
              <div className="premium-upload-zone relative flex h-32 w-full cursor-pointer flex-col items-center justify-center transition-colors">
                <label
                  htmlFor="profile-image-upload"
                  className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6 cursor-pointer z-10"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      <span className="font-semibold">
                        Click para subir imagen
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG (Max 5MB)
                    </p>
                  </div>
                  <input
                    id="profile-image-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setImageFile(file);
                        setFileName(file.name);
                      }
                    }}
                  />
                </label>
              </div>
              {fileName ? (
                <div className="flex items-center gap-2 mt-1 rounded-md border border-emerald-500/20 bg-emerald-500/10 p-2 text-sm text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-300">
                  <ImageIcon className="h-4 w-4" />
                  <span className="truncate max-w-[300px]">{fileName}</span>
                </div>
              ) : (
                user?.profileImage && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground p-2">
                    <ImageIcon className="h-4 w-4" />
                    <span className="truncate">Imagen actual conservada</span>
                  </div>
                )
              )}
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">
              {isUpdatingLoading ? (
                <SpinnerButton variant="sizes" />
              ) : (
                "Guardar Cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
