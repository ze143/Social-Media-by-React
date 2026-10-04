import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../api/axiosInstance';

function extractArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.[key])) return data.data[key];
  return [];
}

// جلب تعليقات بوست
export function useComments(postId) {
  return useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/posts/${postId}/comments`);
      console.log('🔍 Comments response:', data);
      return extractArray(data, 'comments');
    },
    enabled: !!postId,
  });
}

// إضافة تعليق
export function useCreateComment(postId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body) => {
      const { data } = await axiosInstance.post(`/posts/${postId}/comments`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', postId] }),
  });
}

// تعديل تعليق
export function useUpdateComment(postId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }) => {
      const { data } = await axiosInstance.put(`/posts/${postId}/comments/${id}`, body);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', postId] }),
  });
}

// حذف تعليق
export function useDeleteComment(postId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await axiosInstance.delete(`/posts/${postId}/comments/${id}`);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', postId] }),
  });
}