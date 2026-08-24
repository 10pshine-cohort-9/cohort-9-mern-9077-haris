import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      const data = await signup({ name, email, password });
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-4">

      <div className="absolute top-5 left-6 md:left-10 text-amber-700 font-semibold text-sm bg-yellow-200/80 px-3 py-1 rounded-full -rotate-2 shadow-sm">
        🗒️ Notes Galore
      </div>

      <div className="relative px-8 py-8 text-left bg-white rounded-2xl shadow-xl border border-amber-200 w-full max-w-md">

        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center rotate-6">
          <svg width="30" height="34" viewBox="0 0 34 34" className="drop-shadow-md">
            <defs>
              <radialGradient id="pinHead" cx="35%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="45%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="#b91c1c" />
              </radialGradient>
              <linearGradient id="pinNeedle" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e5e7eb" />
                <stop offset="100%" stopColor="#6b7280" />
              </linearGradient>
            </defs>
            <rect x="16" y="20" width="2" height="11" fill="url(#pinNeedle)" />
            <circle cx="17" cy="14" r="10" fill="url(#pinHead)" stroke="#991b1b" strokeWidth="0.5" />
            <ellipse cx="13.5" cy="10" rx="3" ry="2" fill="white" opacity="0.5" />
          </svg>
          <div className="w-4 h-1.5 bg-black/20 rounded-full blur-[2px] -mt-1" />
        </div>

        <span className="inline-block bg-yellow-200/80 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full rotate-[-2deg] mb-4 shadow-sm">
          ✍️ start noting
        </span>

        <h3 className="text-2xl font-bold text-amber-700 mb-4">Create an account</h3>

        {error && (
          <div className="flex items-start gap-2 text-sm text-red-700 mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
            <span className="leading-none mt-0.5">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-stone-700 text-sm font-medium">Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 mt-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-stone-700 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="john@gmail.com"
              className="w-full px-4 py-2 mt-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mt-4">
            <label className="block text-stone-700 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="At least 8 characters"
              className="w-full px-4 py-2 mt-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-400 placeholder:text-stone-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="flex items-center justify-between mt-6">
            <button className="px-6 py-2 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-3 hover:scale-105 font-semibold transition-transform duration-200 shadow-md">
              Sign Up
            </button>
            <Link to="/login" className="text-sm text-amber-700 font-medium hover:underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}