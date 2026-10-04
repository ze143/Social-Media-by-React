import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Route Posts
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {user ? (
            <>
              <Link to="/" className="hover:text-blue-600">الرئيسية</Link>
              <Link
                to="/posts/create"
                className="bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600"
              >
                + بوست
              </Link>
              <Link to="/profile" className="hover:text-blue-600">حسابي</Link>
              <Link to="/change-password" className="hover:text-blue-600">كلمة المرور</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-600">دخول</Link>
              <Link to="/signup" className="hover:text-blue-600">تسجيل</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}