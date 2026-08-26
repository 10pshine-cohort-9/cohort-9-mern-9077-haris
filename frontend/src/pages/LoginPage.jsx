import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const data = await login({ email, password });
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setErrors({
        password: err.response?.data?.message || 'Login failed.'
      });
    }
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);

    setErrors((prev) => ({
      ...prev,
      email: ''
    }));
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);

    setErrors((prev) => ({
      ...prev,
      password: ''
    }));
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-4 py-6">

      <Link
        to="/"
        className="absolute top-5 left-6 md:left-10 text-amber-700 font-semibold text-sm bg-yellow-200/80 px-3 py-1 rounded-full -rotate-2 shadow-sm hover:bg-yellow-200 transition-colors"
      >
        🗒️ Notes Galore
      </Link>

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

          <h3 className="text-2xl font-bold text-amber-700 mb-4">
            Log in to your account
          </h3>

          <form onSubmit={handleSubmit} noValidate>

            <div className="mt-4">
              <label className="block text-stone-700 text-sm font-medium">
                Email
              </label>

              <input
                type="email"
                placeholder="john@gmail.com"
                className={`w-full px-4 py-2.5 mt-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-amber-200 focus:ring-amber-400'
                }`}
                value={email}
                onChange={handleEmailChange}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-stone-700 text-sm font-medium">
                Password
              </label>

              <div className="relative mt-2">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-md focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
                    errors.password
                      ? 'border-red-300 focus:ring-red-200'
                      : 'border-amber-200 focus:ring-amber-400'
                  }`}
                  value={password}
                  onChange={handlePasswordChange}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-amber-600 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 3l18 18"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10.58 10.58a2 2 0 102.83 2.83"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.88 4.24A9.94 9.94 0 0112 4c5 0 8.5 4 10 8a17.3 17.3 0 01-3.12 4.88"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.23 6.23C4.77 7.45 3.7 9.1 2 12c1.5 4 5 8 10 8 1.61 0 3.07-.34 4.36-.91"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.06 12.35a1 1 0 010-.7C3.6 7.7 7.32 4 12 4s8.4 3.7 9.94 7.65a1 1 0 010 .7C20.4 16.3 16.68 20 12 20s-8.4-3.7-9.94-7.65z"
                      />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-8">
              <button
                type="submit"
                className="px-7 py-2.5 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-3 hover:scale-105 font-semibold transition-transform duration-200 shadow-md"
              >
                Log In
              </button>

              <Link
                to="/signup"
                className="text-sm text-amber-700 font-medium hover:underline"
              >
                Don't have an account? Sign up
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}