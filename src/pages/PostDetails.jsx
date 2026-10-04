import { useParams, useNavigate } from 'react-router-dom';
import { usePost, useDeletePost } from '../hooks/usePosts';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import { useAuth } from '../auth/AuthContext';
import toast from 'react-hot-toast';

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: post, isLoading, isError } = usePost(id);
  const { mutate: deletePost } = useDeletePost();

  if (isLoading) return <p className="text-center p-8">جاري التحميل...</p>;
  if (isError || !post)
    return <p className="text-center p-8 text-red-500">البوست غير موجود</p>;

  const isOwner =
    post.user?._id === user?._id || post.user?._id === user?.id;

  const handleDelete = () => {
    if (!confirm('متأكد من حذف البوست؟')) return;
    deletePost(post._id, {
      onSuccess: () => {
        toast.success('تم حذف البوست');
        navigate('/');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {/* البوست */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-2 mb-3">
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
        <p className="text-gray-800 whitespace-pre-wrap">{post.body}</p>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="mt-3 text-red-500 text-sm hover:underline"
          >
            حذف البوست
          </button>
        )}
      </div>

      {/* إضافة تعليق */}
      <CommentForm postId={id} />

      {/* قائمة التعليقات */}
      <h3 className="font-bold text-lg">التعليقات</h3>
      <CommentList postId={id} />
    </div>
  );
}