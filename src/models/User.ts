import {Schema, model, InferSchemaType} from "mongoose";    

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String, 
            required: true,
            unique: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

type UserType = InferSchemaType<typeof userSchema>;
const User = model<UserType>("User", userSchema); // ffdsfs
export default User;