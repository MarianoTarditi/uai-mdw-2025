"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, type FieldPath } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import {
  createExercise,
  reset as resetExerciseState,
} from "@/features/exercises/exerciseSlice";
import {
  exerciseSchema,
  type ExerciseFormValues,
} from "@/pages/exercises/validations/exerciseSchema";
import { ETIQUETAS, MATERIALES, MUSCULOS } from "@/pages/exercises/constants";
import type { IExercise } from "@/types/auth";
import { FileVideo, LinkIcon, UploadCloud, WandSparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComboBoxMultiSelect } from "@/components/private/comboBoxMultiSelect/ComboBoxMultiSelect";

type ExerciseFormInput = z.input<typeof exerciseSchema>;

interface CreateExerciseProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: (data: IExercise) => void;
}

const STEPS = [
  { id: 1, title: "Base del ejercicio" },
  { id: 2, title: "Objetivo muscular" },
  { id: 3, title: "Contenido visual" },
];

const EXERCISE_PRESETS: Array<{
  label: string;
  tags: ExerciseFormValues["etiquetas"];
  materials: ExerciseFormValues["materialesNecesarios"];
}> = [
  {
    label: "Fuerza explosiva",
    tags: ["Tren Inferior"],
    materials: ["Barra"],
  },
  {
    label: "Core funcional",
    tags: ["Core"],
    materials: ["Fitball"],
  },
  {
    label: "Hipertrofia",
    tags: ["Tren Superior"],
    materials: ["Mancuernas"],
  },
];

