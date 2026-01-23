import express from "express";
import {registerUser, loginUser, getUser, editUser, logout} from "../controllers/userController"

const router = express.Router();

router.post("/signup",registerUser);