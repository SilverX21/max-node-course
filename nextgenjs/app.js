//using ES modules, we can now import express and other modules using 'import' syntax
import express from "express";

//when we use the import of our classes, we need to specify the .js extension after the filename
//for packages, that is not necessary
import resHandler from "./response-handler.js";

const app = express();

app.get("/", resHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`NextGenJS app is running on port ${PORT}`);
});
