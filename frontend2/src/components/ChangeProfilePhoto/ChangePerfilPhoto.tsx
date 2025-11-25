// src/components/ChangeProfilePhoto/ChangeProfilePhotoDialog.tsx
"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadProfile } from "./ChangePerfilPhoto"; // Asegúrate que esta ruta sea correcta
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; // Necesitas una función de utilidad para concatenar clases

interface ChangeProfilePhotoDialogProps {
  currentImageUrl: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeProfilePhotoDialog({
  currentImageUrl,
  open,
  onOpenChange,
}: ChangeProfilePhotoDialogProps) {

  // Función para cerrar el diálogo si la subida fue exitosa (puedes pasarla como prop a FileUploadProfile)
  // const handleUploadSuccess = () => {
  //   onOpenChange(false);
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Update Profile Photo
            <X className="w-5 h-5 cursor-pointer text-muted-foreground hover:text-foreground" onClick={() => onOpenChange(false)} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24 border-2">
            <AvatarImage 
              src={currentImageUrl || undefined} 
              alt="Current Profile Photo" 
            />
            <AvatarFallback>
              {/* Muestra las iniciales del usuario si no hay imagen (Opcional) */}
            </AvatarFallback>
          </Avatar>
          
          <div className="w-full">
            {/* Aquí integramos el componente de subida de archivos */}
            <FileUploadProfile 
            //  onUploadSuccess={handleUploadSuccess} // Si deseas cerrar el diálogo al éxito
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}