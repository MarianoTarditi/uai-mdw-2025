"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AddExercise } from "@/pages/exercises/components/CreateExercise";
import { useAppSelector } from "@/app/reduxHooks";
import { UserRole } from "@/features/users/userSlice";

export function ExerciseButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { profile } = useAppSelector((state) => state.user);
  const canCreate =
    profile?.roles.includes(UserRole.Trainer) ||
    profile?.roles.includes(UserRole.Admin);

  return (
    <>
      <Button
        disabled={!canCreate}
        onClick={openModal}
        variant="default"
        size="sm"
        className="ml-auto hidden h-9 rounded-full px-4 lg:flex"
      >
        <Settings2 className="mr-2 h-4 w-4" />
        Nuevo ejercicio
      </Button>

      <AddExercise
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={closeModal}
      />
    </>
  );
}
