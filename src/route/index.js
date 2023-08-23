var express = require("express");
const { login, authCheck } = require("../controllers/authController");
const { userList, addUser, getUser } = require("../controllers/userController");
const { userAuthToken } = require("../middleware/authCheck");
var route = express();

route.post("/login", login);
route.get("/user", getUser);
route.post("/add-user", addUser);

route.get("/user-list", userList);
route.get("/user-todo", userAuthToken, authCheck);

module.exports = route;
