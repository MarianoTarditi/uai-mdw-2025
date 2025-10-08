import { Schema, model, InferSchemaType } from "mongoose";
import {UserRole} from "../types"


const userSchema = new Schema(
  {
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    firebaseUid: { type: String, unique: true },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.Student],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

type UserType = InferSchemaType<typeof userSchema>;
const User = model<UserType>("User", userSchema); 
export default User;
