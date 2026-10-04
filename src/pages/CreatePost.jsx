import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useCreatePost } from '../hooks/usePosts';
import toast from 'react-hot-toast';

const schema = z.object({
  body: z.string().min(1, 'اكتب محتوى البوست').max(1000, 'طويل جدًا'),
});

export default function CreatePost() {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreatePost();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = (data) => {
    mutate(data, {
      onSuccess: () => {
        toast.success('تم النشر');
        navigate('/');
      },
      onError: () => toast.error('فشل النشر'),
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow p-6 space-y-4"
      >
        <h1 className="text-2xl font-bold">بوست جديد</h1>

        <textarea
          {...register('body')}
          placeholder="اكتب محتوى البوست..."
          rows={6}
          className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {errors.body && (
          <p className="text-red-500 text-sm">{errors.body.message}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? 'جاري النشر...' : 'نشر'}
        </button>
      </form>
    </div>
  );
}