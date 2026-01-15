"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { AddExercise } from "@/components/exercises/CreateExercise";

export function ExerciseButton() {
  const [isOpen, setIsOpen] = React.useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <>
      {/* Botón para abrir el modal */}
      <Button
        onClick={openModal}
        variant="outline"
        size="sm"
        className="ml-auto hidden h-8 lg:flex"
      >
        <Settings2 className="mr-2 h-4 w-4" />
        Create
      </Button>

      {/* Modal de creación */}
      <AddExercise
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={closeModal}
      />
    </>
  );
}
