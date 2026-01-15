import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  imagePath: string | null | undefined;
  name: string;
  lastName: string;
  className?: string; // Para pasar clases de Tailwind/shadcn/ui
}

const STATIC_BASE_URL = "http://localhost:3000";

const getImageUrl = (imagePath: string): string | null => {
  if (!imagePath) return null;

  return `${STATIC_BASE_URL}${imagePath}?t=${Date.now()}`;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imagePath,
  name,
  lastName,
  className,
}) => {
  const finalImageUrl = imagePath ? getImageUrl(imagePath) : null;
  const fallbackText = `${name[0] || "?"}${lastName[0] || "?"}`;
  const altText = `${name} ${lastName} profile`;

  return (
    <Avatar className={className}>
      {finalImageUrl ? (
        <img
          src={finalImageUrl}
          alt={altText}
          className="rounded-full w-full h-full object-cover"
        />
      ) : (
        <AvatarFallback>{fallbackText}</AvatarFallback>
      )}
    </Avatar>
  );
};
