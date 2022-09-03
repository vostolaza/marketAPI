import app from "./app";
import mongoose from "mongoose";

const dotenv = require("dotenv");
dotenv.config();

mongoose
  .connect(process.env.DB_URL!)
  .then(() => {
    console.log("Connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Server Ready ⚡");
      console.log(`Listening on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("cannot connect to mongo db: ", JSON.stringify(err, null, 2));
  });
