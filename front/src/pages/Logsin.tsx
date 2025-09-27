import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Eye, EyeOff, User, Mail, Lock, LogIn, UserPlus, Code2, GraduationCap } from 'lucide-react';

// Type definitions
interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'junior' | 'senior';
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: 'junior' | 'senior';
  };
}

interface SignupResponse {
  token: string;
  newUser: {
    _id: string;
    name: string;
    email: string;
    role: 'junior' | 'senior';
  };
}

const LoginSignup: React.FC = () => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'junior'
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [message, setMessage] = useState<string>('');

  // API BASE URL (matches your backend)
  const API_BASE_URL: string = 'http://localhost:3000/users';

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleRoleChange = (role: 'junior' | 'senior'): void => {
    setFormData(prev => ({
      ...prev,
      role
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.role) {
      newErrors.role = 'Please select your developer level';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data: LoginResponse = await response.json();

      if (response.ok) {
        // Store token and user data including role
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('Login successful!');
        
        // Redirect to chat after 1.5s
        setTimeout(() => {
          window.location.href = '/';
        }, 1500);
      } else {
        setMessage(data.error || 'Login failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data: SignupResponse = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! Redirecting to login...');
        // Auto-switch to login after 2s
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ name: '', email: '', password: '', role: 'junior' });
          setMessage('');
        }, 2000);
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = (): void => {
    setIsLogin(!isLogin);
    setFormData({ name: '', email: '', password: '', role: 'junior' });
    setErrors({});
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-2xl mb-4">
              {isLogin ? <LogIn className="w-8 h-8 text-indigo-600" /> : <UserPlus className="w-8 h-8 text-indigo-600" />}
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-gray-600">
              {isLogin ? 'Sign in to your account' : 'Join our developer community'}
            </p>
          </div>

          <div className="space-y-6">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Role Selection (Signup only) */}
            {!isLogin && (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Developer Level
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* Junior Developer */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('junior')}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                      formData.role === 'junior'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <GraduationCap className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Junior</div>
                    <div className="text-xs opacity-75">0-3 years</div>
                  </button>

                  {/* Senior Developer */}
                  <button
                    type="button"
                    onClick={() => handleRoleChange('senior')}
                    className={`p-4 border-2 rounded-lg text-center transition-all duration-200 ${
                      formData.role === 'senior'
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Code2 className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Senior</div>
                    <div className="text-xs opacity-75">3+ years</div>
                  </button>
                </div>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
            )}

            {/* Message */}
            {message && (
              <div className={`text-center p-3 rounded-lg ${
                message.includes('successful') 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={isLogin ? handleLogin : handleSignup}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg transition duration-300 flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            {/* Toggle Mode */}
            <div className="text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
                <button
                  type="button"
                  onClick={toggleMode}
                  className="ml-2 text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;