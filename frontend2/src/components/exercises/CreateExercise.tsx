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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { reset, createExercise } from "@/features/exercises/exerciseSlice";
import { exerciseSchema } from "@/zodValidations/exerciseSchema";
import type { IExercise } from "@/types/auth";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { useEffect, useState } from "react";
import {
  ETIQUETAS,
  MATERIALES,
  MUSCULOS,
} from "@/components/exercises/constants";
import { ComboBoxMultiSelect } from "@/components/comboBoxMultiSelect/ComboBoxMultiSelect";

// --- IMPORTACIONES NUEVAS ---
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Link as LinkIcon,
  UploadCloud,
  FileVideo,
  Youtube,
} from "lucide-react";

interface CreateExerciseProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSubmit?: (data: IExercise) => void;
}

export function AddExercise({ isOpen, setIsOpen }: CreateExerciseProps) {
  const dispatch = useAppDispatch();
  const { isError, isCreatingSuccess, message, isCreatingLoading } =
    useAppSelector((state) => state.exercise);

  // Estado local para manejar visualmente la subida de archivo (placeholder)
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue, // Necesario si implementas lógica de subida real
    formState: { errors },
  } = useForm<IExercise>({
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

  const musculoOptions = MUSCULOS.map((m) => ({ value: m, label: m }));
  const materialOptions = MATERIALES.map((m) => ({ value: m, label: m }));
  const etiquetaOptions = ETIQUETAS.map((e) => ({ value: e, label: e }));
  const [videoFile, setVideoFile] = useState<File | null>(null);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
    }

    if (isCreatingSuccess) {
      toast.success("Exercise created successfully!");
      dispatch(reset());
      setIsOpen(false);
      setFileName(null); // Reseteamos el archivo visual
    }
  }, [isError, isCreatingSuccess, message, dispatch, setIsOpen]);

  const handleFormSubmit = async (data: IExercise) => {
    // Si hay un archivo seleccionado y estamos en la pestaña "upload"
    // (Asumiendo que agregas un estado activeTab o validas si videoFile existe)
    if (videoFile) {
      const formData = new FormData();

      // 1. Textos Simples
      formData.append("nombre", data.nombre);
      formData.append("comentario", data.comentario || "");

      // 2. Arrays (CRÍTICO: Convertirlos a JSON string)
      // Si no haces esto, se envían vacíos o mal formados
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

      // 3. El Archivo de Video
      formData.append("video", videoFile);

      // 4. Despachar
      await dispatch(createExercise(formData as any));
    } else {
      // Lógica normal para links de youtube (JSON simple)
      await dispatch(createExercise(data));
    }
  };

  if (isCreatingLoading) {
    return <SpinnerButton variant="sizes" />;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[500px] bg-background text-foreground max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Nuevo ejercicio</DialogTitle>
            <DialogDescription>
              Completa los detalles y asigna un video demostrativo.
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

            {/* MÚSCULOS PRINCIPALES */}
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

            {/* MÚSCULOS SECUNDARIOS */}
            <div className="grid gap-3">
              <Label>Músculos secundarios (Opcional)</Label>
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

            {/* MATERIALES */}
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

            {/* ETIQUETAS */}
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

            {/* --- SECCIÓN VIDEO --- */}
            <div className="grid gap-3 mt-2 p-4 border rounded-lg bg-muted/10">
              <Label className="text-base font-semibold">Elige tu video</Label>
              <p className="text-xs text-muted-foreground mb-2">
                El video que vayas a subir debe ser corto y con un inicio y
                final en la misma posición para una mejor visualización (bucle).
              </p>

              <Tabs defaultValue="link" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link">Importar Enlace</TabsTrigger>
                  <TabsTrigger value="upload">Subir Archivo</TabsTrigger>
                </TabsList>

                {/* OPCIÓN 1: LINK (Youtube/Drive) */}
                <TabsContent value="link" className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Youtube className="h-5 w-5 text-red-500" />
                    <span className="text-sm font-medium">
                      Youtube, Vimeo o Drive Público
                    </span>
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

                {/* OPCIÓN 2: ARRASTRAR ARCHIVO */}
                <TabsContent value="upload" className="mt-4">
                  <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors border-muted-foreground/25">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-full pt-5 pb-6"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <UploadCloud className="w-8 h-8 mb-3 text-muted-foreground" />
                        <p className="mb-1 text-sm text-muted-foreground">
                          <span className="font-semibold">
                            Click para subir
                          </span>{" "}
                          o arrastrar
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setVideoFile(file); // <--- GUARDAR EL ARCHIVO AQUÍ
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
                  <p className="text-[10px] text-muted-foreground mt-2 text-center">
                    *Para subir archivos reales (.mp4) requieres configuración
                    de almacenamiento en nube. Por ahora usa la opción de
                    Enlace.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
            {/* --- FIN SECCIÓN VIDEO --- */}

            {/* COMENTARIO */}
            <div className="grid gap-3">
              <Label htmlFor="comentario">Comentario (opcional)</Label>
              <Textarea
                id="comentario"
                {...register("comentario")}
                placeholder="Describe la técnica o tips..."
                className="resize-none"
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar ejercicio</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
