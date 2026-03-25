import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";

const saveUser = async (req: Request, res: Response) => {
  try {
    const firebaseUser = (req as any).user;
    const firebaseUid = firebaseUser.uid;
    const email = firebaseUser.email;

    const { name, lastName, phone, gender, birthDate, weight, height } = req.body;

    const existingUser = await User.findOne({ firebaseUid });
    if (existingUser) {
      return handleHttpError(res, "User already exists", 409);
    }

    const user = await User.create({
      firebaseUid,
      email,
      name,
      lastName,
      phone,
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
