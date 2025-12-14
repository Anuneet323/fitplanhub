import React, { useState, useEffect } from 'react';

const Message = ({ text, type = 'info', onClose = () => {} }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!show) return null;

  const icon = {
    'success': '✓',
    'error': '✕',
    'info': 'ℹ'
  };

  return (
    <div className={`message message-${type}`}>
      <span className="message-icon">{icon[type]}</span>
      <span>{text}</span>
    </div>
  );
};

export default Message;
