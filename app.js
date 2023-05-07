const express = require("express");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHanlder = require("./controllers/errorControllers");
const app = express();

const userRouter = require("./routes/userRoutes");
const petRouter = require("./routes/petRoutes");

app.use(express.json());
app.use(cors());
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
