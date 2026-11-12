import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
  sendConnectionRequest,
  getConnectionStatus,
  getReceivedRequests,
  getSentRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  getMyConnections,
} from "../controllers/connection.controllers.js";

const connectionRouter = express.Router();

connectionRouter.post("/request/:userId", isAuth, sendConnectionRequest);

connectionRouter.get("/status/:userId", isAuth, getConnectionStatus);

connectionRouter.get("/requests/received", isAuth, getReceivedRequests);

connectionRouter.get("/requests/sent", isAuth, getSentRequests);

connectionRouter.put("/accept/:requestId", isAuth, acceptConnectionRequest);

connectionRouter.put("/reject/:requestId", isAuth, rejectConnectionRequest);

connectionRouter.delete("/cancel/:requestId", isAuth, cancelConnectionRequest);

connectionRouter.get("/all", isAuth, getMyConnections);

export default connectionRouter;