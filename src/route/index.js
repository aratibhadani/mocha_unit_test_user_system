var express = require("express");
const { login, authCheck } = require("../controllers/authController");
const { userList, addUser, getUser, updateUser, deleteUser } = require("../controllers/userController");
const { userAuthToken } = require("../middleware/authCheck");
var route = express();

route.post("/login", login);
route.post("/add-user", addUser);
route.get("/user/:id", getUser);
route.patch("/user/:id", updateUser);
route.delete("/user/:id", deleteUser);
route.get("/user-list", userList);

route.get("/user-todo", userAuthToken, authCheck);

module.exports = route;
