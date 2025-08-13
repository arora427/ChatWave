import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequestname, getFriendRequests, getMyFriends, getOutgoingFriendReq, getRecommendedUsers, sendFriendRequest, testRoute } from "../controllers/user.controller.js";



const router = express.Router();

router.use(protectRoute);

router.get("/", getRecommendedUsers);
router.get("/friends", getMyFriends);
router.post("/friend-request/:userId", sendFriendRequest);
router.put("/friend-request/:userId/accept", acceptFriendRequestname);
router.get("/friend-requests", getFriendRequests); 

router.get("/outgoing-friend-requests", getOutgoingFriendReq );

// Add this line for testing
router.get("/test", testRoute);


export default router;
