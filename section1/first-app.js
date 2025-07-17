//to run this code, use the command: node first-app.js (you must be inside the section1 folder))
console.log("Hello from Node.js");

// Import the 'fs' module to work with the file system
const fs = require("fs");
// Write a message to a file named 'hello.txt'
fs.writeFileSync("hello2.txt", "Hello from Node.js, this time we have a file here!");
