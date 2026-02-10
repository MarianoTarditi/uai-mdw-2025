"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import { CreateRoutine } from "@/pages/routines/components/CreateRoutine";

export function RoutineButton() {
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
        Crear
      </Button>

      {/* Modal de creación */}
      <CreateRoutine
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onSubmit={closeModal}
      />
    </>
  );
}
