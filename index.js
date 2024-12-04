const express = require("express");
const { auth } = require("./routes/auth");
const cors = require("cors");
const { deposit } = require("./routes/deposit");
const app = express();

app.use(cors())

app.use(express.json())

app.use("/auth", auth)
app.use("/",deposit)

app.listen(5000);