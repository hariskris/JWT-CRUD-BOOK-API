const userModel = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  create: function (req, res, next) {
    userModel.findOne(
      { email: req.body.email, phone: req.body.phone },
      function (err, userInfo) {
        if (!userInfo) {
          let user = {};
          user.name = req.body.name;
          user.email = req.body.email;
          user.phone = req.body.phone;
          user.password = req.body.password;
          user.cognitoSub = uuidv4();
          userModel.create(user, function (err, result) {
            if (err) next(err);
            else
              res.status(200).send({ message: "User added successfully!!!" });
          });
        } else {
          res
            .status(422)
            .send({ message: "Email or phone number already exists" });
        }
      }
    );
  },
  authenticate: function (req, res, next) {
    userModel.findOne({ email: req.body.email }, function (err, userInfo) {
      console.log("user", userInfo);
      if (err) {
        next(err);
      } else {
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { cognitoSub: userInfo.cognitoSub },
            req.app.get("secretKey"),
            { expiresIn: "1h" }
          );
          res
            .status(200)
            .send({
              message: "Loggedin succesfully!!!",
              data: { user: userInfo, token: token },
            });
        } else {
          res.status(422).send({ message: "Invalid email/password!!!" });
        }
      }
    });
  },
};
