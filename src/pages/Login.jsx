import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const schema = z.object({
  email: z.string().email('البريد غير صحيح'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      alert(error.response?.data?.message || 'بيانات الدخول غير صحيحة');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
      
      <input {...register('email')} placeholder="البريد الإلكتروني" className="w-full p-2 border rounded" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      
      <input type="password" {...register('password')} placeholder="كلمة المرور" className="w-full p-2 border rounded" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded">
        {isSubmitting ? 'جاري الدخول...' : 'دخول'}
      </button>
      
      <p className="text-center">ليس لديك حساب؟ <Link to="/signup" className="text-blue-500">سجل الآن</Link></p>
    </form>
  );
}