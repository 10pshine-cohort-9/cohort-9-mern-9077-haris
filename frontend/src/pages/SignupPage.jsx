import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please enter your name.';
    }

    if (!email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter a password.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const data = await signup({ name, email, password });
      loginUser(data);
      navigate('/dashboard');
    } catch (err) {
      setErrors({
        email: err.response?.data?.message || 'Registration failed.'
      });
    }
  }

  function handleNameChange(e) {
    setName(e.target.value);

    setErrors((prev) => ({
      ...prev,
      name: ''
    }));
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
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-4">

      <Link
        to="/"
        className="absolute top-5 left-6 md:left-10 text-amber-700 font-semibold text-sm bg-yellow-200/80 px-3 py-1 rounded-full -rotate-2 shadow-sm hover:bg-yellow-200 transition-colors"
      >
        🗒️ Notes Galore
      </Link>

      <div className="relative px-8 py-8 text-left bg-white rounded-2xl shadow-xl border border-amber-200 w-full max-w-md">

        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center rotate-6">
          <svg
            width="30"
            height="34"
            viewBox="0 0 34 34"
            className="drop-shadow-md"
          >
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

            <rect
              x="16"
              y="20"
              width="2"
              height="11"
              fill="url(#pinNeedle)"
            />

            <circle
              cx="17"
              cy="14"
              r="10"
              fill="url(#pinHead)"
              stroke="#991b1b"
              strokeWidth="0.5"
            />

            <ellipse
              cx="13.5"
              cy="10"
              rx="3"
              ry="2"
              fill="white"
              opacity="0.5"
            />
          </svg>

          <div className="w-4 h-1.5 bg-black/20 rounded-full blur-[2px] -mt-1" />
        </div>

        <span className="inline-block bg-yellow-200/80 text-amber-900 text-xs font-semibold px-3 py-1 rounded-full rotate-[-2deg] mb-4 shadow-sm">
          ✍️ start noting
        </span>

        <h3 className="text-2xl font-bold text-amber-700 mb-4">
          Create an account
        </h3>

        <form onSubmit={handleSubmit} noValidate>

          <div className="mt-4">
            <label htmlFor="signup-name" className="block text-stone-700 text-sm font-medium">
              Name
            </label>

            <input
              id="signup-name"
              type="text"
              placeholder="John Doe"
              className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
                errors.name
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-amber-200 focus:ring-amber-400'
              }`}
              value={name}
              onChange={handleNameChange}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'signup-name-error' : undefined}
            />

            {errors.name && (
              <p id="signup-name-error" className="mt-1.5 text-xs text-red-600">
                {errors.name}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="signup-email" className="block text-stone-700 text-sm font-medium">
              Email
            </label>

            <input
              id="signup-email"
              type="email"
              placeholder="john@gmail.com"
              className={`w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
                errors.email
                  ? 'border-red-300 focus:ring-red-200'
                  : 'border-amber-200 focus:ring-amber-400'
              }`}
              value={email}
              onChange={handleEmailChange}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'signup-email-error' : undefined}
            />

            {errors.email && (
              <p id="signup-email-error" className="mt-1.5 text-xs text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label htmlFor="signup-password" className="block text-stone-700 text-sm font-medium">
              Password
            </label>

            <div className="relative mt-2">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                className={`w-full px-4 py-2 pr-11 border rounded-md focus:outline-none focus:ring-2 placeholder:text-stone-400 ${
                  errors.password
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-amber-200 focus:ring-amber-400'
                }`}
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'signup-password-error' : undefined}
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
                      d="M9.88 4.24A9.94 9.94 0 0112 4c5 0 8.5 3.7 10 8a17.3 17.3 0 01-3.12 4.88"
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
              <p id="signup-password-error" className="mt-1.5 text-xs text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-3 hover:scale-105 font-semibold transition-transform duration-200 shadow-md"
            >
              Sign Up
            </button>

            <Link
              to="/login"
              className="text-sm text-amber-700 font-medium hover:underline"
            >
              Already have an account? Login
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}