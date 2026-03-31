import { Request, Response } from "express";
import Routine from "../../models/Routine";
import User from "../../models/User";
import { UserRole } from "../../types";
import handleHttpError from "../../utils/handleError";
import {
  enrichStudentsWithPaymentBridge,
  getLatestPaymentForStudent,
  normalizePaymentSource,
  resolveStudentPaymentSource,
  saveStudentPaymentSource,
  syncUserPaymentBridge,
} from "../../utils/paymentBridge";

const sanitizeUser = (user: any) => {
  if (!user) return null;

  return {
    id: user._id || user.uid,
    name: user.name,
    email: user.email,
    roles: user.roles,
  };
};

const sanitizeSensitiveUserData = (user: any) => {
  if (!user) return null;

  const plainUser =
    typeof user?.toObject === "function" ? user.toObject() : { ...user };

  delete plainUser.auth;

  return plainUser;
};

const getAuthorizedStudent = async (
  requester: any,
  studentId: string,
  forbiddenMessage: string,
  notStudentMessage: string,
) => {
  const student = await User.findById(studentId);
  if (!student) {
    return { error: { message: "User not found", code: 404 } };
  }

  const isAdmin = requester.roles.includes(UserRole.Admin);

  if (!isAdmin) {
    const trainerStudentRelation = await Routine.exists({
      trainerId: requester._id,
      studentId: student._id,
    });

    if (!trainerStudentRelation) {
      return {
        error: {
          message: forbiddenMessage,
          code: 403,
        },
      };
    }
  }

  if (!student.roles?.includes(UserRole.Student)) {
    return {
      error: {
        message: notStudentMessage,
        code: 400,
      },
    };
  }

  return { student };
};

const hydrateSingleStudentPayment = async (student: any) => {
  const [enrichedStudent] = await enrichStudentsWithPaymentBridge([
    sanitizeSensitiveUserData(student),
  ]);

  return enrichedStudent ?? null;
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    const filter: any = {};

    if (isActive !== undefined) {
      if (isActive === "true") filter.isActive = true;
      if (isActive === "false") filter.isActive = false;
    }

    const users = await User.find(filter).sort({ createdAt: -1 });
    const requestingUser = sanitizeUser(req.user);

    res.status(200).json({
      userRequesting: requestingUser,
      data: users.map(sanitizeSensitiveUserData),
    });
  } catch (error) {
    handleHttpError(res, "Error getting users", 500, error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;

    const user = await User.findById(id).lean();
    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    res.status(200).json({
      userRequesting: sanitizeUser(req.user),
      data: sanitizeSensitiveUserData(user),
    });
  } catch (error) {
    handleHttpError(res, "Error getting user", 500, error);
  }
};

const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.uid) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const user = await User.findOne({ firebaseUid: req.user.uid }).lean();

    if (!user) {
      return handleHttpError(res, "Profile not found", 404);
    }

    res.status(200).json({
      data: sanitizeSensitiveUserData(user),
    });
  } catch (error) {
    console.error("getProfile error:", error);
    handleHttpError(res, "Error loading profile", 500, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const { name, lastName, phone, height, weight, birthDate, gender, existingProfileImage } =
      req.body;

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return handleHttpError(res, "User not found", 404);
    }

    let finalProfileImage = existingProfileImage || currentUser.profileImage;

    if (req.file) {
      finalProfileImage = `/uploads/profileImages/${req.file.filename}`;
    }
    const updateData: Record<string, unknown> = {
      name,
      lastName,
      profileImage: finalProfileImage,
    };

    if (phone !== undefined) {
      updateData.phone = phone === "" ? null : phone;
    }

    if (height !== undefined) {
      updateData.height =
        height === null || height === "" || height === "null"
          ? null
          : Number(height);
    }

    if (weight !== undefined) {
      updateData.weight =
        weight === null || weight === "" || weight === "null"
          ? null
          : Number(weight);
    }

    if (birthDate !== undefined) {
      updateData.birthDate =
        birthDate === null || birthDate === "" ? null : new Date(birthDate);
    }

    if (gender !== undefined) {
      updateData.gender = gender === "" ? null : gender;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      message: "User updated successfully",
      data: sanitizeSensitiveUserData(updatedUser),
    });
  } catch (error) {
    handleHttpError(res, "Error updating user", 500, error);
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    res.status(200).json({
      userRequesting: sanitizeUser(req.user),
      message: "User deactivated successfully",
      data: sanitizeSensitiveUserData(user),
    });
  } catch (error) {
    handleHttpError(res, "Error soft-deleting user", 500, error);
  }
};

const activateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    if (user.isActive) {
      return handleHttpError(res, "User is already active", 400);
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      userRequesting: sanitizeUser(req.user),
      message: "User activated successfully",
      data: sanitizeSensitiveUserData(user),
    });
  } catch (error) {
    handleHttpError(res, "Error activating user", 500, error);
  }
};

const setUserRole = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const { roles } = req.body;

    if (!Array.isArray(roles)) {
      return handleHttpError(res, "Roles must be an array", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles },
      { new: true },
    );

    if (!updatedUser) {
      return handleHttpError(res, "User not found", 404);
    }

    res.status(200).json({
      message: "Roles updated successfully",
      data: sanitizeSensitiveUserData(updatedUser),
    });
  } catch (error) {
    handleHttpError(res, "Error updating user roles", 500, error);
  }
};

const getStudentsPayments = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);

    const studentFilter: any = { roles: { $in: [UserRole.Student] } };

    if (!isAdmin) {
      const routines = await Routine.find({ trainerId: requester._id })
        .select("studentId")
        .lean();

      const studentIds = Array.from(
        new Set(routines.map((routine: any) => String(routine.studentId))),
      );

      studentFilter._id = { $in: studentIds };
    }

    const students = await User.find(studentFilter)
      .select(
        "_id name lastName email phone roles isActive profileImage payment createdAt updatedAt",
      )
      .sort({ createdAt: -1 })
      .lean();

    const enrichedStudents = await enrichStudentsWithPaymentBridge(
      students.map((student) => sanitizeSensitiveUserData(student)),
    );

    res.status(200).json({
      userRequesting: sanitizeUser(req.user),
      data: enrichedStudents,
    });
  } catch (error) {
    handleHttpError(res, "Error getting students payments", 500, error);
  }
};

const getPaymentsSummary = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);

    const studentFilter: any = { roles: { $in: [UserRole.Student] } };

    if (!isAdmin) {
      const routines = await Routine.find({ trainerId: requester._id })
        .select("studentId")
        .lean();

      const studentIds = Array.from(
        new Set(routines.map((routine: any) => String(routine.studentId))),
      );

      studentFilter._id = { $in: studentIds };
    }

    const students = await User.find(studentFilter)
      .select("_id payment")
      .lean();

    const enriched = await enrichStudentsWithPaymentBridge(students);

    const totalStudents = enriched.length;
    const paidStudents = enriched.filter(
      (student) => student.paymentStatus.status === "al_dia",
    ).length;
    const pendingStudents = totalStudents - paidStudents;
    const dueSoonStudents = enriched.filter(
      (student) => student.paymentStatus.status === "vence",
    ).length;
    const overdueStudents = enriched.filter(
      (student) => student.paymentStatus.status === "vencido",
    ).length;

    const totalAmount = enriched.reduce(
      (sum, student) => sum + Number(student.payment?.amount || 0),
      0,
    );

    const collectedAmount = enriched.reduce((sum, student) => {
      if (student.paymentStatus.status !== "al_dia") return sum;
      return sum + Number(student.payment?.amount || 0);
    }, 0);

    res.status(200).json({
      data: {
        totalStudents,
        paidStudents,
        pendingStudents,
        dueSoonStudents,
        overdueStudents,
        totalAmount,
        collectedAmount,
        pendingAmount: totalAmount - collectedAmount,
      },
    });
  } catch (error) {
    handleHttpError(res, "Error getting payments summary", 500, error);
  }
};

