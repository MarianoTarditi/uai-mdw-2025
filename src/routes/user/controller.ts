import { Request, Response } from "express";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { matchedData } from "express-validator";

const createUser = async (req: Request, res: Response) => {
  try {
    const body = matchedData(req);

    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email is already in use",
        error: true,
      });
    }

    const user = new User(body);
    await user.save();
    res
      .status(201)
      .json({ message: "User created successfully", data: user, error: false });
  } catch (error) {
    handleHttpError(res, "Error creating user", 500, error);
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const includeInactive = req.query.includeInactive === "true"; // Verifica si el query param es 'true'
    const filter = includeInactive ? {} : { isActive: true }; // Si includeInactive es true, devuelve todos los usuarios, si es false, solo los activos.

    const users = await User.find(/*{ isActive: true }*/ filter); // Solo usuarios activos
    res.status(200).json(users);
  } catch (error) {
    handleHttpError(res, "Error getting users", 500, error);
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id, isActive: true }); // Solo usuarios activos
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ data: user });
  } catch (error) {
    handleHttpError(res, "Error getting user", 500, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const body = matchedData(req); // Desestructura los campos que podrían actualizarse desde el cuerpo de la petición
    const { id } = req.params; // Desestructura id desde los parámetros de ruta (/users/:id, :id)

      if (body.email) {
      const existingUser = await User.findOne({ email: body.email, _id: { $ne: id } });
      if (existingUser) {
        return res.status(409).json({
          message: "Email is already in use",
          error: true,
        });
      }
    }

    const user = await User.findOneAndUpdate( // findOneAndUpdate busca con filtros un documento y lo actualiza en una sola operación atómica
      { _id: id, isActive: true }, // condición: id coincide y usuario activo
      body, // son los campos a cambiar.
      { new: true } //  Mongoose devuelva el documento ya actualizado
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User Updated successfully", data: user });
  } catch (error) {
    handleHttpError(res, "Error updating user", 500, error);
  }
};

const hardDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id); // findByIdAndDelete ya devuelve null si no encuentra el usuario con ese id.
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
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
    // console.log(user); Es null si no se encontró un usuario activo con ese id.

    // Si no se encontró, puede ser porque no existe o ya estaba inactivo
    if (!user) {
      const existingUser = await User.findById(id); // Primero verificamos si el usuario existe
      if (!existingUser) {
        return res.status(404).json({ message: "User not found", error: true });
      }
      return res
        .status(409)
        .json({ message: "User is already inactive", error: true });
    }

    res.json({ message: "User soft-deleted successfully", data: user });
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
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isActive) {
      return res.status(400).json({
        message: "User is already active",
        error: true,
      });
    }

    res.status(200).json({ message: "User activated successfully", data: user });
  } catch (error) {
    handleHttpError(res, "Error activating user", 500, error);
  }
};

export default {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  hardDeleteUser,
  softDeleteUser,
  activateUser,
};
