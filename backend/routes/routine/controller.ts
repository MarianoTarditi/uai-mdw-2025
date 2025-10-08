import { Request, Response } from "express";
import Routine from "../../models/Routine";
import handleHttpError from "../../utils/handleError";

const createRoutine = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, trainerId, studentIds, exerciseAssignment } = req.body;

    const existingRoutine = await Routine.findOne({ name });
    if (existingRoutine) {
      return handleHttpError(res, "Routine already exist", 409);
    }

    const routine = new Routine({
      name,
      description,
      startDate,
      endDate,
      trainerId,
      studentIds,
      exerciseAssignment
    });

    await routine.save();

    res.status(201).json({
      message: "Routine created successfully",
      data: routine
    });
  } catch (error) {
    handleHttpError(res, "Error creating routine", 500, error);
  }
};

const getAllRoutines = async (req: Request, res: Response) => {
  try {
    const routine = await Routine.find()
    .populate("trainerId", "name lastName email")
    .populate("studentIds", "name lastName email")
    .populate({ path: "exerciseAssignment", select: "sets reps restTime notes",
      populate: { path: "exerciseId", select: "name muscleGroup description" },
    });

    res.status(200).json({ data: routine });
  } catch (error) {
    console.log(error)

    handleHttpError(res, "Error getting routines", 500, error);
  }
};

const getRoutineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const routine = await Routine.findById(id)
    .populate("trainerId", "name lastName email")
    .populate("studentIds", "name lastName email")
    .populate({
        path: "exerciseAssignment",
        populate: { path: "exerciseId", select: "name muscleGroup description" },
    });

    console.log(routine)

    if (!routine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({ data: routine });
  } catch (error) {
    handleHttpError(res, "Error getting routine", 500, error);
  }
};

const updateRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, startDate, endDate, trainerId, studentIds, exerciseAssignment } = req.body;

    const findRoutine = await Routine.findByIdAndUpdate(
      id,
      { name, description, startDate, endDate, trainerId, studentIds, exerciseAssignment },
      { new: true }
    );

    if (!findRoutine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({ message: "Routine updated successfully", data: findRoutine});
  } catch (error) {
    handleHttpError(res, "Error updating routine", 500, error);
  }
};

const hardDeleteRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const routine = await Routine.findByIdAndDelete(id); // findByIdAndDelete ya devuelve null si no encuentra el usuario con ese id.
    if (!routine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({ message: "Routine deleted successfully", });
  } catch (error) {
    handleHttpError(res, "Error deleting routine", 500, error);
  }
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  hardDeleteRoutine,
};
