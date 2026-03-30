import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import "dotenv/config";
import User from "../models/userModel";

// 👉 Define Request Body Types
interface RegisterBody {
  email: string;
  password: string;
  name: string;
}

interface LoginBody {
  email: string;
  password: string;
}

// 👉 CREATE USER
export const createUser = async (
  req: Request<{}, {}, RegisterBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password, name } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(409).json({ message: "User already exist" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await new User({
      email,
      name,
      password: hashedPassword,
      role: "buyer",
    }).save();

    res.status(201).json({
      message: "User created",
      user: newUser,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 LOGIN USER
export const loginUser = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User doesn't exist" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_USERTOKEN as string,
      { expiresIn: "7d" }
    );

    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 GET ALL USERS
export const getUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      res.status(404).json({ message: "No user registered yet" });
      return;
    }

    res.status(200).json({
      message: "Fetched all users",
      fetcheduser: users,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 GET SINGLE USER
export const getSingleUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const singleUser = await User.findById(req.params.id);

    if (!singleUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "Fetched single user",
      fetcheduser: singleUser,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 UPDATE USER
export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user id" });
      return;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      res.status(404).json({ message: "No user found" });
      return;
    }

    res.status(200).json({
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log("something went wrong", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// 👉 DELETE USER
export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid user ID" });
      return;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Something went wrong:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};