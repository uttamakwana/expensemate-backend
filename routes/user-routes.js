import express from "express";
import {
  login,
  register,
  getAllUsers,
  getUserInfo,
} from "../controllers/user-controllers.js";
const router = express.Router();

//* routes endpoint
// login
router.post("/login", login);
// register
router.post("/register", register);
// all users
router.get("/all", getAllUsers);
// get user info
router.get("", getUserInfo);

export default router;
