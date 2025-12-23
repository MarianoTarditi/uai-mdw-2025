import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";

const saveUser = async (req: Request, res: Response) => {
  try {
    console.log("BODY RECIBIDO:", req.body); // 👈 AQUI

    const {
      firebaseUid,
      email,
      name,
      lastName,
      gender,
      birthDate,
      weight,
      height,
    } = req.body;

    // 1. Verificar si ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return handleHttpError(res, "Email already in use", 409);
    }

    // 2. Crear usuario en MongoDB
    const user = await User.create({
      firebaseUid,
      email,
      name,
      lastName,
      gender,
      birthDate,
      weight,
      height,
    });

    return res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    return handleHttpError(res, "Error while registering user", 500);
  }
};

export default { saveUser };
