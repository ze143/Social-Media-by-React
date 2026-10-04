import { usePosts } from '../hooks/usePosts';
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';

export default function Home() {
  const { data: posts, isLoading, isError } = usePosts();

  if (isLoading) return <p className="text-center p-8">جاري التحميل...</p>;
  if (isError) return <p className="text-center p-8 text-red-500">فشل تحميل البوستات</p>;

  // ضمان إن posts دايمًا array
  const postsArray = Array.isArray(posts) ? posts : [];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4">
      {postsArray.length > 0 ? (
        postsArray.map((post) => <PostCard key={post._id || post.id} post={post} />)
      ) : (
        <p className="text-center text-gray-500 py-8">
          لا توجد بوستات بعد — كن أول من ينشر!
        </p>
      )}
    </div>
  );
}