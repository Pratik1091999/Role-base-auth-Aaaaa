const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/userRoute");
require("dotenv").config();

app.use(express.json());
app.use("/user", userRoute);

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("connected"));

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Server Started at " + PORT);
});
app.listen(PORT, () => console.log(`Server Started at Port - ${PORT}`));
