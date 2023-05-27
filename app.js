const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const AppError = require("./utils/appError");
const globalErrorHanlder = require("./controllers/errorControllers");
const app = express();

const userRouter = require("./routes/userRoutes");
const petRouter = require("./routes/petRoutes");
const authRouter = require("./routes/authRoutes");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://furry-friends-client.vercel.app",
    ],
    credentials: true,
  })
);
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/pet", petRouter);

//Handles non-existing routes
app.all("*", (req, res, next) => {
  next(
    new AppError(
      `The route ${req.originalUrl} does not exist on this server`,
      404
    )
  );
});

app.use(globalErrorHanlder);

module.exports = app;
