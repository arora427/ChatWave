import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;


        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } }, // Exclude current user
                { _id: { $nin: currentUser.friends } },
                // Exclude friends
                { isOnboarded: true } // Only include onboarded users
            ]
        })
        res.status(200).json(recommendedUsers);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getMyFriends(req, res) {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Unauthorized: User not found in request" });
        }

        const user = await User.findById(req.user._id)
            .select("friends")
            .populate("friends", "fullname email profilepic bio nativeLanguage learningLanguage");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        console.error("Error fetching friends:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


// ... other functions ...

export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user.id;
    const { id: recipientId } = req.params;

    // prevent sending req to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You can't send friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "Recipient not found" });
    }

    // check if user is already friends
    if (recipient.friends.includes(myId)) {
      return res.status(400).json({ message: "You are already friends with this user" });
    }

    // check if a req already exists
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { sender: myId, recipient: recipientId },
        { sender: recipientId, recipient: myId },
      ],
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "A friend request already exists between you and this user" });
    }

    const friendRequest = await FriendRequest.create({
      sender: myId,
      recipient: recipientId,
    });

    res.status(201).json(friendRequest);
  } catch (error) {
    console.error("Error in sendFriendRequest controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
// ... other functions ...
export async function acceptFriendRequestname(req, res) {
    try {
        const { id: requestId } = req.params

        const friendRequest = await FriendRequest.findById(requestId);

        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" })
        };
        //check if the request is for the current user
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this request" })
        };

        friendRequest.status = "accepted";
        await friendRequest.save();
        // Add each user to the other's friends list
        //$addToSet: ensures that the user is added only if they are not already in the array


        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });
        res.status(200).json({ message: "Friend request accepted" });

    } catch (error) {
        console.error("Error accepting friend request:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function getFriendRequests(req,res) {
    try {
       
        const incommingReqs= await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender","fullname profilepic bio nativeLanguage learningLanguage");

        
        const acceptedReqs= await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","fullname profilepic ");
        res.status(200).json({
            incommingReqs,
            acceptedReqs
        });
    } catch (error) {
        console.error("Error fetching friend requests:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getOutgoingFriendReq(req,res) {
    try {
      const outgoingRequests= await FriendRequest.find({
        sender:req.user.id,
        status:"pending"
      }).populate("recipient","fullname profilepic nativeLanguage learningLanguage");  
      res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error fetching outgoing friend requests:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

// In user.controller.js
import { streamClient } from "../lib/stream.js"; // Import the client

// ... other functions ...

export const removeFriend = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const { friendId } = req.params;

    // 1. Remove friend from both users' friends lists in MongoDB
    await User.findByIdAndUpdate(currentUserId, { $pull: { friends: friendId } });
    await User.findByIdAndUpdate(friendId, { $pull: { friends: currentUserId } });

    // 2. Remove users from the Stream Chat channel
    const channelId = [currentUserId.toString(), friendId].sort().join("-");
    const channel = streamClient.channel("messaging", channelId);
    await channel.removeMembers([currentUserId.toString(), friendId]);

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};