const updateStudentPayment = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const studentId = String(req.params.id);
    const { startDate, amount, paymentDate, isPaid, billingCycleDays } = req.body;

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const authorizedStudent = await getAuthorizedStudent(
      requester,
      studentId,
      "You can only update payments for your own students",
      "Payments can only be updated for student users",
    );

    if (authorizedStudent.error) {
      return handleHttpError(
        res,
        authorizedStudent.error.message,
        authorizedStudent.error.code,
      );
    }

    const student = authorizedStudent.student!;
    const latestPayment = await getLatestPaymentForStudent(student._id);
    const currentPayment = resolveStudentPaymentSource(
      student.toObject(),
      latestPayment,
    );
    const nextPayment = normalizePaymentSource(
      {
        startDate:
          startDate !== undefined
            ? startDate === null || startDate === ""
              ? null
              : new Date(startDate)
            : undefined,
        amount:
          amount !== undefined
            ? amount === null || amount === ""
              ? null
              : Number(amount)
            : undefined,
        paymentDate:
          paymentDate !== undefined
            ? paymentDate === null || paymentDate === ""
              ? null
              : new Date(paymentDate)
            : undefined,
        billingCycleDays:
          billingCycleDays !== undefined
            ? billingCycleDays === null || billingCycleDays === ""
              ? undefined
              : Number(billingCycleDays)
            : undefined,
        isPaid:
          typeof isPaid === "boolean"
            ? isPaid
            : paymentDate !== undefined
              ? paymentDate !== null && paymentDate !== ""
              : undefined,
      },
      currentPayment,
    );

    if (typeof isPaid === "boolean") {
      nextPayment.isPaid = isPaid;
      nextPayment.paymentDate = isPaid
        ? nextPayment.paymentDate ?? new Date()
        : null;
    }

    const savedPayment = await saveStudentPaymentSource(student._id, nextPayment);
    await syncUserPaymentBridge(student._id, savedPayment);

    const refreshedStudent = await User.findById(student._id).lean();
    const enrichedStudent = refreshedStudent
      ? await hydrateSingleStudentPayment(refreshedStudent)
      : null;

    res.status(200).json({
      message: "Student payment updated successfully",
      data: enrichedStudent,
    });
  } catch (error) {
    handleHttpError(res, "Error updating student payment", 500, error);
  }
};

const sendPaymentReminder = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const studentId = String(req.params.id);
    const { channel } = req.body as { channel?: "email" | "whatsapp" };

    if (channel !== "email" && channel !== "whatsapp") {
      return handleHttpError(res, "Invalid reminder channel", 400);
    }

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const authorizedStudent = await getAuthorizedStudent(
      requester,
      studentId,
      "You can only send reminders to your own students",
      "Reminders can only target students",
    );

    if (authorizedStudent.error) {
      return handleHttpError(
        res,
        authorizedStudent.error.message,
        authorizedStudent.error.code,
      );
    }

    const student = authorizedStudent.student!;
    const latestPayment = await getLatestPaymentForStudent(student._id);
    const currentPayment = resolveStudentPaymentSource(
      student.toObject(),
      latestPayment,
    );
    const nextPayment = normalizePaymentSource(
      {
        reminderCount: currentPayment.reminderCount + 1,
        lastReminderAt: new Date(),
        lastReminderChannel: channel,
      },
      currentPayment,
    );

    const savedPayment = await saveStudentPaymentSource(student._id, nextPayment, {
      mode: "replace_latest",
    });
    await syncUserPaymentBridge(student._id, savedPayment);

    const refreshedStudent = await User.findById(student._id).lean();
    const enrichedStudent = refreshedStudent
      ? await hydrateSingleStudentPayment(refreshedStudent)
      : null;

    res.status(200).json({
      message: "Reminder tracked successfully",
      data: enrichedStudent,
    });
  } catch (error) {
    handleHttpError(res, "Error sending payment reminder", 500, error);
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  activateUser,
  setUserRole,
  getProfile,
  getStudentsPayments,
  getPaymentsSummary,
  updateStudentPayment,
  sendPaymentReminder,
};
