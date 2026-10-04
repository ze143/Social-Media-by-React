import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

// دالة مساعدة لاستخراج الـ array من أي شكل
function extractArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.data?.posts)) return data.data.posts;
  return [];
}

// جلب كل البوستات
export function usePosts() {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data } = await axiosInstance.get('/posts');
      console.log('🔍 Posts response:', data);
      return extractArray(data, 'posts');
    },
  });
}

// جلب بوست واحد
export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${id}`);
      console.log('🔍 Post response:', data);
      return data?.post || data?.data?.post || data?.data || data;
    },
    enabled: !!id,
  });
}

// إنشاء بوست
export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await axiosInstance.post('/posts', body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

// تعديل بوست
export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }) => {
      const { data } = await axiosInstance.put(`/posts/${id}`, body);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['posts'] });
      qc.invalidateQueries({ queryKey: ['post', vars.id] });
    },
  });
}

// حذف بوست
export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/posts/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}