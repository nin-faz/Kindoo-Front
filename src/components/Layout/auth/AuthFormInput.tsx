import React, { useState } from 'react';

type AuthFormInputProps = {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
};

export const AuthFormInput: React.FC<AuthFormInputProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  error,
  required = false,
  autoComplete,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value;

  return (
    <div className="relative">
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          required={required}
          autoComplete={autoComplete}
          className={`
            block w-full px-4 pt-6 pb-1 text-slate-900 bg-white border 
            rounded-lg appearance-none focus:outline-none focus:ring-2 
            peer placeholder-transparent transition-all duration-200
            ${error 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200' 
              : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-200'
            }
          `}
          placeholder={label}
        />
        <label
          htmlFor={name}
          className={`
            absolute text-sm duration-200 transform origin-[0] 
            ${isActive ? '-translate-y-3 scale-75 top-4 z-10 text-gray-500' : 'top-4 translate-y-0 scale-100'} 
            left-4 peer-focus:-translate-y-3 peer-focus:scale-75 
            peer-focus:top-4 peer-focus:z-10 
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 
            peer-placeholder-shown:top-4 pointer-events-none 
            ${error 
              ? 'text-red-500 peer-focus:text-red-600' 
              : isActive ? 'text-slate-500' : 'text-slate-500 peer-focus:text-indigo-600'
            }
          `}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};