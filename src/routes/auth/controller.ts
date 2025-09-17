import User from "../../models/User";
import handleHttpError from "../../utils/handleError";
import { Request, Response } from "express";
import admin from "../../utils/firebase";
import axios from "axios";

const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, name, lastName } = req.body;
    const userRecord = await admin.auth().createUser({
      email,
      password,
    });
    const user = new User({
      name,
      lastName,
      email,
      firebaseUid: userRecord.uid,
    });
    await user.save();
    res.status(201).json({ firebaseUser: userRecord, user });
  } catch (error) {
    handleHttpError(res, "Error while registering user", 500);
    console.log(error);
  }
};

const login = async (req: Request, res: Response) => {
  // Sign in wth email and password
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      handleHttpError(res, "Email and password are required", 400);
    }
    const apiKey = process.env.FIREBASE_API_KEY;
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await axios.post(url, {
      email,
      password,
      returnSecureToken: true, // to get the ID token
    });
    res.json({
      idToken: response.data.idToken,
      refreshToken: response.data.refreshToken,
      expiresIn: response.data.expiresIn,
      localId: response.data.localId,
    });
  } catch (error: any) {
    const firebaseError = error?.response?.data?.error?.message;

    if (firebaseError === "USER_DISABLED") {
      return handleHttpError(res, "User account is disabled, talk to an admin", 403);
    }

    if (firebaseError === "INVALID_LOGIN_CREDENTIALS") {
      return handleHttpError(res, "Email or password incorrect, please try again", 401);
    }

    console.log("Firebase login error:", firebaseError);
    handleHttpError(res, "Login failed", 401, firebaseError);
  }
};

export default {
  registerUser,
  login,
};
