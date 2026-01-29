import express from "express";
import { registerUser,loginUser,getUser,editUser,logout } from "../controllers/userController";

const router = express();

router.post("/signup",registerUser);
router.post("/login",loginUser);
router.get("/user-details/:id",getUser);
router.put("/edit-user/:id",editUser);
router.post("/logout",logout);

export default router;