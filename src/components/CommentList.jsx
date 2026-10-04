import { useComments } from '../hooks/useComments';
import CommentItem from './CommentItem';

export default function CommentList({ postId }) {
  const { data: comments, isLoading } = useComments(postId);

  if (isLoading) return <p className="text-center text-gray-500">جاري التحميل...</p>;
  if (!comments?.length)
    return <p className="text-center text-gray-500 py-4">لا توجد تعليقات بعد</p>;

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} postId={postId} />
      ))}
    </div>
  );
}