// features/routines/routineTypes.ts

export interface IExerciseAssignment {
  exerciseId: {
    _id: string;
    nombre: string;
    musculosPrincipales: string[];
    // Agrega aquí otras propiedades del ejercicio si las necesitas (videoUrl, etc)
  };
  _id: string; // 👈 NECESARIO

  sets: number;
  reps: number;
  restTime: number;
  notes?: string;
}

export interface IRoutine {
  _id: string;
  name: string;
  description?: string;
  trainerId: {
    _id: string;
    name: string;
    lastName: string;
    email: string;
  };
  exerciseAssignments: IExerciseAssignment[];
  isActive: boolean;
  isTemplate: boolean;
  createdAt: string;
  updatedAt: string;
}
