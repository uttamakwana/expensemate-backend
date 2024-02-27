import { response } from "../lib/response.js";
import { TryCatch } from "../lib/try-catch.js";
import { ErrorHandler } from "../lib/error-handler.js";
import { User } from "../models/user-model.js";

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

// async function splitBill(user, friend, index) {
//   user.friends = user.friends.map((e) => {
//     if (
//       e &&
//       e.friendId &&
//       e.friendId.toString() === friend.friendId.toString()
//     ) {
//       // split bill
//       e.transactions.push({
//         share: friend.share,
//         description: friend.description,
//         category: friend.category ? friend.category : "",
//         createdAt: Date.now(),
//       });
//       e.amount += friend.share;
//     }
//     return e;
//   });
//   const findThatFriend = await User.findById(friend.friendId);
//   findThatFriend.friends = findThatFriend.friends.map((e) => {
//     if (e && e.friendId && e.friendId.toString() === user._id.toString()) {
//       e.transactions.push({
//         share: friend.share,
//         description: friend.description,
//         category: friend.category ? friend.category : "",
//         createdAt: Date.now(),
//       });
//       e.amount -= friend.share;
//     }
//     return e;
//   });
//   await findThatFriend.save();
// }

// async function splitBill(user, friend, id) {
//   user.friends = user.friends.map((e) => {
//     if (
//       e &&
//       e.friendId &&
//       e.friendId.toString() === friend.friendId.toString()
//     ) {
//       e.transactions.push({
//         share: friend.share,
//         description: friend.description,
//         category: friend.category ? friend.category : "",
//         createdAt: Date.now(),
//       });
//       e.amount += friend.share;
//     }
//     return e;
//   });
//   const Friend = await User.findById(friend.friendId);
//   Friend.friends = Friend.friends.map((e) => {
//     if (
//       e &&
//       e.friendId &&
//       e.friendId.toString() === friend.friendId.toString()
//     ) {
//       e.transactions.push({
//         share: friend.share,
//         description: friend.description,
//         category: friend.category ? friend.category : "",
//         createdAt: Date.now(),
//       });
//       e.amount -= friend.share;
//     }
//     return e;
//   });
//   await Friend.save();
// }

async function splitBill(user, friend) {
  // Find the friend in the user's friends list
  const userFriend = user.friends.find(
    (e) => e.friendId.toString() === friend.friendId.toString()
  );

  // Update user's friend transaction
  if (userFriend) {
    userFriend.transactions.push({
      share: friend.share,
      description: friend.description,
      category: friend.category ? friend.category : "",
      createdAt: new Date(),
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
      description: friend.description,
      category: friend.category ? friend.category : "",
      createdAt: new Date(),
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
  const { userId } = req.body;
});
