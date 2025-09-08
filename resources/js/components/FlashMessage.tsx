import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface FlashMessageProps {
  message: string;
  type: 'success' | 'error';
  onClose?: () => void;
  duration?: number;
}

const FlashMessage: React.FC<FlashMessageProps> = ({
  message,
  type,
  onClose,
  duration = 5000,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };

  if (!visible) return null;

  return (
    <div
      className={`fixed top-4 right-4 flex items-center p-4 rounded-md shadow-md ${type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} max-w-md z-50 animate-fade-in-down`}
      role="alert"
    >
      <div className="flex items-center">
        {type === 'success' ? (
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
        )}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button
        onClick={handleClose}
        className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default FlashMessage;