import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  name: z.string().min(2, 'الاسم قصير جدًا'),
  email: z.string().email('البريد غير صحيح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  rePassword: z.string(),
  dateOfBirth: z.string(),
  gender: z.enum(['male', 'female']),
}).refine((data) => data.password === data.rePassword, {
  message: 'كلمتا المرور غير متطابقتين',
  path: ['rePassword'],
});

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await signup(data);
      navigate('/login');
    } catch (error) {
      alert(error.response?.data?.message || 'حدث خطأ');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">إنشاء حساب</h1>
      
      <input {...register('name')} placeholder="الاسم" className="w-full p-2 border rounded" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      
      <input {...register('email')} placeholder="البريد الإلكتروني" className="w-full p-2 border rounded" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      
      <input type="password" {...register('password')} placeholder="كلمة المرور" className="w-full p-2 border rounded" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      
      <input type="password" {...register('rePassword')} placeholder="تأكيد كلمة المرور" className="w-full p-2 border rounded" />
      {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}
      
      <input type="date" {...register('dateOfBirth')} className="w-full p-2 border rounded" />
      
      <select {...register('gender')} className="w-full p-2 border rounded">
        <option value="male">ذكر</option>
        <option value="female">أنثى</option>
      </select>
      
      <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white p-2 rounded">
        {isSubmitting ? 'جاري التسجيل...' : 'تسجيل'}
      </button>
    </form>
  );
}