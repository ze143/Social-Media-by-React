import { useState } from 'react';
import { useCreatePost } from '../hooks/usePosts';
import toast from 'react-hot-toast';

export default function PostForm() {
  const [body, setBody] = useState('');
  const { mutate, isPending } = useCreatePost();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!body.trim()) return;

    mutate(
      { body },
      {
        onSuccess: () => {
          setBody('');
          toast.success('تم نشر البوست');
        },
        onError: (err) => {
          toast.error(err.response?.data?.message || 'حدث خطأ');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="اكتب بوست جديد..."
        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {isPending ? 'جاري النشر...' : 'نشر'}
        </button>
      </div>
    </form>
  );
}