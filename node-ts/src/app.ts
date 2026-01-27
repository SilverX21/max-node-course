import bodyParser from "body-parser";
import express from "express";
import todosRoutes from "./routes/todos.js";

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(todosRoutes);

app.listen(port, () => {
  console.log(`Connected to port ${port}`);
});
