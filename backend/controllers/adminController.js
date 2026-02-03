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

export {
    adminLogin,

}