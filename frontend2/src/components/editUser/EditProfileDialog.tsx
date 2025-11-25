import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/zodValidations/editProfileSchema";
import type { IEditProfileData } from "@/types/auth";
import { useAppDispatch, useAppSelector } from "@/app/reduxHooks";
import { updateUserProfile } from "@/features/users/userSlice";
import { toast } from "sonner";
import { SpinnerButton } from "../spinner/Spinner";
import { reset } from "@/features/users/userSlice";
import { SelectGender } from "../shadcn-studio/select/SelectGender";
import { FileUploadProfile } from "../ChangeProfilePhoto/ChangePerfilPhoto";

export function EditProfileDialog({
  profile,
}: {
  profile: IEditProfileData | null;
}) {
  const dispatch = useAppDispatch();
  const { isError, message, isLoading, isSuccess } = useAppSelector(
    (state) => state.user
  );
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IEditProfileData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: profile?.name ?? "",
      lastName: profile?.lastName ?? "",
      birthDate: profile?.birthDate ?? null,
      gender: profile?.gender ?? null,
      height: profile?.height ?? null,
      weight: profile?.weight ?? null,
      profileImage: profile?.profileImage ?? "",
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error(message);
      dispatch(reset());
      return;
    }

    if (isSuccess) {
      toast.success("Profile updated successfully!");
      dispatch(reset());
      setOpen(false);
    }
  }, [isError, isSuccess, message, dispatch]);

  const handleFormSubmit = async (data: IEditProfileData) => {
    if (!profile?._id) return;

    await dispatch(updateUserProfile({ id: profile._id, userData: data }));
  };

  if (isLoading) {
    return <SpinnerButton variant="sizes" />;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="data-[state=open]:!zoom-in-100 data-[state=open]:slide-in-from-bottom-20 data-[state=open]:duration-600 sm:max-w-[425px] bg-background text-foreground">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogHeader className="mb-4">
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and save changes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="birthDate">Birth Date</Label>
              <Input type="text" id="birthDate" {...register("birthDate")} />
              {errors.birthDate && (
                <p className="text-sm text-red-500">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <SelectGender />

            <div className="grid gap-3">
              <Label htmlFor="height">Height (cm)</Label>
              <Input type="number" id="height" {...register("height")} />
              {errors.height && (
                <p className="text-sm text-red-500">{errors.height?.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input type="number" id="weight" {...register("weight")} />
              {errors.weight && (
                <p className="text-sm text-red-500">{errors.weight?.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="profileImage">Profile Image (URL)</Label>
              <Input id="profileImage" {...register("profileImage")} />
              {errors.profileImage && (
                <p className="text-sm text-red-500">
                  {errors.profileImage.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
