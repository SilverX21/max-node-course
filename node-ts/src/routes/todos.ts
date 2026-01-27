import { Router } from "express";
import type { Todo } from "../models/todo.js";

const router = Router();

type RequestBody = {
  id: string;
  text: string;
};

type RequestParams = { todoId: string };

const todos: Todo[] = [];

router.get("/", (req, res, next) => {
  res.status(200).json({ todos: todos });
});

router.get("/:todoId", (req, res, next) => {
  const params = req.params as RequestParams;

  const todoIndex = todos.findIndex(
    (todoItem) => todoItem.id === params.todoId,
  );

  if (todoIndex > 0) {
    const todo = todos[todoIndex];
    return res
      .status(200)
      .json({ message: "Got the required todo", todo: todo });
  }

  res.status(404).json({ message: "Required todo wasn't found", todo: null });
});

router.post("/todo", (req, res, next) => {
  //we can use type casting like this to get intellisense
  //we can convert our body to a type or interface and then we can have access to the properties inside
  const body = req.body as RequestBody;

  const newTodo: Todo = {
    id: new Date().toISOString(),
    text: body.text,
  };

  todos.push(newTodo);

  res.status(201).json({ message: "Created todo", todos: todos });
});

router.delete("/todo/:todoId", (req, res, next) => {});

export default router;
