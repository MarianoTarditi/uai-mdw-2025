import { Request, Response } from "express";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";

const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return null;

  let birthDate: Date;

  if (typeof date === "string" && date.includes("/")) {
    const [day, month, year] = date.split("/");
    birthDate = new Date(Number(year), Number(month) - 1, Number(day));
  } else {
    birthDate = new Date(date);
  }

  if (isNaN(birthDate.getTime())) return null;

  const day = birthDate.getDate().toString().padStart(2, "0");
  const month = (birthDate.getMonth() + 1).toString().padStart(2, "0");
  const year = birthDate.getFullYear();

  return `${day}/${month}/${year}`;
};

const convertToDateObject = (dateString: string | undefined | null) => {
  if (!dateString) return null;

  const parts = dateString.split("/");

  if (parts.length === 3) {
    const date = new Date(
      Date.UTC(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]))
    );
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    let filter = {};

    if (isActive !== undefined) {
      filter = { isActive: isActive === "true" };
    }

    const users = await User.find(filter);
    const requestingUser = sanitizeUser(res.locals.user);

    res.status(200).json({ userRequesting: requestingUser, data: users });
  } catch (error) {
    handleHttpError(res, "Error getting users", 500, error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ firebaseUid: id, isActive: true }).lean();

    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    const requestingUser = sanitizeUser(res.locals.user);

    return res.status(200).json({
      userRequesting: requestingUser,
      data: {
        ...user,
        birthDate: formatDate(user.birthDate),
        createdAt: formatDate(user.createdAt),
      },
    });
  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error getting user", 500, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let {
      name,
      lastName,
      height,
      weight,
      birthDate,
      gender,
      existingProfileImage,
    } = req.body;

    height = height === "" ? null : Number(height);
    weight = weight === "" ? null : Number(weight);
    let finalProfileImage: string | undefined;

    if (req.file) {
      finalProfileImage = `/uploads/profileImages/${req.file.filename}`;
    } else if (existingProfileImage) {
      finalProfileImage = existingProfileImage;
    }

    const dateObject = convertToDateObject(birthDate);

    const updateData: Record<string, any> = {
      name,
      lastName,
      height,
      weight,
      birthDate: dateObject,
      gender,
    };

    if (finalProfileImage !== undefined) {
      updateData.profileImage = finalProfileImage;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("Error en updateUser (Backend):", error);
    res.status(500).json({
      message: "Internal Server Error during update.",
      details: error.message || error.toString(),
    });
  }
};

const hardDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id); // findByIdAndDelete ya devuelve null si no encuentra el usuario con ese id.
    if (!user) {
      handleHttpError(res, "User not found", 404);
      return;
    }

    const requestingUser = sanitizeUser(res.locals.user);
    res.status(200).json({
      requestingUser: requestingUser,
      message: "User deleted successfully",
    });
  } catch (error) {
    handleHttpError(res, "Error deleting user", 500, error);
  }
};

const softDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOneAndUpdate(
      { _id: id, isActive: true }, // condición: id coincide y usuario activo
      { isActive: false }, // actualización: desactivar usuario
      { new: true } // devuelve el documento actualizado
    );

    // Si no se encontró, puede ser porque no existe o ya estaba inactivo
    if (!user) {
      const existingUser = await User.findById(id);
      if (!existingUser) {
        handleHttpError(res, "User not found", 404);
        return;
      }
      handleHttpError(res, "User is already inactive", 400);
      return;
    }

    const requestingUser = sanitizeUser(res.locals.user);
    res.json({
      requestingUser: requestingUser,
      message: "User soft-deleted successfully",
      data: user,
    });
  } catch (error) {
    handleHttpError(res, "Error soft-deleting user", 500, error);
  }
};

const activateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      handleHttpError(res, "User not found", 404);
      return;
    }

    if (user.isActive) {
      handleHttpError(res, "User is already active", 400);
      return;
    }
    const requestingUser = sanitizeUser(res.locals.user);
    res.status(200).json({
      requestingUser: requestingUser,
      message: "User activated successfully",
      data: user,
    });
  } catch (error) {
    handleHttpError(res, "Error activating user", 500, error);
  }
};

const setUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    if (!roles || !Array.isArray(roles)) {
      return handleHttpError(res, "Roles must be an array", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles },
      { new: true }
    );

    if (!updatedUser) {
      return handleHttpError(res, "User not found", 404);
    }

    const requestingUser = sanitizeUser(res.locals.user);
    res.json({
      requestingUser: requestingUser,
      message: "Roles updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    handleHttpError(res, "Error updating user roles", 500);
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
  activateUser,
  setUserRole,
};
