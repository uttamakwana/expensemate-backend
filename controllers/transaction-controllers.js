import { response } from "../lib/response.js";
import { TryCatch } from "../lib/try-catch.js";
import { ErrorHandler } from "../lib/error-handler.js";
import { User } from "../models/user-model.js";
import { ObjectId } from "mongodb";

//* Create Transaction
//* POST
//* Pubilc | Auth
//* localhost:4000/transaction/create
export const createTransaction = TryCatch(async (req, res, next) => {
  const { userId, amount, description, category, friends, attachement } =
    req.body;
  const { split } = req.query;
  let user = await User.findById(userId);
  if (user) {
    // user found
    user.transactions.push({
      amount,
      description,
      category: category ? category : "",
      friends: friends.length > 0 ? friends : [],
      attachement: attachement ? attachement : "",
    });
    if (friends.length === 0 && split === "true") {
      return next(
        new ErrorHandler(
          "Please provide information of friend's share and description!",
          404
        )
      );
    } else if (friends.length > 0 && split === "true") {
      await Promise.all(
        friends.map((friend, index) => splitBill(user, friend, index))
      );
    }
    await user.save();
    return response(res, 200, true, "Trasaction created successfully!");
  } else {
    return next(new ErrorHandler("User not found!", 404));
  }
});

async function splitBill(user, friend) {
  const paidId = new ObjectId();
  // Find the friend in the user's friends list
  const userFriend = user.friends.find(
    (e) => e.friendId.toString() === friend.friendId.toString()
  );

  // Update user's friend transaction
  if (userFriend) {
    userFriend.transactions.push({
      share: friend.share,
      name: friend.name,
      description: friend.description,
      category: friend.category ? friend.category : "",
      createdAt: new Date(),
      paidId,
    });
    userFriend.amount += friend.share;
  }

  // Find the user in the friend's friends list
  const friendToUpdate = await User.findById(friend.friendId);
  const friendInUserList = friendToUpdate.friends.find(
    (e) => e.friendId.toString() === user._id.toString()
  );

  // Update friend's transaction
  if (friendInUserList) {
    friendInUserList.transactions.push({
      share: friend.share,
      name: friend.name,
      description: friend.description,
      category: friend.category ? friend.category : "",
      createdAt: new Date(),
      paidId,
    });
    friendInUserList.amount -= friend.share;
  }

  // Save friend's changes
  await friendToUpdate.save();
}

//* Paid Transaction
//* POST
//* Public | Auth
//* localhost:4000/transaction/paid
export const paidTransaction = TryCatch(async (req, res, next) => {
  const { userId, friendId, paidId } = req.body;
  if (userId && friendId && paidId) {
    const data = await User.findById(userId);
    const dataFriend = await User.findById(friendId);
    if (data && dataFriend) {
      const findThatFriend = data.friends.find(
        (e) => e.friendId.toString() === friendId.toString()
      );

      if (findThatFriend) {
        const transaction = findThatFriend.transactions.find(
          (e) => e.paidId === paidId
        );
        findThatFriend.amount += transaction.share;
        transaction.paid = true;
      }

      const findThatFriendsMainAccount = dataFriend.friends.find(
        (e) => e.friendId.toString() === userId.toString()
      );
      if (findThatFriendsMainAccount) {
        const transaction = findThatFriendsMainAccount.transactions.find(
          (e) => e.paidId === paidId
        );
        findThatFriendsMainAccount.amount -= transaction.share;
        transaction.paid = true;
      }
    } else {
      return next(new ErrorHandler("User not found!", 400));
    }
    await data.save();
    await dataFriend.save();
    return response(res, 200, true, "Paid status changed successfully!");
  } else {
    return next(new ErrorHandler("Make sure to provide all information!", 400));
  }
});
