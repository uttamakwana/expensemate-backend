import mongoose from "mongoose";

export const isValidId = (id) => {
  return mongoose.isValidObjectId(id);
};
