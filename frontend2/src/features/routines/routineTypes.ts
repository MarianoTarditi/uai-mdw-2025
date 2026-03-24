
export interface IExerciseAssignment {
  exerciseId: {
    _id: string;
    nombre: string;
    musculosPrincipales: string[];
  };
  _id: string; 

  sets: number;
  reps: number;
  restTime: number;
  notes?: string;
}

export interface IRoutineExerciseAssignmentPayload {
  exerciseId: string;
  sets: number;
  reps: number;
  restTime: number;
  notes?: string;
}

export interface IRoutinePayload {
  name: string;
  description?: string;
  studentId: string;
  exerciseAssignments: IRoutineExerciseAssignmentPayload[];
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
    studentId: {
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
