
import User from "../models/userModel";
import generateToken from "../utils/generateToken";
import bcrypt from "bcrypt";

const registerUser = async (req, res) => {
    try {
        const { name, email, password, mobile, image } = req.body;
        if (!name || !email || !password) {
            return res.status(401).json({ message: "Credentials are missing" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(401).json({ message: "User with this credential already exists" })
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            mobile,
            image
        })
        res.json({ message: "User registered successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, isAdmin: false });
        if (!user) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }
        if (user.isBlocked) {
            return res.status(400).json({ message: "User is blocked" });
        }
        if (!await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: "Email or password is incorrect" });
        }
        const token = generateToken(user);
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3600000
        });
        res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
                mobile: user.mobile
            }, token
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.json({ message: "UserId is missing" })
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const editUser = async (req, res) => {
    try {
        const { name, email, image, mobile } = req.body;
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ message: "User ID is missing" });
        }
        await User.findByIdAndUpdate(id, {
            name,
            email,
            mobile,
            image
        });
        res.status(200).json({ message: "User profile updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}

const logout = async (req,res) => {
    try {
        res.clearCookie("token",{
            httpOnly:true,
            secure:true,
        });
        return res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.error("Logout error:",error);
        res.status(500).json({message:"Failed to long out"});
    }
}

export {
    registerUser,
    loginUser,
    getUser,
    editUser,
    logout
}