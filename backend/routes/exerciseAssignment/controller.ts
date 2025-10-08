import { Request, Response } from "express";
import ExerciseAssignment from "../../models/ExerciseAssignment";
import handleHttpError from "../../utils/handleError";

const createExerciseAssignment = async (req: Request, res: Response) => {
  try {
    const { sets, reps, exerciseId, restTime, notes } = req.body;

    const exerciseAssignment = new ExerciseAssignment({
      sets,
      reps,
      exerciseId,
      restTime,
      notes,
    });

    await exerciseAssignment.save();

    res.status(201).json({
      message: "Exercise assignment created successfully",
      data: exerciseAssignment,
    });
  } catch (error) {
    handleHttpError(res, "Error creating exercise assignment", 500, error);
  }
};

const getAllExerciseAssignment = async (req: Request, res: Response) => {
  try {
    const exerciseAssignment = await ExerciseAssignment.find().populate( "exerciseId" );

    res.status(200).json({ data: exerciseAssignment });
  } catch (error) {
    handleHttpError(res, "Error getting exercise assignments", 500, error);
  }
};

const getExerciseAssignmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exerciseAssignment = await ExerciseAssignment.findById(id).populate(
      "exerciseId"
    );

    if (!exerciseAssignment) {
      return handleHttpError(res, "Exercise assignment not found", 404);
    }

    res.status(200).json({ data: exerciseAssignment });
  } catch (error) {
    handleHttpError(res, "Error getting exercise assignments", 500, error);
  }
};

const updateExerciseAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { sets, reps, exerciseId, restTime, notes } = req.body;

    const exerciseAssignment = await ExerciseAssignment.findByIdAndUpdate(
      id,
      { sets, reps, exerciseId, restTime, notes },
      { new: true }
    );

    if (!exerciseAssignment) {
      return handleHttpError(res, "Exercise assignment not found", 404);
    }

    res
      .status(200)
      .json({
        message: "Exercise assignment updated successfully",
        data: exerciseAssignment,
      });
  } catch (error) {
    handleHttpError(res, "Error updating exercise assignment", 500, error);
  }
};

const hardDeleteExerciseAssignment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const exerciseAssignment = await ExerciseAssignment.findByIdAndDelete(id); // findByIdAndDelete ya devuelve null si no encuentra el usuario con ese id.
    if (!exerciseAssignment) {
      return handleHttpError(res, "Exercise assignment not found", 404);
    }

    res
      .status(200)
      .json({ message: "Exercise assignment deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting exercise assignment", 500, error);
  }
};

export default {
  createExerciseAssignment,
  getAllExerciseAssignment,
  getExerciseAssignmentById,
  updateExerciseAssignment,
  hardDeleteExerciseAssignment,
};
