import jwt from "jsonwebtoken";
import { InferSchemaType, Types } from "mongoose";
import User from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
type UserType = InferSchemaType<typeof User.schema>;

/*
  Lo que hacés es firmar digitalmente con JWT_SECRET → esto asegura que nadie pueda modificar el token sin que se invalide.
  Sirve para autenticación, no para ocultar datos sensibles.
*/

const tokenSign = async (user: UserType & { _id: Types.ObjectId }) => {
  const sign = jwt.sign(
    { _id: user._id.toString(), role: user.role },
    JWT_SECRET,
    { expiresIn: "2h" }
  );
  return sign;
};

const verifyToken = async (tokenJwt: string) => {
  try {
    const decoded = jwt.verify(tokenJwt, JWT_SECRET) as jwt.JwtPayload;
    const user = await User.findById(decoded._id);

    if (!user) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};

export default { tokenSign, verifyToken };
