"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalDataForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Datos Personales:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="space-y-2">
        <Label>Nombre y Apellido</Label>
        <Input {...register("fullName")} placeholder="Ej: Agustina Bouza" />
      </div>

      <div className="space-y-2">
        <Label>DNI</Label>
        <Input {...register("dni")} placeholder="31681756" />
      </div>

      <div className="space-y-2">
        <Label>Fecha de Nacimiento</Label>
        <Input type="date" {...register("birthDate")} />
      </div>

      <div className="space-y-2">
        <Label>Dirección</Label>
        <Input {...register("address")} placeholder="Av Arijón 3645" />
      </div>

      <div className="space-y-2">
        <Label>Teléfono</Label>
        <Input {...register("phone")} placeholder="3412130072" />
      </div>

      <div className="space-y-2">
        <Label>Correo Electrónico</Label>
        <Input type="email" {...register("email")} />
      </div>

      <div className="space-y-2">
        <Label>Profesión / Dedicación</Label>
        <Input {...register("profession")} placeholder="ej: emprendedora" />
      </div>

      <Button type="submit" className="w-full">Guardar</Button>
    </form>
  );
}
