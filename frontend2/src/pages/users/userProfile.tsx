import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BadgeCheck,
  Mail,
  ShieldCheck,
  Calendar,
  Heart,
  Ruler,
  Scale,
  Phone,
  UserRound,
} from "lucide-react";
import { UpdateUser } from "./components/UpdateUser";
import { SpinnerButton } from "@/components/private/spinner/Spinner";
import { UserAvatar } from "@/components/private/userAvatar/UserAvatar";
import { fetchUserProfile } from "@/features/users/userSlice";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { PageHero } from "@/components/private/premium/PageHero";
import { MetricStrip } from "@/components/private/premium/MetricStrip";

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

  const completionFields = [
    profile.phone,
    profile.birthDate,
    profile.gender,
    profile.height,
    profile.weight,
  ];
  const completedCount = completionFields.filter(Boolean).length;
  const completionPercent = Math.round((completedCount / completionFields.length) * 100);

  const profileMetrics = [
    {
      label: "Estado de cuenta",
      value: profile.isActive ? "Activo" : "Inactivo",
      helper: "Disponibilidad operativa",
      icon: BadgeCheck,
      tone: profile.isActive ? ("positive" as const) : ("warning" as const),
    },
    {
      label: "Roles asignados",
      value: profile.roles.length,
      helper: profile.roles.join(" · "),
      icon: ShieldCheck,
      tone: "default" as const,
    },
    {
      label: "Perfil completo",
      value: `${completionPercent}%`,
      helper: `${completedCount}/${completionFields.length} campos de salud`,
      icon: UserRound,
      tone: "default" as const,
    },
  ];

  return (
    <div className="w-full space-y-4 p-2">
      <PageHero
        icon={UserRound}
        title="Perfil Profesional"
        description="Gestiona tu identidad, datos de salud y disponibilidad para mantener una presencia premium y consistente en toda la plataforma."
        badge={profile.email}
        chips={["Identidad", "Confianza", "Precision de Datos"]}
      />

      <MetricStrip items={profileMetrics} />

      <div className="flex justify-center">
        <Card className="premium-editor-panel max-w-lg w-full shadow-lg">
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

          {profile.isActive ? <Badge className="bg-green-500 text-white">Activo</Badge> : <Badge className="bg-red-500 text-white">Inactivo</Badge>}
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
              <Phone className="w-4 h-4 text-muted-foreground" />
              Teléfono
            </label>
            <p className="text-sm">{profile.phone || "Sin asignar"}</p>
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
                : "Sin asignar"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-muted-foreground" />
              Género
            </label>
            <p className="text-sm capitalize">
              {profile.gender ?? "Sin asignar"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              Altura
            </label>
            <p className="text-sm">
              {profile.height ? `${profile.height} cm` : "Sin asignar"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              Peso
            </label>
            <p className="text-sm">
              {profile.weight ? `${profile.weight} kg` : "Sin asignar"}
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
    </div>
  );
}
