import User from "../../models/User";
import handlePassword from "../../utils/handlePassword";
import { matchedData } from "express-validator";
import handleJwt from "../../utils/handleJwt";
import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";

// Estás hasheando las contraseñas (con bcrypt).
// Estás firmando tokens (con JWT).

const register = async (req: Request, res: Response) => {
  try {
    const body = matchedData(req);
    const hashedPassword = await handlePassword.encrpytPassword(body.password); // transforma la contraseña en un hash irreversible, "candado" para que nadie vea la contraseña real.

    const existingEmail = await User.findOne({ email: body.email });
    if (existingEmail) {
      handleHttpError(res, "Email already in use", 404);
      return;
    }

    const data = { ...body, password: hashedPassword };
    const user = await User.create(data);

    user.set("password", undefined, { strict: false });
    const dataUser = {
      token: await handleJwt.tokenSign(user), // genera y firma un token JWT para el usuario recién creado
      data: user,
    };

    res.json({ message: "User registered successfully", data: dataUser });
  } catch (error) {
    handleHttpError(res, "Error registering user", 500, error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const body = matchedData(req); // extrae solo los campos que pasaron las validaciones.
    const user = await User.findOne({ email: body.email }).select(
      "password name email role"
    ); // solicita explícitamente que el documento incluya esos campos

    if (!user) {
      handleHttpError(res, "User not found", 404);
      return;
    }


    const hashPassword = user.password; // Extrae (del documento Mongoose) el campo password (el hash guardado en DB)
    const check = await handlePassword.comparePassword(
      body.password,
      hashPassword
    );

    if (!check) {
      handleHttpError(res, "Invalid password", 401);
      return;
    }

    user.set("password", undefined, { strict: false }); // Borra/oculta el campo password del documento en memoria (no lo elimina de la BD).
    const dataUser = {
      token: await handleJwt.tokenSign(user), // genera y firma un token JWT para el usuario, valido por 2 horas
      user,
    };

    res.json({ message: "User login successfully", data: dataUser });
  } catch (error) {
    handleHttpError(res, "Error login user", 500, error);
  }
};

export default {
  register,
  login,
};
