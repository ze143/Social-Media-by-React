import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './auth/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import PostDetails from './pages/PostDetails';
import CreatePost from './pages/CreatePost';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Route>

        <Route path="*" element={<p className="text-center p-8">404 - الصفحة غير موجودة</p>} />
      </Routes>
    </>
  );
}