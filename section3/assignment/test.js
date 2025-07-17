const http = require("http");
const testRoutes = require("./test-routes");

const server = http.createServer(testRoutes.handler);

server.listen(3000);
