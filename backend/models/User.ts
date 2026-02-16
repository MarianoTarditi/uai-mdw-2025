import { Schema, model, InferSchemaType } from "mongoose";
import { UserRole } from "../types";
import { auditPlugin } from "../utils/auditPlugin";

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

    birthDate: { type: Date, default: null }, 
    gender: { type: String, enum: ["male", "female", "other"], default: null },
    height: { type: Number, default: null },
    weight: { type: Number, default: null },
    profileImage: { type: String, default: null },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.plugin(auditPlugin);


type UserType = InferSchemaType<typeof userSchema>;
const User = model<UserType>("User", userSchema);
export default User;