export function AddExercise({ isOpen, setIsOpen }: CreateExerciseProps) {
  const dispatch = useAppDispatch();
  const { isError, isCreatingSuccess, message, isCreatingLoading } =
    useAppSelector((state) => state.exercise);

  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<ExerciseFormInput, unknown, ExerciseFormValues>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      nombre: "",
      comentario: "",
      etiquetas: [],
      musculosPrincipales: [],
      musculosSecundarios: [],
      materialesNecesarios: [],
      videoUrl: "",
      imageUrl: "",
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (!isOpen) return;

    reset({
      nombre: "",
      comentario: "",
      etiquetas: [],
      musculosPrincipales: [],
      musculosSecundarios: [],
      materialesNecesarios: [],
      videoUrl: "",
      imageUrl: "",
    });
    setStep(1);
    setVideoFile(null);
    setFileName(null);
    dispatch(resetExerciseState());
  }, [dispatch, isOpen, reset]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Error al crear ejercicio");
      dispatch(resetExerciseState());
    }

    if (isCreatingSuccess) {
      toast.success("Ejercicio creado correctamente");
      dispatch(resetExerciseState());
      setIsOpen(false);
    }
  }, [dispatch, isCreatingSuccess, isError, message, setIsOpen]);

  const stepValidationMap = useMemo<Record<number, FieldPath<ExerciseFormValues>[]>>(
    () => ({
      1: ["nombre"],
      2: ["musculosPrincipales", "materialesNecesarios", "etiquetas"],
      3: [],
    }),
    [],
  );

  const handleNext = async () => {
    const fields = stepValidationMap[step as keyof typeof stepValidationMap];
    if (fields.length > 0) {
      const isValid = await trigger(fields);
      if (!isValid) return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const muscleOptions = useMemo(
    () => MUSCULOS.map((muscle) => ({ value: muscle, label: muscle })),
    [],
  );

  const materialOptions = useMemo(
    () => MATERIALES.map((material) => ({ value: material, label: material })),
    [],
  );

  const tagOptions = useMemo(
    () => ETIQUETAS.map((tag) => ({ value: tag, label: tag })),
    [],
  );

  const handlePrimaryMusclesChange = (values: string[]) => {
    const validValues = values as ExerciseFormValues["musculosPrincipales"];
    const secondary = watch("musculosSecundarios") || [];
    const filteredSecondary = secondary.filter(
      (muscle) => !validValues.includes(muscle),
    );

    setValue("musculosPrincipales", validValues, { shouldValidate: true });
    setValue("musculosSecundarios", filteredSecondary, { shouldValidate: true });
  };

  const handleSecondaryMusclesChange = (values: string[]) => {
    const validValues = values as ExerciseFormValues["musculosSecundarios"];
    const primary = watch("musculosPrincipales") || [];
    const filteredPrimary = primary.filter((muscle) => !validValues.includes(muscle));

    setValue("musculosSecundarios", validValues, { shouldValidate: true });
    setValue("musculosPrincipales", filteredPrimary, { shouldValidate: true });
  };

  const handlePreset = (preset: (typeof EXERCISE_PRESETS)[number]) => {
    setValue("etiquetas", [...preset.tags], { shouldValidate: true });
    setValue("materialesNecesarios", [...preset.materials], {
      shouldValidate: true,
    });
  };

  const handleFormSubmit = async (data: ExerciseFormValues) => {
    if (videoFile) {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("comentario", data.comentario || "");
      formData.append("etiquetas", JSON.stringify(data.etiquetas));
      formData.append("musculosPrincipales", JSON.stringify(data.musculosPrincipales));
      formData.append("musculosSecundarios", JSON.stringify(data.musculosSecundarios || []));
      formData.append("materialesNecesarios", JSON.stringify(data.materialesNecesarios));
      formData.append("video", videoFile);
      formData.append("imageUrl", data.imageUrl || "");

      await dispatch(createExercise(formData));
      return;
    }

    await dispatch(createExercise(data));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="premium-dialog sm:max-w-[900px] bg-background text-foreground max-h-[92vh] overflow-hidden p-0">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex h-full flex-col">
          <DialogHeader className="premium-dialog-header px-6 py-5">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <WandSparkles className="h-5 w-5 text-primary" />
              Constructor de ejercicio
            </DialogTitle>
            <DialogDescription>
              Crea ejercicios en un flujo guiado, rápido y consistente.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1.4fr_0.8fr] min-h-0 flex-1">
            <div className="overflow-y-auto p-6">
              <div className="mb-5 flex flex-wrap gap-2">
                {STEPS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setStep(item.id)}
                    data-active={step === item.id}
                    className={cn(
                      "premium-step-pill px-3 py-1.5 text-xs transition",
                      step === item.id
                        ? ""
                        : "text-muted-foreground hover:bg-muted",
                    )}
                  >
                    {item.id}. {item.title}
                  </button>
                ))}
              </div>

              {step === 1 && (
                <section className="space-y-5">
                  <div className="grid gap-2">
                    <Label htmlFor="nombre">Nombre del ejercicio</Label>
                    <Input
                      id="nombre"
                      {...register("nombre")}
                      placeholder="Ej: Sentadilla frontal con barra"
                    />
                    {errors.nombre && (
                      <p className="text-sm text-destructive">{errors.nombre.message}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="comentario">Coaching cue (opcional)</Label>
                    <Textarea
                      id="comentario"
                      {...register("comentario")}
                      placeholder="Ej: Mantener el torso firme y bajar controlado."
                      className="resize-none min-h-[100px]"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="imageUrl">Imagen de referencia (opcional)</Label>
                    <Input
                      id="imageUrl"
                      {...register("imageUrl")}
                      placeholder="https://..."
                    />
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="space-y-5">
                  <div className="premium-editor-panel grid gap-4 p-4 sm:p-5">
                    <div className="space-y-2">
                      <Label>Músculos principales</Label>
                      <ComboBoxMultiSelect
                        options={muscleOptions}
                        value={formValues.musculosPrincipales || []}
                        onChange={handlePrimaryMusclesChange}
                        placeholder="Selecciona músculos principales"
                        searchPlaceholder="Buscar músculo principal..."
                        emptyMessage="No se encontraron músculos."
                        className="min-h-10"
                      />
                      {errors.musculosPrincipales && (
                        <p className="text-sm text-destructive">
                          {errors.musculosPrincipales.message as string}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Músculos secundarios</Label>
                      <ComboBoxMultiSelect
                        options={muscleOptions}
                        value={formValues.musculosSecundarios || []}
                        onChange={handleSecondaryMusclesChange}
                        placeholder="Selecciona músculos secundarios"
                        searchPlaceholder="Buscar músculo secundario..."
                        emptyMessage="No se encontraron músculos."
                        className="min-h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="premium-editor-panel grid gap-3 p-4 sm:p-5">
                      <Label>Equipamiento</Label>
                      <ComboBoxMultiSelect
                        options={materialOptions}
                        value={formValues.materialesNecesarios || []}
                        onChange={(values) =>
                          setValue(
                            "materialesNecesarios",
                            values as ExerciseFormValues["materialesNecesarios"],
                            { shouldValidate: true },
                          )
                        }
                        placeholder="Selecciona equipamiento"
                        searchPlaceholder="Buscar equipamiento..."
                        emptyMessage="No se encontró equipamiento."
                        className="min-h-10"
                      />
                      {errors.materialesNecesarios && (
                        <p className="text-sm text-destructive">
                          {errors.materialesNecesarios.message as string}
                        </p>
                      )}
                    </div>

                    <div className="premium-editor-panel grid gap-3 p-4 sm:p-5">
                      <Label>Etiqueta de objetivo</Label>
                      <ComboBoxMultiSelect
                        options={tagOptions}
                        value={formValues.etiquetas || []}
                        onChange={(values) =>
                          setValue("etiquetas", values as ExerciseFormValues["etiquetas"], {
                            shouldValidate: true,
                          })
                        }
                        placeholder="Selecciona etiquetas"
                        searchPlaceholder="Buscar etiqueta..."
                        emptyMessage="No se encontraron etiquetas."
                        className="min-h-10"
                      />
                      {errors.etiquetas && (
                        <p className="text-sm text-destructive">
                          {errors.etiquetas.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="premium-editor-panel space-y-3 p-4 sm:p-5">
                    <Label>Plantillas rápidas</Label>
                    <div className="flex flex-wrap gap-2">
                      {EXERCISE_PRESETS.map((preset) => (
                        <Button
                          key={preset.label}
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => handlePreset(preset)}
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="space-y-4">
                  <Label className="text-base">Video demostrativo</Label>

                  <Tabs defaultValue="link" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="link">URL</TabsTrigger>
                      <TabsTrigger value="upload">Subir archivo</TabsTrigger>
                    </TabsList>

                    <TabsContent value="link" className="space-y-3 pt-3">
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          {...register("videoUrl")}
                          placeholder="https://youtube.com/..."
                          className="pl-9"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="upload" className="space-y-3 pt-3">
                      <label className="premium-upload-zone flex cursor-pointer flex-col items-center justify-center p-8 text-center">
                        <UploadCloud className="mb-2 h-6 w-6 text-primary" />
                        <span className="text-sm font-medium">
                          Arrastra un video o haz click para subir
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Formatos sugeridos: MP4, MOV
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="video/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            setVideoFile(file);
                            setFileName(file.name);
                          }}
                        />
                      </label>

                      {fileName && (
                        <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2 text-sm">
                          <FileVideo className="h-4 w-4 text-primary" />
                          <span className="truncate">{fileName}</span>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </section>
              )}
            </div>

            <aside className="border-l bg-muted/20 p-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Preview de ejercicio
              </h4>
              <div className="premium-editor-panel p-4 shadow-sm">
                <p className="text-lg font-semibold">
                  {formValues.nombre || "Nuevo ejercicio"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formValues.comentario || "Agrega una instrucción técnica para el alumno."}
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Músculos</p>
                    <div className="flex flex-wrap gap-1">
                      {[...(formValues.musculosPrincipales || []), ...(formValues.musculosSecundarios || [])]
                        .slice(0, 6)
                        .map((item) => (
                          <Badge key={item} variant="secondary">
                            {item}
                          </Badge>
                        ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-1 text-xs font-medium text-muted-foreground">Equipamiento</p>
                    <div className="flex flex-wrap gap-1">
                      {(formValues.materialesNecesarios || []).map((item) => (
                        <Badge key={item} variant="outline">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          <DialogFooter className="border-t px-6 py-4 sm:justify-between">
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" onClick={handleBack} disabled={step === 1}>
                Anterior
              </Button>
              <Button type="button" variant="secondary" onClick={handleNext} disabled={step === 3}>
                Siguiente
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isCreatingLoading || step !== 3}>
                {isCreatingLoading ? "Creando..." : "Crear ejercicio"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

