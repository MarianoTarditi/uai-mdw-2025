import { Request, Response } from "express";
import Routine from "../../models/Routine";
import handleHttpError from "../../utils/handleError";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}

const createRoutine = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { name, description, exerciseAssignments } = req.body;
    const trainerId = req.user.uid;

    if (!name || !exerciseAssignments?.length) {
      return handleHttpError(res, "Invalid routine data", 400);
    }

    let routine = await Routine.create({
      name,
      description,
      trainerId,
      exerciseAssignments,
    });

    routine = await routine.populate({
      path: "exerciseAssignments.exerciseId",
      select: "nombre musculosPrincipales imgUrl",
    });

    res.status(201).json({
      message: "Routine created successfully",
      data: routine,
    });
  } catch (error) {
    console.error("CREATE ROUTINE ERROR:", error);
    handleHttpError(res, "Error creating routine", 500, error);
  }
};

const getAllRoutines = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const routines = await Routine.find({ trainerId: req.user.uid }).populate({
      path: "exerciseAssignments.exerciseId",
      select: "nombre musculosPrincipales",
    });

    res.status(200).json({ data: routines });
  } catch (error) {
    handleHttpError(res, "Error getting routines", 500, error);
  }
};

const getRoutineById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const routine = await Routine.findById(id)
      .populate("trainerId", "name lastName email")
      .populate({
        path: "exerciseAssignments.exerciseId",
        select: "nombre musculosPrincipales imgUrl",
      });

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
    const updateData = req.body;

    const updatedRoutine = await Routine.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate({
      path: "exerciseAssignments.exerciseId",
      select: "nombre musculosPrincipales imgUrl",
    });

    if (!updatedRoutine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({
      message: "Routine updated successfully",
      data: updatedRoutine,
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    handleHttpError(res, "Error updating routine", 500, error);
  }
};

const deleteRoutine = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const routine = await Routine.findByIdAndDelete(id);

    if (!routine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({ message: "Routine deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting routine", 500, error);
  }
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
};
