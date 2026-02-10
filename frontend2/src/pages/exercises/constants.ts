export const MUSCULOS = [
  "Abdominales",
  "Abductores",
  "Aductores",
  "Bíceps",
  "Gemelos",
  "Glúteos",
  "Hombros",
  "Pectorales",
  "Antebrazos",
  "Isquiotibiales",
  "Dorsales",
  "Lumbar",
  "Redondos",
  "Cuello",
  "Cuadríceps",
  "Tríceps",
  "Trapecio",
  "Oblicuos",
  "Romboide",
  "Soleo",
] as const;

export type Musculo = (typeof MUSCULOS)[number];

export const MATERIALES = [
  "None",
  "Mancuernas",
  "TRX",
  "Kettlebell",
  "Barra",
  "Machine",
  "Foam Roller",
  "Rack",
  "Banda Elastica",
  "Balon Medicinal",
  "Banco",
  "Fitball",
] as const;

export type Material = (typeof MATERIALES)[number];

export const ETIQUETAS = [
  "Full Body",
  "Cardio",
  "Tren Superior",
  "Tren Inferior",
  "Core",
  "Movilidad",
  "Estiramiento",
  "Roler",
] as const;

export type Etiqueta = (typeof ETIQUETAS)[number];
