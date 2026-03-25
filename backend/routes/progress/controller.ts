import { Request, Response } from "express";
import Progress from "../../models/Progress";
import Routine from "../../models/Routine";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { UserRole } from "../../types";
import { Types } from "mongoose";

const getDbUserFromRequest = async (req: Request) => {
  const reqAny = req as any;

  if (reqAny.dbUser?._id) return reqAny.dbUser;
  if (reqAny.user?.uid) {
    return User.findOne({ firebaseUid: reqAny.user.uid });
  }

  return null;
};

const createProgressEntry = async (req: Request, res: Response) => {
  try {
    const requester = await getDbUserFromRequest(req);

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { studentId } = req.params;
    const { routineId, exerciseId, date, weightUsed, notes, completedSets, completedReps } =
      req.body;

    if (
      requester.roles.includes(UserRole.Student) &&
      String(requester._id) !== String(studentId)
    ) {
      return handleHttpError(res, "Students can only register their own progress", 403);
    }

    const routine = await Routine.findById(routineId).lean();
    if (!routine) {
      return handleHttpError(res, "Routine not found", 404);
    }

    if (String(routine.studentId) !== String(studentId)) {
      return handleHttpError(
        res,
        "The routine does not belong to the selected student",
        400,
      );
    }

    if (
      requester.roles.includes(UserRole.Trainer) &&
      String(routine.trainerId) !== String(requester._id)
    ) {
      return handleHttpError(
        res,
        "You can only register progress for your own students",
        403,
      );
    }

    const hasExercise = routine.exerciseAssignments.some(
      (assignment: any) => String(assignment.exerciseId) === String(exerciseId),
    );

    if (!hasExercise) {
      return handleHttpError(res, "Exercise not found in selected routine", 400);
    }

    const progress = await Progress.create({
      userId: studentId,
      routineId,
      exerciseId,
      date: date ? new Date(date) : new Date(),
      weightUsed: weightUsed ?? null,
      notes: notes ?? "",
      completedSets: completedSets ?? null,
      completedReps: completedReps ?? null,
    });

    const populated = await progress.populate([
      { path: "userId", select: "name lastName email" },
      { path: "routineId", select: "name" },
      { path: "exerciseId", select: "nombre musculosPrincipales" },
    ]);

    res.status(201).json({
      message: "Progress entry created successfully",
      data: populated,
    });
  } catch (error) {
    handleHttpError(res, "Error creating progress entry", 500, error);
  }
};

const getStudentProgress = async (req: Request, res: Response) => {
  try {
    const requester = await getDbUserFromRequest(req);

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { studentId } = req.params;

    if (
      requester.roles.includes(UserRole.Student) &&
      String(requester._id) !== String(studentId)
    ) {
      return handleHttpError(res, "Students can only view their own progress", 403);
    }

    if (requester.roles.includes(UserRole.Trainer)) {
      const hasAnyRoutine = await Routine.exists({
        trainerId: requester._id,
        studentId,
      });

      if (!hasAnyRoutine) {
        return handleHttpError(res, "Student is not assigned to this trainer", 403);
      }
    }

    const progressEntries = await Progress.find({ userId: studentId })
      .populate("routineId", "name")
      .populate("exerciseId", "nombre musculosPrincipales")
      .sort({ date: -1 })
      .lean();

    const totalEntries = progressEntries.length;
    const lastEntry = progressEntries[0] || null;

    const avgWeight = totalEntries
      ? progressEntries.reduce((acc, item) => acc + (item.weightUsed || 0), 0) /
        totalEntries
      : 0;

    const totalCompletedSets = progressEntries.reduce(
      (acc, item) => acc + (item.completedSets || 0),
      0,
    );
    const totalCompletedReps = progressEntries.reduce(
      (acc, item) => acc + (item.completedReps || 0),
      0,
    );

    res.status(200).json({
      data: progressEntries,
      summary: {
        totalEntries,
        lastEntryDate: lastEntry?.date ?? null,
        avgWeightUsed: Number(avgWeight.toFixed(2)),
        totalCompletedSets,
        totalCompletedReps,
      },
    });
  } catch (error) {
    handleHttpError(res, "Error getting student progress", 500, error);
  }
};

const getMyProgress = async (req: Request, res: Response) => {
  try {
    const requester = await getDbUserFromRequest(req);

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const progressEntries = await Progress.find({ userId: requester._id })
      .populate("routineId", "name")
      .populate("exerciseId", "nombre musculosPrincipales")
      .sort({ date: -1 })
      .lean();

    res.status(200).json({ data: progressEntries });
  } catch (error) {
    handleHttpError(res, "Error getting my progress", 500, error);
  }
};

const getStudentsProgressSummary = async (req: Request, res: Response) => {
  try {
    const requester = await getDbUserFromRequest(req);
    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const trainerFilter = requester.roles.includes(UserRole.Admin)
      ? {}
      : { trainerId: requester._id };

    const routines = await Routine.find(trainerFilter)
      .select("_id studentId")
      .lean();

    const studentIds = Array.from(
      new Set(routines.map((routine) => String(routine.studentId))),
    );

    if (studentIds.length === 0) {
      return res.status(200).json({ data: [] });
    }

    const [students, progressAgg] = await Promise.all([
      User.find({ _id: { $in: studentIds } })
        .select("_id name lastName email profileImage payment isActive")
        .lean(),
      Progress.aggregate([
        { $match: { userId: { $in: studentIds.map((id) => new Types.ObjectId(id)) } } },
        {
          $group: {
            _id: "$userId",
            totalEntries: { $sum: 1 },
            lastEntryDate: { $max: "$date" },
          },
        },
      ]),
    ]);

    const aggMap = new Map<string, { totalEntries: number; lastEntryDate: Date | null }>();
    progressAgg.forEach((item: any) => {
      aggMap.set(String(item._id), {
        totalEntries: item.totalEntries || 0,
        lastEntryDate: item.lastEntryDate || null,
      });
    });

    const data = students.map((student) => {
      const info = aggMap.get(String(student._id));

      return {
        ...student,
        progressSummary: {
          totalEntries: info?.totalEntries || 0,
          lastEntryDate: info?.lastEntryDate || null,
        },
      };
    });

    res.status(200).json({ data });
  } catch (error) {
    handleHttpError(res, "Error getting students progress summary", 500, error);
  }
};

export default {
  createProgressEntry,
  getStudentProgress,
  getMyProgress,
  getStudentsProgressSummary,
};
