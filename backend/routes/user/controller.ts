import { Request, Response } from "express";
import User from "../../models/User";
import handleHttpError from "../../utils/handleError";

const sanitizeUser = (user: any) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  roles: user.roles,
});

const formatBirthDate = (date: Date | string | undefined | null) => {
  if (!date) return null;

  // Asegurarse de que sea un objeto Date
  const birthDate = date instanceof Date ? date : new Date(date);

  if (isNaN(birthDate.getTime())) {
    return null; // Manejar fechas inválidas
  }

  // Usar toLocaleDateString con la configuración local para obtener DD/MM/YYYY
  // 'es-ES' suele usar el formato día/mes/año
  // O construir manualmente para asegurar el formato:
  const day = birthDate.getDate().toString().padStart(2, "0");
  const month = (birthDate.getMonth() + 1).toString().padStart(2, "0"); // +1 porque getMonth() es base 0
  const year = birthDate.getFullYear();

  return `${day}/${month}/${year}`;
};
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    let filter = {}; // Filtro vacío por defecto "todos los usuarios".

    if (isActive !== undefined) {
      // Verificamos si el query param 'isActive' está definido.
      filter = { isActive: isActive === "true" }; // si es true
    } // cualquier otra cosa que no sea "true", filtra inactivos

    const users = await User.find(filter); // si existe un filtro, es decir, "isActive: true", lo aplicamos en la consulta find.
    const requestingUser = sanitizeUser(res.locals.user);

    res.status(200).json({ userRequesting: requestingUser, data: users });
  } catch (error) {
    handleHttpError(res, "Error getting users", 500, error);
  }
};

// ... dentro de tu archivo de controladores
const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ firebaseUid: id, isActive: true }).lean(); // Usar .lean() si solo necesitas los datos sin métodos de Mongoose
    if (!user) {
      handleHttpError(res, "User not found", 404);
      return;
    }
    const requestingUser = sanitizeUser(res.locals.user);
    res.status(200).json({ userRequesting: requestingUser, data: user }); // Enviar el objeto formateado
  } catch (error) {
    handleHttpError(res, "Error getting user", 500, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, lastName, height, weight, birthDate, gender, profileImage } =
      req.body;

    const formattedBirthdate = formatBirthDate(birthDate);

    const findUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        lastName,
        height,
        weight,
        birthDate: formattedBirthdate,
        gender,
        profileImage,
      },
      { new: true }
    );

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const requestingUser = sanitizeUser(res.locals.user);
    res
      .status(200)
      .json({ message: "User updated successfully", data: findUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
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
      const existingUser = await User.findById(id); // Primero verificamos si el usuario existe
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
    const { id } = req.params; // id de Mongo del usuario
    const { roles } = req.body; // array de roles nuevos: ["admin"]

    if (!roles || !Array.isArray(roles)) {
      return handleHttpError(res, "Roles must be an array", 400);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { roles }, // 👈 sobrescribe roles
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
