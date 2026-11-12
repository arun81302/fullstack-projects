import express from "express";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

import {
  getCurrentUser,
  updateprofile,
} from "../controllers/user.controller.js";

const userRouter = express.Router();

// Get current user
userRouter.get("/currentuser", isAuth, getCurrentUser);

// Update profile
userRouter.put(
  "/updateprofile",
  isAuth,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  updateprofile,
);

export default userRouter;
