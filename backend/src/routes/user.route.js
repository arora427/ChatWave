import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequestname, getFriendRequests, getMyFriends, getOutgoingFriendReq, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:id", sendFriendRequest); // Restored to :id
router.put("/friend-requests/:id/accept", acceptFriendRequestname);
router.get("/friend-requests", getFriendRequests); 
router.get("/outgoing-friend-requests", getOutgoingFriendReq );

export default router;