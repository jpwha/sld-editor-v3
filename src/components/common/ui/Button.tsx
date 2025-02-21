import React from 'react';

export const Button: React.FC<{ children: React.ReactNode; onClick?: () => void; disabled?: boolean; className?: string }> = ({
  children,
  onClick,
  disabled,
  className = '',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 bg-blue-500 text-white rounded ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'} ${className}`}
  >
    {children}
  </button>
);