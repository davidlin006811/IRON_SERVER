const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cros = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();
// use helmet to secure express
app.use(helmet);
//Enable cros to skip the Same origin policy, it will be changed when deploying
app.use(cros());
// log client request to console
app.use(morgan("dev"));
// Use body parse to parse the body of Post request
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));
//DB config
const db = require("./config/db_config").MONGO_URI;

//Connect to Mongo
mongoose.Promise = global.Promise;
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));

//bind socket io to server
const server = require("http").createServer(app);
io = require("socket.io").listen(server);
io.on("connection", function(socket) {
  console.log("new user connected");
  socket.on("disconnect", function() {
    console.log("a user disconnected");
  });
});

//setup router
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
app.use("/api", userRouter);
app.use("/api/product", productRouter);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
