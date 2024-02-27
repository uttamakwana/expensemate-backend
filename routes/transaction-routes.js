import express from "express";
import {
  createTransaction,
  paidTransaction,
} from "../controllers/transaction-controllers.js";

const router = express.Router();

//* route
// create trasaction
router.post("/create", createTransaction);
// paid transaction
router.post("/paid", paidTransaction);

export default router;
