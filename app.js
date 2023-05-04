const express = require("express");
const cors = require("cors");

const app = express();

const usersRouter = require("./routes/usersRoute");
const petsRouter = require("./routes/petRoutes");

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/pets", petsRouter);

module.exports = app;
