import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left'
}) => {
  const baseClasses = 'font-medium rounded-full transition-all duration-200 inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-purple-500 text-white hover:bg-purple-600 active:bg-purple-700 shadow-md hover:shadow-lg',
    secondary: 'bg-pink-500 text-white hover:bg-pink-600 active:bg-pink-700 shadow-md hover:shadow-lg',
    outline: 'border-2 border-purple-500 text-purple-500 hover:bg-purple-50 active:bg-purple-100',
    ghost: 'text-purple-500 hover:bg-purple-50 active:bg-purple-100'
  };
  
  const sizeClasses = {
    sm: 'text-xs px-3 py-1',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3'
  };
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && iconPosition === 'left' && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="ml-2">{icon}</span>}
    </button>
  );
};

export default Button;