import mongoose from "mongoose";

//* transaction schema
const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Amount is required!"],
    },
    description: {
      type: String,
      required: [true, "Description is required!"],
    },
    category: {
      type: String,
    },
    friends: [
      {
        friendId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        share: {
          type: Number,
          required: [true, "Share of friend is required!"],
        },
        description: {
          type: String,
          required: [true, "Description for friend is required!"],
        },
        category: {
          type: String,
        },
        paid: {
          type: Boolean,
          default: false,
        },
        paidAt: {
          type: Date,
        },
      },
    ],
    attachement: {
      type: String,
    },
  },
  { timestamps: true }
);

//* friend request
const FriendRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
});

//* friend schema
const FriendSchema = new mongoose.Schema({
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
  },
  name: {
    type: String,
  },
  amount: {
    type: Number,
    default: 0,
  },
  transactions: [
    {
      share: {
        type: Number,
        required: [true, "Share of friend is required!"],
      },
      category: {
        type: String,
      },
      description: {
        type: String,
        required: [true, "Description of friend is required"],
      },
      createdAt: {
        type: Date,
        required: [
          true,
          "Time of transaction created for the friend is required",
        ],
      },
      updatedAt: {
        type: Date,
      },
      paid: {
        type: Boolean,
        default: false,
      },
      paidAt: {
        type: Date,
      },
      paidId: {
        type: String,
      },
    },
  ],
});

//* final user schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name requried!"],
    },
    email: {
      type: String,
      required: [true, "Email required!"],
      unique: [true, "Email already exists!"],
    },
    password: {
      type: String,
      required: [true, "Password requried!"],
    },
    friends: [FriendSchema],
    friendRequests: [FriendRequestSchema],
    transactions: [TransactionSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model("users", UserSchema);
