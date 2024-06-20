// store/todoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export interface Todo {
  id: string;
  content: string;
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  loading: false,
  error: null,
};

// Async thunk for fetching todos
export const fetchTodos = createAsyncThunk<Todo[]>(
  "todos/fetchTodos",
  async () => {
    const response = await axios.get("http://localhost:3000/api/todo/all");
    console.log("fetchTodos response:", response.data);
    return response.data.todos;
  }
);

// Async thunk for adding a new todo
export const addTodo = createAsyncThunk<Todo, string>(
  "todos/addTodo",
  async (content) => {
    const response = await axios.post("http://localhost:3000/api/todo/create", {
      content,
    });
    console.log("addTodo response:", response.data);
    return response.data;
  }
);

// Async thunk for updating a todo's content
export const updateTodoContent = createAsyncThunk<Todo, Todo>(
  "todos/updateTodoContent",
  async (todo) => {
    const response = await axios.put(
      `http://localhost:3000/api/todo/update/${todo.id}`,
      { content: todo.content }
    );
    console.log("updateTodoContent response:", response.data);
    return response.data.updatedTodo;
  }
);

// Async thunk for updating a todo's status
export const updateTodoStatus = createAsyncThunk<Todo, string>(
  "todos/updateTodoStatus",
  async (id) => {
    const response = await axios.put(
      `http://localhost:3000/api/todo/complete/${id}`
    );
    console.log("updateTodoStatus response:", response.data);
    return response.data.updatedTodo;
  }
);

// Async thunk for deleting a todo
export const deleteTodo = createAsyncThunk<string, string>(
  "todos/deleteTodo",
  async (id) => {
    await axios.delete(`http://localhost:3000/api/todo/delete/${id}`);
    console.log("deleteTodo id:", id);
    return id;
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.loading = false;
        state.todos = action.payload;
        console.log("State after fetchTodos.fulfilled:", state.todos);
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch todos";
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
        console.log("State after addTodo.fulfilled:", state.todos);
      })
      .addCase(
        updateTodoContent.fulfilled,
        (state, action: PayloadAction<Todo>) => {
          const index = state.todos.findIndex(
            (todo) => todo.id === action.payload.id
          );
          if (index !== -1) {
            state.todos[index] = action.payload;
          } else {
            console.error("Updated todo content not found in state");
          }
          console.log("State after updateTodoContent.fulfilled:", state.todos);
        }
      )
      .addCase(
        updateTodoStatus.fulfilled,
        (state, action: PayloadAction<Todo>) => {
          const index = state.todos.findIndex(
            (todo) => todo.id === action.payload.id
          );
          if (index !== -1) {
            state.todos[index] = action.payload;
          } else {
            console.error("Updated todo status not found in state");
          }
          console.log("State after updateTodoStatus.fulfilled:", state.todos);
        }
      )
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        console.log("State after deleteTodo.fulfilled:", state.todos);
      });
  },
});

export default todoSlice.reducer;
