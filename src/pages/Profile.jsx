import { useAuth } from '../auth/AuthContext';
import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';

export default function Profile() {
  const { user } = useAuth();
  const { data: posts, isLoading } = usePosts();

  // ضمان إن posts array
  const postsArray = Array.isArray(posts) ? posts : [];

  // استخرج user id من أي مكان ممكن
  const myId =
    user?._id ||
    user?.id ||
    user?.user?._id ||
    user?.user?.id;

  console.log('🔍 Profile - myId:', myId);
  console.log('🔍 Profile - user:', user);
  console.log('🔍 Profile - posts:', postsArray);

  // فلترة البوستات بتاعت المستخدم
  const myPosts = postsArray.filter((p) => {
    const creatorId =
      p.user?._id ||
      p.user?.id ||
      p.postCreator?._id ||
      p.postCreator?.id ||
      p.createdBy?._id ||
      p.createdBy?.id ||
      p.userId;

    return creatorId === myId;
  });

  if (isLoading) return <p className="text-center p-8">جاري التحميل...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h1 className="text-xl font-bold mb-2">الملف الشخصي</h1>
        <p>الاسم: {user?.name || 'غير محدد'}</p>
        <p>البريد: {user?.email || 'غير محدد'}</p>
      </div>

      <h2 className="font-bold text-lg">
        بوستاتي ({myPosts.length})
      </h2>

      {myPosts.length > 0 ? (
        myPosts.map((p) => <PostCard key={p._id || p.id} post={p} />)
      ) : (
        <p className="text-center text-gray-500 py-8">
          لا توجد بوستات — انشر أول بوست من الصفحة الرئيسية
        </p>
      )}
    </div>
  );
}