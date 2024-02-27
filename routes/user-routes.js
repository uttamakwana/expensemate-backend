import express from "express";
import {
  login,
  register,
  getAllUsers,
} from "../controllers/user-controllers.js";
const router = express.Router();

//* routes endpoint
// login
router.post("/login", login);
// register
router.post("/register", register);
// all users
router.get("/all", getAllUsers);

export default router;
