const http = require("http");

//it will look for module.exports in the file routes.js
const routes = require("./routes"); // Import the routes module

console.log(routes.someText); // Log the exported text from the routes module

// This code creates an HTTP server that listens on port 3000
// and logs the request object to the console whenever a request is made.
const server = http.createServer(routes.handler);

// Start the server on port 3000, so we can go to the browser and open localhost:3000 to test it
server.listen(3000);
