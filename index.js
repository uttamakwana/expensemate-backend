import express from "express";
import dotenv from "dotenv";
import { connectToDB } from "./lib/database.js";
//* import routes
import userRoutes from "./routes/user-routes.js";
import friendRoutes from "./routes/friend-routes.js";
import transactionRoutes from "./routes/transaction-routes.js";
import { errorMiddleware } from "./middlewares/error-middleware.js";

//* configurations
dotenv.config();

//* variables
// create app
const app = express();
const PORT = process.env.PORT || 3000;

//* middlewares
// parse body data into json
app.use(express.json());

//* routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/transaction", transactionRoutes);

//* error handler
//* wherever you use 'return next(new ErrorHandler(message, statusCode)) the req will be come here and error will be throwed!
app.use(errorMiddleware);

//* connect to the database then only connect to the server
const { connected } = await connectToDB();
if (connected) {
  // server listens to a user request
  app.listen(PORT, () => {
    console.log("***** Connected to Server *****");
    console.log(`Server is started on PORT: ${PORT}`);
  });
}

app.get("/", (req, res) => {
  res.send("Hi");
});

export default app;
