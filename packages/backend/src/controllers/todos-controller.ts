import TodoItem from "@my-todo-app/shared";
import express, { Router, Request, Response } from "express";
import { loadItemById, loadTodos, saveTodo } from "../services/todos-service";

const todosController = express.Router();

todosController.get("/", async (req: Request, res: Response<TodoItem[]>) => {
  res.send(await loadTodos());
});

todosController.get("/:todoId", async (req: Request, res: Response<TodoItem>) => {
  try {
    res.send(await loadItemById(req.params.todoId));
  } catch (e) {
    res.sendStatus(404)
  }
})

todosController.post(
  "/",
  async (req: Request<TodoItem>, res: Response<TodoItem[]>) => {
    try {
      res.send(await saveTodo(req.body));
    } catch (e) {
      res.sendStatus(400)
    }
  }
);

export default todosController;
