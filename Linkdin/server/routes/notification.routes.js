import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../controllers/notification.controllers.js";

const notificationRouter = express.Router();

notificationRouter.get("/all", isAuth, getNotifications);

notificationRouter.put("/read/:id", isAuth, markNotificationAsRead);

notificationRouter.put("/read-all", isAuth, markAllNotificationsAsRead);

export default notificationRouter;