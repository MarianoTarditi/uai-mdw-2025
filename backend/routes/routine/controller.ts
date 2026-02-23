import { Request, Response } from "express";
import Routine from "../../models/Routine";
import handleHttpError from "../../utils/handleError";
import User from "../../models/User";
import { UserRole } from "../../types";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}

const createRoutine = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const trainer = await User.findOne({ email: authUser.email });

    if (!trainer) {
      return handleHttpError(res, "Trainer not found in database", 404);
    }

    const { name, description, exerciseAssignments, studentId } = req.body;

    if (!name || !exerciseAssignments?.length || !studentId) {
      return handleHttpError(res, "Invalid routine data", 400);
    }

    const student = await User.findOne({
      _id: studentId,
      roles: UserRole.Student,
      isActive: true,
    });

    if (!student) {
      return handleHttpError(res, "Invalid student", 400);
    }

    let routine = await Routine.create({
      name,
      description,
      trainerId: trainer._id,
      studentId: student._id,
      exerciseAssignments,
      isTemplate: false,
    });

    routine = await routine.populate([
      {
        path: "exerciseAssignments.exerciseId",
        select: "nombre musculosPrincipales imgUrl",
      },
      {
        path: "trainerId",
        select: "name lastName email",
      },
      {
        path: "studentId",
        select: "name lastName email profileImage",
      },
    ]);

    res.status(201).json({
      message: "Routine created successfully",
      data: routine,
    });
  } catch (error) {
    handleHttpError(res, "Error creating routine", 500, error);
  }
};

const getAllRoutines = async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).user;

    if (!firebaseUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const user = await User.findOne({ firebaseUid: firebaseUser.uid });

    if (!user) {
      return handleHttpError(res, "User not found in database", 404);
    }

    let filter = {};

    if (user.roles.includes(UserRole.Admin)) {
      filter = {};
    } else {
      filter = {
        $or: [{ trainerId: user._id }, { studentId: user._id }],
      };
    }

    const routines = await Routine.find(filter)
      .populate({
        path: "exerciseAssignments.exerciseId",
        select: "nombre musculosPrincipales imgUrl",
      })
      .populate({
        path: "trainerId",
        select: "name lastName email",
      })
      .populate({
        path: "studentId",
        select: "name lastName email profileImage",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ data: routines });
  } catch (error) {
    handleHttpError(res, "Error getting routines", 500, error);
  }
};

const getRoutineById = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const user = await User.findOne({ firebaseUid: authUser.uid });

    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    const { id } = req.params;

    let routineQuery: any = { _id: id };

    if (user.roles.includes(UserRole.Trainer)) {
      routineQuery.trainerId = user._id;
    }

    if (user.roles.includes(UserRole.Student)) {
      routineQuery.studentId = user._id;
    }

    const routine = await Routine.findOne(routineQuery)
      .populate("trainerId", "name lastName email")
      .populate({
        path: "exerciseAssignments.exerciseId",
        select:
          "nombre musculosPrincipales musculosSecundarios materialesNecesarios etiquetas comentario imgUrl",
      })
      .populate("studentId", "name lastName email profileImage");

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
    const authUser = (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const trainer = await User.findOne({ email: authUser.email });

    if (!trainer) {
      return handleHttpError(res, "Trainer not found", 404);
    }

    const { id } = req.params;
    const updateData = req.body;

    const updatedRoutine = await Routine.findOneAndUpdate(
      {
        _id: id,
        trainerId: trainer._id,
      },
      updateData,
      { new: true },
    )
      .populate({
        path: "exerciseAssignments.exerciseId",
        select: "nombre musculosPrincipales imgUrl",
      })
      .populate("studentId", "name lastName email profileImage");

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
    const authUser = (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const trainer = await User.findOne({ email: authUser.email });

    if (!trainer) {
      return handleHttpError(res, "Trainer not found", 404);
    }

    const { id } = req.params;

    const routine = await Routine.findOneAndDelete({
      _id: id,
      trainerId: trainer._id,
    });

    if (!routine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    res.status(200).json({
      message: "Routine deleted successfully",
    });
  } catch (error) {
    handleHttpError(res, "Error deleting routine", 500, error);
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const students = await User.find({
      roles: UserRole.Student,
      isActive: true,
    }).select("_id name lastName email profileImage");

    res.status(200).json({ data: students });
  } catch (error) {
    handleHttpError(res, "Error fetching students", 500, error);
  }
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
  getStudents,
};
