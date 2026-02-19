import { Request, Response } from "express";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";

const sanitizeUser = (user: any) => {
  if (!user) return null;

  return {
    id: user._id || user.uid,
    name: user.name,
    email: user.email,
    roles: user.roles,
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
    const {
      name,
      lastName,
      height,
      weight,
      birthDate,
      gender,
      existingProfileImage,
    } = req.body;

    const currentUser = await User.findById(id);
    if (!currentUser) {
      return handleHttpError(res, "User not found", 404);
    }

    let finalProfileImage = existingProfileImage || currentUser.profileImage;

    if (req.file) {
      finalProfileImage = `/uploads/profileImages/${req.file.filename}`;
    }

    const parsedHeight = height && height !== "null" ? Number(height) : null;
    const parsedWeight = weight && weight !== "null" ? Number(weight) : null;
    const parsedBirthDate = birthDate ? new Date(birthDate) : null;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        lastName,
        height: parsedHeight,
        weight: parsedWeight,
        birthDate: parsedBirthDate,
        gender,
        profileImage: finalProfileImage,
      },
      { new: true, runValidators: true },
    );

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

export default {
  getAllUsers,
  getUserById,
  updateUser,
  softDeleteUser,
  activateUser,
  setUserRole,
  getProfile,
};
