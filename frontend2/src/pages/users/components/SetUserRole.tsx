"use client";

import { useState, useEffect } from "react";
import { UserCog } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
 
import { UserRole, setUserRole } from "@/features/users/userSlice";
import type { IUserProfile } from "@/features/users/userSlice";
import { useAppDispatch } from "@/app/reduxHooks";

interface SetUserRoleProps {
  user: IUserProfile;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const SetUserRole = ({ user, isOpen, setIsOpen }: SetUserRoleProps) => {
  const dispatch = useAppDispatch();

  const [selectedRole, setSelectedRole] = useState<UserRole>(
    (user.roles?.[0] as UserRole) || "student",
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.roles?.[0]) {
      setSelectedRole(user.roles[0] as UserRole);
    }
  }, [user]);

  const handleSaveRole = async () => {
    if (!user?._id) return;

    if (selectedRole === user.roles?.[0]) {
      setIsOpen(false);
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        setUserRole({
          userId: user._id,
          roles: [selectedRole],
        }),
      ).unwrap();

      toast.success(`Rol actualizado a ${selectedRole} correctamente`);
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error al cambiar rol:", error);

      toast.error(
        typeof error === "string"
          ? error
          : error?.message || "Error al actualizar el rol",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="items-center text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10">
            <UserCog className="h-6 w-6 text-blue-600" />
          </div>

          <DialogTitle>
            Cambiar rol de {user.name} {user.lastName}
          </DialogTitle>

          <DialogDescription>
            Selecciona el nivel de acceso para este usuario.
          </DialogDescription>
        </DialogHeader>

        {/* SELECT */}
        <div className="py-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Rol del usuario</label>

            <Select
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as UserRole)}
              disabled={loading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="student">Estudiante</SelectItem>
                <SelectItem value="trainer">Entrenador</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:justify-center">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button onClick={handleSaveRole} disabled={loading}>
            {loading ? <SpinnerButton variant="sizes" /> : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
