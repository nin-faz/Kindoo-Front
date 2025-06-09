import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Lock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-center">
          <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3">
            <Lock className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-white">{isLogin ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="text-indigo-200 mt-1 text-sm">
            {isLogin ? 'Sign in to access your account' : 'Sign up to get started with our service'}
          </p>
        </div>

        {/* Form Container */}
        <div className="p-6">
          {isLogin ? <LoginForm /> : <RegisterForm />}

          {/* Toggle between login and register */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-1 text-indigo-600 font-medium hover:text-indigo-500 focus:outline-none focus:underline transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;