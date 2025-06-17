import React, { useState, useContext, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AuthFormInput } from './AuthFormInput';
import { Button } from '../ui/Button';
import { useMutation, gql } from '@apollo/client';
import { AuthContext } from '../../context/AuthContext';

const REGISTER_USER = gql`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      id
      userName
      createdAt
    }
  }
`;

const LOGIN_USER = gql`
  mutation Login($username: String!, $pass: String!) {
    login(username: $username, pass: $pass)
  }
`;

export const RegisterForm: React.FC = () => {
  const [createUser] = useMutation(REGISTER_USER);
  const [loginMutation] = useMutation(LOGIN_USER);
  const { login } = useContext(AuthContext)!;

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: ''
  });

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

  useEffect(() => {
    if (!formData.password) {
      setPasswordStrength({ score: 0, label: '' });
      return;
    }
    let score = 0;
    const password = formData.password;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    score = Math.min(4, Math.floor(score / 1.5));
    const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong'];
    setPasswordStrength({
      score,
      label: labels[score]
    });
  }, [formData.password]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength.score < 2) {
      newErrors.password = 'Password is too weak';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const { data } = await createUser({
        variables: {
          createUserInput: {
            userName: formData.username,
            password: formData.password,
          },
        },
      });
      // Si l'inscription a réussi, on enchaîne avec le login
      if (data?.createUser) {
        const loginResult = await loginMutation({
          variables: {
            username: formData.username,
            pass: formData.password,
          },
        });
        if (loginResult.data?.login) {
          login(loginResult.data.login);
        }
      }
    } catch (error: any) {
      setErrors({
        form: error.message || 'Registration failed. Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const PasswordStrengthIndicator = () => {
    if (!formData.password) return null;
    const colors = [
      'bg-red-500',     // Very weak
      'bg-orange-500',  // Weak
      'bg-yellow-500',  // Fair
      'bg-green-400',   // Good
      'bg-green-500'    // Strong
    ];
    return (
      <div className="mt-2">
        <div className="flex h-1 w-full bg-slate-200 rounded-full overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className={`h-full flex-1 ${i <= passwordStrength.score ? colors[passwordStrength.score] : 'bg-slate-200'} transition-all duration-300`}
            />
          ))}
        </div>
        <p className="text-xs mt-1 text-slate-500">
          Password strength: <span className={`font-medium ${colors[passwordStrength.score].replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
        </p>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
        autoComplete="name"
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
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
        {/* Contraintes du mot de passe */}
        <PasswordStrengthIndicator />
        <ul className="mt-2 text-xs text-slate-500 list-disc list-inside">
            <li>Au moins 8 caractères</li>
            <li>Au moins une majuscule</li>
            <li>Au moins une minuscule</li>
            <li>Au moins un chiffre</li>
            <li>Au moins un caractère spécial</li>
        </ul>
      </div>
      
      <div className="relative">
        <AuthFormInput
          label="Confirm Password"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <Button 
        type="submit" 
        isLoading={isSubmitting}
        className="w-full"
      >
        Create Account
      </Button>
    </form>
  );
};