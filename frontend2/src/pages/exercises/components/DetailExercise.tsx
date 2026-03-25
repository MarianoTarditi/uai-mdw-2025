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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IExercise } from "@/types/auth";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { reset, getExercise } from "@/features/exercises/exerciseSlice";
import { VideoPlayer } from "@/utils/videoPlayer";
import { Dumbbell, Tags, Wrench } from "lucide-react";

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
  }, [isOpen, exercise?._id, dispatch]);

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

  const renderList = (items: string[] | undefined | string) => {
    if (!items) return <span className="text-muted-foreground text-sm">N/A</span>;

    if (typeof items === "string") {
      return <Badge variant="secondary">{items}</Badge>;
    }

    if (!Array.isArray(items) || items.length === 0) {
      return <span className="text-muted-foreground text-sm">N/A</span>;
    }

    return (
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, idx) => (
          <Badge key={idx} variant="secondary" className="font-normal">
            {item}
          </Badge>
        ))}
      </div>
    );
  };

  const shouldShowSpinner =
    isFetchingLoading ||
    !detailedExercise ||
    detailedExercise._id !== exercise?._id;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[920px] max-h-[92vh] overflow-y-auto bg-background text-foreground p-0">
        <DialogHeader className="border-b bg-gradient-to-r from-primary/10 to-card px-6 py-5">
          <DialogTitle className="text-xl">Ficha de ejercicio</DialogTitle>
          <DialogDescription>
            Visualiza técnica, enfoque muscular y recurso audiovisual.
          </DialogDescription>
        </DialogHeader>

        {shouldShowSpinner ? (
          <div className="flex justify-center items-center py-16">
            <SpinnerButton variant="sizes" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <Card className="py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {detailedExercise?.nombre || "Ejercicio"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2">
                    <Label>Nombre</Label>
                    <Input readOnly value={detailedExercise?.nombre || ""} />
                  </div>

                  <div className="grid gap-2">
                    <Label>Coaching cue</Label>
                    <Textarea
                      readOnly
                      value={detailedExercise?.comentario || "Sin comentario."}
                      className="resize-none min-h-[90px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-primary" />
                    Músculos objetivo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Principales</p>
                    {renderList(detailedExercise?.musculosPrincipales)}
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Secundarios</p>
                    {renderList(detailedExercise?.musculosSecundarios)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Wrench className="h-4 w-4 text-primary" />
                    Equipamiento
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderList(detailedExercise?.materialesNecesarios)}</CardContent>
              </Card>

              <Card className="py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tags className="h-4 w-4 text-primary" />
                    Etiquetas
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderList(detailedExercise?.etiquetas)}</CardContent>
              </Card>

              <Card className="py-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Video demostrativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoPlayer url={detailedExercise?.videoUrl || ""} />
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <DialogFooter className="border-t bg-muted/20 px-6 py-4">
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

