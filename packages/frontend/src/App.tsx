import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { LoginInput } from "./LoginInput";
import { TodoItem } from "@my-todo-app/shared";

axios.defaults.baseURL =
  process.env.REACT_APP_TODO_API || "http://localhost:3001";
axios.interceptors.request.use((config) => {
  if (!config?.headers) {
    config.headers = {};
  }
  const jwt = localStorage.getItem("jwt");
  if (jwt) {
    config.headers["authorization"] = `Bearer ${jwt}`;
  }
  return config;
});

const fetchTodos = async (): Promise<TodoItem[]> => {
  const response = await axios.get<TodoItem[]>("/todos");
  return response.data;
};

const TodoList = ({ todos, error }: { todos: TodoItem[]; error?: string }) => {
  if (error) {
    return <div>{error}</div>;
  } else if (todos) {
    return (
      <div>
        {todos.map((item) => {
          return <p key={item._id}>{item.text}</p>;
        })}
      </div>
    );
  } else {
    return <div>'Waiting for todos'</div>;
  }
};

const TodoInput = ({
  todoText,
  setTodoText,
  onCreate,
}: {
  todoText: string;
  setTodoText: (text: string) => void;
  onCreate: (text: string) => void;
}) => {
  return (
    <>
      <input
        type="text"
        value={todoText}
        onChange={(e) => setTodoText(e.target.value)}
      />
      <button onClick={(e) => onCreate(todoText)}>Create todo</button>
    </>
  );
};

function App() {
  const [todoText, setTodoText] = useState<string>("");
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [error, setError] = useState<string | undefined>();
  const [isLoggedIn, setLoggedIn] = useState<boolean>(false);

  const createTodo = async (todoText: string): Promise<void> => {
    const todoItem: TodoItem = {
      text: todoText,
      timeStamp: new Date(),
    };

    try {
      await axios.post("/todos", todoItem);
      const response = await axios.get<TodoItem[]>("/todos");
      setTodos(response.data);
    } catch (err) {
      setTodos([]);
      setError("Something went wrong when fetching my todos...");
    } finally {
      setTodoText("");
    }
  };

  useEffect(() => {
    fetchTodos()
      .then(setTodos)
      .catch((error) => {
        setTodos([]);
        setError("Something went wrong when fetching my todos...");
      });
  }, []);

  const performLogin = async (
    username: string,
    password: string
  ): Promise<void> => {
    const loginResponse = await axios.post("/login", {
      username: username,
      password: password,
    });
    if (loginResponse && loginResponse.status === 200) {
      localStorage.setItem("jwt", loginResponse.data);
      setLoggedIn(true);
      setError("");
      const response = await axios.get<TodoItem[]>("/todos");
      setTodos(response.data);
    }
  };

  return (
    <div className="App">
      <header className="App-header">My ToDo Lists</header>
      <section className="App-content">
        {isLoggedIn ? (
          <TodoList todos={todos} error={error} />
        ) : (
          <LoginInput onLogin={performLogin} />
        )}
      </section>
      <footer className="App-footer">
        <TodoInput
          onCreate={createTodo}
          setTodoText={setTodoText}
          todoText={todoText}
        />
      </footer>
    </div>
  );
}

export default App;
