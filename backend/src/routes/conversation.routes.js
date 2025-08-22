import express from "express";
import { getConversationMessages } from "../controllers/conversation.controllers.js";
import { isAuthenticatedUser } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:id/messages", isAuthenticatedUser, getConversationMessages);

export default router;
