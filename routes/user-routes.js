import express from "express";
import { userLogin, userRegister } from "../controllers/user-controllers.js";
const router = express.Router();

//* routes endpoint
router.post("/login", userLogin);
router.post("/regsiter", userRegister);

export default router;
