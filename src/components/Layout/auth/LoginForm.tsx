import React, { useState, useContext } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthFormInput } from './AuthFormInput';
import { Button } from '../ui/Button';
import { AuthContext } from '../../context/AuthContext';


export const LoginForm: React.FC = () => {
  const { login } = useContext(AuthContext)!; // Utilisation du contexte d'auth

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      login(formData.username, formData.password);
    } catch (error: any) {
      setErrors({
        form: error.message || 'Authentication failed. Please check your credentials.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.form && (
        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
          {errors.form}
        </div>
      )}
      
      <AuthFormInput
        label="Username"
        name="username"
        type="text"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        required
        autoComplete="username"
      />
      
      <div className="relative">
        <AuthFormInput
          label="Password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="flex items-center">
        <div className="text-sm">
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline transition-colors">
            Forgot password?
          </a>
        </div>
      </div>
      
      <Button 
        type="submit" 
        isLoading={isSubmitting}
        className="w-full"
      >
        Sign in
      </Button>
    </form>
  );
};