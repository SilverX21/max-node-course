const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>My First Page</title></head>");
    res.write("<body>");
    res.write("<h1>Hello from my assignment! :)</h1>");
    res.write("<ul><li>John Cena</li></ul>");
    res.write("<form action='/create-user' method='POST'>");
    res.write("<input type='text' name='username' placeholder='Enter Username'>");
    res.write("<button type='submit'>Submit</button>");
    res.write("</form>");
    res.write("</body>");
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });

    return req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      const username = parsedBody.split("=")[1];
      console.log(username); // Log the username to the console
      res.statusCode = 302; // Redirect after processing
      res.setHeader("Location", "/");
      return res.end();
    });
  }
};

module.exports = {
  handler: requestHandler,
};
