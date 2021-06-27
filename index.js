const connectDB = require("./startup/db");
const express = require("express");
const app = express();
const users = require("./routes/users");
const terms = require("./routes/terms");
const techs = require("./routes/techs");
const goals = require("./routes/goals");
const profiles = require("./routes/profiles");
const characters = require("./routes/characters");
const auth = require("./routes/auth");
const cors = require("cors");

connectDB();

app.use(cors());
app.use(express.json());
app.use("/api/users", users);
app.use("/api/terms", terms);
app.use("/api/techs", techs);
app.use("/api/goals", goals);
app.use("/api/profiles", profiles);
app.use("/api/characters", characters);
app.use("/api/auth", auth);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});
