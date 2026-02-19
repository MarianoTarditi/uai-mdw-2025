"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { CreateRoutine } from "@/pages/routines/components/CreateRoutine";
import { useAppSelector } from "@/app/reduxHooks";
import { UserRole } from "@/features/users/userSlice";

export function RoutineButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const { profile } = useAppSelector((state) => state.user);
  const isTrainer = profile?.roles.includes(UserRole.Trainer);

  return (
    <>
      <Button
        disabled={!isTrainer}
        onClick={openModal}
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <Settings2 className="mr-2 h-4 w-4" />
        Crear
      </Button>

      <CreateRoutine
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={closeModal}
      />
    </>
  );
}
