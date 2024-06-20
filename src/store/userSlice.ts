import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import axiosInstance from "../api/axios";

interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface UserState {
  loading: boolean;
  user: User | null;
  error: string | null;
}

const initialState: UserState = {
  loading: false,
  user: null,
  error: null,
};

export const signupUser = createAsyncThunk<
  User,
  { firstname: string; lastname: string; email: string; password: string },
  { rejectValue: string }
>("signup", async (formData, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/register", {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
    });
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

export const loginUser = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>("login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.post("/login", credentials);

    const token = response.data.token;
    // Store the token in cookies
    Cookies.set("token", token, { expires: 7 }); // Set cookie with expiration date

    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response.data.message);
  }
});

// Define a logout action
export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      Cookies.remove("token"); // Remove token from cookies
    } catch (error: any) {
      return rejectWithValue("Error logging out");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default userSlice.reducer;
