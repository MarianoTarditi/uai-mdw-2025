"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ClinicalDataForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    console.log("Datos Clínicos:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>¿Tiene alguna lesión actual?</Label>
        <Input {...register("currentInjury")} placeholder="si / no" />
      </div>

      <div className="space-y-2">
        <Label>Descripción de la lesión</Label>
        <Input {...register("injuryDescription")} />
      </div>

      <div className="space-y-2">
        <Label>¿Ha tenido alguna cirugía?</Label>
        <Input {...register("hadSurgery")} placeholder="si / no" />
      </div>

      <div className="space-y-2">
        <Label>Descripción / Fecha de la cirugía</Label>
        <Input {...register("surgeryDetails")} placeholder="Ej: clavícula" />
      </div>

      <div className="space-y-2">
        <Label>¿Tiene alguna condición médica preexistente?</Label>
        <Input {...register("medicalCondition")} placeholder="si / no" />
      </div>

      <div className="space-y-2">
        <Label>Descripción de la condición médica</Label>
        <Input {...register("conditionDescription")} />
      </div>

      <div className="space-y-2">
        <Label>¿Toma alguna medicación?</Label>
        <Input {...register("medication")} placeholder="si / no / cual?" />
      </div>

      <Button type="submit" className="w-full">
        Guardar
      </Button>
    </form>
  );
}
