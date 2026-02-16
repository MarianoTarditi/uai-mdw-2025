import { Musculo, Material, Etiqueta } from "@/pages/exercises/constants"; 

type IRegisterUserData = z.infer<typeof registerSchema>;

export type IEditProfileData = z.infer<typeof editProfileSchema>;

export interface ILoginUserData {
  email: string;
  password: string;
}

export type Musculo =
  | "Abdominales"
  | "Abductores"
  | "Aductores"
  | "Bíceps"
  | "Gemelos"
  | "Glúteos"
  | "Hombros"
  | "Pectorales"
  | "Antebrazos"
  | "Isquiotibiales"
  | "Dorsales"
  | "Lumbar"
  | "Redondos"
  | "Cuello"
  | "Cuadríceps"
  | "Tríceps"
  | "Trapecio"
  | "Oblicuos"
  | "Romboide"
  | "Soleo";

export type Material =
  | "None"
  | "Mancuernas"
  | "TRX"
  | "Kettlebell"
  | "Barra"
  | "Machine"
  | "Foam Roller"
  | "Rack"
  | "Banda Elastica"
  | "Maza"
  | "Balon Medicinal"
  | "Banco"
  | "Fitball"
  | "Saco Búlgaro"
  | "Cajón"
  | "Landime"
  | "Bosu"
  | "Multipower"
  | "Polea"
  | "Escalera de Coordinación"
  | "Valla"
  | "Aro"
  | "Stetps"
  | "Disco"
  | "Conos"
  | "Espaldera";

export type Etiqueta =
  | "Full Body"
  | "Cardio"
  | "Tren Superior"
  | "Tren Inferior"
  | "Core"
  | "Movilidad"
  | "Estiramiento"
  | "Roler";

export interface IExercise {
  _id?: string;
  nombre: string;
  comentario?: string;
  musculosPrincipales: Musculo[];
  musculosSecundarios: Musculo[];
  materialesNecesarios: Material[];
  etiquetas: Etiqueta[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface IExerciseState {
  exercises: IExercise[];
  exercise?: IExercise;
  isError: boolean;
  message: string;

  isFetchingSuccess: boolean;
  isCreatingSuccess: boolean;
  isUpdatingSuccess: boolean;
  isDeletingSuccess: boolean;
  isDetailLoading: boolean;

  isFetchingLoading: boolean;
  isCreatingLoading: boolean;
  isUpdatingLoading: boolean;
  isDeletingLoading: boolean;

  deletedRoutine: boolean; 
}
