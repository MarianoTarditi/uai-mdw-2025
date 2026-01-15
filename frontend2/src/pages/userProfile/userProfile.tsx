import { useAppSelector } from "@/app/reduxHooks";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, ShieldCheck, Calendar, Heart, Ruler, Scale } from "lucide-react";
import { EditProfileDialog } from "../../components/editUser/EditProfileDialog";
import { SpinnerButton } from "@/components/spinner/Spinner";
import { UserAvatar } from "@/components/userAvatar/UserAvatar";

export default function UserProfile() {
  const { profile, isLoading } = useAppSelector((state) => state.user);

  if (isLoading || !profile) {
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
            imagePath={
              profile.profileImage
                ? `${profile.profileImage}?t=${Date.now()}`
                : undefined
            }
            name={profile.name}
            lastName={profile.lastName}
            className="w-20 h-20"
          ></UserAvatar>

          <h2 className="text-xl font-semibold">
            {profile.name} {profile.lastName}
          </h2>

          <p className="text-sm text-muted-foreground">{profile.email}</p>

          {profile.isActive ? (
            <Badge className="bg-green-500 text-white">Active</Badge>
          ) : (
            <Badge className="bg-red-500 text-white">Inactive</Badge>
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
              Birth Date
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
              Gender
            </label>
            <p className="text-sm capitalize">
              {profile.gender ?? "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Ruler className="w-4 h-4 text-muted-foreground" />
              Height
            </label>
            <p className="text-sm">
              {profile.height ? `${profile.height} cm` : "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Scale className="w-4 h-4 text-muted-foreground" />
              Weight
            </label>
            <p className="text-sm">
              {profile.weight ? `${profile.weight} kg` : "Not provided"}
            </p>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Account Created
            </label>
            <p className="text-sm">
              {new Date(profile.createdAt).toLocaleDateString()}
            </p>
          </div>
          <EditProfileDialog profile={profile} />
        </CardContent>
      </Card>
    </div>
  );
}
