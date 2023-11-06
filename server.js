const express = require("express");
const logger = require("morgan");
const books = require("./app/api/routes/book");
const users = require("./app/api/routes/users");
const cors = require("cors");
const mongoose = require("./app/api/config/database"); //database configuration
var jwt = require("jsonwebtoken");
const app = express();

app.set("secretKey", "nodeRestApi"); // jwt secret token

// connection to mongodb
mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

app.use(logger("dev"));

var corsOptions = {
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// public route
app.use("/users", users);

// private route
app.use("/book", validateUser, books);
app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

// JWT middleware
function validateUser(req, res, next) {
  jwt.verify(
    req.headers["x-access-token"],
    req.app.get("secretKey"),
    function (err, decoded) {
      if (err) {
        res.status(401).json({ status: "error", message: err.message });
      } else {
        // add user id to request
        req.body.userId = decoded.cognitoSub;
        next();
      }
    }
  );
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use(function (err, req, res, next) {
  if (err.status === 404) res.status(404).json({ message: "Not found" });
  else res.status(500).json({ message: "Something wents wrong :( !!!" });
});

// server listening
app.listen(3000, function () {
  console.log("Node server listening on port 3000");
});
