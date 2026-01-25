import fs from "fs";
//we can import path module like this in ES modules
//or we can import specific methods from it like "dirname"
//path has all of the methods we need to work with file and directory paths
//but we can specifically import only what we need
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//__dirname is not available in ES modules by default, we can derive it from import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const resHandler = (req, res, next) => {
  //express has a built-in method to send files
  res.sendFile(path.join(__dirname, "my-page.html"));
};

//we can export using ES module syntax now
export default resHandler;
