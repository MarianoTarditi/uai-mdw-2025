"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmergencyDataForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Datos de Emergencia:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      <div className="space-y-2">
        <Label>Nombre del contacto de emergencia</Label>
        <Input {...register("emergencyName")} placeholder="Ej: Martín Fraile" />
      </div>

      <div className="space-y-2">
        <Label>Relación</Label>
        <Input {...register("emergencyRelation")} placeholder="Ej: marido" />
      </div>

      <div className="space-y-2">
        <Label>Teléfono del contacto</Label>
        <Input {...register("emergencyPhone")} placeholder="3412019134" />
      </div>

      <Button type="submit" className="w-full">Guardar</Button>
    </form>
  );
}
