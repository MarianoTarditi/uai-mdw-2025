// src/components/shadcn-studio/select/SelectGender.tsx

import { useId } from "react";
import { type UseFormRegister, type FieldError } from "react-hook-form"; // 👈 Importar FieldError
import { Label } from "@/components/ui/label";
import { SelectNative } from "@/components/ui/select-native";
import type { IEditProfileData } from "@/types/auth";

interface SelectGenderProps {
  register: UseFormRegister<IEditProfileData>;
  defaultValue: IEditProfileData["gender"] | undefined;
  error?: FieldError; // 👈 1. Añadir la prop opcional de error
}

export const SelectGender = ({
  register,
  defaultValue,
  error,
}: SelectGenderProps) => {
  const id = useId();

  return (
    <div className="grid gap-3">
      <Label htmlFor={id}>Gender</Label>
      <SelectNative
        id={id}
        {...register("gender")}
        defaultValue={defaultValue || ""}
      >
        <option value="" disabled>
          Please select a gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </SelectNative>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </div>
  );
};
