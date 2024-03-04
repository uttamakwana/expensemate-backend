import mongoose from "mongoose";

export const connectToDB = async () => {
  const mongoURI = process.env.MONGO_URI;
  let connected = false;
  try {
    const response = await mongoose.connect(mongoURI, {
      dbName: "expensemate",
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
