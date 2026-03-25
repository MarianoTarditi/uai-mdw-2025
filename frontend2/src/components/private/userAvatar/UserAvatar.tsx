import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { resolveMediaUrl } from "@/utils/mediaUrl";

interface UserAvatarProps {
  imagePath: string | null | undefined;
  name: string;
  lastName: string;
  className?: string;
}

const DEFAULT_AVATAR = "/UserDefault.png";

export const UserAvatar: React.FC<UserAvatarProps> = ({
  imagePath,
  name,
  lastName,
  className,
}) => {
  const imageUrl = resolveMediaUrl(imagePath) ?? DEFAULT_AVATAR;
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
