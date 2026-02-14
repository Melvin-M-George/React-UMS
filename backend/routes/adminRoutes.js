import express from "express";
import { adminLogin,createUser,deleteUser,editUser,getUsers,logoutAdmin,updateUserStatus } from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login",adminLogin);
router.get("/users",authMiddleware,getUsers);
router.put("/update-userStatus/:id",authMiddleware,updateUserStatus);
router.post("/create-user",authMiddleware,createUser);
router.delete("/delete-user/:id",authMiddleware,deleteUser);
router.put("/edit-user/:id",authMiddleware,editUser);
router.post("/logout",logoutAdmin);

export default router;
