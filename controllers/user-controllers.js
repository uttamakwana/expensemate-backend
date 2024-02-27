import { response } from "../lib/response.js";
import TryCatch from "../lib/try-catch.js";
import ErrorHandler from "../lib/error-handler.js";
import { User } from "../models/user-model.js";

//* User Register
//* POST
//* Pubilc
//* localhost:4000/user/register
export const userRegister = TryCatch(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  } else {
    const user = await User.create({ name, email, password });
    return response(res, 200, true, "Registration successfull!", { user });
  }
});

//* User Login
//* POST
//* Pubilc
//* localhost:4000/user/login
export const userLogin = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("All fields are required!", 400));
  } else {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("User not found!", 404));
    }
    const isCorrectPassword = user.password === password;
    if (!isCorrectPassword) {
      return next(new ErrorHandler("Email or password maybe wrong!!", 400));
    } else {
      return response(res, 200, true, "Login successfull!", { user });
    }
  }
});
