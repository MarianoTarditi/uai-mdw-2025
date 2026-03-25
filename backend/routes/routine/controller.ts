import { Request, Response } from "express";
import Routine from "../../models/Routine";
import handleHttpError from "../../utils/handleError";
import User from "../../models/User";
import { UserRole } from "../../types";
import RoutineTemplate from "../../models/RoutineTemplate";
import path from "path";
import fs from "fs";
import { UPLOADS_DIR } from "../../utils/uploadsPath";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; [key: string]: any };
    }
  }
}

const createRoutine = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).dbUser || (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const trainer = await User.findById(authUser._id || authUser.id);

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
    const authUser = (req as any).dbUser || (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const requester = await User.findById(authUser._id || authUser.id);

    if (!requester) {
      return handleHttpError(res, "Requester not found", 404);
    }

    const { id } = req.params;
    const updateData = req.body;

    const query: any = { _id: id };
    const isAdmin = requester.roles.includes(UserRole.Admin);

    if (!isAdmin) {
      query.trainerId = requester._id;
    }

    const updatedRoutine = await Routine.findOneAndUpdate(query, updateData, {
      new: true,
    })
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
    const authUser = (req as any).dbUser || (req as any).user;

    if (!authUser) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const requester = await User.findById(authUser._id || authUser.id);

    if (!requester) {
      return handleHttpError(res, "Requester not found", 404);
    }

    const { id } = req.params;

    const query: any = { _id: id };
    const isAdmin = requester.roles.includes(UserRole.Admin);

    if (!isAdmin) {
      query.trainerId = requester._id;
    }

    const routine = await Routine.findOneAndDelete(query);

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
    const requester = (req as any).dbUser || null;

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);
    const isTrainer = requester.roles.includes(UserRole.Trainer);

    if (isAdmin || isTrainer) {
      const students = await User.find({
        roles: UserRole.Student,
        isActive: true,
      }).select("_id name lastName email profileImage");

      return res.status(200).json({ data: students });
    }

    return handleHttpError(res, "No tienes permisos para listar estudiantes", 403);
  } catch (error) {
    handleHttpError(res, "Error fetching students", 500, error);
  }
};

const getRoutineTemplates = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).dbUser || null;

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);

    const filter = isAdmin ? {} : { uploadedBy: requester._id };

    const templates = await RoutineTemplate.find(filter)
      .populate("uploadedBy", "name lastName email")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ data: templates });
  } catch (error) {
    handleHttpError(res, "Error fetching routine templates", 500, error);
  }
};

const uploadRoutineTemplateFile = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).dbUser || null;

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    if (!req.file) {
      return handleHttpError(res, "Template file is required", 400);
    }

    const title =
      (req.body?.title as string | undefined)?.trim() ||
      req.file.originalname.replace(path.extname(req.file.originalname), "");

    const template = await RoutineTemplate.create({
      title,
      fileUrl: `/uploads/routineTemplates/${req.file.filename}`,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: requester._id,
    });

    const populated = await template.populate("uploadedBy", "name lastName email");

    res.status(201).json({
      message: "Routine template uploaded successfully",
      data: populated,
    });
  } catch (error) {
    handleHttpError(res, "Error uploading routine template", 500, error);
  }
};

const deleteRoutineTemplateFile = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).dbUser || null;

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const template = await RoutineTemplate.findById(id);

    if (!template) {
      return handleHttpError(res, "Template not found", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);
    if (!isAdmin && String(template.uploadedBy) !== String(requester._id)) {
      return handleHttpError(
        res,
        "You can only delete your own templates",
        403,
      );
    }

    const relativeFilePath = template.fileUrl.replace(/^[/\\]*uploads[/\\]?/, "");
    const absolutePath = path.join(UPLOADS_DIR, relativeFilePath);
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await RoutineTemplate.findByIdAndDelete(id);
    res.status(200).json({ message: "Template deleted successfully" });
  } catch (error) {
    handleHttpError(res, "Error deleting routine template", 500, error);
  }
};

const renameRoutineTemplateFile = async (req: Request, res: Response) => {
  try {
    const requester = (req as any).dbUser || null;

    if (!requester) {
      return handleHttpError(res, "User not authenticated", 401);
    }

    const { id } = req.params;
    const { title } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 3) {
      return handleHttpError(
        res,
        "Title is required and must be at least 3 characters",
        400,
      );
    }

    const template = await RoutineTemplate.findById(id);
    if (!template) {
      return handleHttpError(res, "Template not found", 404);
    }

    const isAdmin = requester.roles.includes(UserRole.Admin);
    if (!isAdmin && String(template.uploadedBy) !== String(requester._id)) {
      return handleHttpError(
        res,
        "You can only rename your own templates",
        403,
      );
    }

    template.title = title.trim();
    await template.save();

    const populated = await template.populate("uploadedBy", "name lastName email");

    res.status(200).json({
      message: "Template renamed successfully",
      data: populated,
    });
  } catch (error) {
    handleHttpError(res, "Error renaming routine template", 500, error);
  }
};

export default {
  createRoutine,
  getAllRoutines,
  getRoutineById,
  updateRoutine,
  deleteRoutine,
  getStudents,
  getRoutineTemplates,
  uploadRoutineTemplateFile,
  deleteRoutineTemplateFile,
  renameRoutineTemplateFile,
};
