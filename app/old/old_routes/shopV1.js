const express = require("express");
const path = require("path");
const rootDir = require("../util/path");

const router = express.Router();

router.get("/", (req, res, next) => {
  console.log("this is the value of __dirname inside the shop.js: ", __dirname);
  // sendFile is a method that allows us to send a file as a response, it takes the absolute path to the file we want to send
  //the __direname variable gives the absolute path to the current directory. It is a global variable in Node.js
  //path.join is used to create a path that is compatible with the current operating system
  //the first argument global __direname, the second is ../, this is because the __direname is pointing to the current folder, that's "routes"
  // then it's the directory we want, and then it's the file name we want to provide
  //we can't use / as a separator because it will not work on Windows, so we use path.join to create a path that is compatible with the current operating system
  res.sendFile(path.join(rootDir, "views", "shop.html"));
});

module.exports = router;
