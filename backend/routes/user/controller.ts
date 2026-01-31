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
      Date.UTC(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0])),
    );
    return isNaN(date.getTime()) ? null : date;
  }
  return null;
};

// --- GET ALL USERS (Pequeña mejora en filtros) ---
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { isActive } = req.query;
    const filter: any = {};

    // Manejo robusto del booleano en query string
    if (isActive !== undefined) {
      if (isActive === "true") filter.isActive = true;
      if (isActive === "false") filter.isActive = false;
    }

    // Sugerencia: Normalmente en un panel de admin quieres ver los borrados también,
    // pero si es una lista pública, quizás quieras filtrar filter.isActive = true por defecto.

    // Agrego .sort para que salgan los más nuevos primero (opcional)
    const users = await User.find(filter).sort({ createdAt: -1 });

    const requestingUser = sanitizeUser(res.locals.user);

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
    const { id } = req.params;

    // CORRECCIÓN: Usamos findById para buscar por el ID de Mongo
    // Y quitamos el filtro de "isActive" para que el admin pueda ver detalles de usuarios desactivados
    const user = await User.findById(id).lean();

    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    const requestingUser = sanitizeUser(res.locals.user);

    return res.status(200).json({
      userRequesting: requestingUser,
      data: {
        ...user,
        // Asegúrate de que tu helper formatDate maneje fechas nulas
        birthDate: user.birthDate ? formatDate(user.birthDate) : null,
        createdAt: formatDate(user.createdAt),
      },
    });
  } catch (error) {
    console.log(error);
    // Si el ID no tiene formato válido de Mongo, findById lanza error, aquí lo capturamos
    return handleHttpError(res, "Error getting user", 500, error);
  }
};

// userController.ts

const getProfile = async (req: Request, res: Response) => {
  try {
    // DEBUG: Mira en la consola de VSCode (donde corre el backend) qué imprime esto
    console.log("REQ.USER:", (req as any).user);
    console.log("RES.LOCALS:", res.locals);

    // PROTECCIÓN: Verifica si existe el usuario decodificado
    // Nota: Dependiendo de tu middleware, podría estar en req.user o res.locals.user
    const userDecoded = res.locals.user || (req as any).user;

    if (!userDecoded || !userDecoded.uid) {
      console.error("Error: No se encontró UID en el token decodificado");
      return handleHttpError(res, "Token invalid or missing user data", 401);
    }

    const { uid } = userDecoded;

    // Buscamos por firebaseUid
    const user = await User.findOne({ firebaseUid: uid }).lean();

    if (!user) {
      return handleHttpError(res, "Profile not found in DB", 404);
    }

    // ... responder con los datos ...
    // Asegúrate de que sanitizeUser y formatDate estén importados
    return res.status(200).json({
      data: {
        ...user,
        // Manejo seguro de fechas
        birthDate: user.birthDate ? formatDate(user.birthDate) : null,
        createdAt: formatDate(user.createdAt),
      },
    });
  } catch (error) {
    console.error("CRASH en getProfile:", error); // Esto te dirá el error exacto
    handleHttpError(res, "Error loading profile", 500, error);
  }
};

const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Extraemos datos del Body
    // Nota: Al venir de FormData, todo son strings, hay que tener cuidado.
    const {
      name,
      lastName,
      height,
      weight,
      birthDate,
      gender,
      existingProfileImage, // Campo opcional que envía el front con la URL vieja
    } = req.body;

    // 2. Buscamos el usuario actual (Igual que en Exercise)
    // Esto es vital para asegurar que existe y para tener el valor "fallback" de la imagen
    const currentUser = await User.findById(id);
    if (!currentUser) {
      return handleHttpError(res, "User not found", 404);
    }

    // 3. Lógica de IMAGEN (Idéntica a la de VIDEO en Exercise)
    // Por defecto, asumimos que se queda la imagen que envía el front o la que ya tenía la base de datos.
    let finalProfileImage = existingProfileImage || currentUser.profileImage;

    if (req.file) {
      // SI SUBIERON ARCHIVO NUEVO: Sobrescribimos con la ruta nueva de Multer
      finalProfileImage = `/uploads/profileImages/${req.file.filename}`;
    }

    // 4. Conversiones de Tipos (Sanitización)
    // Como FormData envía "null" o "" como string, limpiamos los números:
    const parsedHeight =
      height && height !== "" && height !== "null" ? Number(height) : null;
    const parsedWeight =
      weight && weight !== "" && weight !== "null" ? Number(weight) : null;

    // Conversión de fecha usando tu helper
    const parsedBirthDate = birthDate ? convertToDateObject(birthDate) : null;

    // 5. Actualizamos
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
      {
        new: true, // Devuelve el objeto actualizado
        runValidators: true, // Ejecuta validaciones del Schema de Mongoose
      },
    );

    // 6. Respuesta Exitosa
    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser, // Mantengo la key 'data' que usas en el frontend para usuarios
    });
  } catch (error: any) {
    // Usamos el mismo handler de error para consistencia
    console.error("Error en updateUser:", error);
    handleHttpError(res, "Error updating user", 500, error);
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

    // Intentamos actualizar directamente.
    // No filtramos por { isActive: true } aquí para simplificar.
    // Si ya es false, se queda en false (idempotencia), lo cual es bueno.
    const user = await User.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }, // Nos devuelve el usuario ya modificado
    );

    if (!user) {
      return handleHttpError(res, "User not found", 404);
    }

    // Opcional: Si quieres ser estricto y avisar si ya estaba inactivo:
    // (Esto requiere que verifiques el estado anterior, pero generalmente
    // en una API REST, borrar algo que ya está borrado debería dar 200 OK)

    const requestingUser = sanitizeUser(res.locals.user);

    res.status(200).json({
      userRequesting: requestingUser, // Mantén consistencia en nombres (userRequesting vs requestingUser)
      message: "User deactivated successfully",
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
      { new: true },
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
      { new: true },
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
  getProfile,
};
