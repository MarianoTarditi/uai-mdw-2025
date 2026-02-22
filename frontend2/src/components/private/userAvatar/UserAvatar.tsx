import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  imagePath: string | null | undefined;
  name: string;
  lastName: string;
  className?: string;
}

const STATIC_BASE_URL = import.meta.env.VITE_STATIC_URL;
const DEFAULT_AVATAR = "/UserDefault.png";

const getImageUrl = (imagePath?: string | null): string => {
  if (!imagePath) return DEFAULT_AVATAR;
  return `${STATIC_BASE_URL}${imagePath}?t=${Date.now()}`;
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imagePath,
  name,
  lastName,
  className,
}) => {
  const imageUrl = getImageUrl(imagePath);
  const fallbackText = `${name?.[0] ?? "?"}${lastName?.[0] ?? "?"}`;
  const altText = `${name} ${lastName} profile`;

  return (
    <Avatar className={className}>
      <img
        src={imageUrl}
        alt={altText}
        className="rounded-full w-full h-full object-cover"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_AVATAR;
        }}
      />

      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
};
