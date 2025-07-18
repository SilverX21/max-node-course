const http = require("http");

const server = http.createServer((req, res) => {
  console.log(req.url);
});

server.listen(3000);
console.log("Server listening in port 3000");
