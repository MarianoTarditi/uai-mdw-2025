import { Request, Response } from "express";
import User from "../../models/User";
import Routine from "../../models/Routine";
import Exercise from "../../models/Exercise";
import { UserRole } from "../../types";
import handleHttpError from "../../utils/handleError";
import AuditLog from "../../models/AuditLog";
import Progress from "../../models/Progress";
import { Types } from "mongoose";

const getRequestingUser = (req: Request) => (req as any).dbUser;

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const requestingUser = getRequestingUser(req);

    if (!requestingUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const isAdmin = requestingUser.roles?.includes(UserRole.Admin);

    let scopedStudentIds: Types.ObjectId[] = [];

    if (!isAdmin) {
      const trainerRoutines = await Routine.find({
        trainerId: requestingUser._id,
      })
        .select("studentId")
        .lean();

      scopedStudentIds = Array.from(
        new Set(trainerRoutines.map((item) => String(item.studentId))),
      ).map((id) => new Types.ObjectId(id));
    }

    const now = new Date();
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const studentFilter = isAdmin
      ? { roles: UserRole.Student }
      : { _id: { $in: scopedStudentIds }, roles: UserRole.Student };

    const routineFilter = isAdmin ? {} : { trainerId: requestingUser._id };
    const progressFilter = isAdmin
      ? {}
      : { userId: { $in: scopedStudentIds } };

    const [
      totalStudents,
      activeStudents,
      totalTrainers,
      totalRoutines,
      totalExercises,
      progressEntriesThisMonth,
      studentsWithPendingPayments,
    ] = await Promise.all([
      User.countDocuments(studentFilter),
      User.countDocuments({ ...studentFilter, isActive: true }),
      isAdmin ? User.countDocuments({ roles: UserRole.Trainer }) : 1,
      Routine.countDocuments(routineFilter),
      Exercise ? Exercise.countDocuments() : 0,
      Progress.countDocuments({
        ...progressFilter,
        date: { $gte: currentMonthStart, $lt: nextMonthStart },
      }),
      User.countDocuments({
        ...studentFilter,
        $or: [{ "payment.isPaid": false }, { payment: { $exists: false } }],
      }),
    ]);

    res.status(200).json({
      data: {
        totalStudents,
        activeStudents,
        totalTrainers,
        totalRoutines,
        totalExercises,
        progressEntriesThisMonth,
        studentsWithPendingPayments,
      },
    });
  } catch (error) {
    handleHttpError(res, "Error fetching dashboard stats", 500, error);
  }
};

const getChartData = async (req: Request, res: Response) => {
  try {
    const requestingUser = getRequestingUser(req);

    if (!requestingUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const isAdmin = requestingUser.roles?.includes(UserRole.Admin);
    const { type } = req.query; 
    let Model: any;
    let matchStage: any = {};

    switch (type) {
      case "users":
        Model = User;
        if (!isAdmin) {
          const routines = await Routine.find({ trainerId: requestingUser._id })
            .select("studentId")
            .lean();

          const studentIds = Array.from(
            new Set(routines.map((item) => String(item.studentId))),
          ).map((id) => new Types.ObjectId(id));

          matchStage = { _id: { $in: studentIds } };
        }
        break;
      case "routines":
        Model = Routine;
        if (!isAdmin) {
          matchStage = { trainerId: requestingUser._id };
        }
        break;
      case "exercises":
        Model = Exercise;
        break;
      case "progress":
        Model = Progress;
        if (!isAdmin) {
          const routines = await Routine.find({ trainerId: requestingUser._id })
            .select("studentId")
            .lean();

          const studentIds = Array.from(
            new Set(routines.map((item) => String(item.studentId))),
          ).map((id) => new Types.ObjectId(id));

          matchStage = { userId: { $in: studentIds } };
        }
        break;
      default:
        Model = User;
    }

    const dateField = type === "progress" ? "$date" : "$createdAt";

    const pipeline: any[] = [];

    if (Object.keys(matchStage).length > 0) {
      pipeline.push({ $match: matchStage });
    }

    pipeline.push(
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: dateField } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, 
    );

    const data = await Model.aggregate(pipeline);

    const formattedData = data.map((item: any) => ({
      date: item._id,
      count: item.count,
    }));

    res.status(200).json({ data: formattedData });
  } catch (error) {
    handleHttpError(res, "Error fetching chart data", 500, error);
  }
};

export const getAuditLogs = async (req: Request, res: Response) => {
  try {
    const requestingUser = getRequestingUser(req);

    if (!requestingUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const isAdmin = requestingUser.roles?.includes(UserRole.Admin);
    const logs = await AuditLog.find(isAdmin ? {} : { performedBy: requestingUser._id })
      .populate("performedBy", "name lastName email")
      .populate("affectedUser", "name lastName email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ data: logs });
  } catch (error) {
    handleHttpError(res, "Error fetching audit logs", 500, error);
  }
};

export default { getDashboardStats, getChartData, getAuditLogs };
