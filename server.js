const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB Connection Engaged"));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Listening on port:${PORT}`);
});
