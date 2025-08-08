import express from "express"
const router = express.Router();
import { protectRoute } from "../middlewares/authMiddleware.js";
import { getMessages, sendMessage, getUsersForSidebars } from "../controllers/messageController.js";

router.get("/users",protectRoute,getUsersForSidebars);
router.get("/:id",protectRoute,getMessages);
router.post("/send/:id",protectRoute,sendMessage);

export default router;