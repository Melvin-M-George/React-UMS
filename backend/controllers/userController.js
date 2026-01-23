import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import bcrypt from "bcrypt";

const registerUser = async (req,res) => {
    try {
        const {name,email,password,mobile,image} = req.body;
        if(!name || !email || !password){
            return res.status(401).json({message:"Credentials are missing"});
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(401).json({message:"User with this credential already exists"})
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            name,
            email,
            password:hashedPassword,
            mobile,
            image
        })
        res.json({message:"User registered successfully",user});
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal server error",error});
    }
}
const loginUser = async (req,res) => {
    try {
        
    } catch (error) {
        
    }
}

export {
    registerUser,
    loginUser,
}