import { Request, Response } from "express";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { UserRole } from "../../types";
import Routine from "../../models/Routine";
import { calculatePaymentStatus } from "../../utils/paymentStatus";

const sanitizeUser = (user: any) => {
  if (!user) return null;

  return {
    id: user._id || user.uid,
    name: user.name,
    email: user.email,
    roles: user.roles,
  };
};

const enrichStudentPayment = (student: any) => {
  const paymentStatus = calculatePaymentStatus(student.payment);

  return {
    ...student,
    paymentStatus,
  };
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
      data: users,
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
      data: user,
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
      data: user,
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
      data: updatedUser,
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
      data: user,
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
      data: user,
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
      data: updatedUser,
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

    let studentFilter: any = { roles: { $in: [UserRole.Student] } };

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

    const enrichedStudents = students.map(enrichStudentPayment);

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

    let studentFilter: any = { roles: { $in: [UserRole.Student] } };

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

    const enriched = students.map((student) => ({
      ...student,
      paymentStatus: calculatePaymentStatus(student.payment),
    }));

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

    const { id } = req.params;
    const { startDate, amount, paymentDate, isPaid, billingCycleDays } = req.body;

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const student = await User.findById(id);
    if (!student) {
      return handleHttpError(res, "User not found", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);

    if (!isAdmin) {
      const trainerStudentRelation = await Routine.exists({
        trainerId: requester._id,
        studentId: student._id,
      });

      if (!trainerStudentRelation) {
        return handleHttpError(
          res,
          "You can only update payments for your own students",
          403,
        );
      }
    }

    const isStudent = student.roles?.includes(UserRole.Student);
    if (!isStudent) {
      return handleHttpError(
        res,
        "Payments can only be updated for student users",
        400,
      );
    }

    const nextPayment = {
      startDate: student.payment?.startDate ?? null,
      amount: student.payment?.amount ?? null,
      paymentDate: student.payment?.paymentDate ?? null,
      isPaid: student.payment?.isPaid ?? false,
      billingCycleDays: student.payment?.billingCycleDays ?? 30,
      reminderCount: student.payment?.reminderCount ?? 0,
      lastReminderAt: student.payment?.lastReminderAt ?? null,
      lastReminderChannel: student.payment?.lastReminderChannel ?? null,
    };

    if (startDate !== undefined) {
      nextPayment.startDate =
        startDate === null || startDate === "" ? null : new Date(startDate);
    }

    if (amount !== undefined) {
      nextPayment.amount = amount === null || amount === "" ? null : Number(amount);
    }

    if (paymentDate !== undefined) {
      nextPayment.paymentDate =
        paymentDate === null || paymentDate === ""
          ? null
          : new Date(paymentDate);
    }

    if (typeof isPaid === "boolean") {
      nextPayment.isPaid = isPaid;
      if (isPaid && !nextPayment.paymentDate) {
        nextPayment.paymentDate = new Date();
      }
    }

    if (billingCycleDays !== undefined) {
      nextPayment.billingCycleDays =
        billingCycleDays === null || billingCycleDays === ""
          ? 30
          : Number(billingCycleDays);
    }

    student.payment = nextPayment;

    await student.save();

    const studentObject = student.toObject();
    const enrichedStudent = {
      ...studentObject,
      paymentStatus: calculatePaymentStatus(studentObject.payment),
    };

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

    const { id } = req.params;
    const { channel } = req.body as { channel?: "email" | "whatsapp" };

    if (channel !== "email" && channel !== "whatsapp") {
      return handleHttpError(res, "Invalid reminder channel", 400);
    }

    const requester = (req as any).dbUser || null;
    if (!requester) {
      return handleHttpError(res, "User not found in database", 404);
    }

    const student = await User.findById(id);
    if (!student) {
      return handleHttpError(res, "User not found", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);

    if (!isAdmin) {
      const trainerStudentRelation = await Routine.exists({
        trainerId: requester._id,
        studentId: student._id,
      });

      if (!trainerStudentRelation) {
        return handleHttpError(
          res,
          "You can only send reminders to your own students",
          403,
        );
      }
    }

    const isStudent = student.roles?.includes(UserRole.Student);
    if (!isStudent) {
      return handleHttpError(res, "Reminders can only target students", 400);
    }

    const payment = student.payment || ({} as any);
    payment.reminderCount = Number(payment.reminderCount || 0) + 1;
    payment.lastReminderAt = new Date();
    payment.lastReminderChannel = channel;
    student.payment = payment;

    await student.save();

    const studentObject = student.toObject();
    const enrichedStudent = {
      ...studentObject,
      paymentStatus: calculatePaymentStatus(studentObject.payment),
    };

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
