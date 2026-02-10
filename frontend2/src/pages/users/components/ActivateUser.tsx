"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import type { IUserProfile } from "@/features/users/userSlice";
import { useAppDispatch } from "@/app/reduxHooks";
import { activateUser } from "@/features/users/userSlice";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { useState } from "react";

interface ActivateUserProps {
  user: IUserProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function ActivateUser({ user, isOpen, setIsOpen }: ActivateUserProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!user?._id) return;

    try {
      setLoading(true);
      await dispatch(activateUser(user._id)).unwrap();
      toast.success("Usuario activado correctamente");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Error al activar usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader className="items-center text-center">
          <div className="bg-green-500/10 mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <DialogTitle>¿Activar a {user.name}?</DialogTitle>

          <DialogDescription>
            El usuario recuperará el acceso al sistema.
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

          <Button onClick={handleActivate} disabled={loading}>
            {loading ? <SpinnerButton variant="sizes" /> : "Activar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
