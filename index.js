import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./lib/database.js";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
//* import routes
import userRoutes from "./routes/user-routes.js";
import friendRoutes from "./routes/friend-routes.js";
import transactionRoutes from "./routes/transaction-routes.js";
//* import middleware
import { errorMiddleware } from "./middlewares/error-middleware.js";

//* configurations
dotenv.config();

//* variables
// create app
const app = express();
// create PORT
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//* middlewares
// parse body data into json
app.use(express.json());
// cross origin resource sharing: only frontend can send request
app.use(cors());

//* routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/friend", friendRoutes);
app.use("/api/v1/transaction", transactionRoutes);

//* error handler
//* wherever you use 'return next(new ErrorHandler(message, statusCode)) the req will be come here and error will be throwed!
app.use(errorMiddleware);

app.use("/uploads", express.static("uploads"));

//* connect to the database then only connect to the server
const { connected } = await connectToDB();
if (connected) {
  // server listens to a user request
  app.listen(PORT, () => {
    console.log("***** Connected to Server *****");
    console.log(`Server is started on PORT: ${PORT}`);
  });
}

// Handle 404 errors
app.all("*", (req, res) => {
  res.status(404).sendFile(resolve(__dirname, "public", "404-not-found.html"));
});

export default app;
