import { Request, Response } from "express";
import { Types } from "mongoose";
import admin from "../../utils/firebase";
import AuditLog from "../../models/AuditLog";
import Exercise from "../../models/Exercise";
import Payment from "../../models/Payment";
import Progress from "../../models/Progress";
import Routine from "../../models/Routine";
import User from "../../models/User";
import { UserRole } from "../../types";
import handleHttpError from "../../utils/handleError";
import { normalizeArgentinaPhone } from "../../utils/phoneAr";
import {
  buildLegacyPaymentBridge,
  createInitialPaidPaymentSource,
  enrichStudentsWithPaymentBridge,
  syncUserPaymentBridge,
} from "../../utils/paymentBridge";

const getRequestingUser = (req: Request) => (req as any).dbUser;
const DEFAULT_STUDENT_PASSWORD = "123456789";

const sanitizeUserResponse = (user: any) => {
  if (!user) {
    return null;
  }

  const plainUser =
    typeof user.toObject === "function" ? user.toObject() : { ...user };

  return plainUser;
};

const parseBirthDate = (value?: string | null) => {
  if (!value) {
    return null;
  }

  const [day, month, year] = String(value).split("/");
  if (!day || !month || !year) {
    return null;
  }

  const parsedDate = new Date(`${year}-${month}-${day}`);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const parseOptionalNumber = (value?: string | number | null) => {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? null : parsedValue;
};

const parseIsoDate = (value?: string | Date | null) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

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
      studentsForPayments,
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
      User.find(studentFilter).select("_id payment").lean(),
    ]);

    const studentsWithPendingPayments = (
      await enrichStudentsWithPaymentBridge(studentsForPayments)
    ).filter((student) => student.paymentStatus.status !== "al_dia").length;

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
    const logs = await AuditLog.find(
      isAdmin ? {} : { performedBy: requestingUser._id },
    )
      .populate("performedBy", "name lastName email")
      .populate("affectedUser", "name lastName email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({ data: logs });
  } catch (error) {
    handleHttpError(res, "Error fetching audit logs", 500, error);
  }
};

const createManagedUser = async (req: Request, res: Response) => {
  let firebaseUser: admin.auth.UserRecord | null = null;

  try {
    const requester = getRequestingUser(req);
    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const {
      name,
      lastName,
      email: rawEmail,
      phone,
      gender,
      birthDate,
      weight,
      height,
      paymentAmount,
      paymentBillingCycleDays,
      paymentStartDate,
      paymentDate,
    } = req.body;

    const email = String(rawEmail).trim().toLowerCase();
    const normalizedPhone = normalizeArgentinaPhone(phone);

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return handleHttpError(res, "Ya existe un usuario con ese email", 409);
    }

    firebaseUser = await admin.auth().createUser({
      email,
      password: DEFAULT_STUDENT_PASSWORD,
      displayName: `${name} ${lastName}`.trim(),
      disabled: false,
    });

    const createdUser = new User({
      name,
      lastName,
      email,
      phone: normalizedPhone,
      firebaseUid: firebaseUser.uid,
      roles: [UserRole.Student],
      gender: gender || null,
      birthDate: parseBirthDate(birthDate),
      weight: parseOptionalNumber(weight),
      height: parseOptionalNumber(height),
    });

    await createdUser.save();

    const initialPayment = createInitialPaidPaymentSource({
      studentId: createdUser._id,
      amount: parseOptionalNumber(paymentAmount),
      billingCycleDays: parseOptionalNumber(paymentBillingCycleDays),
      startDate: parseIsoDate(paymentStartDate),
      paymentDate: parseIsoDate(paymentDate),
    });

    const createdPayment = await Payment.create(initialPayment);
    await syncUserPaymentBridge(createdUser._id, createdPayment.toObject());
    createdUser.payment = buildLegacyPaymentBridge(createdPayment.toObject());

    return res.status(201).json({
      message: "Alumno creado correctamente con contraseÃ±a inicial 123456789",
      data: sanitizeUserResponse(createdUser),
    });
  } catch (error: any) {
    if (firebaseUser?.uid) {
      try {
        const persistedUser = await User.findOne({ firebaseUid: firebaseUser.uid });

        if (persistedUser) {
          await Payment.deleteMany({
            $or: [{ userId: persistedUser._id }, { studentId: persistedUser._id }],
          });
          await User.deleteOne({ _id: persistedUser._id });
        }
      } catch (cleanupDbError) {
        console.error("Database cleanup error:", cleanupDbError);
      }
    }

    if (firebaseUser?.uid) {
      try {
        await admin.auth().deleteUser(firebaseUser.uid);
      } catch (cleanupError) {
        console.error("Firebase cleanup error:", cleanupError);
      }
    }

    if (error?.code === "auth/email-already-exists") {
      return handleHttpError(res, "Ya existe un usuario con ese email", 409);
    }

    return handleHttpError(res, "Error creating managed user", 500, error);
  }
};

export default {
  getDashboardStats,
  getChartData,
  getAuditLogs,
  createManagedUser,
};
