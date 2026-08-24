import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex items-center bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 px-6 md:px-16 py-12 overflow-hidden">
      <div className="max-w-6xl w-full mx-auto flex flex-col-reverse md:flex-row items-center justify-between gap-12 -translate-y-3 md:-translate-y-5">

        {/* Text */}
        <div className="flex-1 text-left md:pr-8 translate-x-1 md:translate-x-4">
          <span className="inline-block bg-yellow-200/80 text-amber-900 text-sm font-semibold px-3 py-1 rounded-full rotate-[-2deg] mb-4 shadow-sm">
            📌 your thoughts, organized
          </span>

          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-700 mb-4 leading-tight">
            Notes Galore
          </h1>

          <p className="text-lg text-stone-600 mb-8 max-w-md">
            A simple, secure place to write and organize your notes. Private to
            you, accessible from anywhere.
          </p>

          {user ? (
            <Link
              to="/dashboard"
              className="inline-block px-8 py-3 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-1 font-semibold text-lg transition shadow-md"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="inline-block px-8 py-3 text-white bg-amber-500 rounded-2xl hover:bg-amber-600 hover:-rotate-1 font-semibold text-lg transition shadow-md"
              >
                Get Started
              </Link>
              <p className="mt-4 text-stone-500">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-700 font-medium hover:underline">
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* image */}
        <div className="flex-1 flex justify-center md:justify-end">
          <div className="relative rotate-2 max-w-lg w-full">
            <div className="absolute -top-3 -left-3 w-10 h-5 bg-yellow-300/80 rotate-[-25deg] shadow-sm z-10" />
            <div className="absolute -top-3 -right-3 w-10 h-5 bg-orange-300/80 rotate-[25deg] shadow-sm z-10" />

            <img
              src="https://img.magnific.com/premium-vector/colorful-sticky-note-collection_1647902-101.jpg"
              alt="Notes Galore preview"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>

      </div>
    </div>
  );
}