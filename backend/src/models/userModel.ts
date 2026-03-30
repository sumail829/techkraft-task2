import mongoose, { InferSchemaType, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["buyer", "admin"],
    default: "buyer",
  },
}, { timestamps: true });

type IUser = InferSchemaType<typeof userSchema>;

const User = mongoose.model<IUser>("User", userSchema);

export default User;