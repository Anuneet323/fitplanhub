export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  USER: 'user',
  TRAINER: 'trainer'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
};

export const MESSAGE_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info'
};

export const STORAGE_KEYS = {
  USER: 'fitplanhub_user',
  TOKEN: 'fitplanhub_token'
};
