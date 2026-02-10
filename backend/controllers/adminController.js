import User from "../models/userModel";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken";

const adminLogin = async (req,res) => {
    try {
        const {email,password} = req.body;
        const admin = await User.findOne({email,isAdmin:true});
        if(!admin){
            return res.status(401).json({message:"Email or password is incorrect"})
        }
        if(!await bcrypt.compare(password,admin.password)){
            return res.status(401).json({message:"Invalid email or password"});
        }
        const token = await generateToken({_id:admin._id,isAdmin:true});
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            maxAge:3600000
        });
        res.status(200).json({
            admin:{
                name:admin.name,
            },token
        });
    } catch (error) {
        console.error("login error",error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const getUsers = async (req,res) => {
    try {
        const users = await User.find({isAdmin:false});
        res.json(users);
    } catch (error) {
        console.error("Error",error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const updateUserStatus = async (req,res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);
        user.isBlocked = !user.isBlocked;
        await user.save();
        res.status(200).json({message:"User status updated successfully"})
    } catch (error) {
        console.error("Error",error);
        res.status(500).json({message:"Something went wrong"});
    }
}

const createUser = async (req,res) => {
    try {
        const {name,email,password,image,mobile} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(403).json({message:"User with this email already exists"});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            image,
            mobile
        });
        res.status(200).json({message:"User created successfully",user});
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Error creating user"});
    }
}

const deleteUser = async (req,res) => {
    try {
        const id = req.params.id;
        await User.findByIdAndDelete(id);
        res.status(200).json({message:"User deleted successfully"})
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Error deleting user"});
    }
}

export {
    adminLogin,
    getUsers,
    createUser,
    deleteUser


}