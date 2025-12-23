"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ActivityDataForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Actividad Física:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>¿Tenés experiencia previa en entrenamiento físico?</Label>
        <Input {...register("experience")} placeholder="si / no + detalles" />
      </div>

      <div className="space-y-2">
        <Label>¿Practicás actualmente algún deporte?</Label>
        <Input {...register("currentSport")} placeholder="si / no + cual?" />
      </div>

      <div className="space-y-2">
        <Label>¿Con qué frecuencia?</Label>
        <Input {...register("frequency")} placeholder="Ej: ahora poca..." />
      </div>

      <div className="space-y-2">
        <Label>¿Tuviste lesiones o molestias?</Label>
        <Input {...register("pastInjuries")} placeholder="si / no" />
      </div>

      <Button type="submit" className="w-full">
        Guardar
      </Button>
    </form>
  );
}
