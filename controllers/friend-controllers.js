import { TryCatch } from "../lib/try-catch.js";
import { ErrorHandler } from "../lib/error-handler.js";
import { User } from "../models/user-model.js";
import { isValidId } from "../lib/utils.js";
import { response } from "../lib/response.js";

//* Send Friend Request
//* POST
//* Pubilc | Auth
//* localhost:4000/friend/send-request/
export const sendFriendRequest = TryCatch(async (req, res, next) => {
  const { userId, friendId } = req.body;
  if (!userId || !friendId) {
    return next(new ErrorHandler("Id is required!", 400));
  }
  if (userId === friendId) {
    return next(
      new ErrorHandler("You can't send friend request to yourself!", 400)
    );
  }
  if (!isValidId(userId) || !isValidId(friendId)) {
    return next(new ErrorHandler("Provide a valid Id!", 400));
  }
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (user && friend) {
    // user found now send the friend request:
    // first check if request already exists or not.
    const isReqAlreadyExist = friend.friendRequests?.findIndex(
      (e) => e.userId.toString() === userId.toString()
    );
    if (isReqAlreadyExist === -1) {
      // request does not exist!
      friend.friendRequests.push({ userId });
      await friend.save();
      return response(res, 200, true, "Request sent successfully!");
    } else {
      return next(new ErrorHandler("Request already sent!", 404));
    }
  } else {
    return next(new ErrorHandler("User not found!", 404));
  }
});

//* Accept Friend Request
//* POST
//* Pubilc | Auth
//* localhost:4000/friend/accept-request
export const friendRequest = TryCatch(async (req, res, next) => {
  const { userId, friendId } = req.body;
  const { status } = req.query;
  if (!userId || !friendId) {
    return next(new ErrorHandler("Id is required!", 400));
  }
  if (userId === friendId) {
    return next(
      new ErrorHandler("You can't send friend request to yourself!", 400)
    );
  }
  if (!isValidId(userId) || !isValidId(friendId)) {
    return next(new ErrorHandler("Provide a valid Id!", 400));
  }
  const user = await User.findById(userId);
  const friend = await User.findById(friendId);
  if (user && friend && status === "accept") {
    // users found! now accept the friend request
    user.friends.push({ friendId, name: friend.name });
    friend.friends.push({ friendId: userId, name: user.name });
    user.friendRequests = user.friendRequests.filter(
      (e) => e.userId.toString() !== friendId.toString()
    );
    await user.save();
    await friend.save();
    return response(res, 200, true, "Friend request accepted!");
  } else if (user && friend && status === "decline") {
    user.friendRequests = user.friendRequests.filter(
      (e) => e.userId.toString() !== friendId.toString()
    );
    await user.save();
    return response(res, 200, true, "Friend request declined!");
  } else {
    // user not found
    return next(new ErrorHandler("User not found!", 404));
  }
});
