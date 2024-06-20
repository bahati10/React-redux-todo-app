import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../store/store";
import {
  fetchTodos,
  addTodo,
  updateTodoContent,
  updateTodoStatus,
  deleteTodo,
} from "../store/todoSlice";
import type { Todo } from "../store/todoSlice";
import Navbar from "./common/Navbar";
import "../style.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenSquare,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const Todo = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector(
    (state: RootState) => state.todos
  );
  const [task, setTask] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  // Fetch todos when component mounts
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // Log todos whenever they change
  useEffect(() => {
    console.log("Todos from state:", todos); // Log to monitor state changes
  }, [todos]);

  const handleAddTodo = () => {
    if (task.trim()) {
      console.log("Adding todo:", task);
      dispatch(addTodo(task))
        .then((result) => {
          console.log("Add todo result:", result);
          if ("error" in result) {
            console.error("Failed to add todo:", result.error.message);
          } else {
            setTask(""); // Clear task input after adding
          }
        })
        .catch((error: any) => {
          console.error("Error adding todo:", error);
        });
    }
  };

  const handleUpdateTodoContent = () => {
    if (editingTodo) {
      dispatch(
        updateTodoContent({
          ...editingTodo,
          content: task,
        })
      )
        .then(() => {
          setEditingTodo(null);
          setTask("");
        })
        .catch((error: any) => {
          console.error("Error updating todo content:", error);
        });
    }
  };

  const handleUpdateTodoStatus = (todo: Todo) => {
    dispatch(updateTodoStatus(todo.id)).catch((error: any) => {
      console.error("Error updating todo status:", error);
    });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setTask(todo.content);
  };

  const handleDeleteTodo = (id: string) => {
    dispatch(deleteTodo(id));
  };

  return (
    <div className="todo-container">
      <Navbar />
      <div className="topbar">
        <div className="texts">
          <div className="main-text">TODO Done</div>
          <div className="small-text">Keep it up</div>
        </div>
        <div className="count-container">
          <div className="counts">
            <span className="done">
              {Array.isArray(todos) &&
                todos.filter((todo) => todo.status).length}
            </span>
            /
            <span className="pending">
              {Array.isArray(todos) && todos.length}
            </span>
          </div>
        </div>
      </div>

      <div className="todo-input-container">
        <input
          type="text"
          className="todo-input"
          placeholder="what's your next task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <div
          className="add-icon"
          onClick={
            editingTodo ? () => handleUpdateTodoContent() : handleAddTodo
          }
        >
          <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>

      {loading && <div>Loading...</div>}
      {error && (
        <div className="error">
          {typeof error === "string" ? (
            error
          ) : (
            <pre>{JSON.stringify(error, null, 2)}</pre>
          )}
        </div>
      )}

      <div className="todo-list">
        {Array.isArray(todos) &&
          todos.map((todo) => (
            <div className="todo" key={todo.id}>
              <div className="check-name">
                <input
                  type="checkbox"
                  className="status"
                  checked={todo.status}
                  onChange={() => handleUpdateTodoStatus(todo)}
                />
                <div className={`task ${todo.status ? "completed" : ""}`}>
                  {todo.content}
                </div>
              </div>
              <div className="icons">
                <FontAwesomeIcon
                  icon={faPenSquare}
                  className="edit-todo"
                  onClick={() => handleEditTodo(todo)}
                />
                <FontAwesomeIcon
                  icon={faTrash}
                  className="delete-todo"
                  onClick={() => handleDeleteTodo(todo.id)}
                />
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Todo;
