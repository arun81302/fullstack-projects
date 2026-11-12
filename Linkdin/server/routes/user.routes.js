import express from "express";

import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";

import {
  getCurrentUser,
  updateprofile,getUserProfile,searchUsers,getSuggestedUsers  
} from "../controllers/user.controller.js";

const userRouter = express.Router();


userRouter.get("/currentuser", isAuth, getCurrentUser);
userRouter.get("/profile/:userId", isAuth, getUserProfile);
userRouter.get("/search", isAuth, searchUsers);
userRouter.get("/suggestions", isAuth, getSuggestedUsers);


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
