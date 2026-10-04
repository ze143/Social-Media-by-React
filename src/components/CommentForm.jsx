import { useState } from 'react';
import { useCreateComment } from '../hooks/useComments';
import toast from 'react-hot-toast';

export default function CommentForm({ postId }) {
  const [content, setContent] = useState('');
  const { mutate, isPending } = useCreateComment(postId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    mutate(
      { content },
      {
        onSuccess: () => {
          setContent('');
          toast.success('تم إضافة التعليق');
        },
        onError: () => toast.error('فشل إضافة التعليق'),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-3 flex gap-2">
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="اكتب تعليق..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        disabled={isPending}
        className="bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        إرسال
      </button>
    </form>
  );
}