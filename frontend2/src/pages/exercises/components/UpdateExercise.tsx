"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import type { IExercise } from "@/types/auth";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect, useState } from "react";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { reset, updateExercise } from "@/features/exercises/exerciseSlice";
import { exerciseSchema } from "@/pages/exercises/validations/exerciseSchema";
import { ETIQUETAS, MATERIALES, MUSCULOS } from "@/pages/exercises/constants";
import { ComboBoxMultiSelect } from "@/components/private/comboBoxMultiSelect/ComboBoxMultiSelect";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Link as LinkIcon,
  UploadCloud,
  FileVideo,
  Youtube,
} from "lucide-react";

interface UpdateExerciseProps {
  exercise: IExercise | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function UpdateExercise({
  exercise,
  isOpen,
  setIsOpen,
}: UpdateExerciseProps) {
  const dispatch = useAppDispatch();
  const { isError, isUpdatingSuccess, message, isUpdatingLoading } =
    useAppSelector((state) => state.exercise);

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset: resetForm,
    formState: { errors },
  } = useForm<IExercise>({
    resolver: zodResolver(exerciseSchema),
  });

  const musculoOptions = MUSCULOS.map((m) => ({ value: m, label: m }));
  const materialOptions = MATERIALES.map((m) => ({ value: m, label: m }));
  const etiquetaOptions = ETIQUETAS.map((e) => ({ value: e, label: e }));

  useEffect(() => {
    if (isOpen && exercise) {
      resetForm({
        nombre: exercise.nombre,
        musculosPrincipales: exercise.musculosPrincipales || [],
        musculosSecundarios: exercise.musculosSecundarios || [],
        materialesNecesarios: exercise.materialesNecesarios || [],
        etiquetas: exercise.etiquetas || [],
        comentario: exercise.comentario || "",
        videoUrl: exercise.videoUrl || "",
        imageUrl: exercise.imageUrl || "",
      });
      setVideoFile(null);
      setFileName(null);
    }
  }, [isOpen, exercise, resetForm]);

  useEffect(() => {
    if (isError) {
      toast.error(message || "Error updating exercise");
      dispatch(reset());
    }

    if (isUpdatingSuccess && isOpen) {
      toast.success("Exercise updated successfully!");
      dispatch(reset());
      setIsOpen(false);
    }
  }, [isError, isUpdatingSuccess, message, dispatch, setIsOpen, isOpen]);

  const handleFormSubmit = async (data: IExercise) => {
    if (!exercise?._id) return;

    if (videoFile) {
      const formData = new FormData();
      formData.append("nombre", data.nombre);
      formData.append("comentario", data.comentario || "");

      formData.append("etiquetas", JSON.stringify(data.etiquetas));
      formData.append(
        "musculosPrincipales",
        JSON.stringify(data.musculosPrincipales),
      );
      formData.append(
        "musculosSecundarios",
        JSON.stringify(data.musculosSecundarios),
      );
      formData.append(
        "materialesNecesarios",
        JSON.stringify(data.materialesNecesarios),
      );

      formData.append("video", videoFile);

      await dispatch(
        updateExercise({ id: exercise._id, exerciseData: formData as any }),
      );
    } else {
      await dispatch(updateExercise({ id: exercise._id, exerciseData: data }));
    }
  };

  if (isUpdatingLoading) {
    return <SpinnerButton variant="sizes" />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[500px] bg-background text-foreground max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Editar Ejercicio</DialogTitle>
            <DialogDescription>
              Modifica los detalles del ejercicio.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* NOMBRE */}
            <div className="grid gap-3">
              <Label htmlFor="nombre">Nombre del ejercicio</Label>
              <Input
                id="nombre"
                {...register("nombre")}
                placeholder="Ej: Press de Banca"
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label>Músculos principales</Label>
              <Controller
                name="musculosPrincipales"
                control={control}
                render={({ field }) => (
                  <ComboBoxMultiSelect
                    options={musculoOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar músculos"
                    searchPlaceholder="Buscar músculo..."
                  />
                )}
              />
              {errors.musculosPrincipales && (
                <p className="text-sm text-red-500">
                  {errors.musculosPrincipales.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label>Músculos secundarios</Label>
              <Controller
                name="musculosSecundarios"
                control={control}
                render={({ field }) => (
                  <ComboBoxMultiSelect
                    options={musculoOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar músculos"
                  />
                )}
              />
            </div>

            <div className="grid gap-3">
              <Label>Materiales necesarios</Label>
              <Controller
                name="materialesNecesarios"
                control={control}
                render={({ field }) => (
                  <ComboBoxMultiSelect
                    options={materialOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar materiales"
                  />
                )}
              />
              {errors.materialesNecesarios && (
                <p className="text-sm text-red-500">
                  {errors.materialesNecesarios.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label>Etiquetas</Label>
              <Controller
                name="etiquetas"
                control={control}
                render={({ field }) => (
                  <ComboBoxMultiSelect
                    options={etiquetaOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Seleccionar etiquetas"
                  />
                )}
              />
              {errors.etiquetas && (
                <p className="text-sm text-red-500">
                  {errors.etiquetas.message}
                </p>
              )}
            </div>

            <div className="grid gap-3 mt-2 p-4 border rounded-lg bg-muted/10">
              <Label className="text-base font-semibold">
                Video del Ejercicio
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Puedes mantener el video actual, pegar un nuevo enlace o subir
                un nuevo archivo.
              </p>

              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link">Enlace</TabsTrigger>
                  <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
                </TabsList>

                <TabsContent value="link" className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">Link Externo</span>
                  </div>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register("videoUrl")}
                      placeholder="https://youtube.com/..."
                      className="pl-9"
                    />
                  </div>
                  {errors.videoUrl && (
                    <p className="text-sm text-red-500">
                      {errors.videoUrl.message}
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="upload" className="mt-4">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                    <label
                      htmlFor="dropzone-file-edit"
                      className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">
                            Click para cambiar video
                          </span>
                        </p>
                      </div>
                      <input
                        id="dropzone-file-edit"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoFile(file);
                            setFileName(file.name);
                          }
                        }}
                      />
                    </label>
                  </div>
                  {fileName && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-green-600 bg-green-50 p-2 rounded">
                      <FileVideo className="h-4 w-4" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            <div className="grid gap-3">
              <Label htmlFor="comentario">Comentario</Label>
              <Textarea
                id="comentario"
                {...register("comentario")}
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Guardar Cambios</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
