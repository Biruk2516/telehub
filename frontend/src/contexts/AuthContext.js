import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set auth token header
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Configure axios defaults
  useEffect(() => {
    axios.defaults.baseURL = 'http://localhost:5000';
    axios.defaults.timeout = 10000; // 10 second timeout
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    // Serve static uploads from backend domain
    axios.defaults.withCredentials = false;
  }, []);

  // Load user from API
  const loadUser = useCallback(async () => {
    try {
      const res = await axios.get('/api/auth/me');
      dispatch({ type: 'LOAD_USER_SUCCESS', payload: res.data.user });
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  }, []);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      setAuthToken(state.token);
      loadUser();
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.token, loadUser]);

  // Register user
  const register = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/register', formData);
      setAuthToken(res.data.token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      dispatch({ type: 'AUTH_ERROR' });
      return false;
    }
  };

  // Login user
  const login = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('/api/auth/login', formData);
      setAuthToken(res.data.token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      dispatch({ type: 'AUTH_ERROR' });
      return false;
    }
  };

  // Logout user
  const logout = () => {
    setAuthToken(null);
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    register,
    login,
    logout,
    loadUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
