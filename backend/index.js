const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const path = require("path");
const app = express();

connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/login", require("./routes/login"));
app.use("/api/register", require("./routes/register"));
app.use("/api/chat", require("./routes/user"));
app.use("/api/avatar", require("./routes/avatar"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("../frontend/docGPT/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/docGPT", "build", "index.html"));
  });
}

app.listen(5000, function () {
  console.log("Servidor arrancado en el puerto 5000!");
});