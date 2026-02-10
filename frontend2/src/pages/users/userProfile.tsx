import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ShieldCheck, Calendar, Heart, Ruler, Scale } from "lucide-react";
import { UpdateUser } from "./components/UpdateUser";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { UserAvatar } from "@/components/private/userAvatar/UserAvatar";
import { fetchUserProfile } from "@/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";

export default function UserProfile() {
  const dispatch = useAppDispatch();
  const { profile, isFetchingLoading } = useAppSelector((state) => state.user);
  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  if (isFetchingLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <SpinnerButton variant="sizes" />
      </div>
    );
  }

  return (
    <div className="flex justify-center p-8">
      <Card className="max-w-lg w-full shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4">
          <UserAvatar
            imagePath={profile.profileImage}
            name={profile.name}
            lastName={profile.lastName}
            className="w-20 h-20"
          />

          <h2 className="text-xl font-semibold">
            {profile.name} {profile.lastName}
          </h2>

          <p className="text-sm text-muted-foreground">{profile.email}</p>

          {profile.isActive ? (
            <Badge className="bg-green-500 text-white">Activo</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Inactivo</Badge>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Mail className="w-4 h-4 text-muted-foreground" />
              Email
            </label>
            <p className="text-sm">{profile.email}</p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-muted-foreground" />
              Roles
            </label>
            <div className="flex gap-2 flex-wrap">
              {profile.roles.map((role) => (
                <Badge key={role} variant="secondary">
                  {role}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Fecha de nacimiento
            </label>
            <p className="text-sm">
              {profile.birthDate
                ? new Date(profile.birthDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                : "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              Género
            </label>
            <p className="text-sm capitalize">
              {profile.gender ?? "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              Altura
            </label>
            <p className="text-sm">
              {profile.height ? `${profile.height} cm` : "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              Peso
            </label>
            <p className="text-sm">
              {profile.weight ? `${profile.weight} kg` : "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Fecha de creación
            </label>
            <p className="text-sm">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
        <div className="pt-4 flex justify-center">
          <Button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2"
          >
            <Pencil className="w-4 h-4" />
            Editar perfil
          </Button>
        </div>

        <UpdateUser
          isOpen={isEditOpen}
          setIsOpen={setIsEditOpen}
          user={profile}
        />
      </Card>
    </div>
  );
}
