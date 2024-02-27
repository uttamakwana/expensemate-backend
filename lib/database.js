import mongoose, { connect } from "mongoose";

export const connectToDB = async () => {
  let connected = false;
  try {
    const response = await mongoose.connect("mongodb://localhost:27017", {
      dbName: "splitwise",
    });
    if (response) {
      console.log("***** Connected to Database *****");
      console.log("Database name: ", response.connection.name);
      console.log("Database host: ", response.connection.host);
      connected = true;
    }
  } catch (error) {
    console.log(error);
    connected = false;
  }
  return { connected };
};
