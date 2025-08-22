import express from "express";

import { isAuthenticatedUser } from "../middlewares/auth.js";
import { getAllUsers, getUser, findUserByEmail } from "../controllers/user.controllers.js";

const router = express.Router();

router.route("/").get(isAuthenticatedUser, getAllUsers);

router.route("/find-by-email").post(isAuthenticatedUser, findUserByEmail);

router.route("/:id").get(isAuthenticatedUser, getUser);

export default router;
