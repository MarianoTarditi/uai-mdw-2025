"use client";

import { TriangleAlertIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { IUserProfile } from "@/features/users/userSlice";
import { useAppDispatch } from "@/app/reduxHooks";
import { permanentDeleteUser } from "@/features/users/userSlice";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useState } from "react";

interface PermanentDeleteUserProps {
  user: IUserProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function PermanentDeleteUser({
  user,
  isOpen,
  setIsOpen,
}: PermanentDeleteUserProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await dispatch(permanentDeleteUser(user._id)).unwrap();

      toast.success("Usuario eliminado permanentemente");
      setIsOpen(false);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Error al eliminar usuario";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          <div className="bg-destructive/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <TriangleAlertIcon className="text-destructive h-6 w-6" />
          </div>

          <DialogTitle>
            Eliminar permanentemente a {user.name}?
          </DialogTitle>

          <DialogDescription>
            Esta acción es irreversible. Se eliminarán todos los datos
            asociados al usuario: pagos, rutinas, progreso y cuenta de acceso.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <SpinnerButton variant="sizes" />
            ) : (
              "Eliminar permanentemente"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
