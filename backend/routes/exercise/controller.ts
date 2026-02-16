import { Request, Response } from "express";
import Exercise from "../../models/Exercise";
import handleHttpError from "../../utils/handleError";

const parseArray = (value: any) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (e) {
      return [];
    }
  }
  return value;
};

const createExercise = async (req: Request, res: Response) => {
  try {
    const {
      nombre,
      comentario,
      etiquetas,
      musculosPrincipales,
      musculosSecundarios,
      materialesNecesarios,
      videoUrl,
      imageUrl,
    } = req.body;

    const existingExercise = await Exercise.findOne({ nombre });
    if (existingExercise) {
      return handleHttpError(res, "Exercise already exists", 409);
    }

    let finalVideoUrl = videoUrl || "";

    if (req.file) {
      finalVideoUrl = `/uploads/exerciseVideos/${req.file.filename}`;
    }

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
      .json({ message: "Exercise created successfully", data: exercise });
  } catch (error) {
    handleHttpError(res, "Error creating exercise", 500, error);
  }
};

const getAllExercises = async (req: Request, res: Response) => {
  try {
    const exercises = await Exercise.find();

    res.status(200).json({
      data: exercises,
    });
  } catch (error) {
    handleHttpError(res, "Error getting exercises", 500, error);
  }
};

const getExerciseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      handleHttpError(res, "Exercise not found", 404);
      return;
    }

    res.status(200).json({
      data: exercise,
    });
  } catch (error) {
    handleHttpError(res, "Error getting exercise", 500, error);
  }
};

const updateExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      comentario,
      etiquetas,
      musculosPrincipales,
      musculosSecundarios,
      materialesNecesarios,
      videoUrl,
    } = req.body;

    const currentExercise = await Exercise.findById(id);
    if (!currentExercise)
      return handleHttpError(res, "Exercise not found", 404);

    let finalVideoUrl = videoUrl;

    if (req.file) {
      finalVideoUrl = `/uploads/exerciseVideos/${req.file.filename}`;
    } else if (!videoUrl) {
      finalVideoUrl = currentExercise.videoUrl;
    }

    const updatedExercise = await Exercise.findByIdAndUpdate(
      id,
      {
        nombre,
        comentario,
        etiquetas,
        musculosPrincipales,
        musculosSecundarios,
        materialesNecesarios,
        videoUrl: finalVideoUrl,
      },
      { new: true },
    );

    res.status(200).json({ message: "Update success", data: updatedExercise });
  } catch (error) {
    handleHttpError(res, "Error updating", 500, error);
  }
};

const deleteExercise = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exercise = await Exercise.findByIdAndDelete(id);
    if (!exercise) {
      handleHttpError(res, "Exercise not found", 404);
      return;
    }

    res
      .status(200)
      .json({ message: "Exercise deleted successfully", data: exercise });
  } catch (error) {
    handleHttpError(res, "Error deleting Exercise", 500, error);
  }
};

export default {
  createExercise,
  getAllExercises,
  getExerciseById,
  updateExercise,
  deleteExercise,
};
