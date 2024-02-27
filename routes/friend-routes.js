import express from "express";
import {
  friendRequest,
  sendFriendRequest,
} from "../controllers/friend-controllers.js";

const router = express.Router();

//* routes
router.post("/send-request/", sendFriendRequest);
router.post("/request", friendRequest);
export default router;
