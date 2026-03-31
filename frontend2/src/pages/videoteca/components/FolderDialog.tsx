import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface FolderDialogProps {
  open: boolean;
  title: string;
  description: string;
  initialName?: string;
  initialDescription?: string | null;
  isLoading?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: { name: string; description: string | null }) => Promise<void> | void;
}

export function FolderDialog({
  open,
  title,
  description,
  initialName = "",
  initialDescription = "",
  isLoading = false,
  onOpenChange,
  onSubmit,
}: FolderDialogProps) {
  const [name, setName] = useState(initialName);
  const [folderDescription, setFolderDescription] = useState(
    initialDescription ?? "",
  );

  useEffect(() => {
    if (open) {
      setName(initialName);
      setFolderDescription(initialDescription ?? "");
    }
  }, [initialDescription, initialName, open]);

  const handleSubmit = async () => {
    await onSubmit({
      name: name.trim(),
      description: folderDescription.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nombre</label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ej: Cadera"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Descripción</label>
            <Input
              value={folderDescription}
              onChange={(event) => setFolderDescription(event.target.value)}
              placeholder="Movilidad, ejercicios correctivos"
            />
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || name.trim().length < 2}
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
