import express from "express";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import 'dotenv/config'
import User from "../models/userModel.js";

export const createUser=async(req,res)=>{
    try {
        const {email,password,name}=req.body;
        const userExist=await User.findOne({email});
        if(userExist){
            return res.status(409).json({
                message:"User already exist"
            })
        }
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=await new User({
            email,
            name,
            password:hashedPassword,
            role: "buyer"
        }).save();
        return res.status(201).json({
            message:"User created",
            user:newUser
        })
    } catch (error) {
            console.log("something went wrong",error)
        return res.status(500).json({
            message:"Internal server error"
            })
    }
}

export const loginUser=async(req,res)=>{
    try {
        const {email,password,name}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({
                message:"User dosent exist"
            })
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(401).json({
                message:"Invalid creadencials"
            })
        }
         const token=jwt.sign({id:user._id,email:user.email,role: user.role},process.env.JWT_USERTOKEN,{
            expiresIn:"7d",
        });
        const {password:_,...userData}=user._doc;
        return res.status(200).json({message:"Login successful",token,user:userData})
    } catch (error) {
        console.log("something went wrong",error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getUser=async(req,res)=>{
    try {
        const getAllUser=await User.find();
        // if(!getAllUser){
        //     return res.status(404).json({message:"No user registered yet"});

        // }
        if (getAllUser.length === 0) {
            return res.status(404).json({ message: "No user registered yet" });
          }
        return res.status(200).json({message:"fetched all user",fetcheduser:getAllUser});
        
    } catch (error) {
        console.log("something went wrong",error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getSingleUser=async(req,res)=>{
    try {
        const singleUser=await User.findById(req.params.id);
        if(!singleUser){
            return res.status(404).json({message:"User not found"});

        }
        return res.status(200).json({message:"fetched single User",fetcheduser:singleUser});
        
    } catch (error) {
        console.log("something went wrong",error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const updateUser=async(req,res)=>{
    try {

        const {id}=req.params;
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({message:"Invalid user id"})
        }
    
        if(req.body.password){
            const salt=await bcrypt.genSalt(10);
            req.body.password=await bcrypt.hash(req.body.password,salt)
        }
        const modifyUser=await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
        if(!modifyUser){
            return res.status(404).json({message:"No user found"})
        }
        return res.status(200).json({message:"User updated successfully",updatedUser:modifyUser})
    } catch (error) {
        console.log("something went wrong",error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const deleteUser = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Validate MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      return res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      console.log("Something went wrong:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };