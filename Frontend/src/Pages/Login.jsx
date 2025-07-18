import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { setUser } from '../redux/slices/userslice';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/users/login', {
        email,
        password,
      });
      console.log('response : ', response);
      
      if (response) {
        console.log('response : ', response);
        
        localStorage.setItem('token', response.data.token);
        dispatch(setUser(response.data.user));
        console.log('response : ', response);
        
        toast.success('Login successful', {
          description: `Welcome back, ${response.data.user.username}!`,
        });
        navigate('/');
      }
    } catch (error) {
      toast.error('Login failed', {
        description:
          error.response?.data?.message || 'Invalid credentials or server error.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-20">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-12 rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Login to Your Dashboard
        </h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-6 py-3 border rounded-lg text-base bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-3 border rounded-lg text-base bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg bg-green-600 text-white rounded-lg hover:bg-green-700 transition ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-10 text-center text-md text-gray-600 dark:text-gray-400">
          Don’t have an account?{' '}
          <Link to="/register" className="text-green-600 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
