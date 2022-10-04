import { TodoItem } from "@my-todo-app/shared";
import {
  loadAllTodoItems,
  loadTodoItem,
  saveTodoItem,
} from "../models/todos-repository";

export const saveTodo = async (todoItem: TodoItem, author: string): Promise<TodoItem[]> => {
  if (!todoItem.text || todoItem.text == "") {
    throw new Error("Invalid text on todo item!");
  }

  todoItem.timeStamp = new Date();
  todoItem.author = author

  await saveTodoItem(todoItem);

  return await loadAllTodoItems();
};

export const loadTodos = async (): Promise<TodoItem[]> => {
  return await loadAllTodoItems();
};

export const loadItemById = async (todoId: string): Promise<TodoItem> => {
  const item = await loadTodoItem(todoId);

  if (!item) {
    throw new Error(`Can't find item with id ${todoId}`);
  }

  return item;
};
