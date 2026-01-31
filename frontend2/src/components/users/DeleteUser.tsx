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
import { deleteUser } from "@/features/users/userSlice";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { useState } from "react";

interface DeleteUserProps {
  user: IUserProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DeleteUser({ user, isOpen, setIsOpen }: DeleteUserProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await dispatch(deleteUser(user._id)).unwrap();

      toast.success(
        user.isActive
          ? "Usuario desactivado correctamente"
          : "Usuario eliminado correctamente",
      );

      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Error al eliminar usuario");
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
            {user.isActive
              ? `¿Desactivar a ${user.name}?`
              : `¿Eliminar a ${user.name}?`}
          </DialogTitle>

          <DialogDescription>
            {user.isActive
              ? "El usuario perderá el acceso, pero sus datos se conservarán."
              : "Esta acción eliminará el usuario de forma permanente."}
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
            ) : user.isActive ? (
              "Desactivar"
            ) : (
              "Eliminar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
