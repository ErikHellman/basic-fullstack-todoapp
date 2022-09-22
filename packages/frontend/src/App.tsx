import React, { useEffect, useState } from "react";
import TodoItem from "@my-todo-app/shared";
import "./App.css";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_TODO_API || "http://localhost:3001";

const fetchTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>("/todos");
  return response.data;
};

function App() {
  const [todoText, setTodoText] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string | undefined>();

  const createTodo = async (todoText: string): Promise<void> => {
    const todoItem: TodoItem = {
      text: todoText,
      timeStamp: new Date(),
    };

    try {
      await axios.post("/todos", todoItem)
      const response = await axios.get<TodoItem[]>("/todos")
      setTodos(response.data)
    } catch(err) {
      setTodos([]);
      setError("Something went wrong when fetching my todos...");
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTodos()
      .then(setTodos)
      .catch((error) => {
        setTodos([]);
        setError("Something went wrong when fetching my todos...");
      });
    }, 10000)

    return () => clearInterval(interval)
  }, []);

  const output = () => {
    if (error) {
      return <div>{error}</div>;
    } else if (todos) {
      return (
        <div>
          {todos.map((item) => {
            return <p key={item.id}>{item.text}</p>;
          })}
        </div>
      );
    } else {
      return <div>'Waiting for todos'</div>;
    }
  };

  return (
    <div className="App">
      <header className="App-header">{output()}</header>
      <section>
        <input
          type="text"
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button onClick={(e) => createTodo(todoText)}>Create todo</button>
      </section>
    </div>
  );
}

export default App;
