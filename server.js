const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./model/User.js");

mongoose.connect("mongodb://localhost:27017/FurryFriends");

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

const usersRouter = require("./routes/usersRoute");
const petsRouter = require("./routes/petsRoute");

app.use(express.json());
app.use(cors());
app.use("/users", usersRouter);
app.use("/pets", petsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
