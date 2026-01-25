import fs from "fs";

//if we use the export default syntax, we can import without using {}
//otherwise, we would need to import using { resHandler }
//using exports const resHandler would require that we import using {}
const resHandler = (req, res, next) => {
  fs.readFile("my-page.html", "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading welcome file.");
      return;
    }
    res.send(data);
  });
};

//we can export using ES module syntax now
export default resHandler;
