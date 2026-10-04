import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const schema = z.object({
  password: z.string().min(1, 'كلمة المرور الحالية مطلوبة'),
  newPassword: z
    .string()
    .min(8, 'كلمة المرور الجديدة 8 أحرف على الأقل')
    .regex(/[A-Z]/, 'لازم حرف كبير')
    .regex(/[a-z]/, 'لازم حرف صغير')
    .regex(/[0-9]/, 'لازم رقم')
    .regex(/[#?!@$%^&*-]/, 'لازم رمز خاص (#?!@$%^&*-)'),
});

export default function ChangePassword() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await axiosInstance.patch('/users/change-password', {
        password: data.password,
        newPassword: data.newPassword,
      });
      toast.success('تم تغيير كلمة المرور — سجل دخول تاني');
      setTimeout(() => {
        logout();
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('❌ Error:', error.response?.data);
      toast.error(error.response?.data?.message || 'حدث خطأ');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">تغيير كلمة المرور</h1>
      
      <input type="password" {...register('password')} placeholder="كلمة المرور الحالية" className="w-full p-2 border rounded" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      
      <input type="password" {...register('newPassword')} placeholder="كلمة المرور الجديدة" className="w-full p-2 border rounded" />
      {errors.newPassword && <p className="text-red-500 text-sm">{errors.newPassword.message}</p>}
      
      <p className="text-xs text-gray-500">
        8 أحرف على الأقل، حرف كبير، حرف صغير، رقم، ورمز خاص (#?!@$%^&*-)
      </p>
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded">
        {isSubmitting ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
      </button>
    </form>
  );
}