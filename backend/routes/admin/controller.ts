import { Request, Response } from "express";
import User from "../../models/User";
import Routine from "../../models/Routine";
import Exercise from "../../models/Exercise";
import { UserRole } from "../../types";
import handleHttpError from "../../utils/handleError";
import AuditLog from "../../models/AuditLog";

const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [totalStudents, totalTrainers, totalRoutines, totalExercises] =
      await Promise.all([
        User.countDocuments({ roles: UserRole.Student }),
        User.countDocuments({ roles: UserRole.Trainer }),
        Routine.countDocuments(),
        Exercise ? Exercise.countDocuments() : 0,
      ]);

    res.status(200).json({
      data: {
        totalStudents,
        totalTrainers,
        totalRoutines,
        totalExercises,
      },
    });
  } catch (error) {
    handleHttpError(res, "Error fetching dashboard stats", 500, error);
  }
};

const getChartData = async (req: Request, res: Response) => {
  try {
    const { type } = req.query; 
    let Model: any;

    switch (type) {
      case "users":
        Model = User;
        break;
      case "routines":
        Model = Routine;
        break;
      case "exercises":
        Model = Exercise;
        break;
      default:
        Model = User;
    }

    const data = await Model.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } }, 
    ]);

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
    const logs = await AuditLog.find()
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
