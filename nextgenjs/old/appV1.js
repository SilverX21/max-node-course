const express = require("express");
const fs = require("fs");

const app = express();

app.get("/", (req, res, next) => {
  fs.readFile("my-page.html", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading welcome file.");
      return;
    }
    res.send(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NextGenJS app is running on port ${PORT}`);
});
