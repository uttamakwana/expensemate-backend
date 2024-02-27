import express from "express";
import { createTransaction } from "../controllers/transaction-controllers.js";

const router = express.Router();

//* route
// create trasaction
router.post("/create", createTransaction);

export default router;
