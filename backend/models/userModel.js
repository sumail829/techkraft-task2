import mongoose, { Mongoose } from "mongoose";

const userSchema=new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name:{type:String,reqired:true},
    password: { type: String, required: true },
})

const User=mongoose.model("User",userSchema);
export default User;
