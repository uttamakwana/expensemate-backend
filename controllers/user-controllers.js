import { response } from "../lib/response.js";
import { TryCatch } from "../lib/try-catch.js";
import { ErrorHandler } from "../lib/error-handler.js";
import { User } from "../models/user-model.js";
//* bcrypt
import bcrypt from "bcrypt";

//* User Register
//* POST
//* Pubilc
//* localhost:4000/user/register``
export const register = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  } else {
    // hasing the password for encryption(security)
    const hashedPassword = await bcrypt.hash(password, 10);
    let user;
    if (hashedPassword) {
      user = await User.create({ name, email, password: hashedPassword });
    }
    return response(res, 200, true, "Registration successfull!", { user });
  }
});

//* User Login
//* POST
//* Pubilc
//* localhost:4000/user/login
export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  } else {
    const user = await User.findOne({ email }).select("password");
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return next(new ErrorHandler("Email or password maybe wrong!!", 400));
    } else {
      return response(res, 200, true, "Login successfull!", { user });
    }
  }
});

//* Get All Users
//* GET
//* Pubilc (Authenticated Rotue)
//* localhost:4000/user/all
export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find({});
  if (users.length === 0) {
    return response(res, 404, false, "No users found!");
  }
  return response(res, 200, true, "Users retrieved successfully!", users);
});

//TODO: Create a Logout API once authentication is established
