const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const path = require("path");
const dotenv = require("dotenv");
const app = express();
const verifyToken = require('./routes/validate-token');

dotenv.config()
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/login", require("./routes/login"));
app.use("/api/register", require("./routes/register"));
app.use("/api/chat", verifyToken, require("./routes/user"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/docGPT/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/docGPT", "build", "index.html"));
  });
}

app.listen(5000, function () {
  console.log("Servidor arrancado en el puerto 5000!");
});