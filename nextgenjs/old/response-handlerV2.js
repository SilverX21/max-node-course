//we can use the fs promises API to work with files using promises/async-await
import fs from "fs/promises";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  //as we can see, using promises we can avoid callback hell
  //we can make the readFile method return a promise and then use .then() and .catch() to handle the result
  fs.readFile("my-page.html", "utf8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default resHandler;
