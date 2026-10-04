import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useUpdateComment, useDeleteComment } from '../hooks/useComments';
import toast from 'react-hot-toast';

export default function CommentItem({ comment, postId }) {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content || comment.body || '');

  const { mutate: updateComment, isPending: updating } = useUpdateComment(postId);
  const { mutate: deleteComment } = useDeleteComment(postId);

  const creatorId = comment.commentCreator?._id || comment.user?._id;
  const isOwner = creatorId === user?._id || creatorId === user?.id;

  const handleUpdate = () => {
    if (!content.trim()) return;
    updateComment(
      { id: comment._id, body: { content } },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast.success('تم تعديل التعليق');
        },
        onError: () => toast.error('فشل التعديل'),
      }
    );
  };

  const handleDelete = () => {
    if (!confirm('متأكد من حذف التعليق؟')) return;
    deleteComment(comment._id, {
      onSuccess: () => toast.success('تم حذف التعليق'),
      onError: () => toast.error('فشل الحذف'),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
          {(comment.commentCreator?.name || comment.user?.name || '?')[0]}
        </div>
        <p className="font-semibold text-sm">
          {comment.commentCreator?.name || comment.user?.name || 'مستخدم'}
        </p>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              disabled={updating}
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {updating ? 'جاري الحفظ...' : 'حفظ'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300"
            >
              إلغاء
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-700">{comment.content || comment.body}</p>
          {isOwner && (
            <div className="flex gap-3 mt-2 text-xs">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-500 hover:underline"
              >
                تعديل
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:underline"
              >
                حذف
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}