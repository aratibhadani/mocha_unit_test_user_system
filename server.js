var express = require("express");
const route = require("./src/route");
const port = 3000;
var app = express();
app.use(express.json());
app.use("/", route);

var server = app.listen(port, function () {
  console.log("Example app listening at http://localhost",port);
});
module.exports = server;
