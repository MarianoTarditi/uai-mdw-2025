"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AddExercise } from "@/pages/exercises/components/CreateExercise";

export function ExerciseButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <Settings2 className="mr-2 h-4 w-4" />
        Crear
      </Button>

      <AddExercise
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={closeModal}
      />
    </>
  );
}
