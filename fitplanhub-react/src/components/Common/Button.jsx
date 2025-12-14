import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = ''
}) => {
  const buttonClass = `
    btn
    btn-${variant}
    btn-${size}
    ${fullWidth ? 'btn-full' : ''}
    ${disabled || loading ? 'btn-disabled' : ''}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? '⏳ Loading...' : children}
    </button>
  );
};

export default Button;
