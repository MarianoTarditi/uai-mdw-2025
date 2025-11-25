// src/components/ChangeProfilePhoto/ChangeProfilePhotoDialog.tsx
"use client";

import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileUploadProfile } from "./ChangePerfilPhoto"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils"; 

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
            </AvatarFallback>
          </Avatar>
          
          <div className="w-full">
           
            <FileUploadProfile 
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}