import User from "../models/User.js";
import  FriendRequest from "../models/FriendRequest.js"

export async function getRecommendedUsers(req,res)
{
    try {
        const currentUserId=req.user.id;
        const currentUser=req.user;

        const recommendedUser= await User.find({
            $and:[{_id:{$ne:currentUserId}},// exclude current user
                {$id:{$nin:currentUser.friends}},//exclude current Users friends
                {isOnboarded:true},
            ],
        });
        res.status(200).json({recommendedUser});

    } catch (error) {
        console.error("error in getRecommendedUser controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getMyFriends(req,res)
{
    try {
        const user=await User.findById(req.user.id).select("friends").populate("friends",
            "fullName nativeLanguage learningLanguage profilePic"
        );
        res.status(200).json(user.friends);
    } catch (error) {
        console.error("error in getMyFriends controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function sendFriendRequest(req,res){
    try {
        const myId=req.user.id;
        const {id:recipientId}=req.params;

        if(myId===recipientId) return res.status(400).json({message:"you can't send friend request to yourself"});

        const recipient=await User.findById(recipientId);

        if(!recipient) return res.status(400).json({message:"recipient not found"});

        if(recipient.find.include(myId)) return res.status(400).json({message:"you are already friend with user"});

        const existingRequest=await FriendRequest.findOne({
            $or:[{sender:myId,recipient:recipientId},{sender:recipientId,recipient:myId}],
        });

        if(existingRequest) return res.status(400).json({message:"A friend already exists between you and this user"});

        const friendRequest= await FriendRequest.create({
            sender:myId,
            recipient:recipientId
        });
        res.status(201).json(friendRequest);

    } catch (error) {
        console.error("error in sendFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function acceptFriendRequest(req,res)
{
    try {
        const {id:requestId}=req.params;
        const friendRequest=await FriendRequest.findById(requestId);
        if(!friendRequest) return res.status(404).json({message:"friend request not found"});
        if(friendRequest.recipient.toString()!==re.user.id) return res.status(404).json({message:"you are not authorized to accept this request"});
        friendRequest.status="accepted";
        await friendRequest.save();

        //add each user to others friend array
        //$addtoSet:adds element to an array only if they do not already exist 
        await User.findByIdAndUpdate(friendRequest.sender,{
            $addtoset:{friends:friendRequest.recipient}
        })

        await User.findByIdAndUpdate(friendRequest.recipient,{
            $addtoset:{friends:friendRequest.sender}
        })
    } catch (error) {
        console.error("error in acceptFriendRequest controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getFriendRequests(req,res)
{
    try {
        const incomingReqs=await FriendRequest.find({
            recipient:req.user.id,
            status:"pending",
        }).populate("sender","fullName nativeLanguge learningLanguage");

        const acceptedReqs=await FriendRequest.find({
            sender:req.user.id,
            status:"accepted",
        }).populate("recipient","fullName profilePic");

        res.status(200).json({incomingReqs,acceptedReqs});

    } catch (error) {
        console.error("error in getFriendRequests controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function getOutgoingFriendReqs(req,res){
    try {
        const outgoingRequests=await FriendRequest.find({
            sender:req.user.id,
            status:"pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error("error in getOutgoingRequestReqs controller",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}