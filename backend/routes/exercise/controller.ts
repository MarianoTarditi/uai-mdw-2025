import { Request, Response } from "express";
import Exercise from "../../models/Exercise";
import handleHttpError from "../../utils/handleError";

const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

// Función auxiliar para parsear arrays que vienen como string en FormData
const parseArray = (value: any) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return []; // Si falla el parseo, devolvemos array vacío
    }
  }
  return value; // Si ya es array o undefined, lo devolvemos tal cual
};

const createExercise = async (req: Request, res: Response) => {
  try {
    // 1. Extraemos los datos del body (Multer ya los procesó)
    const {
      nombre,
      comentario,
      etiquetas,
      musculosPrincipales,
      musculosSecundarios,
      materialesNecesarios,
      videoUrl, // Este vendrá si el usuario eligió "Enlace"
      imageUrl,
    } = req.body;

    // 2. Validar si ya existe
    const existingExercise = await Exercise.findOne({ nombre });
    if (existingExercise) {
      return handleHttpError(res, "Exercise already exists", 409);
    }

    // 3. Lógica para definir la URL final del video
    let finalVideoUrl = videoUrl || ""; // Por defecto usamos el link si existe

    // Si Multer capturó un archivo, sobreescribimos videoUrl con la ruta del archivo
    if (req.file) {
      // Construimos una URL relativa para acceder al video
      // Ejemplo: /uploads/exerciseVideos/exercise-123456.mp4
      finalVideoUrl = `/uploads/exerciseVideos/${req.file.filename}`;
    }

    // 4. Crear el objeto Exercise
    // IMPORTANTE: Usamos parseArray para los campos que son listas
    const exercise = new Exercise({
      nombre,
      comentario,
      materialesNecesarios: parseArray(materialesNecesarios),
      musculosPrincipales: parseArray(musculosPrincipales),
      musculosSecundarios: parseArray(musculosSecundarios),
      etiquetas: parseArray(etiquetas),
      videoUrl: finalVideoUrl,
      imageUrl,
    });

    await exercise.save();

    res
      .status(201)
      .json({ message: "Exercise created successfully", exercise });
  } catch (error) {
    // Si hubo error y se subió un archivo, sería buena práctica borrarlo aquí para no dejar basura,
    // pero por ahora mantengamoslo simple.
    handleHttpError(res, "Error creating exercise", 500, error);
  }
};

const getAllExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.find(); // si existe un filtro, es decir, "isActive: true", lo aplicamos en la consulta find.

    res.status(200).json(exercises);
  } catch (error) {
    handleHttpError(res, "Error getting exercises", 500, error);
  }
};

const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id); // Solo usuarios activos
    if (!exercise) {
      handleHttpError(res, "Exercise not found", 404);
      return;
    }

    res.status(200).json({ exercise });
  } catch (error) {
    handleHttpError(res, "Error getting exercise", 500, error);
  }
};

// En exercise.controller.ts
const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Extraemos datos
    const {
      nombre,
      comentario,
      etiquetas,
      musculosPrincipales,
      musculosSecundarios,
      materialesNecesarios,
      videoUrl,
    } = req.body;

    // Buscamos el ejercicio actual
    const currentExercise = await Exercise.findById(id);
    if (!currentExercise)
      return handleHttpError(res, "Exercise not found", 404);

    // Lógica de VIDEO:
    let finalVideoUrl = videoUrl; // Si viene del input (link), usamos ese.

    if (req.file) {
      // SI SUBIERON ARCHIVO NUEVO: Usamos la ruta nueva
      finalVideoUrl = `/uploads/exerciseVideos/${req.file.filename}`;
    } else if (!videoUrl) {
      // Si no enviaron link nuevo y no hay archivo nuevo, ¿Mantenemos el viejo?
      // Generalmente el frontend envía el link viejo en el input 'videoUrl', asi que esto debería estar cubierto.
      finalVideoUrl = currentExercise.videoUrl;
    }

    // Actualizamos
    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      {
        nombre,
        comentario,
        etiquetas, // Ya vienen parseados por el middleware
        musculosPrincipales,
        musculosSecundarios,
        materialesNecesarios,
        videoUrl: finalVideoUrl,
      },
      { new: true },
    );

    res.status(200).json({ message: "Update success", updatedExercise });
  } catch (error) {
    handleHttpError(res, "Error updating", 500, error);
  }
};

const hardDeleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndDelete(id); // findByIdAndDelete ya devuelve null si no encuentra el usuario con ese id.
    if (!exercise) {
      handleHttpError(res, "Exercise not found", 404);
      return;
    }

    res.status(200).json({ message: "Exercise deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting Exercise", 500, error);
  }
};

export default {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  hardDeleteExercise,
};
