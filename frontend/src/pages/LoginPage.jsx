import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await login({ email, password });
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-4 py-6">

      <div className="absolute top-5 left-6 md:left-10 text-amber-700 font-semibold text-sm bg-yellow-200/80 px-3 py-1 rounded-full -rotate-2 shadow-sm">
        🗒️ Notes Galore
      </div>

      <div className="flex flex-col items-center -rotate-1 w-full max-w-lg">

        <div className="flex flex-col items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-500 shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
          <div className="w-px h-8 bg-stone-400/70" />
          <span className="w-2 h-2.5 rounded-full bg-stone-500 -mb-1" />
        </div>

        <div className="relative px-10 pt-12 pb-10 text-left bg-white rounded-2xl shadow-xl border border-amber-200 w-full">

          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-amber-100 border border-amber-300 shadow-inner" />

          <span className="inline-block bg-yellow-200/80 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full rotate-[-2deg] mb-4 shadow-sm">
            👋 welcome back
          </span>

          <h3 className="text-2xl font-bold text-amber-700 mb-4">Log in to your account</h3>

          {error && (
            <div className="flex items-start gap-2 text-sm text-red-700 mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
              <span className="leading-none mt-0.5">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mt-4">
              <label className="block text-stone-700 text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="john@gmail.com"
                className="w-full px-4 py-2.5 mt-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="block text-stone-700 text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 mt-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center justify-between mt-8">
              <button className="px-7 py-2.5 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-3 hover:scale-105 font-semibold transition-transform duration-200 shadow-md">
                Log In
              </button>
              <Link to="/signup" className="text-sm text-amber-700 font-medium hover:underline">
                Don't have an account? Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}