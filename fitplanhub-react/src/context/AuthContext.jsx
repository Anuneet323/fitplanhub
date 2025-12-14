import React, { createContext, useReducer, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const AuthContext = createContext();

const initialState = {
  user: JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  loading: false,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    
    case 'AUTH_SUCCESS':
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(action.payload.user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null
      };
    
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    case 'AUTH_LOGOUT':
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      return { user: null, token: null, loading: false, error: null };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback((user, token) => {
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: { user, token }
    });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
