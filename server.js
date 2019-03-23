const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cros = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const uuid = require("./functions/uuid");
global[uuid] = {};
//const compression = require("compression");
const app = express();

// use helmet to secure express
app.use(helmet());
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
  socket.on("admin init", () => {
    //sotre the admin socket to global variable
    const date = new Date();
    const time = date.getTime();
    console.log(time);
    socket.username = time;
    global[uuid][socket.username] = socket;
  });
  socket.on("disconnect", function() {
    if (socket === global[uuid][socket.username]) {
      delete global[uuid][socket.username];
    }
    console.log("a user disconnected");
    console.log(global[uuid]);
  });
  socket.on("logout", function() {
    delete global[uuid][socket.username];
    console.log("a user disconnected");
    console.log(global[uuid]);
  });
});

//setup router
const productRouter = require("./routers/productRouter");
const userRouter = require("./routers/userRouter");
const messageRouter = require("./routers/messageRouter");
const reviewRouter = require("./routers/reviewRouter");
const careerRouter = require("./routers/careerRouter");
const appointmentRouter = require("./routers/appointmentRouter");

app.use("/api", userRouter);
app.use("/api/product", productRouter);
app.use("/api/message", messageRouter);
app.use("/api/review", reviewRouter);
app.use("/api/career", careerRouter);
app.use("/api/appointment", appointmentRouter);

//Listen to the port 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
