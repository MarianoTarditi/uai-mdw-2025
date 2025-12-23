import { Request, Response } from "express";
import Exercise from "../../models/Exercise";
import handleHttpError from "../../utils/handleError";
import { data } from "react-router-dom";

const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

const createExercise = async (req: Request, res: Response) => {
  try {
    const { name, description, muscleGroup, videoUrl, imageUrl } = req.body;

    const existingExercise = await Exercise.findOne({ name: name });
    if (existingExercise) {
      return handleHttpError(res, "Exercise already exist", 409);
    }

    const exercise = new Exercise({
      name,
      description,
      muscleGroup,
      videoUrl,
      imageUrl,
    });

    await exercise.save();

    res.status(201).json({ message: "Exercise created successfully", exercise });
  } catch (error) {
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
    console.log("Fetched exercise:", exercise);
    if (!exercise) {
      handleHttpError(res, "Exercise not found", 404);
      return;
    }

    res.status(200).json({ exercise });
  } catch (error) {
    handleHttpError(res, "Error getting exercise", 500, error);
  }
};

const updateExercise = async (req: Request, res: Response) => {
  try {

    const { id } = req.params;
    const { name, description, muscleGroup, videoUrl, imageUrl } = req.body;

    const findExercise = await Exercise.findByIdAndUpdate(
      id,
      { name, description, muscleGroup, videoUrl, imageUrl },
      { new: true }
    );

    if (!findExercise) {
      return handleHttpError(res, "Exercise not found", 404);
    }

    res.status(200).json({ message: "Exercise updated successfully", findExercise });
  } catch (error) {
    handleHttpError(res, "Error updating exercise", 500, error);
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
