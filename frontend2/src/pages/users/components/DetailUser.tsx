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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import type { IUserProfile } from "@/features/users/userSlice";
import { useAppSelector, useAppDispatch } from "@/app/reduxHooks";
import { useEffect } from "react";
import { toast } from "sonner";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import {
  reset,
  getUserById,
  clearSelectedUser,
} from "@/features/users/userSlice";

interface DetailUserProps {
  user: IUserProfile | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function DetailUser({ user, isOpen, setIsOpen }: DetailUserProps) {
  const dispatch = useAppDispatch();

  const {
    isError,
    message,
    isDetailLoading,
    selectedUser: detailedUser,
  } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (isOpen && user?._id) {
      dispatch(getUserById(user._id));
    }
  }, [isOpen, user?._id, dispatch]);

  useEffect(() => {
    if (isError && isOpen) {
      toast.error(message || "Error cargando perfil de usuario");
    }
  }, [isError, message, isOpen]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      dispatch(reset());
      dispatch(clearSelectedUser());
    }
  };

  const formatDate = (date?: string | Date | null) => {
    if (!date) return "No especificada";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "No especificada";

    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const renderRoles = (roles: string[]) => {
    if (!roles || roles.length === 0)
      return <span className="text-muted-foreground text-sm">Sin roles</span>;

    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, idx) => (
          <Badge key={idx} variant="secondary">
            {role}
          </Badge>
        ))}
      </div>
    );
  };

  const API_URL = import.meta.env.VITE_STATIC_URL;

  const imageUrl = detailedUser?.profileImage
    ? detailedUser.profileImage.startsWith("http")
      ? detailedUser.profileImage
      : `${API_URL}${detailedUser.profileImage}`
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background text-foreground p-6">
        <DialogHeader>
          <DialogTitle>Perfil de Usuario</DialogTitle>
          <DialogDescription>
            Detalles completos e información personal.
          </DialogDescription>
        </DialogHeader>

        {isDetailLoading ? (
          <div className="flex flex-col justify-center items-center py-10 gap-2">
            <SpinnerButton variant="sizes" />
            <p className="text-sm text-muted-foreground">
              Cargando información...
            </p>
          </div>
        ) : (
          <div className="grid gap-6 py-2">
            {/* SECCIÓN SUPERIOR */}
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div className="flex-shrink-0 flex flex-col items-center">
                <Avatar className="w-24 h-24 border-2 border-muted">
                  <AvatarImage
                    src={imageUrl}
                    alt={detailedUser?.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl font-bold">
                    {detailedUser?.name?.charAt(0).toUpperCase()}
                    {detailedUser?.lastName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-2 text-center">
                  <Badge
                    variant={detailedUser?.isActive ? "default" : "destructive"}
                  >
                    {detailedUser?.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              <div className="flex-grow w-full grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-1.5">
                    <Label>Nombre</Label>
                    {/* CAMBIO 1: disabled y clases para mejorar contraste */}
                    <Input
                      disabled
                      value={detailedUser?.name || ""}
                      className="disabled:opacity-100 disabled:cursor-default bg-muted/50"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Apellido</Label>
                    {/* CAMBIO 2: disabled */}
                    <Input
                      disabled
                      value={detailedUser?.lastName || ""}
                      className="disabled:opacity-100 disabled:cursor-default bg-muted/50"
                    />
                  </div>
                </div>

                <div className="grid gap-1.5">
                  <Label>Email</Label>
                  {/* CAMBIO 3: disabled */}
                  <Input
                    disabled
                    value={detailedUser?.email || ""}
                    className="disabled:opacity-100 disabled:cursor-default bg-muted/50"
                  />
                </div>

                <div className="grid gap-1.5">
                  <Label>Roles</Label>
                  <div className="p-2 border rounded-md bg-muted/20 min-h-[40px] flex items-center">
                    {renderRoles(detailedUser?.roles || [])}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* SECCIÓN DATOS FÍSICOS (Ya estaban "bloqueados" porque son Divs) */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-muted-foreground">
                Información Personal & Física
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Género</Label>
                  <div className="p-2 border rounded-md bg-muted/10 text-sm capitalize">
                    {detailedUser?.gender || "N/A"}
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Fecha Nac.</Label>
                  <div
                    className="p-2 border rounded-md bg-muted/10 text-sm truncate"
                    title={formatDate(detailedUser?.birthDate)}
                  >
                    {formatDate(detailedUser?.birthDate)}
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Altura (cm)</Label>
                  <div className="p-2 border rounded-md bg-muted/10 text-sm">
                    {detailedUser?.height ? `${detailedUser.height} cm` : "N/A"}
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Peso (kg)</Label>
                  <div className="p-2 border rounded-md bg-muted/10 text-sm">
                    {detailedUser?.weight ? `${detailedUser.weight} kg` : "N/A"}
                  </div>
                </div>
              </div>
            </div>

            {/* INFO DE SISTEMA */}
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mt-2 bg-muted/20 p-2 rounded">
              <p>
                <strong>ID:</strong>{" "}
                <span className="font-mono">{detailedUser?._id}</span>
              </p>
              <p>
                <strong>Creado:</strong> {formatDate(detailedUser?.createdAt)}
              </p>
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
