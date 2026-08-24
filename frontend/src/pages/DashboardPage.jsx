import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200">
      <nav className="bg-white/80 border-b border-amber-200 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-amber-700">🗒️ Notes Galore</h1>
        <button onClick={logoutUser} className="text-red-500 hover:text-red-700 font-semibold">
          Logout
        </button>
      </nav>
      <div className="p-8 text-center mt-10">
        <h2 className="text-3xl font-bold text-stone-800">Welcome, {user?.name}</h2>
      </div>
    </div>
  );
} 