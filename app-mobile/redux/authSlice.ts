import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "../utils/axiosConfig";
import Constants from "expo-constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUser } from "../types";

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

type AuthState = {
  user: IUser | null;
  isAuth: boolean;
  loading: boolean;
  loadingProfile: boolean;
  error: string | null;
};

const initialState: AuthState = {
  loading: false,
  loadingProfile: false,
  isAuth: false,
  user: null,
  error: null,
};

// register user

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (
    {
      username,
      email,
      password,
    }: {
      username: string;
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/auth/register`,
        {
          username,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store token in AsyncStorage for register
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }

      return data.user as IUser;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// login user

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (
    {
      email,
      password,
    }: {
      email: string;
      password: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await axios.post(
        `${apiUrl}/auth/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Store token in AsyncStorage for login
      if (data.token) {
        await AsyncStorage.setItem('token', data.token);
      }

      return data.user as IUser;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// logout user

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/logout`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('token');

      return data.user as IUser;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// profile

export const loadProfile = createAsyncThunk(
  "auth/loadProfile",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${apiUrl}/auth/profile`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return data.user as IUser;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Check if user is authenticated on app startup
export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No token found');
      }
      
      const { data } = await axios.get(`${apiUrl}/auth/profile`);
      return data.user as IUser;
    } catch (error: any) {
      // Remove invalid token
      await AsyncStorage.removeItem('token');
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    clearError: (state) => {
      state.error = null;
    },

    setAuth: (state, action) => {
      state.isAuth = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isAuth = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state) => {
      state.loading = false;
    });

    builder.addCase(loadProfile.pending, (state) => {
      state.loadingProfile = true;
    });
    builder.addCase(loadProfile.fulfilled, (state, action) => {
      state.loadingProfile = false;
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(loadProfile.rejected, (state) => {
      state.loadingProfile = false;
      state.isAuth = false;
      state.user = null;
    });

    builder.addCase(checkAuthStatus.pending, (state) => {
      state.loadingProfile = true;
    });
    builder.addCase(checkAuthStatus.fulfilled, (state, action) => {
      state.loadingProfile = false;
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(checkAuthStatus.rejected, (state) => {
      state.loadingProfile = false;
      state.isAuth = false;
      state.user = null;
    });
  },
});

export const { clearError, setAuth, setUser, setLoading } = authSlice.actions;

export default authSlice.reducer;