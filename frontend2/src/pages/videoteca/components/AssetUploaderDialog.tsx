import { useState } from "react";
import { ImagePlus, Loader2, UploadCloud, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { validateVideotecaFile } from "@/pages/videoteca/components/mediaValidation";

interface AssetUploaderDialogProps {
  open: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: FormData) => Promise<void>;
}

export function AssetUploaderDialog({
  open,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: AssetUploaderDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [localError, setLocalError] = useState("");

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setName("");
      setDescription("");
      setFile(null);
      setLocalError("");
    }

    onOpenChange(nextOpen);
  };

  const handleFileChange = async (nextFile: File | null) => {
    setLocalError("");
    setFile(null);

    if (!nextFile) {
      return;
    }

    try {
      await validateVideotecaFile(nextFile);
      setFile(nextFile);
      if (!name.trim()) {
        setName(nextFile.name.replace(/\.[^.]+$/, ""));
      }
    } catch (error) {
      setLocalError(
        error instanceof Error
          ? error.message
          : "No se pudo validar el archivo.",
      );
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setLocalError("Seleccioná un archivo antes de subir.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    if (name.trim()) {
      formData.append("name", name.trim());
    }
    if (description.trim()) {
      formData.append("description", description.trim());
    }

    try {
      await onSubmit(formData);
      handleClose(false);
    } catch (error) {
      setLocalError(
        error instanceof Error ? error.message : "No se pudo subir el archivo.",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-border/60 bg-background/95 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Subir archivo a la videoteca</DialogTitle>
   
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <Video className="h-4 w-4 text-primary" />
                Videos cortos
              </div>
            </div>
            <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground">
                <ImagePlus className="h-4 w-4 text-primary" />
                Imágenes de apoyo
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="asset-name"
            >
              Nombre
            </label>
            <Input
              id="asset-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: Rotación interna de cadera"
              maxLength={120}
            />
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="asset-file"
            >
              Archivo local
            </label>
            <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4">
              <Input
                id="asset-file"
                type="file"
                accept="image/*,video/*"
                onChange={(event) => {
                  void handleFileChange(event.target.files?.[0] || null);
                }}
              />
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                <UploadCloud className="h-4 w-4" />
                Videos hasta 60 segundos · Imágenes y videos locales
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="asset-description"
            >
              Descripción corta
            </label>
            <Textarea
              id="asset-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Ej: movilidad suave para mejorar la rotación sin compensar con la lumbar."
              maxLength={240}
              className="min-h-24"
            />
            <div className="text-right text-xs text-muted-foreground">
              {description.length}/240
            </div>
          </div>

          {localError ? (
            <div className="rounded-2xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {localError}
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || !file}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              "Subir archivo"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
