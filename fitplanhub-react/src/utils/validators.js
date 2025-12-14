export const validators = {
  email: (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      return 'Invalid email address';
    }
    return null;
  },

  password: (password) => {
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return null;
  },

  name: (name) => {
    if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return null;
  },

  price: (price) => {
    if (!price || price < 1) {
      return 'Price must be greater than 0';
    }
    return null;
  },

  duration: (duration) => {
    if (!duration || duration < 1) {
      return 'Duration must be at least 1 day';
    }
    return null;
  },
};

export const validateForm = (formData, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const validator = rules[field];
    const error = validator(formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
