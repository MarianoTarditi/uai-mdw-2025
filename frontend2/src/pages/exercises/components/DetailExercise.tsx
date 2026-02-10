import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent, // <--- Asegúrate que venga de @/components/ui/dialog
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // <-- A veces falta este si lo usas, pero aquí lo controlas por estado
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; // Necesitas importar esto
import type { IExercise } from "@/types/auth";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { reset, getExercise } from "@/features/exercises/exerciseSlice";
import { VideoPlayer } from "@/utils/videoPlayer";

interface DetailExerciseProps {
  exercise: IExercise | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DetailExercise({
  exercise,
  isOpen,
  setIsOpen,
}: DetailExerciseProps) {
  const dispatch = useAppDispatch();
  const {
    isError,
    message,
    isFetchingLoading,
    exercise: detailedExercise,
  } = useAppSelector((state) => state.exercise);

  useEffect(() => {
    if (isOpen && exercise?._id) {
      dispatch(getExercise(exercise._id));
    }
    // No reseteamos en error aquí para permitir ver el toast, se resetea al cerrar
  }, [isOpen, exercise?._id, dispatch]);

  // Manejo de errores visual
  useEffect(() => {
    if (isError && isOpen) {
      toast.error(message || "Error cargando ejercicio");
    }
  }, [isError, message, isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(reset());
    }
  };

  // Helper para evitar crasheos si el array viene undefined
  // Helper para evitar crasheos
  const renderList = (items: string[] | undefined | string) => {
    // Aceptamos string también por si acaso
    // 1. Si es null o undefined
    if (!items)
      return <span className="text-muted-foreground text-sm">N/A</span>;

    // 2. BLOQUE DE SEGURIDAD: Si viene un STRING (Dato viejo de la BD), lo mostramos directo
    if (typeof items === "string") {
      return <Badge variant="secondary">{items}</Badge>;
    }

    // 3. Si es un Array pero está vacío
    if (Array.isArray(items) && items.length === 0) {
      return <span className="text-muted-foreground text-sm">N/A</span>;
    }

    // 4. Si NO es un array (y no era string), evitamos el crash del map
    if (!Array.isArray(items)) {
      return <span className="text-red-500 text-xs">Error de datos</span>;
    }

    // 5. Renderizado normal de Array
    return (
      <div className="flex flex-wrap gap-1">
        {items.map((item, idx) => (
          <Badge key={idx} variant="secondary">
            {item}
          </Badge>
        ))}
      </div>
    );
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-background text-foreground p-6">
        <DialogHeader>
          <DialogTitle>Detalles del Ejercicio</DialogTitle>
          <DialogDescription>
            Información completa del ejercicio seleccionado.
          </DialogDescription>
        </DialogHeader>

        {isFetchingLoading ? (
          <div className="flex justify-center items-center py-10">
            <SpinnerButton />
          </div>
        ) : (
          <div className="grid gap-4 py-2">
            {/* NOMBRE */}
            <div className="grid gap-2">
              <Label>Nombre</Label>
              <Input readOnly value={detailedExercise?.nombre || ""} />
            </div>

            {/* MÚSCULOS PRINCIPALES (Aquí estaba el error) */}
            <div className="grid gap-2">
              <Label>Músculos Principales</Label>
              <div className="p-2 border rounded-md bg-muted/20 min-h-[40px] flex items-center">
                {renderList(detailedExercise?.musculosPrincipales)}
              </div>
            </div>

            {/* MÚSCULOS SECUNDARIOS */}
            <div className="grid gap-2">
              <Label>Músculos Secundarios</Label>
              <div className="p-2 border rounded-md bg-muted/20 min-h-[40px] flex items-center">
                {renderList(detailedExercise?.musculosSecundarios)}
              </div>
            </div>

            {/* MATERIALES */}
            <div className="grid gap-2">
              <Label>Materiales Necesarios</Label>
              <div className="p-2 border rounded-md bg-muted/20 min-h-[40px] flex items-center">
                {renderList(detailedExercise?.materialesNecesarios)}
              </div>
            </div>

            {/* ETIQUETAS */}
            <div className="grid gap-2">
              <Label>Etiquetas</Label>
              <div className="p-2 border rounded-md bg-muted/20 min-h-[40px] flex items-center">
                {renderList(detailedExercise?.etiquetas)}
              </div>
            </div>

            {/* COMENTARIO */}
            <div className="grid gap-2">
              <Label>Comentario</Label>
              <Textarea
                readOnly
                value={detailedExercise?.comentario || ""}
                className="resize-none"
              />
            </div>

            {/* VIDEO & IMAGEN */}
            <div className="mt-4">
              <DialogTitle className="mb-2">Video explicativo</DialogTitle>

              {/* CORRECCIÓN 1: Usamos detailedExercise y agregamos '|| ""' */}
              <VideoPlayer url={detailedExercise?.videoUrl || ""} />
            </div>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
