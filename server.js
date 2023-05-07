const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const PORT = process.env.PORT || 8080;
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port:${PORT}`);
    });
  })
  .catch((err) => console.log("DB Connection Error: ", err.message));
