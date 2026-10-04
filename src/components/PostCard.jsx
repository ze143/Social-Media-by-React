import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useDeletePost, useUpdatePost } from '../hooks/usePosts';
import toast from 'react-hot-toast';

export default function PostCard({ post }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [body, setBody] = useState(post.body);

  const { mutate: deletePost } = useDeletePost();
  const { mutate: updatePost, isPending } = useUpdatePost();

  const isOwner =
    post.user?._id === user?._id || post.user?._id === user?.id;

  const handleDelete = () => {
    if (!confirm('متأكد من حذف البوست؟')) return;
    deletePost(post._id, {
      onSuccess: () => toast.success('تم الحذف'),
      onError: () => toast.error('فشل الحذف'),
    });
  };

  const handleUpdate = () => {
    if (!body.trim()) return;
    updatePost(
      { id: post._id, body: { body } },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success('تم التعديل');
        },
        onError: () => toast.error('فشل التعديل'),
      }
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
          {post.user?.name?.[0] || '?'}
        </div>
        <div>
          <p className="font-semibold">{post.user?.name || 'مستخدم'}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.createdAt).toLocaleString('ar-EG')}
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={isPending}
              className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {isPending ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setBody(post.body);
              }}
              className="bg-gray-200 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-800 whitespace-pre-wrap">{post.body}</p>
      )}

      <div className="flex items-center gap-4 mt-3 pt-3 border-t text-sm">
        <Link to={`/posts/${post._id}`} className="text-blue-500 hover:underline">
          التفاصيل والتعليقات
        </Link>
        {isOwner && !isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="text-green-600 hover:underline"
            >
              تعديل
            </button>
            <button onClick={handleDelete} className="text-red-500 hover:underline">
              حذف
            </button>
          </>
        )}
      </div>
    </div>
  );
}