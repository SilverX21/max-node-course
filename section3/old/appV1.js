const http = require("http");
const fs = require("fs");

// This code creates an HTTP server that listens on port 3000
// and logs the request object to the console whenever a request is made.
const server = http.createServer((req, res) => {
  const url = req.url; // Get the URL of the request
  const method = req.method; // Get the HTTP method of the request

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Message</title></head>");
    res.write(
      '<body><form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form></body>'
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];

    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk); // Collect the data chunks
    });

    //this event is triggered when all data has been received
    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString(); // Combine the chunks into a single Buffer and convert to string
      const message = parsedBody.split("=")[1]; // Extract the message from the parsed body, it should be in the format "message=your_message"

      fs.writeFile("message.txt", message, (err) => {
        res.statusCode = 302; // Set the status code to 302 for redirection
        res.setHeader("Location", "/"); // Set the Location header to redirect to the home page
        return res.end();
      });
    });
  }

  // Set the response header to indicate that the content type is HTML
  res.setHeader("Content-Type", "text/html");
  // Write a simple HTML response
  res.write("<html>");
  res.write("<head><title>My First Page</title></head>");
  res.write("<body><h1>Hello World!</h1></body>");
  res.write("</html>");
  res.end(); // End the response, if we do something regarding the response, it will throw an error
});

// Start the server on port 3000, so we can go to the browser and open localhost:3000 to test it
server.listen(3000);
