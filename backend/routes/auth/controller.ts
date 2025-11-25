import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";
import admin from "../../utils/firebase";
import axios from "axios";

const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      handleHttpError(res, "Email already in use", 409);
    }

    const userRecord = await admin.auth().createUser({ email, password });

    const user = new User({
      name,
      lastName,
      email,
      firebaseUid: userRecord.uid,
    });
    await user.save();
    res.status(201).json({
      firebaseUser: userRecord,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
    });
  } catch (error) {
    handleHttpError(res, "Error while registering user", 500);
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return handleHttpError(res, "Email and password are required", 400);
    }

    // Buscar el usuario en tu DB
    const apiKey = process.env.FIREBASE_API_KEY;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

    // Login en Firebase
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true,
    });

    const user = await User.findOne({ email });

    if (!user) {
      return handleHttpError(res, "User not found in database", 404);
    }

    // Devolver datos completos
    res.json({
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId,
      email: response.data.email,
      name: user.name,
      lastName: user.lastName,
      roles: user.roles,
    });
  } catch (error: any) {
    const firebaseError = error?.response?.data?.error?.message;

    if (firebaseError === "USER_DISABLED") {
      return handleHttpError(
        res,
        "User account is disabled, talk to an admin",
        403
      );
    }

    if (firebaseError === "INVALID_LOGIN_CREDENTIALS") {
      return handleHttpError(
        res,
        "Email or password incorrect, please try again",
        401
      );
    }

    if (firebaseError === "INVALID_LOGIN_CREDENTIALS") {
      return handleHttpError(
        res,
        "Email or password incorrect, please try again",
        401
      );
    }

    console.log("Firebase login error:", firebaseError);
    handleHttpError(res, "Login failed", 401, firebaseError);
  }
};

export default {
  signUp,
  login,
};
